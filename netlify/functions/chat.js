import path from 'path';
import { buildSystemContext } from '../../retrieval/context_builder.js';

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'Content-Type, Authorization',
  'access-control-allow-methods': 'POST, OPTIONS',
  'content-type': 'application/json; charset=utf-8',
};

// DATA_ROOT points to the private knowledge directory.
// Local dev: set DATA_ROOT=/path/to/libby_casevault in .env
// Netlify: set DATA_ROOT in environment variables dashboard
const DATA_ROOT = process.env.DATA_ROOT || path.join(process.cwd(), 'data');

function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(m => m && typeof m.content === 'string' && m.content.trim())
    .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content.trim() }))
    .slice(-12);
}

function flattenContent(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map(p => (typeof p === 'string' ? p : p?.text || '')).join('\n').trim();
  }
  return '';
}

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return json(500, { error: 'OPENROUTER_API_KEY missing from Netlify environment variables.' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Invalid JSON body.' });
  }

  const model = (body.model || 'openrouter/auto').trim();
  const audience = (body.audience || 'general').trim();
  const userId = body.userId || body.user_id || 'patient_zero';
  const workspaceContext = body.context || {};
  const priorMessages = normalizeMessages(body.messages);

  // Load structured knowledge for this user from DATA_ROOT
  let knowledgeContext = '';
  try {
    knowledgeContext = buildSystemContext(userId, DATA_ROOT, audience);
  } catch (err) {
    console.error('Context build error:', err.message);
    knowledgeContext = `Knowledge load failed for ${userId}: ${err.message}`;
  }

  const systemPrompt = [
    'You are Libby, a structured advocacy support assistant for the NATICO case portal.',
    '',
    'Your role:',
    '- Answer questions about this specific case using the structured knowledge below.',
    '- Distinguish clearly: Confirmed Facts | Inferred Notes | Open Questions | Actions Required.',
    '- Do not fabricate case details. If something is not in the knowledge base, say so.',
    '- Be calm, plain, structured. No medical or legal authority claims.',
    '- When drafting, make it usable and concise.',
    `- Audience mode: ${audience}.`,
    '',
    '=== STRUCTURED CASE KNOWLEDGE ===',
    knowledgeContext || '(No structured knowledge loaded. Responding generally.)',
    '=================================',
  ].join('\n');

  // Summarize workspace state from browser (evidence added this session, drafts, etc.)
  const workspaceSummary = workspaceContext && Object.keys(workspaceContext).length
    ? `\n\nCurrent workspace state (this session):\n${JSON.stringify(workspaceContext, null, 2)}`
    : '';

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Session context:${workspaceSummary || ' (empty workspace)'}` },
    ...priorMessages,
  ];

  try {
    const referer =
      request.headers.get('origin') ||
      process.env.URL ||
      'https://libbylive.netlify.app';

    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': referer,
        'X-Title': 'libby_live',
      },
      body: JSON.stringify({ model, messages, temperature: 0.3, max_tokens: 1200 }),
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return json(upstream.status, {
        error: data?.error?.message || 'OpenRouter request failed.',
        upstream: data,
      });
    }

    const reply = flattenContent(data?.choices?.[0]?.message?.content) || 'No response returned.';

    return json(200, {
      reply,
      model: data?.model || model,
      usage: data?.usage || null,
      knowledge_loaded: !!knowledgeContext && !knowledgeContext.startsWith('No structured'),
    });
  } catch (error) {
    return json(500, { error: error instanceof Error ? error.message : 'Unknown server error.' });
  }
};
