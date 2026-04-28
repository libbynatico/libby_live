# Libby Worker Instruction Card System

Generated: 2026-04-28  
Status: practical operating model, not theory  
Applies to: Libby Live, Life Librarian, secure memory bank, dashboard, letters, intake, evidence, calendar, and demo mode

## Core problem

The project does not need a vague claim that there are 100 or 150 agents.

The project needs modifiable worker instructions that can be used by:

- Matthew;
- Claude Code;
- ChatGPT;
- Gemini;
- Zach or another teammate;
- a future backend worker;
- an automation script;
- a dashboard button.

A worker is only useful if it has a clear role, a trigger, required inputs, allowed actions, expected output, and a done condition.

---

## Product decision

Libby should use **Instruction Cards**.

Each worker has a small editable card. The card tells the worker exactly what to do and what not to do.

A worker is not a personality. A worker is a repeatable job definition.

---

## Worker Instruction Card schema

```json
{
  "worker_id": "W001",
  "worker_name": "Readable name",
  "lane": "Intake | Evidence | Medical | Benefits | Housing | Letters | Calendar | Family | Product | Demo",
  "role": "What this worker is responsible for",
  "trigger": "When this worker should run",
  "inputs_required": [],
  "inputs_optional": [],
  "allowed_actions": [],
  "blocked_actions": [],
  "output_required": [],
  "confidence_rules": [],
  "done_condition": "How we know the worker finished",
  "handoff_to": [],
  "human_review_required": true,
  "current_status": "active | draft | planned | blocked",
  "modifiable_notes": "Freeform notes for quick editing"
}
```

---

## The 150-worker structure

The 150-worker model should be organized as **10 lanes × 15 workers**.

This gives enough capacity for a serious system, but still keeps roles understandable.

### Lanes

1. Intake Workers
2. Evidence Workers
3. Memory Workers
4. Calendar / Time Workers
5. Letter / Output Workers
6. Medical / Functional Workers
7. Benefits / Admin Workers
8. Family / Housing Workers
9. Product / Engineering Workers
10. Demo / Investor Workers

Each lane can eventually hold 15 workers.

Not every worker needs to run all the time. The dashboard should activate only the workers needed for the current mode.

---

## Runtime flow

```text
User input / file / email / calendar / task arrives
→ Intake worker classifies it
→ Evidence worker attaches source/confidence
→ Memory worker decides whether to save durable memory
→ Calendar/task worker checks dates and deadlines
→ Output worker generates letter/brief/timeline
→ Quality worker checks hallucination risk
→ Dashboard worker creates next-best-action
→ Handshake worker prepares human handoff
```

---

## Active worker cards — v0 practical set

These are the first workers that should actually exist in the app.

---

### W001 — Intake Triage Worker

**Lane:** Intake  
**Role:** Decide what type of input arrived and where it belongs.  
**Trigger:** New text, file, email, screenshot, audio, transcript, or user note.  
**Inputs required:** raw input, timestamp, user_id, case_id.  
**Allowed actions:** classify input, assign topic, create queue row, create blink.  
**Blocked actions:** do not summarize as fact; do not create final letter; do not mark confirmed.  
**Output required:** intake queue item with type, topic, sensitivity, and next worker.  
**Done condition:** item is routed to Evidence, Calendar, Letter, Memory, or Task worker.

---

### W002 — Source Preservation Worker

**Lane:** Evidence  
**Role:** Make sure the original source is preserved before any summary is created.  
**Trigger:** Any new file or evidence-bearing message.  
**Inputs required:** source file/message, source type, user_id, case_id.  
**Allowed actions:** save raw file, assign source_id, create metadata stub.  
**Blocked actions:** do not overwrite source; do not delete raw input.  
**Output required:** source_id and private vault path.  
**Done condition:** source exists in private vault or is flagged as not yet preserved.

---

### W003 — Transcript / OCR Worker

**Lane:** Intake  
**Role:** Convert audio, screenshots, PDFs, and images into text.  
**Trigger:** Source status is `needs_transcription` or `needs_ocr`.  
**Inputs required:** source_id, file path, file type.  
**Allowed actions:** transcribe, OCR, split long audio, create derived text.  
**Blocked actions:** do not edit meaning silently; do not delete source.  
**Output required:** transcript/OCR text plus processing status.  
**Done condition:** text exists or failure reason is logged.

---

### W004 — Evidence Confidence Worker

**Lane:** Evidence  
**Role:** Decide whether a claim is confirmed, user-reported, inferred, or missing evidence.  
**Trigger:** New memory, letter, timeline item, or output.  
**Inputs required:** claim text, linked source_ids if any.  
**Allowed actions:** assign confidence label, request source, downgrade unsupported claims.  
**Blocked actions:** never upgrade to confirmed without source.  
**Output required:** confidence label and source gap if needed.  
**Done condition:** every claim has a confidence status.

