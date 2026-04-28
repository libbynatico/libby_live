exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const body = JSON.parse(event.body || "{}");

    const triggerLine = body.triggerLine || "";
    const rawInput = body.rawInput || "";
    const localDate = body.localDate || new Date().toISOString().slice(0,10);
    const timezone = body.timezone || "America/Toronto";
    const participants = body.participants || [];

    const timeMatch = triggerLine.match(/(\d{1,2}:?\d{0,2}\s?(am|pm)?)-(\d{1,2}:?\d{0,2}\s?(am|pm)?)/i);
    const triggerMatch = triggerLine.match(/\/(\w+)/);

    const start = timeMatch ? timeMatch[1] : null;
    const end = timeMatch ? timeMatch[3] : null;
    const trigger = triggerMatch ? `/${triggerMatch[1]}` : null;

    const event_id = `evt_${localDate.replace(/-/g,"")}_${(start||"0000").replace(/[:\s]/g,"")}_${(trigger||"unknown").replace("/","")}`;

    const normalized = {
      event_id,
      trigger,
      local_date: localDate,
      timezone,
      start_time_local: start,
      end_time_local: end,
      participants,
      raw_input: rawInput,
      created_at: new Date().toISOString()
    };

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await fetch(`${process.env.SUPABASE_URL}/rest/v1/${process.env.LIBBY_EVENTS_TABLE || "libby_events"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify(normalized)
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, event: normalized })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
