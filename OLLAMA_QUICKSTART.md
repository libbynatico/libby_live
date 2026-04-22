# Ollama Quick Start — 5 Minutes to Free Chat

**Goal**: Get Ollama running so your chat actually works.

---

## 1. Download Ollama (2 min)

**macOS/Linux/Windows:**
- Go to https://ollama.ai/download
- Install for your OS
- Restart terminal/shell

## 2. Start the Server (1 min)

```bash
ollama serve
```

**You should see:**
```
2026/04/22 14:00:00 listening on 127.0.0.1:11434
```

**Leave this running.** Open a new terminal for the next step.

## 3. Download a Model (1 min)

```bash
ollama pull mistral
```

**First time takes ~5 min** (downloads 4GB). After that, instant.

Models to choose:
- `mistral` (default) — Good balance, uses ~4GB
- `neural-chat` — Smaller (~3GB), faster
- `llama2` — General purpose (~4GB)

## 4. Test It Works (1 min)

```bash
curl -X POST http://localhost:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"mistral","messages":[{"role":"user","content":"Hello"}]}'
```

You should get a JSON response with a message.

## 5. Test With Libby Live (optional)

1. Open: https://libbynatico.github.io/libby_live/
2. Type something in the chat (right side)
3. Send

**It should now work!** You're using free, local Ollama.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Connection refused" | Start ollama: `ollama serve` |
| "Model not found" | Pull it: `ollama pull mistral` |
| Chat still says "unavailable" | Hard refresh browser (Ctrl+Shift+R) |
| Too slow | Try `neural-chat` instead of `mistral` |
| Out of memory | Reduce max_tokens in chat.js or use smaller model |

---

## What's Happening

1. **Your browser** sends a message to Libby Live
2. **Libby Live** calls your local Ollama server at `http://localhost:11434`
3. **Ollama** generates a response using Mistral model
4. **Response** comes back to your browser

**All free. All local. Your data never leaves your machine.**

---

## Next: Add Fallback (Optional)

If you want chat to work even when Ollama is off:

1. Get free OpenRouter key: https://openrouter.ai
2. Set in Netlify environment variables:
   ```
   OPENROUTER_API_KEY=your_key
   ```
3. Now if Ollama is down, it auto-falls back to OpenRouter (~$0.001 per message)

---

## Run Ollama Permanently (Optional)

To keep Ollama running in background:

**macOS**: Install from App Store, runs in menu bar automatically

**Linux**: 
```bash
systemctl start ollama
systemctl enable ollama  # Auto-start on boot
```

**Windows**: Installed as service, runs in background automatically

---

That's it. Free chat is now running.

Questions? Check `docs/LLM_SETUP_GUIDE.md` for full options.
