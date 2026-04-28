# Libby Always-On Dashboard Design

Generated: 2026-04-28  
Target devices: iPad, wall-mounted tablet, home assistant monitor, desktop browser, TV/monitor kiosk  
Portal rule: one portal; guest sees demo, authenticated users see private live dashboard

## Product decision

Libby should feel less like a website and more like an always-on command surface.

The user should be able to leave Libby open on an iPad, kitchen/home monitor, bedside screen, or desk display and immediately understand:

- what is happening today;
- what needs attention;
- what has arrived;
- what is missing;
- what is ready to show someone;
- what the next best action is;
- whether the system is healthy.

This dashboard should work as:

1. **Screensaver mode** — calm, glanceable, low-interaction display.
2. **Home assistant monitor mode** — always-on household/case operations board.
3. **Meeting mode** — high-contrast, quick-copy, iPad-readable support surface.
4. **Investor/demo mode** — redacted walkthrough that shows the product logic without exposing private evidence.

---

## One portal behaviour

### Guest state

If no user is signed in:

```text
portal opens
→ render guest/demo dashboard
→ use demo_001 and case_demo_001
→ show redacted/synthetic/mild workflow
→ show investor/supporter story and device ask
→ no private connectors
→ no private evidence
```

### Authenticated state

If user signs in:

```text
portal opens
→ resolve auth subject
→ map to user_id
→ load allowed cases
→ show private live dashboard
→ show user-specific heartbeat, blinks, calendar, queue, handshakes, and outputs
```

### Fast toggle

A signed-in admin/product-builder should be able to switch:

- `Live Private`
- `Shared Household`
- `Demo Guest`
- `Pitch Mode`

Switching to demo must not leak private data.

---

## Dashboard layout

### Top bar

- Libby logo/status
- current mode: Guest Demo / Live Private / Meeting / Pitch
- signed-in user or Guest
- time and date
- system heartbeat color
- quick action: Sign in / Switch mode / Start meeting

### Main grid

Use large cards. No dense tables in default view.

Recommended always-on grid:

