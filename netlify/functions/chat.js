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

// LLM backend configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct';

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

// Try Ollama first (free, local)
async function callOllama(messages) {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: messages.filter(m => m.role !== 'system'),
      system: messages.find(m => m.role === 'system')?.content || '',
      stream: false,
    }),
  });

  if (!response.ok) throw new Error(`Ollama error: ${response.status}`);
  const data = await response.json();
  return {
    reply: data?.message?.content || 'No response from Ollama.',
    model: `ollama/${OLLAMA_MODEL}`,
    source: 'ollama',
  };
}

// Fallback to OpenRouter
async function callOpenRouter(messages) {
  if (!OPENROUTER_KEY) {
    throw new Error('OPENROUTER_API_KEY not configured. Install Ollama or set the key.');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://libbynatico.github.io/libby_live/',
      'X-Title': 'libby_live',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      temperature: 0.3,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `OpenRouter error: ${response.status}`);
  }

  const data = await response.json();
  return {
    reply: flattenContent(data?.choices?.[0]?.message?.content) || 'No response from OpenRouter.',
    model: data?.model || OPENROUTER_MODEL,
    source: 'openrouter',
  };
}

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed' });
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
    'You operate within the Life Librarian 100-agent governance framework.',
    '',
    'Your role:',
    '- Answer questions about this specific case using the structured knowledge below.',
    '- Cite which agent domain owns the answer (e.g., "Surgical/GI Coordination owns this" or "Disability/Income Systems handles this").',
    '- Distinguish clearly: Confirmed Facts (safe for external use) | Inferred Notes (requires verification) | Open Questions | Actions Required.',
    '- Never use Draft facts in responses about external communications. Suggest "Needs Review" status.',
    '- Do not fabricate case details. If something is not in the knowledge base, say so explicitly.',
    '- Be calm, plain, structured. No medical or legal authority claims.',
    '- When drafting external communications, apply evidence citations (e.g., "[See attached Hospital Discharge, 2024-06-15]").',
    '- When drafting, make it usable and concise.',
    '- If you identify Missing Evidence (a claim without supporting documents), flag it for Agent 86.',
    `- Audience mode: ${audience}.`,
    '',
    '=== STRUCTURED CASE KNOWLEDGE (Agent-Aware) ===',
    knowledgeContext || '(No structured knowledge loaded. Responding generally.)',
    '=== END CASE KNOWLEDGE ===',
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
    let result;
    let source = 'unknown';

    // Try Ollama first (free, local)
    try {
      console.log(`[chat] Attempting Ollama at ${OLLAMA_URL}...`);
      result = await callOllama(messages);
      source = 'ollama';
    } catch (ollamaErr) {
      console.log(`[chat] Ollama failed: ${ollamaErr.message}. Trying OpenRouter...`);

      // Fall back to OpenRouter
      try {
        console.log(`[chat] Attempting OpenRouter...`);
        result = await callOpenRouter(messages);
        source = 'openrouter';
      } catch (openrouterErr) {
        // Both failed
        return json(503, {
          error: 'Chat unavailable.',
          details: `Ollama: ${ollamaErr.message} | OpenRouter: ${openrouterErr.message}`,
          help: 'Start Ollama locally: `ollama serve` or configure OPENROUTER_API_KEY',
        });
      }
    }

    return json(200, {
      reply: result.reply,
      model: result.model,
      source: source,
      knowledge_loaded: !!knowledgeContext && !knowledgeContext.startsWith('No structured'),
    });
  } catch (error) {
    return json(500, { error: error instanceof Error ? error.message : 'Unknown server error.' });
  }
};
