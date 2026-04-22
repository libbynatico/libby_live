# Libby Live Unified Architecture — From Claude + GPT Review

**Goal:** Meeting-first, low-hallucination evidence system with fast polished outputs on iPad.

**Principle:** State-first, not chat-first. Evidence in → Claims → Confidence → Human approval → Live display.

---

## Core Model (GPT + Claude)

### What We're NOT Building
- 150 autonomous micro-agents in code
- Improvised chat responses
- Monolithic agent file
- Theatrical agent personas

### What We ARE Building

**8-12 Core Runtime Capabilities:**
1. **Ingest** — Files, audio, emails, notes → normalized, OCR'd, Markdown, dedupe'd
2. **Extract** — Raw text → claims with source refs
3. **Index** — Claims → evidence cards with confidence labels
4. **Matter** — Case routing (ODSP, DSO, Rogers, housing, surgery, etc)
5. **Draft** — Templates + approved blocks → polished letters/briefs
6. **Review** — Confidence gates, human approval, contradiction checks
7. **Alert** — Deadlines, follow-ups, low-confidence flags
8. **Audio** — Transcript → segment → quote extract → caption → package
9. **Audit** — Handshakes (events), heartbeats (snapshots), logs
10. **Serve** — iPad interface with controlled unfolding

Plus:
- **Prompt** management (templates, not improvisation)
- **Schema** enforcement (confidence enums, source refs)
- **Compiler** (approved blocks + templates → final output)

### Canonical Data Model (Required First)

These 12 entities must exist in code with schemas:

```
SourceDocument
  - id, file_path, file_type, ingested_at, raw_text, metadata

EvidenceCard
  - id, source_ref, claim_text, confidence (enum), topic, date_range, matter_id, approval_status

Claim
  - id, text, sources[], confidence, extracted_by, human_reviewed, reasoning_summary

TimelineEvent
  - id, date_start, date_end, event_type (clinical, admin, system), description, sources[], confidence, matter_id

Matter
  - id, type (ODSP, DSO, Rogers, housing, surgery, travel, admin), status, owner_role, created_at, deadline, approval_status

Task
  - id, title, description, owner, due_date, status, matter_id, evidence_refs, follow_up_for

Contact
  - id, name, role, organization, last_contacted, next_contact_date, interaction_count

Interaction
  - id, contact_id, type (email, phone, visit, meeting), date, notes, matter_id, outcome

Draft
  - id, type (medical_chronology, accommodation_request, appeal_letter, meeting_brief, etc), content, sources[], confidence_checks, approval_status, compiled_from[]

Decision
  - id, matter_id, decision_date, decision_text, source_refs, confidence, approved_by, documented

Alert
  - id, alert_type (deadline, missing_evidence, unconfirmed_claim, contradiction, follow_up_needed), severity, matter_id, created_at, resolved_at, action_required

AgentRun
  - id, timestamp, capability (ingest, extract, review, draft, etc), input_id, output_id, actor_type, confidence_delta, human_required, notes
```

Each entity must have:
- UUID id
- Created/modified timestamps
- Source references (traceable back to evidence)
- Confidence label (if applicable)
- Approval status (if external-facing)

---

## Data Layer (5 Levels)

### Level 1: Immutable Evidence
Raw documents, emails, transcripts, screenshots, audio files.
**Never rewritten. Only appended.**

### Level 2: Structured Truth
Claims extracted from evidence with:
- Source refs (back to Level 1)
- Claim text
- Confidence label
- Topic tags
- Human approval status

### Level 3: Polished Artifacts
Compiled, human-reviewed outputs:
- Medical chronology (2001–present)
- Accommodation statement
- ODSP summary
- Appeal letter template
- Meeting brief (one-pager)
- Self-advocacy script
- Post-meeting recap

All sourced from Level 2, human-approved before use.

### Level 4: Live Meeting State
Session-specific temporary layer:
- What question was asked
- What answer was shown (with confidence badge)
- What evidence was referenced
- What new issue was raised
- What follow-up is pending

Cleared after meeting logged to Level 5.

### Level 5: Audit & Governance
Immutable records:
- Handshake events (state transitions)
- Heartbeat snapshots (health status)
- Interaction logs (who asked, who answered, what was shown)
- Decision trail (approvals, rejections, rationale)
- Error/contradiction flags

---

## Confidence Model (Hard Schema)