```text
┌──────────────────────┬──────────────────────┬──────────────────────┐
│ Today / Now           │ Urgent Blinks         │ Next Best Action      │
├──────────────────────┼──────────────────────┼──────────────────────┤
│ Calendar              │ Intake Queue          │ Ready Outputs         │
├──────────────────────┼──────────────────────┼──────────────────────┤
│ People / Cases        │ System Health         │ Handshake / Brief     │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

On iPad portrait, stack cards vertically:

1. Now
2. Urgent Blinks
3. Next Best Action
4. Calendar
5. Ready Outputs
6. Intake Queue
7. Handshake
8. System Health

---

## Core cards

### 1. Now Card

Shows:

- current date/time;
- active case/mode;
- today’s event count;
- next appointment/event;
- current focus.

Example:

```json
{
  "card": "now",
  "title": "Today",
  "primary": "Tuesday, April 28",
  "secondary": "Private workspace · userid=001",
  "next_event": "No verified private calendar loaded in public demo",
  "status": "waiting_for_calendar_connector"
}
```

---

### 2. Urgent Blinks Card

Shows the fastest signals.

Blink examples:

- calendar event today needs pre-brief;
- new email in Libby/Inbox;
- transcript failed;
- file too large;
- output lacks citations;
- task overdue;
- private connector disconnected.

Display rule:

- max 3 blinks in screensaver mode;
- tap to expand;
- urgent items pulse slowly, not aggressively.

---

### 3. Next Best Action Card

Shows exactly one recommended action.

Examples:

- “Install Gmail intake Apps Script and test one labelled email.”
- “Create private evidence vault before adding real documents.”
- “Prepare ODSP handshake before next worker contact.”
- “Switch to demo mode before showing investor.”

This prevents the dashboard from becoming a wall of stress.

---

### 4. Calendar Card

Shows:

- next event;
- events needing pre-briefs;
- events needing post-briefs;
- unverified placeholders clearly marked.

Calendar confidence labels:

- `confirmed_google_calendar`
- `confirmed_email`
- `user_reported`
- `placeholder`

No event should appear as official unless it is confirmed.

---

### 5. Intake Queue Card

Shows:

- new Gmail items;
- new Drive files;
- voice memos waiting;
- screenshots waiting for OCR;
- audio waiting for transcription;
- failed jobs.

Queue statuses:

- `new`
- `saved_to_drive`
- `needs_transcription`
- `needs_ocr`
- `needs_review`
- `ready_for_output`
- `failed`
- `archived`

---

### 6. Ready Outputs Card

Shows polished things that are ready to open or share:

- meeting handshake;
- clinician summary;
- family update;
- investor pitch brief;
- evidence appendix;
- Rogers/benefits/admin letter;
- device/support ask list.

Each output should show:

- audience;
- confidence status;
- last updated;
- source count;
- share/export button.

---

### 7. People / Cases Card

Shows user context without leaking private details:

- user 001 private case;
- Kellsie private case pending onboarding;
- Newfie Nikki private case pending onboarding;
- shared household case planned;
- demo case active for guest mode.

In live mode, only show cases the signed-in user is allowed to view.

---

### 8. System Health Card

Shows the heartbeat:

- portal status;
- auth status;
- Gmail connector;
- Drive connector;
- Calendar connector;
- local worker;
- transcription worker;
- last successful sync;
- failed jobs.

Health colors:

- green = working;
- yellow = usable but degraded;
- red = blocked;
- gray = not configured.

---

### 9. Handshake / Brief Card

Shows the next prepared handoff.

Example:

```text
Next handshake:
Investor / supporter demo
Purpose: show what was built with constrained hardware
Status: redacted and safe
Next action: open five-minute pitch script
```

---

## Screensaver mode

Screensaver mode should be calm and readable from across a room.

Rules:

- large text;
- dark background;
- minimal motion;
- show only essentials;
- rotate slowly every 30–90 seconds;
- never show private sensitive details unless device is authenticated and trusted;
- tap anywhere to unlock full dashboard.

Recommended screensaver slides:

1. Today / Now
2. Urgent Blinks
3. Next Best Action
4. Ready Outputs
5. System Health
6. Demo story / device ask when in guest mode

---

## Privacy modes for always-on display

### Public room / guest mode

Show:

- demo content;
- system status;
- public-safe pitch story;
- device ask;
- synthetic blinks.

Hide:

- names beyond permitted labels;
- private calendar details;
- raw evidence;
- medical specifics;
- benefit amounts;
- family details;
- messages/emails.

### Trusted home mode

Show:

- household tasks;
- today’s schedule;
- non-sensitive reminders;
- system health;
- intake counts.

Hide by default:

- raw evidence;
- medical details;
- agency disputes;
- private notes;
- full transcripts.

### Private meeting mode

Show:

- selected case;
- meeting brief;
- copyable responses;
- source-backed facts;
- questions to ask;
- next steps.

Require explicit unlock.

---

## Data objects needed

### Dashboard state

```json
{
  "dashboard_id": "dash_user_001_current",
  "user_id": "001",
  "case_id": "case_001_life_librarian",
  "mode": "live_private | guest_demo | shared_household | meeting | pitch | screensaver",
  "created_at": "ISO-8601 timestamp",
  "now": {},
  "heartbeat": {},
  "blinks": [],
  "calendar": [],
  "intake_queue": [],
  "ready_outputs": [],
  "people_cases": [],
  "next_best_action": {},
  "system_health": {}
}
```

### Display policy

```json
{
  "display_policy": "public_room | trusted_home | private_meeting | investor_demo",
  "allow_sensitive_details": false,
  "allow_names": false,
  "allow_raw_sources": false,
  "allow_export": false,
  "requires_unlock_for_private": true
}
```

---

## What the dashboard must not become

Do not make it:

- a generic admin panel;
- a dense spreadsheet;
- a stressful task wall;
- a fake medical/legal authority;
- a public exposure of private case data;
- a chatbot-only screen.

It should feel like:

```text
A calm mission-control surface for life evidence, meetings, tasks, and support.
```

---

## Build order

### First dashboard build

1. One portal shell.
2. Guest demo mode by default.
3. Sign-in placeholder.
4. Dashboard mode selector.
5. Static dashboard cards from seed JSON.
6. Screensaver mode toggle.
7. Investor pitch/device ask card.
8. Private/live mode locked until auth is implemented.

### Second dashboard build

1. Load `users_manifest_seed.json`.
2. Load `user_001_seed.json`.
3. Render cards from JSON.
4. Add fake/demo blinks.
5. Add fake/demo heartbeat.
6. Add pitch walkthrough.

### Third dashboard build

1. Add Google OAuth.
2. Resolve real `user_id`.
3. Load private case state.
4. Add Google Calendar connector.
5. Add Gmail/Drive queue counts.
6. Add audit log.

---

## Investor framing

The always-on dashboard is the visual proof that Libby is not just another chat interface.

It is:

- assistive technology;
- family operations board;
- case-management console;
- evidence librarian;
- appointment preparation system;
- non-verbal communication support;
- source-backed advocacy surface.

The pitch line:

> Libby turns the chaos of real life into a calm, always-on evidence and support dashboard.
