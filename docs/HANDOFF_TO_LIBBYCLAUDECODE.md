# Handoff to Libby Claude Code — v2.03.0

**Date**: 2026-04-22  
**Status**: Production website live + local server ready for testing  
**GitHub Pages Live**: https://libbynatico.github.io/libby_live/

---

## Current State

### ✅ LIVE (Main Website)
- **index.html** (v2.03.0-claude-oauth) — full case advocacy dashboard
- Deployed to GitHub Pages from `main` branch
- Fully styled, production-quality UI
- Supabase auth integration (OAuth + login)
- Chat integration points wired
- Sidebar navigation, case context display, evidence workspace ready

### ✅ LOCAL SERVER (Development/Testing)
- **libby-local-server.js** — Node.js HTTP server for offline-first testing
- Serves floating-widget.html on GET /
- Provides `/api/chat` and `/api/ingest-transcript` endpoints
- Ready to test complete audio → transcript → ledger flow
- **Branch**: `claude/plan-chatbot-implementation-DOkaj`

### ✅ DATA LAYER
- `data/mattherbert01/` — user directory with:
  - `ledgers/correspondence.csv` (59 rows)
  - `ledgers/contacts_master.csv` (31 contacts)
  - `ledgers/appointments_transportation.csv` (8 appointments)
  - `ledgers/drive_index_inventory.csv`
  - `transcripts/` — ready for real-time ingestion
  - `timeline.md` — comprehensive case chronology

---

## Next Immediate Actions

### Phase 2a: Wire Live Chat to LLM
**File**: `netlify/functions/chat.js`
- Currently returns stub response
- Wire to OpenRouter (endpoint + model selection)
- Use context builder to inject case facts, ledger data, agent responsibilities
- Status: 90% ready, needs API call completion

### Phase 2b: Google Calendar Integration  
**File**: `floating-widget.html` (lines 313-328)
- Auto-detect meeting by location + time
- Populate `widget.context.contacts` and meeting status
- Wire to `checkCalendarForLocation()` 
- Status: Skeleton ready, needs Google Calendar API key + integration

### Phase 2c: Dashboard Live Data
**File**: `index.html` (search for `todayCount`, `weekCount`)
- Currently hardcoded ("1", "3")
- Connect to `ledgers/appointments_transportation.csv`
- Query for today's + this week's appointments
- Status: UI complete, just needs data wiring

### Phase 3: Production Deployment
**Current**: Netlify free tier hit usage limits  
**Options**:
1. **Keep GitHub Pages** — unlimited, static-only, already deployed
2. **Self-host on Toshiba laptop** — libby-local-server.js runs anywhere
3. **Upgrade Netlify** — if serverless functions needed for chat
4. **Use Edge Functions** — consider Vercel for same-zone latency

---

## File Map — Quick Navigation

| File | Purpose | Status |
|------|---------|--------|
| `index.html` | Main website, case portal, navigation | ✅ Live |
| `netlify/functions/chat.js` | Chat endpoint (LLM integration) | 🔄 Stub → needs OpenRouter |
| `floating-widget.html` | Voice-first transcription widget | ✅ Local testing ready |
| `libby-local-server.js` | Node.js server for local/offline testing | ✅ Ready |
| `data/mattherbert01/timeline.md` | Case chronology (2001–present) | ✅ Complete |
| `docs/LIFE_LIBRARIAN_150_AGENTS_COMPLETE.md` | 150-agent architecture + SOPs | ✅ Canonical |
| `netlify/functions/ingest-transcript.js` | Transcript ingestion (for Netlify) | ✅ Ready |

---

## Environment Variables (Already Set in Netlify)

```
OPENROUTER_API_KEY=<set>
SUPABASE_URL=<set>
SUPABASE_SERVICE_KEY=<set>
```

For local testing: Create `.env.local` with same vars if needed.

---

## Testing Checklist

- [ ] **Local server**: `node libby-local-server.js` → http://localhost:3000
  - [ ] Press 🎤, speak, verify transcript saves to `data/mattherbert01/transcripts/`
  - [ ] Verify `correspondence.csv` gets new row
  - [ ] Verify chat returns response
- [ ] **Live website**: https://libbynatico.github.io/libby_live/
  - [ ] Login works
  - [ ] Dashboard loads case context
  - [ ] Chat accepts messages (will be stub until LLM wired)

---

## Known Limitations & Fixes

1. **Netlify bandwidth limits** — Deploy to GitHub Pages instead (current setup)
2. **Web Speech API** — Requires HTTPS in production (GitHub Pages provides this)
3. **Geolocation** — Requires user permission, gracefully degrades
4. **Google Calendar** — Needs API key + OAuth scopes (not yet implemented)

---

## Hand-Off Notes

- **User priority**: Production-ready website (✅ done), not floating widget
- **Token budget**: Previous session hit 88% capacity—designed handoff to avoid mid-work cutoff
- **Next focus**: Wire live chat to LLM, then Google Calendar auto-detection
- **Deployment**: GitHub Pages is stable and unlimited; focus on feature work, not infrastructure

**When you pick this up**: Start with Phase 2a (chat LLM wiring). It's 90% done and highest value for immediate functionality.

---

**Questions for the user?** Check CLAUDE.md in repo root for project philosophy and non-negotiable rules.
