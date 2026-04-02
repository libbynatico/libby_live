# Libby Live / NATICO - Claude Project Memory

## Project identity
- Repo: `libbynatico/libby_live`
- Netlify project: `libbylive`
- Main product surface: Libby Live
- Organization context: NATICO, a disability-informed advocacy and service-intelligence organization

## Architecture that is intentional
- Static site served from repo root
- Main UI and interaction layer in `index.html`
- Server-side chat integration in `netlify/functions/chat.js`
- No package.json
- No framework migration
- No build step unless a future change proves it is necessary
- Supabase is loaded from CDN for auth
- OpenRouter is called only from the Netlify function

## Deployment state already recovered
- Netlify production deploy succeeded
- GitHub is connected to Netlify
- Netlify environment variables already exist:
  - `OPENROUTER_API_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_KEY`
- Path mistakes in Netlify were already corrected
- A later Netlify/Codex preview run claimed improvements, but the user did not observe meaningful visible change

## Non-negotiable rules
1. Do not migrate to Next.js.
2. Do not add packages or a build step unless strictly necessary.
3. Do not expose or rotate secrets.
4. Do not write secret values into repo files.
5. Fail gracefully if auth or chat are degraded.
6. Prefer a small coherent release over a sprawling rewrite.
7. Every meaningful release must visibly bump versioning.

## Product character
Libby Live should feel:
- institutional but modern
- serious but not sterile
- calm
- trustworthy
- structured
- disability-informed
- more like a real case portal than a prototype or startup SaaS dashboard

Libby must not feel:
- bubbly
- gimmicky
- theatrical
- hype-driven
- toy-like

## Current priorities
1. Produce a visibly improved release, not an invisible refactor
2. Make interaction quality obvious on first load
3. Build a canonical Patient Zero layer inside the repo
4. Tie chatbot context to the Patient Zero reference set
5. Reduce the amount of manual routing work required from the founder

## Versioning rule
The next visible preview release target is:
`v2.01.0-claude-preview1`

When making a visible release, update:
- document title
- visible version chip or footer
- internal version constant
- settings / status view
- changelog or release notes

## Canonical doctrine already recovered from Drive / Gmail
Use these as source-of-truth guidance:
- `LIBBY_CONSTITUTION_v1.md`
- `LIBBY - GLOBAL PERSONALIZATION SETTINGS`
- `GPT_ENGINEER.docx`
- `GEMINI_TEAM_INTAKE.docx`
- `NATICO Platform Architecture and Phase-1 Scope`
- `NATICO Phase-1 Launch Gating Checklist`
- Gmail thread: `Patient_zero_onboarding` (2026-04-01)
- Gmail thread: `Fwd: Urgent help plea - Matthew Herbert - "Patient_reality" & "Patient_experience"` (2026-03-25)
- Gmail thread: `LIBBY_LIVE Phase 2 — Milestones 1 & 2 Complete — Ready for Milestone 3`
- Gmail thread: `claude code v1.02 progress`

## Agent role split
- Claude: primary repo executor, UX improver, final integrator
- ChatGPT: system architecture, synthesis, governance logic
- Gemini: Drive/Gmail retrieval, inventory, Google-native discovery
- OpenClaw Lite: future dispatcher / automation layer
- cheap utility models: transforms and boilerplate only, not canonical logic

## Repo mission
This repo must become:
- a working front-end for guided intake and case support
- a live demo surface for investor / partner review
- a stable base for future automation
- a surface that can consume structured Patient Zero context rather than depending on chat memory alone

## Files that matter first
- `index.html`
- `netlify/functions/chat.js`
- `CHANGELOG.md`
- `docs/PROJECT_HANDOFF_RECOVERY.md`
- `docs/system/libby_natico_operating_model.md`
- `docs/patient_zero/patient_zero_onboarding_master.md`
- `docs/patient_zero/source_index.md`
- `docs/patient_zero/evidence_ledger.csv`
- `docs/patient_zero/patient_zero_context_summary.md`
- `docs/OPENROUTER_SETUP_AND_CHATBOT_WIRING.md`
- `docs/NEXT_ACTIONS_FOR_CLAUDE.md`

## Work method
For every meaningful round:
1. Recover current repo state
2. Identify what is already solved
3. Identify what is still broken or weak
4. Make a visible, reviewable change set
5. Validate the preview, not just the code diff
6. Report: root cause, files changed, visible changes, interaction changes, validation, next steps