**5 statuses, enforceable at record level:**

```
Confirmed
  - Multiple independent sources, or official document, or provider statement
  - Safe for external use without caveats
  - Example: "Crohn's disease diagnosed June 2002 (Hospital Records, Pediatric Consult)"

Draft
  - Based on one source or preliminary evidence
  - Needs human review before external use
  - Example: "Suspected [X] based on symptom notes (Needs clinical confirmation)"

Inferred
  - Logical conclusion from evidence, but not stated directly
  - Must be labeled "appears" / "suggests" / "consistent with"
  - Example: "Care continuity appears to have broken around 2015 (9-year gap in GI follow-ups)"

Missing Evidence
  - Claim exists but supporting docs not yet located
  - Cannot be phrased as fact
  - Example: "Hospital discharge summary from June 2024 surgery [MISSING - need from Cambridge Memorial]"

Needs Review
  - Contradiction detected, or insufficient detail
  - Flagged for human decision
  - Example: "Pain management plan June vs August 2026 [CONFLICTING - need clarification]"
```

**UI Rule:** Every claim shown on iPad has a tiny badge: `[Confirmed]` `[Draft]` `[Inferred]` `[Missing]` `[Review]`

---

## Workflow (10 Permanent Flows)

### 1. Ingest Document
Input: File (PDF, email, image, audio)  
Process: OCR, dedupe, metadata, Markdown conversion  
Output: SourceDocument + placeholder EvidenceCards  
Handshake: `document_ingested`

### 2. Extract Claims
Input: SourceDocument  
Process: LLM extracts claims, models provides confidence  
Output: Claim records  
Gate: Claims tagged as "Draft" until human review  
Handshake: `claims_extracted`

### 3. Index Evidence
Input: Claim  
Process: Create EvidenceCard, assign confidence, add topic/date/matter tags  
Output: EvidenceCard + retrieval record  
Handshake: `evidence_indexed`

### 4. Update Timeline
Input: TimelineEvent + source refs  
Process: Validate date range, attach sources, assign confidence  
Output: TimelineEvent record  
Handshake: `timeline_updated`

### 5. Assign Matter
Input: Evidence + matter classification  
Process: Route to ODSP, DSO, Rogers, housing, surgery, travel, or admin  
Output: Matter record + task assignments  
Handshake: `matter_assigned`

### 6. Build Artifact (Pre-compile)
Input: Matter + approved evidence blocks  
Process: Select template, populate from Level 2 & 3 truth, compile  
Output: Draft artifact with sources  
Gate: Requires human review (confidence check, citation check)  
Handshake: `artifact_compiled`

### 7. Approve for External Use
Input: Artifact + confidence matrix  
Process: Human verifies sources, confidence labels, tone, accuracy  
Output: Approved artifact ready for iPad display  
Handshake: `artifact_approved`

### 8. Run Meeting Session
Input: User question + active matter  
Process: Retrieve approved artifacts + fresh evidence, display with controlled unfolding  
Output: LiveMeetingState record (question, answer shown, evidence cited, follow-ups)  
Handshake: `meeting_state_logged`

### 9. Generate Post-Meeting Recap
Input: LiveMeetingState + new decisions/commitments  
Process: Compile what was asked, answered, promised, still unresolved  
Output: PostMeetingRecap (structured, with task assignments)  
Handshake: `recap_generated`

### 10. Alert on Deadline / Missing Evidence
Input: Matter deadline or confidence gap  
Process: Check date vs today, flag if approaching or overdue, list missing sources  
Output: Alert record + task creation  
Heartbeat: Health check includes alert count  

---

## Handshake & Heartbeat (Strict Events)

### Handshake = State Transition Event

Triggers:
```
document_ingested
claims_extracted
evidence_indexed
claim_confidence_changed
claim_promoted_to_confirmed
artifact_compiled
artifact_approved_for_external_use
meeting_state_logged
decision_recorded
follow_up_task_created
contradiction_detected
evidence_gap_flagged
matter_status_changed
alert_generated
```

**Schema:**
```json
{
  "id": "uuid",
  "timestamp": "ISO 8601",
  "event_type": "document_ingested | claims_extracted | ...",
  "source_refs": ["doc_id", "claim_id"],
  "output_refs": ["evidence_card_id", "task_id"],
  "status_before": "Draft | Confirmed | Missing",
  "status_after": "Confirmed | Needs Review",
  "actor_type": "system | human",
  "actor_id": "user_id | capability_name",
  "confidence_delta": 0.3,
  "human_review_required": true | false,
  "notes": "brief text"
}
```

