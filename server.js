import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const PROVIDER = process.env.LIBBY_MODEL_PROVIDER || 'groq';
const MODEL = process.env.LIBBY_MODEL_NAME || 'llama-3.1-8b-instant';

async function callGroq(messages) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, messages })
  });
  return res.json();
}

async function callOpenRouter(messages) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: process.env.OPENROUTER_MODEL || 'openrouter/free', messages })
  });
  return res.json();
}

app.post('/api/chat', async (req, res) => {
  const messages = req.body.messages || [];
  try {
    const data = PROVIDER === 'groq' ? await callGroq(messages) : await callOpenRouter(messages);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Libby router failed', detail: err.message });
  }
});

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio file uploaded.' });
    if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'Missing GROQ_API_KEY.' });

    const form = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype || 'audio/webm' });
    form.append('file', blob, req.file.originalname || 'libby-recording.webm');
    form.append('model', process.env.GROQ_TRANSCRIBE_MODEL || 'whisper-large-v3-turbo');
    form.append('response_format', 'json');

    const upstream = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: form
    });

    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json(data);
    res.json({ text: data.text || '', raw: data });
  } catch (err) {
    res.status(500).json({ error: 'Transcription failed', detail: err.message });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true, provider: PROVIDER }));

app.listen(process.env.PORT || 8787, () => console.log('Libby router running'));
