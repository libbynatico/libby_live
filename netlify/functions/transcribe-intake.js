const { classifyIntake } = require('./_shared/agent-router');
const { generateOutputs } = require('./_shared/output-generator');
const { inferEventTitle, inferSortBucket, inferPriority, inferPresentationMode } = require('./_shared/event-namer');

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });

    const body = JSON.parse(event.body || '{}');

    const fileDataUrl = body.fileDataUrl;
    const fileName = body.fileName || 'audio.m4a';
    const sourceType = body.sourceType || 'voice_memo';
    const contextNote = body.contextNote || '';

    if (!fileDataUrl) return json(400, { error: 'Missing fileDataUrl' });

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: (() => {
        const form = new FormData();
        const base64 = fileDataUrl.split(',')[1];
        const buffer = Buffer.from(base64, 'base64');
        form.append('file', new Blob([buffer]), fileName);
        form.append('model', 'gpt-4o-mini-transcribe');
        return form;
      })()
    });

    const data = await response.json();

    const transcript = data.text || '';

    const rawInput = `${contextNote}\n\n${transcript}`;

    const classification = classifyIntake({
      trigger: '/event_details',
      sourceType,
      rawInput,
      fileName
    });

    const title = inferEventTitle({
      transcript,
      tags: classification.tags,
      sourceType,
      fileName
    });

    const sort_bucket = inferSortBucket({ tags: classification.tags, sourceType });
    const priority = inferPriority({ tags: classification.tags, riskFlags: classification.risk_flags });
    const mode = inferPresentationMode({ tags: classification.tags, sourceType });

    const event = {
      id: `evt_${Date.now()}`,
      title,
      sort_bucket,
      priority,
      mode,
      transcript,
      classification,
      outputs: generateOutputs({ raw_input: rawInput, classification })
    };

    return json(200, { success: true, event });

  } catch (e) {
    return json(500, { error: e.message });
  }
};