### Heartbeat = Health Snapshot

Triggers: Every 30 minutes, or on user request, or before live meeting.

**Schema:**
```json
{
  "id": "uuid",
  "timestamp": "ISO 8601",
  "session_id": "user session UUID",
  "active_matter": "ODSP | DSO | Rogers | ...",
  "approved_artifacts": [
    { "type": "medical_chronology", "version": 7, "approved_at": "2026-04-22T10:30Z" },
    { "type": "accommodation_statement", "version": 3, "approved_at": "2026-04-21T14:00Z" }
  ],
  "unresolved_questions_count": 2,
  "missing_evidence_count": 3,
  "claims_needing_review_count": 1,
  "contradictions_detected": 0,
  "sync_status": "up_to_date | syncing | error",
  "last_ingest_at": "2026-04-22T09:15Z",
  "last_review_at": "2026-04-22T11:00Z",
  "errors_present": [],
  "readiness_for_meeting": 0.92,
  "next_deadline": "2026-04-25 (ODSP response due)"
}
```

### Log = Permanent Record of Both

Immutable append-only log with all handshakes + heartbeats + user actions.

---

## iPad Interface (Not a Chatbot, a Briefing Console)

### 6-Tab Layout

**Tab 1: Summary**
- Concise plain-language brief of current issue
- Key dates, people, decisions
- Next action with deadline
- Confidence summary (% Confirmed vs Draft)

**Tab 2: Timeline**
- Chronological unfolding of events relevant to this matter
- Date | Event | Source | Confidence
- Filterable by matter type

**Tab 3: Evidence**
- Direct source-backed excerpts, quotes, dates
- Grouped by topic
- "Show source" expands to full document
- Confidence badges visible

**Tab 4: Live Notes**
- What just happened in this meeting
- Questions asked, answers provided
- Follow-ups captured
- Auto-saves as you talk

**Tab 5: Responses**
- Pre-built templates ready to share
- "Show shorter / show fuller" for each
- Copy-to-clipboard
- "Hand to staff" full-screen mode
- Source citations visible

**Tab 6: Tasks**
- What needs follow-up after this meeting
- Deadline, owner, matter, status
- Auto-created from meeting notes

### Interaction Pattern (Nonverbal-Friendly)

```
Worker asks question
  ↓
System searches only relevant approved matter pack
  ↓
Shows concise answer first (3 sentences max)
  ↓
Offers "Show source" (tap to expand)
  ↓
"Show deeper history" (timeline unfolding)
  ↓
"Create follow-up task" (tap to log promise)
```

Large text, high contrast, touch-friendly, no keyboard required.

---

## Templates (Pre-built Artifacts)

Stored as structured templates, not free-form:

```
medical_chronology.template.md
  - Sections: Pre-2019, 2019-2024, 2024-2025, 2025-present
  - Auto-fills from TimelineEvent table
  - Source citations auto-embedded

accommodation_statement.template.md
  - Sections: Diagnosis, Functional Impact, Requested Accommodations, Evidence
  - Fills from Matter + EvidenceCards with Confirmed status

odsp_summary.template.md
  - Sections: Basic Info, Medical Condition, Work Capacity, Financial Need, Supporting Docs
  - Auto-populated from Matter records

appeal_letter.template.md
  - Sections: Salutation, Overview, Evidence Bundle, Specific Rebuttals, Closing
  - Requires human editing in final review before send

meeting_brief_onepager.template.md
  - Sections: Issue, Context, Key Facts, Ask, Supporting Evidence
  - Compiled fresh before each meeting

post_meeting_recap.template.md
  - Sections: What Was Discussed, What Was Agreed, What Needs Follow-up, Commitments Made
  - Auto-logged from LiveMeetingState

self_advocacy_script.template.md
  - Sections: Opening, Key Points, Handling Objections, Closing
  - User-edited, tested in meetings, improved iteratively
```

All templates fill from approved evidence blocks, never improvise.

---

## Folder Structure (Implementation)

