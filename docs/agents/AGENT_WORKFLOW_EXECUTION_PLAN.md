# Agent Workflow Execution Plan

## Current repo state

Libby Live is currently a static, no-build repo with:

- `index.html` as the primary public interface;
- Netlify Functions under `netlify/functions`;
- a chat endpoint that uses repo/file context and OpenRouter/Ollama;
- retrieval utilities under `retrieval/`;
- timestamp-event ingestion started under `netlify/functions/timestamp-event.js`;
- Apple capture workflow documentation under `docs/apple/APPLE_CAPTURE_WORKFLOW.md`.

This means the correct execution path is not a framework migration.

The correct execution path is:

```text
Static UI -> Netlify intake functions -> Supabase/Drive/GitHub storage -> agent workflows -> generated outputs -> Libby UI timeline
```

---

## Desired user experience

From Libby online, the user should be able to:

1. click `Upload file/photo/audio/transcript`;
2. select source type;
3. enter or auto-detect a trigger such as `/event_details`, `/call_record`, `/symptom_log`, `/bp_log`;
4. submit;
5. see the new material appear as an event on the timeline;
6. have agent workflows produce summaries, risk flags, next steps, and external-facing outputs.

---

## Recommended architecture

### 1. Raw intake layer

Accepts:

- text pasted into browser;
- notes transcripts;
- call recording transcripts;
- photo metadata and descriptions;
- voice memo metadata;
- future direct file uploads.

Endpoint:

```text
/.netlify/functions/apple-capture
```

Future endpoint:

```text
/.netlify/functions/upload-intake
```

### 2. Canonical event layer

Every intake should create one canonical event object:

```json
{
  "event_id": "evt_20260428_0415_event_details",
  "trigger": "/event_details",
  "source_type": "call_recording|notes_audio|voice_memo|photo|document|manual_text|shortcut",
  "raw_input": "...",
  "file_reference": "...",
  "classification": {},
  "agent_routes": [],
  "outputs_requested": [],
  "created_at": "ISO-8601"
}
```

### 3. Agent router

The router should map trigger/source/tags to responsible agents.

Examples:

| Signal | Agent route |
|---|---|
| `/symptom_log`, itching, pregnancy | Medical / Pregnancy / Risk Review |
| `/bp_log`, blood pressure | Vitals / Clinical Trend |
| `/wake_system`, appointment stress | Functional / TBI Accommodation / Operations |
| `/call_record`, ODSP, worker | Disability / Income / Correspondence |
| photo upload, home issue | Housing / Environment / Evidence |
| baby inventory photos | Household / Inventory / Thank-you Tracker |

### 4. Output generator

One event can generate multiple outputs:

- raw appendix;
- event JSON;
- clinical summary;
- family update;
- next steps;
- board update;
- evidence ledger row;
- GitHub commit or issue;
- Supabase row.

---

## Agent Workflow Model v1

### Workflow A: Raw Event Intake

Trigger:

```text
/event_details
/event_update
/raw_input
```

Steps:

1. preserve raw material;
2. parse timestamp line;
3. classify domain;
4. create event JSON;
5. write to Supabase if configured;
6. return normalized event to browser.

### Workflow B: Medical Symptom Intake

Trigger:

```text
/symptom_log
/patient_event_update
/clinical_summary
/bp_log
```

Steps:

1. extract symptom/vitals details;
2. label facts as reported/observed/inferred;
3. identify escalation flags without diagnosis;
4. create clinician-facing summary;
5. add questions for next appointment.

### Workflow C: Phone Call Intake

Trigger:

```text
/call_record
/call_summary
```

Steps:

1. preserve transcript;
2. identify people/organizations;
3. extract promises, deadlines, contradictions, follow-ups;
4. create correspondence ledger row;
5. generate clean call summary;
6. flag missing evidence.

### Workflow D: Upload Evidence

Trigger:

```text
/photo_evidence
/document_evidence
/upload
```

Steps:

1. preserve file metadata;
2. ask user for source/date/context when not known;
3. create evidence ledger row;
4. link to event;
5. route to correct domain agent.

### Workflow E: Presentation / Meeting Mode

Trigger:

```text
/board_update
/appointment_prep
/presentation_packet
```

Steps:

1. choose audience;
2. pull confirmed facts only;
3. build short display-ready brief;
4. attach appendix items;
5. mark unverified claims as needs-review.

---

## Implementation stages

### Stage 1: Browser intake panel

Add a visible upload/intake card to `index.html`:

- textarea for raw transcript;
- file picker for image/audio/document;
- trigger dropdown;
- source type dropdown;
- submit button;
- response preview.

### Stage 2: Netlify intake endpoint

Create:

```text
netlify/functions/upload-intake.js
```

Responsibilities:

- accept JSON and file metadata;
- normalize event;
- call agent-router;
- write to Supabase if configured;
- return event and next recommended outputs.

### Stage 3: Agent router module

Create:

```text
netlify/functions/_shared/agent-router.js
```

Responsibilities:

- map triggers to domains;
- add tags;
- identify outputs;
- produce low-risk classifications.

### Stage 4: GitHub canonization

Create a server-side workflow that can write canonical outputs to GitHub using `GITHUB_TOKEN` or a fine-scoped repo token.

Target paths:

```text
data/events/YYYY-MM-DD/event-id.json
data/raw/YYYY-MM-DD/event-id.md
docs/generated/YYYY-MM-DD/event-id-summary.md
```

### Stage 5: Drive polling or manual bridge

If Drive automation is needed:

- simplest: user drops files into Drive intake folder;
- Make.com/Zapier/Apps Script watches folder;
- webhook posts to Libby endpoint.

### Stage 6: Agent outputs UI

Add a timeline/events tab:

- latest events;
- tags;
- agent route;
- output buttons: clinical summary, family update, next steps, board brief.

---

## First build target

The first useful build should be:

```text
Manual upload/paste in Libby -> upload-intake endpoint -> agent-router -> Supabase row -> browser preview
```

This gets the loop working before adding Drive/GitHub automation.

---

## Operating rule

Do not wait for perfect automation.

The system must support manual intake first, then progressively automate.

Manual intake is still valuable if it creates structured, durable, queryable records.
