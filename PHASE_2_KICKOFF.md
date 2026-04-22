# Phase 2 Kickoff — Parallel Work Ready

**Status:** Infrastructure complete. Three agents ready to execute in parallel.  
**Last Updated:** 2026-04-22T22:15Z  
**Token Budget Remaining:** ~58-60% for Phase 2

---

## What's Ready

✅ **Gemini → Direct Import Pipeline**
- Prompt: `/GEMINI_PROMPT_READY_TO_SEND.txt` (copy-paste ready)
- Import endpoint: `POST /api/import-sources` (no connectors needed)
- Output format: Markdown report or JSON
- Result: Stored in `/data/_shared/gemini_source_report_YYYY-MM-DD.json`

✅ **libbyclaudecode → Sample Data + Specs**
- Sample fixture: `/fixtures/sample-briefing-data.json` (realistic test data)
- Design spec: `/design_spec.md` (UI/UX specifications)
- Architecture: `/ARCHITECTURE_UNIFIED.md` (12 entities, confidence model, workflows)
- Task list: `/PHASE_2_TASK_ASSIGNMENTS.md` (4 tasks with acceptance criteria)

✅ **Claude → Guardrails + Coordination**
- Permission enforcement: `/netlify/functions/auth-middleware.js` (read/write guards)
- Audit logging: Built into auth-middleware and import-sources
- Coordination: `/conversation.json` (live heartbeat of all agents)

---

## Three Parallel Workstreams

### 1. libbyclaudecode — UI Development (2-3 hours)

**Task 1: Define 12 Core Schemas** (1-1.5 hrs)
- Create `/schemas/*.schema.json` for all entities
- Include confidence enum in all external-facing schemas
- Ensure userID tagging for multi-patient support

**Task 2: Implement Confidence Model** (30-45 min)
- Create `/js/confidence.js` with enforced enum
- CONFIRMATION_LEVELS = {CONFIRMED, DRAFT, INFERRED, MISSING_EVIDENCE, NEEDS_REVIEW}
- Cannot save without valid confidence level

**Task 3: Build iPad Briefing Console** (1.5-2 hrs)
- 6 tabs: Summary, Timeline, Evidence, Live Notes, Responses, Tasks
- Use sample data from `/fixtures/sample-briefing-data.json`
- Test with both portrait (hide chat) and landscape layouts

**Task 4: Implement Meeting Mode** (1-1.5 hrs)
- User asks question → show answer + confidence badge
- "Show source" expands to full document
- "Create follow-up" captures task
- Auto-generate post-meeting recap

**Sample Data Available:**
```json
{
  "timeline_events": [...13 events from 2001-2026...],
  "claims": [...5 claims with confidence levels...],
  "summary": {...brief description...},
  "tasks": [...4 follow-up tasks...],
  "responses": {...pre-built response templates...}
}
```

---

### 2. Gemini — Source Discovery (1-2 hours)

**1. Copy the prompt:**
```
/GEMINI_PROMPT_READY_TO_SEND.txt
```

**2. Search Matthew's Drive:**
- Priority order: 2001-2015 medical → pre-2024 admin → 2024 crisis → 2025 recognition → 2026 surgery
- Report findings in structured markdown format (see prompt for exact format)

**3. Import directly (no connectors):**

Option A: Use import endpoint
```bash
curl -X POST http://localhost:3000/api/import-sources \
  -H "Content-Type: application/json" \
  -d '{
    "format": "markdown",
    "content": "# GEMINI_SOURCE_DISCOVERY_REPORT\n...",
    "userID": "system"
  }'
```

Option B: Copy-paste into `/data/_shared/gemini_source_report.md` (manual)

**Expected Output Format:**
```markdown
# GEMINI_SOURCE_DISCOVERY_REPORT

## Files Found (High Confidence)
---
FILE_ID: [ID]
FILENAME: [name]
DATE: [date]
TYPE: [Operative Note | Discharge Summary | etc]
RELEVANCE: [What gap does this fill?]
CONFIDENCE: [HIGH | MEDIUM | LOW]
FOLDER_PATH: [path in Drive]
STATUS: [Confirmed Match | Possible Match | Needs Verification]
NOTES: [excerpt or observation]
---

## Files Not Found
---
MISSING_ID: [e.g., TBI_2001]
WHAT_SEARCHED: [search terms used]
SEARCH_TERMS_USED: ["term1", "term2"]
RESULT: [File not found | Found related but not exact]
RECOMMENDATION: [Request from: Hospital | ODSP | Dr. Name]
---

## Summary
- Total files found: X
- High confidence: X
- Medium confidence: X
- Missing / Request from provider: X
- Patterns observed: [notes]
```

