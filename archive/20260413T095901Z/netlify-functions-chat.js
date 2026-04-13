const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "Content-Type, Authorization",
  "access-control-allow-methods": "POST, OPTIONS",
  "content-type": "application/json; charset=utf-8"
};

function json(statusCode, body) {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: corsHeaders
  });
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(msg => msg && typeof msg.content === "string" && msg.content.trim())
    .map(msg => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content.trim()
    }))
    .slice(-12);
}

function flattenContent(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map(part => {
        if (typeof part === "string") return part;
        if (part && typeof part.text === "string") return part.text;
        return "";
      })
      .join("\n")
      .trim();
  }
  return "";
}

export default async (request, context) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return json(500, { error: "OPENROUTER_API_KEY is missing in Netlify environment variables." });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  const model = (body.model || "openrouter/auto").trim();
  const audience = (body.audience || "self").trim();
  const contextSummary = body.context || {};
  const priorMessages = normalizeMessages(body.messages);

  const systemPrompt = `
You are Libby, a structured advocacy support assistant inside Libby Live.

Your job:
- Help organize case facts, evidence, drafts, and next steps.
- Prefer structured, plain, calm language.
- Distinguish confirmed facts from assumptions.
- Be useful for disability, advocacy, casework, administrative, and clinical-adjacent drafting.
- Do not claim legal or medical authority.
- If context is incomplete, say what is missing.
- When writing drafts, keep them concise and usable.
- When summarizing, preserve key dates, names, and practical implications.
- Audience mode is: ${audience}.
`.trim();

  const contextMessage = `
Workspace context:
${JSON.stringify(contextSummary, null, 2)}
`.trim();

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: contextMessage },
    ...priorMessages
  ];

  try {
    const referer =
      request.headers.get("origin") ||
      process.env.URL ||
      (process.env.DEPLOY_PRIME_URL ? `https://${process.env.DEPLOY_PRIME_URL}` : "https://example.com");

    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": referer,
        "X-Title": "libby_live"
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        max_tokens: 900
      })
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return json(upstream.status, {
        error: data?.error?.message || data?.error || "OpenRouter request failed.",
        upstream: data
      });
    }

    const reply = flattenContent(data?.choices?.[0]?.message?.content) || "No response returned.";

    return json(200, {
      reply,
      model: data?.model || model,
      usage: data?.usage || null
    });
  } catch (error) {
    return json(500, {
      error: error instanceof Error ? error.message : "Unknown server error."
    });
  }
};
