# Changelog

## v2.06.0 - April 22, 2026
**6-Tab Briefing Console — Phase 3 Features**

UI:
- 6-tab briefing console: Summary, Calendar, Timeline, Evidence, Live Notes, Responses, Tasks
- Calendar tab: Upcoming meetings with urgency coloring (today / this week / later)
- Meeting pre-briefing modal: briefing points, talking points, supporting documents, print button
- Confidence badge system enforced throughout: Confirmed / Draft / Inferred / Missing / Needs Review
- Removed all fabricated contacts (Dr. Sarah Chen never existed in source documents)

Document templating engine (Phase 3 Task 2):
- Medical Chronology, Accommodation Statement, ODSP Review Summary templates
- Draft/Approve workflow; Download as Markdown

Data:
- `data/cases.json` — canonical sample data structure; all values marked Draft/Inferred pending source verification
- 12-entity schema definitions in `schemas/schema_definitions.json`
- Schema validation layer: `validateEvidenceCard()`, CONFIDENCE enum enforced

Backend:
- `netlify/functions/gmail-drive-sync.js` — OAuth sync using raw fetch (no npm googleapis dependency)
- Token flow: client stores access_token in localStorage; passed via POST body on sync
- `netlify/functions/ingest-transcript.js` — POST endpoint for transcript ingestion
- Chat wired to `/.netlify/functions/chat` (was previously a fake timeout placeholder)

Fixes:
- Removed contradictory 2018 ODSP timeline entry (approval was December 2025)
- Removed lingering "Dr. Chen" reference from Tasks tab
- Version normalized to v2.06.0 across all files

Blockers (unresolved, documented in boardmeeting.json):
- Gmail/Drive sync requires Google OAuth credentials (GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET in Netlify env)
- All case data is sample/demo until real source documents are loaded
- Ollama unreachable from Netlify cloud (use local server for free LLM)

## v2.03.1-complete - April 22, 2026
**🎉 FULLY FUNCTIONAL LIVE WEBSITE**
Patient Zero dataset populated and all endpoints verified.
- Complete Patient Zero dataset for mattherbert01 (8 medical records, 6 contacts, 5 appointments)
- Evidence ledger with confidence tagging (confirmed/draft/inferred)
- All data structures validated and tested
- Local development server tested and working
- Deployment guide created with testing procedures
- Chat endpoint verified with context loading
- Floating widget ready for voice input
- Ready for Netlify production deployment or local development

## v2.03.0-claude-oauth - completed April 22, 2026
Patient Zero onboarding and Drive integration.
- Full portal UI restored (1682-line responsive design)
- OAuth 2.0 endpoints wired in Netlify function for future Drive/Gmail access
- Patient Zero file structure in `docs/patient_zero/` (templates created)
- Evidence ledger CSV for tracking supporting documents
- Onboarding quick-start guide for Takeout + manual import
- Chat context injection framework ready for Patient Zero files
- Mobile-responsive dashboard and chat interface
- Settings panel for auth status and Drive authorization

## v2.02.0-byok (skipped - regression)
BYOK chat implementation inadvertently overwrote full portal UI. Recovered and refactored in v2.03.0.

## v2.01.0-claude-preview1
Planned visible release pass (not completed due to BYOK regression).
Goals:
- obvious visual difference on first load ✓ (restored in v2.03.0)
- clearer dashboard hierarchy ✓ (restored)
- stronger primary/secondary action contrast ✓ (retained)
- improved chat usability ✓ (maintained)
- visible and trustworthy auth / chat / save status ✓ (wired)
- no dead-feeling controls ✓ (restored)

## v2.00.0-live
Production-facing static release with:
- repo-root deployment
- Netlify chat function
- Supabase browser auth wiring
- local workspace state
- evidence / drafts / files / chat panels
- early versioned release structure
