# Ollama Setup - 5 Minutes to Free Local Chat

Get free, local AI chat running. No API keys. No costs.

## Step 1: Install Ollama (2 min)

**Mac:**
```bash
# Download and install
open https://ollama.ai
# Or via Homebrew:
brew install ollama
```

**Linux:**
```bash
curl https://ollama.ai/install.sh | sh
```

**Windows:**
Download from https://ollama.ai and run installer.

## Step 2: Start Ollama Server (1 min)

```bash
# Start the server (runs in background)
ollama serve
# It listens on http://localhost:11434
```

Keep this running while you use Libby Live.

## Step 3: Pull a Model (1-2 min, first time only)

Open a new terminal:

```bash
# Pull Mistral 7B (recommended, 4GB)
ollama pull mistral

# Or use one of these instead:
ollama pull llama2          # Larger, slower (7GB)
ollama pull neural-chat     # Smaller, faster (4GB)
ollama pull dolphin-mixtral # More capable (26GB)
```

First time takes 1-2 minutes (downloads model). After that, instant.

## Step 4: Run Libby Live (1 min)

```bash
cd /home/user/libby_live
./START.sh
```

The server will auto-detect Ollama running on localhost:11434 and use it for chat.

Open http://localhost:3000 and chat with your local AI.

---

## That's It

Ollama is now your local LLM provider. When you chat in Libby Live, it uses your local machine instead of cloud APIs.

**Cost**: FREE (just electricity)  
**Speed**: Instant responses (no network latency)  
**Privacy**: Everything stays on your machine

---

## To Stop Ollama

```bash
# Find the process
ps aux | grep ollama

# Kill it
kill -9 <process_id>

# Or if you want it to auto-start, leave it running
```

---

## Troubleshooting

**"Connection refused" when starting Libby Live**
- Make sure `ollama serve` is running in another terminal
- Check http://localhost:11434 in your browser - if it times out, Ollama isn't running

**Chat is slow**
- First request is always slower (model loading into memory)
- After that, responses are fast
- Smaller models (mistral, neural-chat) are faster than larger ones (llama2)

**Chat is generating nonsense**
- Models vary in quality; Mistral is reliable
- For better quality, use `ollama pull dolphin-mixtral` (larger download)

**"out of memory" error**
- Your machine doesn't have enough RAM
- This is normal on older machines
- Use OpenRouter fallback instead: set `OPENROUTER_API_KEY`

---

## What Model Should I Use?

| Model | Speed | Quality | Size | Best For |
|-------|-------|---------|------|----------|
| mistral | Fast | Good | 4GB | **Recommended** |
| neural-chat | Fast | Good | 4GB | Fast responses |
| llama2 | Medium | Better | 7GB | More capable |
| dolphin-mixtral | Slow | Excellent | 26GB | Best quality |

**Start with mistral**. If you want better responses, upgrade to dolphin-mixtral later.

---

## To Switch Models

```bash
# Pull another model
ollama pull dolphin-mixtral

# Ollama will auto-switch to newest model
# Or specify in environment:
OLLAMA_MODEL=llama2 ./START.sh
```

---

## Using with Libby Live

Once Ollama is running:

1. Start Libby Live: `./START.sh`
2. Chat in the portal - it automatically uses local Ollama
3. All responses are processed locally
4. No API keys needed
5. No data sent to external servers

**Your patient data never leaves your machine.**

---

## When to Use Each Option

| Scenario | Use |
|----------|-----|
| Local testing / development | Ollama (free) |
| When Ollama unavailable | OpenRouter (cheap fallback) |
| High-security deployments | Ollama only |
| Production with budget | Ollama + OpenRouter fallback |
| Best possible responses | Dolphin-mixtral via Ollama |
| No setup overhead | OpenRouter only |

---

## Keep It Simple

1. Install Ollama
2. Run `ollama serve` in one terminal
3. Run `./START.sh` in another terminal
4. Use Libby Live
5. Chat uses local AI

Done.