---

### W005 — Memory Bank Worker

**Lane:** Memory  
**Role:** Decide whether information should become durable memory.  
**Trigger:** User says something important, source confirms something, repeated pattern appears.  
**Inputs required:** statement, user_id, case_id, confidence.  
**Allowed actions:** write atomic memory, update existing memory, mark needs_review.  
**Blocked actions:** do not store sensitive data in public repo.  
**Output required:** memory object.  
**Done condition:** memory is saved or rejected with reason.

---

### W006 — Patient Tag Worker

**Lane:** Memory  
**Role:** Maintain tags that route support needs and outputs.  
**Trigger:** New persistent need or case category appears.  
**Inputs required:** memory, evidence, or user-reported need.  
**Allowed actions:** add/update patient_tags.  
**Blocked actions:** do not use stigmatizing labels; do not expose private tags in demo.  
**Output required:** patient_tag with confidence and sensitivity.  
**Done condition:** tag is available for routing or marked private.

---

### W007 — Daily Dashboard Worker

**Lane:** Calendar / Time  
**Role:** Create the daily status view.  
**Trigger:** User opens app, new day starts, or heartbeat runs.  
**Inputs required:** tasks, calendar, blinks, ready outputs, memory status.  
**Allowed actions:** produce today summary and next-best-action.  
**Blocked actions:** do not flood dashboard with build tasks unless Build Mode is active.  
**Output required:** dashboard state object.  
**Done condition:** dashboard has Now, Blinks, Next Action, Ready Outputs, System Health.

---

### W008 — Blink Detection Worker

**Lane:** Calendar / Time  
**Role:** Detect urgent signals.  
**Trigger:** New queue item, deadline, failed job, unprocessed source, missing evidence.  
**Inputs required:** queue, tasks, calendar, processing status.  
**Allowed actions:** create blink with severity.  
**Blocked actions:** do not create panic; do not duplicate existing blink.  
**Output required:** blink object.  
**Done condition:** urgent issue is visible or intentionally suppressed.

---

### W009 — Task Lane Worker

**Lane:** Calendar / Time  
**Role:** Put tasks into the right lane.  
**Trigger:** New task created manually or by worker.  
**Inputs required:** task title, source, urgency, user_id, case_id.  
**Allowed actions:** classify into Life Admin, Letters, App Build, Intake/Evidence, Calendar, Investor.  
**Blocked actions:** do not mix app-build tasks into urgent life tasks.  
**Output required:** task object with lane.  
**Done condition:** task appears in the correct dashboard lane.

---

### W010 — Calendar Pre-Brief Worker

**Lane:** Calendar / Time  
**Role:** Prepare a meeting/event brief.  
**Trigger:** Calendar event within configured time window or user requests meeting prep.  
**Inputs required:** event, relevant tasks, relevant memories, source status.  
**Allowed actions:** create pre-brief, questions, documents needed, copyable opening statement.  
**Blocked actions:** do not invent event details.  
**Output required:** meeting handshake.  
**Done condition:** user can open a short meeting-ready brief.

---

### W011 — Letter Router Worker

**Lane:** Letter / Output  
**Role:** Choose the right letter type.  
**Trigger:** User opens Letter Mode or types messy request.  
**Inputs required:** user notes, recipient, topic.  
**Allowed actions:** detect ODSP, medical, AODA/accommodation, Rogers, family, investor, provider request.  
**Blocked actions:** do not force everything into generic ODSP template.  
**Output required:** suggested letter type and explanation.  
**Done condition:** correct template is selected or user confirms another.

---

### W012 — AODA / Written Accommodation Letter Worker

**Lane:** Letter / Output  
**Role:** Draft written communication accommodation requests.  
**Trigger:** User mentions AODA, written communication, accessibility, accommodation, typing, iPad, no verbal, processing, memory, or communication barrier.  
**Inputs required:** recipient, situation, requested accommodation.  
**Allowed actions:** draft clear accommodation request.  
**Blocked actions:** do not overstate legal conclusions; do not cite law unless verified.  
**Output required:** subject, body, short version, firm version.  
**Done condition:** user has copyable message.

---

### W013 — ODSP / OW Letter Worker

**Lane:** Letter / Output  
**Role:** Draft benefits-worker messages.  
**Trigger:** User mentions ODSP, OW, MCCSS, worker, caseworker, appointment, benefits, documents, deadline, retro, transportation.  
**Inputs required:** recipient, request, known facts.  
**Allowed actions:** draft update, request confirmation, ask for next steps, request written reply.  
**Blocked actions:** do not invent benefit amounts or deadlines.  
**Output required:** copyable letter plus fact-check list.  
**Done condition:** user can send or revise.

---

### W014 — Medical Summary Worker

