# Phase 2 Task Assignments — Parallel Development

**Status:** In Progress  
**Duration:** This session + next session  
**Tokens:** ~58-60% allocated to Phase 2

---

## LIBBYCLAUDECODE — UI/Schema Implementation

**Owner:** libbyclaudecode  
**Tokens available:** ~25-30%  
**Duration:** ~2-3 hours focused work  
**Branch:** `claude/phase-2-ui-schemas`

### Task 1: Define 12 Core Schemas (1-1.5 hrs)
**What:** Create JSON schemas for all data entities  
**Files to create:** `/schemas/*.schema.json`
```
- source_document.schema.json
- evidence_card.schema.json
- claim.schema.json
- timeline_event.schema.json
- matter.schema.json
- task.schema.json
- contact.schema.json
- interaction.schema.json
- draft.schema.json
- decision.schema.json
- alert.schema.json
- agent_run.schema.json
```

**Acceptance Criteria:**
- [ ] All 12 schemas defined with required fields
- [ ] Confidence enum in all external-facing schemas
- [ ] userID tagged in all entities (multi-patient support)
- [ ] source_refs on all claim/evidence entities
- [ ] Validation rules clear (min/max, required fields)

**Dependencies:** ARCHITECTURE_UNIFIED.md (reference section on 12 entities)

---

### Task 2: Implement Confidence Model in Code (30-45 min)
**What:** Make confidence ENFORCEABLE, not just labels  
**File:** `index.html` + new `js/confidence.js`

```javascript
// Confidence enum (enforced everywhere)
const CONFIDENCE_LEVELS = {
  CONFIRMED: 'Confirmed',
  DRAFT: 'Draft',
  INFERRED: 'Inferred',
  MISSING_EVIDENCE: 'Missing Evidence',
  NEEDS_REVIEW: 'Needs Review'
};

// Badge component (shows on every claim)
function renderConfidenceBadge(confidence) {
  const colors = {
    'Confirmed': '#42c08c',
    'Draft': '#f2bb5e',
    'Inferred': '#75a7ff',
    'Missing Evidence': '#ef6f6f',
    'Needs Review': '#ffc3c3'
  };
  return `<span class="confidence-badge" style="background:${colors[confidence]}">${confidence}</span>`;
}

// Storage validation (don't save without confidence)
function saveEvidenceCard(card) {
  if (!CONFIDENCE_LEVELS[card.confidence]) {
    throw new Error('Confidence must be set before saving');
  }
  localStorage.setItem(`evidence_${card.id}`, JSON.stringify(card));
}
```

**Acceptance Criteria:**
- [ ] Confidence enum defined and enforced
- [ ] UI shows badge for every claim/evidence item
- [ ] Cannot save without setting confidence
- [ ] Different visual styles per confidence level
- [ ] Works in meeting mode (visible always)

---

### Task 3: Build iPad Briefing Console (1.5-2 hrs)
**What:** 6-tab interface that feels like a briefing app, not a chatbot  
**File:** Update `index.html` + new `js/briefing-ui.js`

**6 Tabs:**
1. **Summary** — Concise brief of current issue (3-5 sentences)
2. **Timeline** — Chronological events relevant to this matter
3. **Evidence** — Source-backed clips with "Show source" expands
4. **Live Notes** — What's happening in THIS meeting (capture mode)
5. **Responses** — Pre-built templates + newly assembled text (copy-to-clipboard)
6. **Tasks** — Follow-ups created from meeting (drag to prioritize)

**Acceptance Criteria:**
- [ ] All 6 tabs render with real data (use sample timeline + truths)
- [ ] Tab switching smooth (no lag)
- [ ] Evidence shows confidence badges
- [ ] Live Notes auto-save to localStorage
- [ ] Responses have "Show shorter / Show fuller" toggle
- [ ] Tasks capture owner + deadline
- [ ] iPad portrait: hide chat panel (button to toggle)
- [ ] iPad landscape: show all 3 columns (sidebar | main | chat)
- [ ] Touch-friendly (44px+ tap targets)

**Data Source:** mattherbert01's expanded timeline.md + patient_truths.md

---

### Task 4: Implement Meeting Mode (1-1.5 hrs)
**What:** Live session capture during meetings  
**File:** new `js/meeting-session.js`

**Features:**
- User asks question (text input)
- System shows concise answer from approved materials
- Button: "Show source" (expands to full document)
- Button: "Create follow-up task" (captures commitment)
- Button: "End session" (generates recap)

**Interaction pattern:**
```
Question: "What was my ODSP approval date?"
  ↓
Shows: "December 3, 2025" [Confirmed] [Show source]
  ↓
User taps "Show source"
  ↓
Expands: Full ODSP Notice of Decision (if available)
  ↓
User taps "Create follow-up"
  ↓
Task created: "Follow up on ODSP payment schedule" (owned by: worker)
  ↓
Adds to Tasks tab automatically
```

**Acceptance Criteria:**
- [ ] Questions saved to LiveMeetingState
- [ ] Answers shown with confidence badge
- [ ] Source expansion works
- [ ] Follow-up task creation works
- [ ] Auto-generates post-meeting recap
- [ ] All session data saved to localStorage

---

## GEMINI — Drive Source Discovery

**Owner:** Gemini  
**Tokens available:** Unlimited (external)  
**Duration:** ~1-2 hours  
**Output:** GEMINI_SOURCE_REPORT.md

