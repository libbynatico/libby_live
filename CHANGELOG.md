# Changelog

## v2.03.0-claude-oauth - in progress
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
