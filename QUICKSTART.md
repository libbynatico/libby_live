# Libby Live - Quickstart (No Hands Required)

## Run It Now

```bash
cd /home/user/libby_live
./START.sh
```

That's it. Everything else is automatic.

---

## What Just Happened

✅ Data directory created (if needed)  
✅ Demo patient loaded  
✅ Server started on http://localhost:3000  
✅ Chat function ready (Ollama if available, OpenRouter fallback)  
✅ All endpoints active

---

## Access the Website

- **Main Portal**: http://localhost:3000
- **Floating Widget**: http://localhost:3000/floating-widget.html

---

## Test It

Open a new terminal while server is running:

```bash
# Test chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "demo_patient",
    "messages": [{"role": "user", "content": "What is my status?"}]
  }' | jq '.reply'

# Test widget
curl http://localhost:3000/floating-widget.html | head -20
```

---

## Deploy to Production

When ready to deploy:

```bash
git push origin claude/review-repo-history-FE4ys
```

Then merge to main on GitHub, and Netlify auto-deploys.

---

## Enable Free Chat with Ollama

Chat is currently stub responses. To enable **free local chat**:

```bash
# Install Ollama (https://ollama.ai)
# Then pull a model (one-time):
ollama pull mistral

# Now when you run ./START.sh, it auto-detects Ollama
./START.sh
```

All chat will now use free local AI (no API keys needed).

---

## Use Your Own Patient Data

Edit files in `data/demo_patient/`:
- `profile.md` - Patient demographics and diagnoses
- `timeline.md` - Historical events
- `evidence_ledger.csv` - Medical documents
- `ledgers/` - Contacts, appointments, correspondence

Restart server (Ctrl+C, then `./START.sh`) to load new data.

---

## To Add Another Patient

```bash
# Copy and customize
cp -r data/demo_patient data/your_patient_id
# Edit the files with real data
# Restart server
```

---

## Environment Variables (Optional)

```bash
# Custom data directory
DATA_ROOT=/path/to/custom/data ./START.sh

# Custom port
PORT=8080 ./START.sh

# Custom environment
NODE_ENV=production ./START.sh
```

---

## Troubleshooting

**Server won't start:**
```bash
# Kill any existing process on port 3000
lsof -i :3000 | grep node | awk '{print $2}' | xargs kill -9

# Try again
./START.sh
```

**Chat not working:**
- If Ollama is installed, make sure it's running: `ollama serve`
- If using OpenRouter, set environment variable: `OPENROUTER_API_KEY=your-key ./START.sh`

**Data not loading:**
```bash
# Verify data directory exists
ls -la data/demo_patient/
# Should show: profile.md, timeline.md, evidence_ledger.csv, ledgers/
```

---

## That's All

No configuration files to edit. No build steps. No complex setup.

One command: `./START.sh`

Everything else is automatic.