### Task: Find Missing Sources in Drive

**Reference:** GEMINI_SOURCE_FINDING_PROMPT.md

**Priority order:**
1. Medical records (2001-2015): TBI, Crohn's diagnosis, colectomy, ileostomy
2. Administrative (pre-2024): ODSP attempt, Ontario Works enrollment
3. 2024 Crisis: Cambridge Memorial discharge, operative notes, pathology
4. 2025 Recognition: ODSP approval, DSO assessment, backdate letter
5. 2026 Surgery: Juravinski discharge, operative note, pain management notes

**Output format:**
```markdown
# GEMINI_SOURCE_REPORT.md

## Found (High Confidence)
- [File 1] — Location, date, relevance, confidence

## Found (Medium Confidence)  
- [File 2] — Location, date, relevance, confidence

## Not Found / Request from Provider
- [Missing Item] → Request from [Provider]

## Recommendations
- Patterns observed
- Organization suggestions
```

**Acceptance Criteria:**
- [ ] Searched all priority gaps
- [ ] Found 5+ files OR documented why missing
- [ ] Classified by confidence
- [ ] Identified external requests needed
- [ ] Updated conversation.json

---

## CLAUDE — Coordinator + Guardrails

**Owner:** Claude  
**Duration:** Ongoing (coordinate as tasks complete)  
**Focus:** Implement multi-patient isolation guardrails

### Task 1: Backend Permission Enforcement

**File:** new `netlify/functions/auth-middleware.js`

```javascript
// Enforce permissions on every API call
async function authenticateAndAuthorize(request, currentUser) {
  const { action, userID, fileType } = request.body;
  
  // Check ownership
  if (action === 'read' && userID !== currentUser) {
    // Check if shared
    const permissions = await getPermissions(userID);
    if (!permissions.canRead.includes(currentUser)) {
      return { status: 403, error: 'Access denied' };
    }
  }
  
  // Check write (only owner can modify)
  if (action === 'write' && userID !== currentUser) {
    return { status: 403, error: 'Only owner can edit' };
  }
  
  return { status: 200, authorized: true };
}
```

**Acceptance Criteria:**
- [ ] All API endpoints check permissions
- [ ] Audit log created for every access
- [ ] Cross-patient requests denied
- [ ] Shared documents accessible to both users
- [ ] Tests pass (see test scenarios below)

### Task 2: Coordinate Integration

**During implementation:**
- [ ] Answer libbyclaudecode questions (architecture clarification)
- [ ] Update conversation.json after major milestones
- [ ] Flag blockers immediately
- [ ] Rate work when tasks complete (5-star scale)

---

## Testing Scenarios (Acceptance)

**Test 1: Data Isolation**
```
mattherbert01 tries to read kellsie/timeline.md
Expected: Error "Access denied"
Actual: [test result]
```

**Test 2: Shared Access**
```
mattherbert01 tries to read _shared/dso_assessment_context.md
Expected: Success (shared_with_mattherbert01)
Actual: [test result]
```

**Test 3: Write Protection**
```
kellsie tries to edit mattherbert01/patient_truths.md
Expected: Error "Only mattherbert01 can edit"
Actual: [test result]
```

**Test 4: UI with Real Data**
```
Load briefing console with mattherbert01's timeline
Expected: 6 tabs load, evidence shows confidence badges
Actual: [test result]
```

**Test 5: Meeting Mode**
```
User asks question, system retrieves answer, shows source
Expected: Confidence badge, source expandable, follow-up capturable
Actual: [test result]
```

---

## Commit & Reporting

**After each task:**
1. Commit code to feature branch
2. Update conversation.json:
   - What you accomplished
   - Issues encountered
   - Next blocker
   - Self-rating (1-5 per dimension)

**Example:**
```json
{
  "session": 2,
  "agent": "libbyclaudecode",
  "date": "2026-04-22",
  "accomplishments": [
    "✅ All 12 schemas defined",
    "✅ Confidence model enforced in code",
    "⏳ iPad briefing console (50% done)"
  ],
  "blockers": [
    "Need sample data populated to test tabs"
  ],
  "tokenUsageStart": "27%",
  "tokenUsageEnd": "42%",
  "ratings": {
    "Code Quality": 4,
    "Feature Completeness": 3,
    "UX/Polish": 4,
    "Documentation": 5,
    "Communication": 5
  },
  "feedback": "Solid schema work. UI coming together. Need to finish meeting mode next session."
}
```

---

## Success Criteria (End of Phase 2)

- [ ] All 12 schemas functional and validated
- [ ] Confidence model hard-enforced (can't save without it)
- [ ] 6-tab briefing console works end-to-end
- [ ] Meeting mode captures questions → answers → follow-ups
- [ ] Post-meeting recap auto-generates
- [ ] Multi-patient isolation enforced (test all scenarios)
- [ ] Audit logging working
- [ ] Zero hallucinations (templates only)
- [ ] iPad layout responds to portrait/landscape
- [ ] All tests passing
- [ ] Data integrity checks in place

---

## Go/No-Go Gate (Before Phase 3)

**Phase 3 only starts when:**
- All schemas validated
- Confidence model enforced everywhere
- No access control bugs found in testing
- Briefing console fully functional
- Meeting mode works end-to-end
- Multi-patient tests all passing

**If blocker found:** Flag in conversation.json, fix, re-test.

---

**You're at 35% tokens. You have ~58-60% for Phase 2. Start now.**

Go build.
