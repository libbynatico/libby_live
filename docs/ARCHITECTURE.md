# Libby Live — Architecture

## Repo split

### libby_live (this repo — public, deployable)
The app only. Contains:
- `index.html` — SPA entry point, role-aware login, full portal UI
- `netlify/functions/chat.js` — serverless chat + retrieval API
- `importers/` — local utility scripts to process raw case artifacts
- `retrieval/` — context assembly logic wired into the chat function
- `schemas/` — JSON schemas for validated data structures
- `docs/` — system and architecture documentation

Does NOT contain:
- Raw case files
- Patient transcripts
- CSV indexes from Drive
- Source materials

### libby_casevault (private — local or private repo)
The knowledge base. Contains:
```
patient_zero/
  profile.md               # Patient profile, contacts, diagnoses
  timeline.md              # Chronological case events
  context.md               # Current situation, realities, truths
  evidence_ledger.csv      # Structured evidence with confidence levels
  transcripts/
    calls/                 # Call transcripts as .md or .txt
    audio_transcripts/     # Audio-derived transcripts
  indexes/
    inventory_manifest.csv
    export_manifest.csv
    master_interaction_ledger.csv
    call_history_normalized.csv
    recording_note_index.csv
    call_recording_matches.csv
    audio_transcript_index.csv
    google_calendar_import_interactions.csv
    google_calendar_events.csv
```

### Utility repos (separate, not runtime dependencies)
- `voice-memo-transcription` — audio processing, not app dependency
- `ios_extraction` — iOS file extraction, not app dependency
- Any Drive ingestion scripts → belong in importers/ as local utilities

---

## Data flow

```
Google Drive / Gmail / iOS
        │
        ▼
  [Normalization pass] (manual or via utility repos)
        │
        ▼
  libby_casevault/
  patient_zero/
    profile.md
    timeline.md
    evidence_ledger.csv
    indexes/*.csv
    transcripts/calls/*.md
        │
        ▼ (DATA_ROOT env var)
  netlify/functions/chat.js
    retrieval/context_builder.js
    retrieval/fact_classifier.js
        │
        ▼ (system prompt context injection)
  OpenRouter → LLM response
        │
        ▼
  index.html chat panel
```

---

## Role-aware login

| Role | User ID | Access |
|---|---|---|
| admin | libby | All cases, full portal |
| patient_zero | mattherbert01 | Own case only |
| patient | (future) | Own case only |

Login is handled client-side with Supabase auth (GitHub) or direct role selection.
userId is passed to the chat function, which loads context from `DATA_ROOT/{userId}/`.

---

## Environment variables

| Variable | Where set | Purpose |
|---|---|---|
| `OPENROUTER_API_KEY` | Netlify env | LLM routing |
| `SUPABASE_URL` | Netlify env | Auth and storage |
| `SUPABASE_SERVICE_KEY` | Netlify env | Server-side Supabase calls |
| `DATA_ROOT` | Netlify env or local .env | Path to private knowledge directory |

For local dev, set in `.env`:
```
DATA_ROOT=/absolute/path/to/libby_casevault
```

For Netlify deploy, `DATA_ROOT` must point to a directory the function can reach.
Options:
1. **Private repo as build-time submodule** — check out casevault into `data/` at build time
2. **Supabase storage** — store artifacts in Supabase, function fetches them
3. **Netlify blob storage** — upload artifacts, function reads from Netlify Blobs

MVP default: DATA_ROOT falls back to `./data` in the repo root (gitignored).

---

## Adding a new patient

1. Create `libby_casevault/{user_id}/` directory
2. Add `profile.md`, `timeline.md`, `context.md`, `evidence_ledger.csv`
3. Add `indexes/` and `transcripts/` subdirectories
4. Set `DATA_ROOT` to point to the casevault root
5. Log in as that user_id in Libby Live
6. Chat will automatically load their context

---

## Running the ingest script

```bash
# Validate your local knowledge files
node importers/ingest.js --data-root /path/to/libby_casevault --user mattherbert01
```

This reads all files, parses them, and prints a JSON summary with any missing files.

---

## Deploy steps

1. `git push origin claude/plan-chatbot-implementation-DOkaj`
2. Netlify auto-deploys from connected branch
3. Set `DATA_ROOT` in Netlify environment variables
4. If using private repo for data: add build plugin to clone it before deploy
5. Visit the preview URL, click "Sign in", select role

---

## What still requires the user

| Blocker | What's needed |
|---|---|
| Case knowledge loaded into chat | Copy Drive artifacts into `libby_casevault/patient_zero/` |
| Live Drive sync (Phase 2) | Google Cloud project + OAuth credentials |
| Supabase persistence for drafts/evidence | Supabase table schema deploy |
| Netlify DATA_ROOT for production | Set env var or configure build-time data fetch |

---

## Phase 2 (not MVP)

- Live Google Drive sync via OAuth adapter
- Supabase-backed knowledge storage (for serverless DATA_ROOT)
- Multi-patient workspace with per-user access control
- Evidence tagging UI (confirmed / inferred / open / action)
- Timeline visualization
- Export to PDF/markdown