---

### 3. Claude — Coordination + Guardrails (Ongoing)

**Monitor & Coordinate:**
- Check conversation.json every 30min
- Watch for blockers in notes field
- Unblock quickly if agents get stuck
- Update session history after milestones

**Multi-Patient Permission Tests** (when ready):
```javascript
// Test 1: mattherbert01 tries to read kellsie's private data
testCrossPatientAccess('kellsie', 'mattherbert01')
// Expected: denied (access_denied)

// Test 2: kellsie reads _shared/ document
testCrossPatientAccess('_shared', 'kellsie')
// Expected: allowed (shared_reference)

// Test 3: Audit log shows all access attempts
// Check: /data/_system/file_access_log.json
```

**Rating After Each Session:**
- Code Quality: 1-5 stars
- Feature Completeness: 1-5 stars
- UX/Polish: 1-5 stars
- Documentation: 1-5 stars
- Communication: 1-5 stars

---

## Success Criteria (End of Phase 2)

- [ ] All 12 schemas functional and validated
- [ ] Confidence model hard-enforced (can't save without it)
- [ ] 6-tab briefing console works end-to-end
- [ ] Meeting mode captures questions → answers → follow-ups
- [ ] Multi-patient isolation tested and enforced
- [ ] Gemini source discovery complete and imported
- [ ] Sample data visible in briefing console
- [ ] Zero hallucinations (templates only)
- [ ] iPad portrait/landscape layouts responsive
- [ ] All tests passing

---

## File Locations Reference

| File | Purpose | Owner |
|------|---------|-------|
| `/GEMINI_PROMPT_READY_TO_SEND.txt` | Copy-paste search prompt | Claude |
| `/netlify/functions/import-sources.js` | Direct import endpoint | Claude |
| `/netlify/functions/auth-middleware.js` | Permission enforcement | Claude |
| `/fixtures/sample-briefing-data.json` | Test data | Claude |
| `/conversation.json` | Coordination heartbeat | Claude |
| `/schemas/*.schema.json` | Entity schemas (to create) | libbyclaudecode |
| `/js/confidence.js` | Confidence model (to create) | libbyclaudecode |
| `index.html` (6-tab section) | Briefing console (to implement) | libbyclaudecode |
| `/js/meeting-session.js` | Meeting mode (to create) | libbyclaudecode |
| `/data/_shared/gemini_source_report_*.json` | Imported sources | Gemini |

---

## Quick Start Commands

```bash
# Local dev server
node libby-local-server.js

# Import Gemini output (manual)
curl -X POST http://localhost:3000/api/import-sources \
  -H "Content-Type: application/json" \
  -d '{"format": "markdown", "content": "...", "userID": "system"}'

# Test permissions
curl -X POST http://localhost:3000/.netlify/functions/auth-middleware \
  -H "Content-Type: application/json" \
  -d '{"operation": "test_cross_patient", "userID": "kellsie", "dataType": "mattherbert01", "currentUser": "mattherbert01"}'

# View audit log
cat data/_system/file_access_log.json | tail -20
```

---

## Branch & Commits

**Development Branch:** `claude/plan-chatbot-implementation-DOkaj`

**Recent Commits:**
- `9cb7ba0`: Add structured Gemini Drive source discovery prompt
- `b5449c5`: Phase 2: Set up parallel work infrastructure

---

## Next Milestone

**v2.05.0 — Phase 2 Complete**
- All 12 schemas functional
- Confidence model enforced
- 6-tab briefing console working
- Meeting mode end-to-end
- Multi-patient isolation tested
- Gemini sources imported
- Ready for Phase 3 (advanced workflows)

---

**Ready to build. All three agents can go in parallel. Update conversation.json after each major milestone.**
