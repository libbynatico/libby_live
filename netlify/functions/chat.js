const https = require("https");

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "Content-Type, Authorization",
  "access-control-allow-methods": "POST, OPTIONS, GET",
  "content-type": "application/json; charset=utf-8"
};

// Google OAuth configuration - set via Netlify environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI || "";

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

async function getDriveFiles(accessToken, folderId) {
  if (!accessToken || !folderId) return [];

  try {
    const query = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=id,name,mimeType,webViewLink&pageSize=50`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) return [];

    const data = await response.json();
    return (data.files || []).map(f => ({
      id: f.id,
      name: f.name,
      type: f.mimeType,
      webViewLink: f.webViewLink
    }));
  } catch (e) {
    console.error("Drive API error:", e);
    return [];
  }
}

async function getFileContent(accessToken, fileId) {
  if (!accessToken || !fileId) return "";

  try {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) return "";
    return await response.text();
  } catch (e) {
    console.error("File content error:", e);
    return "";
  }
}

export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname.split("/").slice(-1)[0];

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Route: GET /.netlify/functions/chat/oauth/authorize
  if (path === "oauth" && url.searchParams.get("action") === "authorize") {
    return handleOAuthAuthorize(request);
  }

  // Route: GET /.netlify/functions/chat/oauth/callback
  if (path === "oauth" && url.searchParams.get("code")) {
    return handleOAuthCallback(request);
  }

  // Route: POST /.netlify/functions/chat/drive/files
  if (path === "drive" && request.method === "POST") {
    return handleDriveFiles(request);
  }

  // Default: Handle chat POST request
  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  return handleChat(request);
};

async function handleOAuthAuthorize(request) {
  if (!GOOGLE_CLIENT_ID) {
    return json(500, {
      error: "Google OAuth not configured. Set GOOGLE_OAUTH_CLIENT_ID in Netlify environment variables."
    });
  }

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.append("client_id", GOOGLE_CLIENT_ID);
  authUrl.searchParams.append("redirect_uri", GOOGLE_REDIRECT_URI || `${process.env.URL || "http://localhost:3000"}/.netlify/functions/chat?action=callback`);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/gmail.readonly");
  authUrl.searchParams.append("access_type", "offline");

  return json(200, { authUrl: authUrl.toString() });
}

async function handleOAuthCallback(request) {
  const code = new URL(request.url).searchParams.get("code");
  if (!code) {
    return json(400, { error: "Missing authorization code" });
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return json(500, {
      error: "Google OAuth not configured. Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET."
    });
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: GOOGLE_REDIRECT_URI || `${process.env.URL || "http://localhost:3000"}/.netlify/functions/chat?action=callback`
      }).toString()
    });

    const data = await response.json();

    if (!response.ok) {
      return json(400, { error: data.error || "Token exchange failed" });
    }

    return json(200, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    });
  } catch (error) {
    return json(500, { error: error.message });
  }
}

async function handleDriveFiles(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const { accessToken, folderId } = body;

  if (!accessToken) {
    return json(400, { error: "Missing accessToken" });
  }

  const files = await getDriveFiles(accessToken, folderId || "");

  return json(200, { files });
}

async function handleChat(request) {
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
}