```
/docs
  ├─ ARCHITECTURE_UNIFIED.md (this file)
  ├─ OPERATING_MODEL.md (governance, 150-role taxonomy)
  ├─ SCHEMAS.md (all 12 entities defined)
  ├─ WORKFLOW_GRAPH.md (10 permanent flows)
  └─ IMPLEMENTATION_PLAN.md

/data
  ├─ mattherbert01/
  │   ├─ timeline.md (chronology 2001-present)
  │   ├─ profile.md (baseline medical + context)
  │   ├─ ledgers/
  │   │   ├─ correspondence.csv
  │   │   ├─ contacts_master.csv
  │   │   ├─ appointments_transportation.csv
  │   │   └─ evidence.csv
  │   ├─ transcripts/ (real-time audio ingestion)
  │   └─ artifacts/
  │       ├─ medical_chronology_v7.md (approved)
  │       ├─ accommodation_statement_v3.md (approved)
  │       └─ meeting_brief_2026_04_22.md (session-specific)

/schemas
  ├─ source_document.schema.json
  ├─ evidence_card.schema.json
  ├─ claim.schema.json
  ├─ timeline_event.schema.json
  ├─ matter.schema.json
  ├─ task.schema.json
  ├─ contact.schema.json
  ├─ interaction.schema.json
  ├─ draft.schema.json
  ├─ decision.schema.json
  ├─ alert.schema.json
  ├─ agent_run.schema.json
  ├─ handshake_event.schema.json
  └─ heartbeat_snapshot.schema.json

/prompts
  ├─ extract_claims.prompt.md
  ├─ assign_confidence.prompt.md
  ├─ detect_contradiction.prompt.md
  └─ compile_artifact.prompt.md

/templates
  ├─ medical_chronology.template.md
  ├─ accommodation_statement.template.md
  ├─ odsp_summary.template.md
  ├─ appeal_letter.template.md
  ├─ meeting_brief_onepager.template.md
  ├─ post_meeting_recap.template.md
  └─ self_advocacy_script.template.md

/apps
  └─ libby_live/
      ├─ index.html (v2.04.0, updated for iPad briefing console)
      ├─ assets/
      └─ js/
          ├─ briefing_ui.js (6-tab interface)
          ├─ live_session.js (meeting mode)
          └─ artifact_compiler.js (template filling)

/workflows
  ├─ ingest_document.js
  ├─ extract_claims.js
  ├─ index_evidence.js
  ├─ update_timeline.js
  ├─ assign_matter.js
  ├─ build_artifact.js
  ├─ approve_artifact.js
  ├─ run_meeting_session.js
  ├─ generate_recap.js
  └─ alert_on_deadline.js

/connectors
  ├─ google_calendar.js (sync appointments)
  ├─ gmail.js (ingest emails, send from templates)
  ├─ google_drive.js (discover & ingest files)
  └─ ollama.js (local LLM calls)

/fixtures
  ├─ odsp_appeal_sample_bundle.md
  ├─ dso_assessment_sample.md
  ├─ rogers_conflict_sample.md
  └─ surgical_timeline_sample.md
```

---

## MVP Acceptance Criteria

Before declaring Phase 2 done:

- [ ] All 12 schemas defined and validated
- [ ] Confidence enforcement working (enum validation in UI + storage)
- [ ] Timeline updated with full 2001-present chronology
- [ ] Medical chronology artifact compiles from timeline
- [ ] Accommodation statement artifact compiles from evidence
- [ ] iPad briefing console (6 tabs) functional with real data
- [ ] Meeting mode captures questions, answers, follow-ups
- [ ] Post-meeting recap auto-generates from session log
- [ ] Handshake events logging correctly (test 5+ transitions)
- [ ] Heartbeat snapshots generating every 30 min
- [ ] No external output without source refs + confidence badge
- [ ] WCAG AA accessible
- [ ] Works offline-first (localStorage-based)
- [ ] Zero hallucinations in templated outputs

---

## Success Metrics

**For the user in meetings:**
- Able to pull up any claim and see source + confidence in <1s
- Can show evidence chronology without fumbling
- Can draft reply or accommodation request without external generation
- Nonverbal-friendly (large text, touch controls, minimal scrolling)
- Shows only approved/human-reviewed material
- Confidence badges visible on everything

**For the system:**
- Zero hallucinations in external outputs (100% template-based)
- 100% of claims traceable to evidence
- All state transitions logged (handshake events)
- Health snapshot updates match actual state
- Contradiction detection working (flag conflicts immediately)

---

This is the architecture. Claude Code builds this. You present on iPad. Halluci­nations end.
