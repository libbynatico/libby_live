# Libby Live

Libby Live is the public-facing advocacy and case-support surface for the broader NATICO system.

The current repo is intentionally simple:
- static site from repo root
- main interface in `index.html`
- Netlify Functions in `netlify/functions`
- Supabase loaded from CDN for auth
- OpenRouter used from the serverless chat endpoint
- no build step
- no package manager
- no framework migration by default

## Purpose

This repo is not meant to be a toy dashboard.
It is intended to become:
- a guided intake and case-support portal
- a structured evidence and drafting workspace
- a live demonstration surface for stakeholders
- a durable front-end that can later consume canonical Patient Zero / case files and OpenClaw-mediated automation

## Source of truth

- GitHub = code, canon docs, handoff, and durable repo memory
- Netlify = deploys, previews, runtime secrets
- Supabase = auth and potential persistence
- Google Drive / Gmail = historical doctrine, operating notes, and source material that must be progressively canonicalized into the repo

## Current operating rules

1. Keep the architecture static unless a real need proves otherwise.
2. Do not expose secrets in repo files.
3. Make visible version bumps for meaningful release rounds.
4. Prefer small coherent changes over rewrites.
5. Stabilize the surface first, then expand capability.
6. Canonicalize Patient Zero and system doctrine into repo files rather than depending on chat memory alone.

## Immediate priorities

1. Make the UI obviously better and more reliable.
2. Tie chatbot context to repo-resident canonical files.
3. Build Patient Zero files that distinguish:
   - confirmed facts
   - patient realities
   - reusable truths
   - unresolved gaps
4. Prepare the repo for bounded automation and OpenClaw Lite handoffs.

## Core files

- `CLAUDE.md` - project memory for Claude
- `CHANGELOG.md` - visible version history
- `docs/PROJECT_HANDOFF_RECOVERY.md` - recovered project state
- `docs/system/libby_natico_operating_model.md` - system canon
- `docs/patient_zero/` - canonical Patient Zero layer
- `docs/OPENROUTER_SETUP_AND_CHATBOT_WIRING.md` - OpenRouter implementation/operator guide
- `docs/NEXT_ACTIONS_FOR_CLAUDE.md` - immediate execution brief
