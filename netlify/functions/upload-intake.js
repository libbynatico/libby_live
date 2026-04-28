const { classifyIntake } = require('./_shared/agent-router');
const { generateOutputs } = require('./_shared/output-generator');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const body = JSON.parse(event.body || '{}');

    const triggerLine = body.triggerLine || '/event_update';
    const rawInput = body.rawInput || '';
    const sourceType = body.sourceType || 'manual_text';
    const fileName = body.fileName || null;
    const localDate = body.localDate || new Date().toISOString().slice(0,10);
    const timezone = body.timezone || 'America/Toronto';
    const participants = body.participants || [];

    const triggerMatch = triggerLine.match(/\/(\w+)/);
    const trigger = triggerMatch ? `/${triggerMatch[1]}` : '/event_update';

    const event_id = `evt_${localDate.replace(/-/g,'')}_${Date.now()}_${trigger.replace('/','')}`;

    const classification = classifyIntake({ trigger, sourceType, rawInput, fileName });

    const eventRecord = {
      event_id,
      trigger,
      source_type: sourceType,
      raw_input: rawInput,
      file_name: fileName,
      local_date: localDate,
      timezone,
      participants,
      classification,
      created_at: new Date().toISOString()
    };

    const outputs = generateOutputs(eventRecord);

    const fullRecord = {
      ...eventRecord,
      outputs
    };

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await fetch(`${process.env.SUPABASE_URL}/rest/v1/${process.env.LIBBY_EVENTS_TABLE || 'libby_events'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify(fullRecord)
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, event: fullRecord })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
