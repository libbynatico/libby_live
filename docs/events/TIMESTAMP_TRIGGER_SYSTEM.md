# Libby Timestamp Trigger System

## Purpose

This file defines the canonical timestamp-trigger layer for Libby Live.

The goal is to turn raw conversation fragments, voice transcripts, screenshots, medical observations, appointment notes, and home-life events into durable, structured case records without depending on chat memory alone.

This system supports fast trigger syntax such as:

```text
4:15am-4:49 /event_details
/event_update
/patient_event_update
/board_update
/tldr
/next_steps
/raw_input
/polished_output
```

The trigger layer is designed for Matthew/Kellsie/NATICO use cases where events may be captured while tired, stressed, non-verbal, medically overloaded, or working from mobile.

---

## Core Principle

A timestamp trigger is not merely a note.

It is an instruction to:

1. preserve raw context;
2. assign a time window;
3. classify the event;
4. extract clinically and operationally relevant facts;
5. separate confirmed observations from interpretation;
6. generate reusable outputs for future Libby, doctors, family, support workers, and repo automation.

---

## Required Trigger Families

### Event capture triggers

| Trigger | Purpose | Output |
|---|---|---|
| `/event_details` | Full structured capture of a discrete event | Canonical event record |
| `/event_update` | Shorter event summary | Update record |
| `/patient_event_update` | Medical/patient-facing event record | Clinical-facing event record |
| `/family_update` | Human-readable family summary | Plain-language shareable update |
| `/board_update` | High-signal dashboard/meeting update | Board/meeting artifact |

### Processing triggers

| Trigger | Purpose | Output |
|---|---|---|
| `/raw_input` | Preserve transcript/text exactly as received | Raw appendix |
| `/polished_output` | Convert raw material into human-facing narrative | Clean summary |
| `/tldr` | Produce short summary | Concise summary |
| `/next_steps` | Extract actions and owners | Task list |
| `/risk_flags` | Extract safety/medical/admin risk items | Risk register |

### Domain triggers

| Trigger | Purpose | Output |
|---|---|---|
| `/clinical_summary` | Full medical summary with uncertainty labels | Clinical brief |
| `/bp_log` | Blood pressure reading capture | Vitals row |
| `/symptom_log` | Symptom capture | Symptom trend row |
| `/wake_system` | Sleep/wake system event | Operational support record |
| `/home_environment` | Housing/environment observation | Environment record |
| `/appointment_prep` | Pre-appointment brief | Agenda and questions |
| `/appointment_debrief` | Post-appointment summary | Follow-up record |

---

## Timestamp Syntax

Supported patterns:

```text
4:15am-4:49 /event_details
04:15-04:49 /event_details
2026-04-28 04:15-04:49 /event_details
2026-04-28T04:15:00-04:00/2026-04-28T04:49:00-04:00 /event_details
```

Default timezone: `America/Toronto`.

If no date is supplied, the ingestion layer should attach the current local date or the known transcript date from context.

---

## Canonical Event Fields

Every timestamp-triggered event should attempt to populate:

```json
{
  "event_id": "evt_YYYYMMDD_HHMM_trigger_slug",
  "trigger": "/event_details",
  "event_type": "medical|relationship|operational|home_environment|appointment|admin|mixed",
  "local_date": "2026-04-28",
  "timezone": "America/Toronto",
  "start_time_local": "04:15",
  "end_time_local": "04:49",
  "duration_minutes": 34,
  "participants": [],
  "raw_input": "",
  "summary": "",
  "confirmed_observations": [],
  "interpretations": [],
  "risk_flags": [],
  "actions": [],
  "open_questions": [],
  "tags": [],
  "source_confidence": "raw_transcript|direct_observation|inferred|mixed",
  "created_at": "ISO-8601"
}
```

---

## Clinical Safety Rules

For medical events, the system must not over-diagnose.

Use these labels:

- `confirmed_observation` — directly stated or measured;
- `patient_reported` — reported by Kellsie/Matthew;
- `support_person_observed` — observed by Matthew or another support person;
- `interpretation` — plausible framing, not fact;
- `question_for_clinician` — unresolved medical question;
- `red_flag` — item that may require clinician escalation.

Pregnancy-related records must preserve uncertainty and should include the instruction to contact the care team or triage when symptoms match the care plan or hospital guidance.

---

## Example: 2026-04-28 04:15–04:49

Trigger:

```text
4:15am-4:49 /event_details
```

Canonical domains:

- severe itching/sleep disruption;
- headache after sleeping with hair tied up;
- blood-pressure measurement method discussion;
- home-environment hypothesis;
- wake-system failure and TBI accommodation need;
- appointment readiness stress;
- sleep-location/mattress planning.

Primary event type: `mixed`.

Required tags:

```text
pregnancy, itching, sleep_disruption, blood_pressure, wake_system, tbi_accommodation, home_environment, appointment_prep
```

---

## Netlify Function

The corresponding runtime endpoint is:

```text
/.netlify/functions/timestamp-event
```

Expected method: `POST`.

Expected body:

```json
{
  "triggerLine": "4:15am-4:49 /event_details",
  "rawInput": "full transcript or note text",
  "localDate": "2026-04-28",
  "timezone": "America/Toronto",
  "participants": ["Matthew", "Kellsie"]
}
```

The function returns a normalized event object and, if Supabase environment variables are configured, attempts to write the event to `libby_events`.

---

## Required Environment Variables

Optional Supabase persistence:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
LIBBY_EVENTS_TABLE=libby_events
```

No secrets should be committed to GitHub.

---

## Required Database Table

Suggested table name: `libby_events`.

Minimum columns:

```sql
create table if not exists libby_events (
  id uuid primary key default gen_random_uuid(),
  event_id text unique not null,
  trigger text not null,
  event_type text,
  local_date date,
  timezone text default 'America/Toronto',
  start_time_local text,
  end_time_local text,
  duration_minutes integer,
  participants jsonb default '[]'::jsonb,
  raw_input text,
  summary text,
  confirmed_observations jsonb default '[]'::jsonb,
  interpretations jsonb default '[]'::jsonb,
  risk_flags jsonb default '[]'::jsonb,
  actions jsonb default '[]'::jsonb,
  open_questions jsonb default '[]'::jsonb,
  tags jsonb default '[]'::jsonb,
  source_confidence text default 'mixed',
  created_at timestamptz default now()
);
```

---

## Operating Rule

When a note contains a timestamp range and a slash trigger, treat it as a durable event-capture command.

Do not leave the event only in chat.
