import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const PROVIDER = process.env.LIBBY_MODEL_PROVIDER || 'groq';
const MODEL = process.env.LIBBY_MODEL_NAME || 'llama-3.1-8b-instant';

async function callGroq(messages) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: MODEL, messages })
  });
  return res.json();
}

async function callOpenRouter(messages) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: process.env.OPENROUTER_MODEL || 'openrouter/free', messages })
  });
  return res.json();
}

app.post('/api/chat', async (req, res) => {
  const messages = req.body.messages || [];
  try {
    let data;
    if (PROVIDER === 'groq') {
      data = await callGroq(messages);
    } else {
      data = await callOpenRouter(messages);
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Libby router failed', detail: err.message });
  }
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, provider: PROVIDER });
});

app.listen(process.env.PORT || 8787, () => {
  console.log('Libby router running');
});