**Lane:** Medical / Functional  
**Role:** Turn medical context into safe clinician-facing summary.  
**Trigger:** user needs appointment brief, provider message, hospital package, or functional summary.  
**Inputs required:** relevant memories, symptoms, sources if available.  
**Allowed actions:** create one-page summary and questions.  
**Blocked actions:** do not diagnose; do not present unverified history as confirmed.  
**Output required:** clinician-facing brief with confidence labels.  
**Done condition:** brief is ready for review.

---

### W015 — Functional Limitation Worker

**Lane:** Medical / Functional  
**Role:** Translate lived functional impact into support-language.  
**Trigger:** user mentions mobility, pain, fatigue, sleep, eating, communication, teeth, walker, standing tolerance, home safety.  
**Inputs required:** user report and supporting evidence if available.  
**Allowed actions:** create functional-needs summary.  
**Blocked actions:** do not minimize or exaggerate.  
**Output required:** support request language and evidence gaps.  
**Done condition:** functional impact is clear and actionable.

---

### W016 — Family Support Framing Worker

**Lane:** Family / Housing  
**Role:** Make family-facing explanations calm, clear, and non-accusatory.  
**Trigger:** user asks for family presentation, support request, home update, twins planning, Kellsie/shared household.  
**Inputs required:** audience, ask, boundaries, desired tone.  
**Allowed actions:** draft family update and support list.  
**Blocked actions:** do not expose another person’s private case without consent.  
**Output required:** family-safe summary and ask list.  
**Done condition:** user can send/show it.

---

### W017 — Rogers / Consumer Dispute Worker

**Lane:** Benefits / Admin  
**Role:** Build consumer dispute timeline and escalation letter.  
**Trigger:** user mentions Rogers, Fido, device, billing, IMEI, ticket, escalation, invoice.  
**Inputs required:** facts, dates, bills, call notes.  
**Allowed actions:** create timeline, discrepancy table, escalation request.  
**Blocked actions:** do not invent account details.  
**Output required:** escalation letter and evidence checklist.  
**Done condition:** ready to send or attach sources.

---

### W018 — Secure Memory Bank Worker

**Lane:** Product / Engineering  
**Role:** Make sure real memory is saved privately, not only in GitHub or browser storage.  
**Trigger:** user asks about saved memory, backend, login, Gmail/Drive/Calendar, multi-user onboarding.  
**Inputs required:** user_id, case_id, target backend.  
**Allowed actions:** create schema, folder plan, export/import, backend checklist.  
**Blocked actions:** do not store private records in public repo.  
**Output required:** private memory-bank plan or action.  
**Done condition:** memory has a durable private destination.

---

### W019 — Stable Link / Deployment Worker

**Lane:** Product / Engineering  
**Role:** Preserve one shareable URL and avoid changing test links.  
**Trigger:** deploy, cache issue, URL issue, iPad testing, investor sharing.  
**Inputs required:** current route, deploy target, cache state.  
**Allowed actions:** redirect root, update manifest, add service-worker cache versioning.  
**Blocked actions:** do not make users chase `?v=` links.  
**Output required:** stable URL and cache policy.  
**Done condition:** same user-facing link works across updates.

---

### W020 — iPad UX QA Worker

**Lane:** Product / Engineering  
**Role:** Evaluate iPad screenshots and convert complaints into build tasks.  
**Trigger:** screenshots, user complaints, layout problems.  
**Inputs required:** screenshot notes, device, page, mode.  
**Allowed actions:** create QA issue, identify layout fix, prioritize.  
**Blocked actions:** do not dismiss user frustration as polish.  
**Output required:** QA report and implementation list.  
**Done condition:** issue is logged and tied to next build.

---

### W021 — Screen Mode Worker

**Lane:** Product / Engineering  
**Role:** Maintain always-on iPad/home-monitor mode.  
**Trigger:** user taps Screen Mode or app enters display mode.  
**Inputs required:** dashboard state and privacy policy.  
**Allowed actions:** hide editing UI, show large cards, rotate calmly.  
**Blocked actions:** do not show private sensitive details in public-room mode.  
**Output required:** screen-safe display.  
**Done condition:** iPad can sit open as a calm monitor.

---

### W022 — Investor Demo Worker

**Lane:** Demo / Investor  
**Role:** Prepare a redacted demo story and support ask.  
**Trigger:** user wants to show people/investors/supporters.  
**Inputs required:** demo mode, device ask, product status, system gaps.  
**Allowed actions:** generate pitch script, demo route, ask list.  
**Blocked actions:** do not expose private raw evidence.  
**Output required:** 5-minute demo script and device/support ask.  
**Done condition:** user can present without explaining everything live.

---

### W023 — Root Page Safety Worker

