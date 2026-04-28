const { classifyIntake } = require('./_shared/agent-router');
const { generateOutputs } = require('./_shared/output-generator');

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'Content-Type, Authorization',
      'access-control-allow-methods': 'POST, OPTIONS'
    },
    body: JSON.stringify(body)
  };
}

function decodeDataUrl(dataUrl) {
  const match = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], 'base64')
  };
}

async function transcribeAudio({ fileDataUrl, fileName, prompt }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured. Add it in Netlify environment variables.');
  }

  const decoded = decodeDataUrl(fileDataUrl);
  if (!decoded) throw new Error('Invalid audio data. Expected a base64 data URL.');

  const form = new FormData();
  const blob = new Blob([decoded.buffer], { type: decoded.mimeType || 'audio/m4a' });

  form.append('file', blob, fileName || 'libby-audio.m4a');
  form.append('model', process.env.OPENAI_TRANSCRIBE_MODEL || 'gpt-4o-mini-transcribe');
  form.append('language', 'en');
  form.append('response_format', 'json');
  if (prompt) form.append('prompt', prompt);

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: form
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Transcription failed: ${response.status} ${text}`);
  }

  return response.json();
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') return json(204, {});
    if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });

    const body = JSON.parse(event.body || '{}');

    const triggerLine = body.triggerLine || '/event_details';
    const sourceType = body.sourceType || 'voice_memo';
    const fileName = body.fileName || 'audio.m4a';
    const fileDataUrl = body.fileDataUrl;
    const contextNote = body.contextNote || '';
    const localDate = body.localDate || new Date().toISOString().slice(0, 10);
    const timezone = body.timezone || 'America/Toronto';
    const participants = body.participants || [];

    if (!fileDataUrl) return json(400, { error: 'Missing fileDataUrl.' });

    const transcription = await transcribeAudio({
      fileDataUrl,
      fileName,
      prompt: contextNote || 'Transcribe this Libby/NATICO case audio accurately. Preserve names, dates, appointments, symptoms, phone-call details, and uncertainty.'
    });

    const rawInput = [
      `Source file: ${fileName}`,
      `Source type: ${sourceType}`,
      contextNote ? `Context: ${contextNote}` : null,
      '',
      transcription.text || ''
    ].filter(Boolean).join('\n');

    const triggerMatch = triggerLine.match(/\/(\w+)/);
    const trigger = triggerMatch ? `/${triggerMatch[1]}` : '/event_details';
    const event_id = `evt_${localDate.replace(/-/g, '')}_${Date.now()}_${trigger.replace('/', '')}`;

    const classification = classifyIntake({ trigger, sourceType, rawInput, fileName });

    const eventRecord = {
      event_id,
      trigger,
      source_type: sourceType,
      raw_input: rawInput,
      transcript_text: transcription.text || '',
      file_name: fileName,
      local_date: localDate,
      timezone,
      participants,
      classification,
      transcription_model: process.env.OPENAI_TRANSCRIBE_MODEL || 'gpt-4o-mini-transcribe',
      created_at: new Date().toISOString()
    };

    const outputs = generateOutputs(eventRecord);
    const fullRecord = { ...eventRecord, outputs };

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await fetch(`${process.env.SUPABASE_URL}/rest/v1/${process.env.LIBBY_EVENTS_TABLE || 'libby_events'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify(fullRecord)
      });
    }

    return json(200, { success: true, event: fullRecord });
  } catch (err) {
    return json(500, { error: err.message });
  }
};
