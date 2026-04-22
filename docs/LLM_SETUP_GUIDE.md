# LLM Backend Setup — Ollama + Fallback Options

**Status**: Ready to implement  
**Priority**: Core feature for chat to work  
**Cost**: Free (Ollama) → $5-10/month (OpenRouter) → Qualified free (Claude 200k program)

---

## Quick Comparison

| Option | Cost | Quality | Setup | Best For |
|--------|------|---------|-------|----------|
| **Ollama (Local)** | FREE | Good | 5 min | Daily case work, private data |
| **OpenRouter** | $5-10/mo | Better | 2 min | Fallback when local unavailable |
| **OpenAI GPT-3.5** | ~$2/mo | Best | 2 min | Complex legal analysis |
| **Claude (200k program)* | FREE | Best | Apply | Advocacy orgs, nonprofits |

*Apply: https://www.anthropic.com/research/rbc

---

## Option 1: Ollama (RECOMMENDED - FREE)

### Install
```bash
# macOS / Linux / Windows
# Download from: https://ollama.ai

# After install, pull a model
ollama pull mistral
# or: ollama pull neural-chat (smaller)
# or: ollama pull llama2 (general purpose)
```

### Run Locally
```bash
ollama serve
# Listens on http://localhost:11434
# Stays running in background
```

### Environment Variable
```bash
# Not needed for local Ollama (no auth key required)
```

### Test
```bash
curl -X POST http://localhost:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"mistral","messages":[{"role":"user","content":"Hello"}]}'
```

### Cost
- **$0** (runs on your Toshiba laptop)
- No API calls, no rate limits
- All data stays local and private

---

## Option 2: OpenRouter (FREE TIER + PAID)

### Get API Key
1. Go to https://openrouter.ai/keys
2. Sign up (free)
3. Copy your API key

### Environment Variable
```bash
# .env.local or Netlify env vars
OPENROUTER_KEY=your_key_here
```

### Models (Cheapest First)
```
- mistralai/mistral-7b-instruct: $0.00015 per 1k tokens
- meta-llama/llama-2-70b: $0.00035 per 1k tokens  
- openai/gpt-3.5-turbo: $0.0015 per 1k tokens
```

### Estimated Monthly Cost
- Light use (100 messages/day): $2-5
- Medium use (300 messages/day): $5-15
- Heavy use (1000 messages/day): $15-30

### Test
```bash
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistralai/mistral-7b-instruct",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---

## Option 3: Direct OpenAI

### Get API Key
1. Go to https://platform.openai.com/account/api-keys
2. Create new key
3. Add credit card (minimum $5)

### Estimated Cost
- GPT-3.5 Turbo: $2-5/month for light use
- GPT-4: $20-50/month for moderate use

### Models
```
gpt-3.5-turbo: Fastest, cheapest, good for summaries
gpt-4: Most capable, slower, expensive
gpt-4-turbo: Balance of both
```

---

## Option 4: Claude 200k Access (APPLY NOW)

### Eligibility
- Nonprofit organizations (NATICO qualifies?)
- Disability advocacy orgs
- Research institutions
- Underrepresented communities

### How to Apply
1. Fill form: https://www.anthropic.com/research/rbc
2. Describe NATICO's mission
3. Explain use case (case advocacy for disabled individuals)
4. Wait for approval (~2 weeks)

### If Approved
- Free $100/month credits (or more)
- Access to Claude 3 Opus (best model)
- Perfect for complex case analysis

---

## Implementation in Chat Function

### File: `netlify/functions/chat.js`

**Current state**: Stub response only

**Update strategy**:
1. Check if Ollama is available (localhost:11434)
2. If yes, use it (free)
3. If no, fall back to OpenRouter
4. If that fails, return helpful error

**Code pattern**:
```javascript
async function getResponse(messages, context) {
  // Try Ollama first
  try {
    return await callOllama(messages, context);
  } catch (e) {
    console.log("Ollama unavailable, trying OpenRouter...");
  }

  // Fall back to OpenRouter
  try {
    return await callOpenRouter(messages, context);
  } catch (e) {
    console.log("OpenRouter unavailable");
    return {
      reply: "Chat unavailable. Start Ollama: `ollama serve`",
      source: "error"
    };
  }
}
```

---

## Migration Path (Recommended)

### Week 1: Get Free Working
- [ ] Install & run Ollama locally
- [ ] Update chat.js to call Ollama
- [ ] Test with floating widget on local server
- [ ] Cost: $0

### Week 2: Add Fallback
- [ ] Sign up for OpenRouter (free)
- [ ] Add OpenRouter fallback to chat.js
- [ ] Now works even if Ollama down
- [ ] Cost: $0 (unless heavily used)

### Week 3: Apply for Claude Access
- [ ] Submit Claude 200k program application
- [ ] Meanwhile, keep using Ollama + OpenRouter
- [ ] If approved, integrate Claude for important cases
- [ ] Cost: $0 (if approved)

### Month 2: Optimize
- [ ] Measure actual usage costs
- [ ] Keep what works cheaply
- [ ] Drop expensive services
- [ ] Cost: $5-10/month or less

---

## Current Status

| Item | Status | Notes |
|------|--------|-------|
| index.html | ✅ Ready | Chat UI deployed |
| libby-local-server.js | ✅ Ready | Serves /api/chat endpoint |
| Chat function stub | 🟡 Partial | Returns fake response only |
| Ollama integration | ⏳ TODO | Implement this sprint |
| OpenRouter fallback | ⏳ TODO | Implement after Ollama |
| Claude 200k | ⏳ TODO | Apply + integrate if approved |

---

## Notes for libbyclaudecode

1. **Start with Ollama** — it's free and keeps data private
2. **User is cost-conscious** — optimize for minimal spend
3. **NATICO is a nonprofit** — likely qualifies for Claude 200k
4. **Local-first philosophy** — prefer Ollama > cloud when possible
5. **Graceful degradation** — always provide useful error messages if service unavailable

When implementing:
- Test both Ollama and fallback paths
- Log which service was used for debugging
- Keep response format consistent across providers
- Document model selection rationale