**Lane:** Product / Engineering  
**Role:** Prevent stale demo pages from being treated as truth.  
**Trigger:** root page shows old case data or fake confirmed labels.  
**Inputs required:** current root page, replacement target.  
**Allowed actions:** redirect, archive, relabel demo data.  
**Blocked actions:** do not leave stale private-looking pages live.  
**Output required:** root page safe or redirected.  
**Done condition:** shared root URL no longer shows stale unsupported facts.

---

### W024 — Quality Gate Worker

**Lane:** Evidence  
**Role:** Review outputs before they are sent externally.  
**Trigger:** user clicks copy/send/export on a letter or brief.  
**Inputs required:** output text, intended audience, linked facts.  
**Allowed actions:** flag unsupported claims, ask for source check, shorten, clarify.  
**Blocked actions:** do not block emergency communication; use warning labels instead.  
**Output required:** quality warning and corrected draft if needed.  
**Done condition:** output is safer and clearer.

---

### W025 — Handoff / Handshake Worker

**Lane:** Memory  
**Role:** Create a compact handoff for another person or AI.  
**Trigger:** user is switching tools, asking a teammate, going to a meeting, or preparing a demo.  
**Inputs required:** current context, audience, objective.  
**Allowed actions:** generate TLDR, current state, next action, source gaps, do-not-do list.  
**Blocked actions:** do not include private details beyond audience permission.  
**Output required:** copyable handshake.  
**Done condition:** next person can continue without rereading everything.

---

## How to make this real in the app

The dashboard should not say “150 workers.”

The dashboard should show only the active workers for the current mode.

Example:

### Today Mode active workers

- W007 Daily Dashboard Worker
- W008 Blink Detection Worker
- W009 Task Lane Worker
- W010 Calendar Pre-Brief Worker
- W011 Letter Router Worker
- W024 Quality Gate Worker

### Letter Mode active workers

- W011 Letter Router Worker
- W012 AODA / Written Accommodation Letter Worker
- W013 ODSP / OW Letter Worker
- W014 Medical Summary Worker
- W017 Rogers Worker
- W024 Quality Gate Worker

### Memory Mode active workers

- W004 Evidence Confidence Worker
- W005 Memory Bank Worker
- W006 Patient Tag Worker
- W018 Secure Memory Bank Worker
- W025 Handoff Worker

### Build Mode active workers

- W018 Secure Memory Bank Worker
- W019 Stable Link / Deployment Worker
- W020 iPad UX QA Worker
- W021 Screen Mode Worker
- W023 Root Page Safety Worker

### Demo Mode active workers

- W022 Investor Demo Worker
- W025 Handoff Worker
- W004 Evidence Confidence Worker
- W019 Stable Link / Deployment Worker

---

## Instruction card prompt template

Use this when asking an AI/tool/teammate to act as a worker:

```text
You are running Libby Worker [WORKER_ID]: [WORKER_NAME].

Role:
[ROLE]

Current mode:
[Today / Letter / Memory / Build / Demo / Meeting]

Inputs:
[INPUTS]

Rules:
- Follow the worker’s allowed actions only.
- Do not perform blocked actions.
- Separate confirmed, user-reported, inferred, and missing evidence.
- Keep private details out of public/demo outputs.
- Produce the required output format.

Output required:
[OUTPUT_REQUIRED]

Done condition:
[DONE_CONDITION]
```

---

## Practical example: AODA written request

Input:

```text
I need an AODA written.
```

Correct worker route:

```text
W001 Intake Triage
→ W011 Letter Router
→ W012 AODA / Written Accommodation Letter Worker
→ W024 Quality Gate
→ W005 Memory Bank Worker
```

Expected response:

```text
This sounds like a written communication accommodation request, not a generic ODSP update.

I will draft it as an accommodation request asking for important decisions, deadlines, document requests, and follow-up to be provided in writing, and noting that typed/iPad communication may be needed.
```

---

## Practical example: “What did I miss completing?”

Correct worker route:

```text
W007 Daily Dashboard
→ W008 Blink Detection
→ W009 Task Lane
→ W010 Calendar Pre-Brief
→ W018 Secure Memory Bank Worker
```

Expected response should inspect:

- overdue tasks;
- urgent tasks;
- unprocessed intake queue;
- calendar events;
- ready outputs not sent;
- evidence gaps;
- backend/system blockers.

It should not return a canned motivational summary.

---

## Practical example: iPad screenshot complaint

Correct worker route:

```text
W020 iPad UX QA Worker
→ W009 Task Lane Worker
→ W019 Stable Link Worker
→ W021 Screen Mode Worker
```

Expected output:

- issue list;
- severity;
- affected page/mode;
- fix recommendation;
- build task;
- stable link preserved.

---

## Non-negotiable rule

If a worker cannot produce a useful output, it must say what is missing and hand off to the correct worker.

No worker should pretend to be the whole system.

Libby becomes practical when every worker has a small job, a clear trigger, and a visible handoff.
