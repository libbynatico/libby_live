# Apple Capture Workflow for Libby Live

## Objective

Create the lowest-friction Apple-side capture system for:

1. quick voice notes;
2. longer Voice Memos;
3. phone call recordings saved into Notes;
4. raw-file preservation;
5. automatic ingestion into Libby/NATICO event storage.

This workflow is designed for Matthew/Kellsie mobile use where capture must be possible while tired, non-verbal, overloaded, in appointments, or using AirPods.

---

## Reality Check: AirPods and Voice Memos

AirPods can invoke Siri and control media/calls, but iOS does not expose a clean native automation trigger that fires every time a Voice Memo stops.

Therefore the reliable design is not:

```text
Voice Memo stops -> automatic Shortcut trigger
```

The reliable design is:

```text
Siri/AirPods starts a capture shortcut -> shortcut records audio -> shortcut saves file -> shortcut posts metadata/raw text/file reference to Libby endpoint
```

For calls:

```text
Phone call is recorded by iOS -> Apple saves recording/transcript in Notes -> user shares/copies/transfers note/transcript -> Libby ingests raw call record
```

---

## Capture Modes

### Mode A: Fast AirPods voice note

Use this for quick thoughts, symptom logs, wake logs, appointment notes, and timestamp triggers.

User action:

```text
Press/hold AirPod stem or say Siri command
```

Suggested Siri phrase:

```text
Libby capture
```

Shortcut actions:

1. Dictate Text or Record Audio.
2. Ask for trigger line if not spoken.
3. Save raw text/audio metadata.
4. POST to `/.netlify/functions/apple-capture`.
5. Show success notification.

Best for:

- `/event_update`
- `/symptom_log`
- `/bp_log`
- `/wake_system`
- `/next_steps`

---

### Mode B: Longer memo recording

Use this when the recording may be long and should preserve the raw file.

Recommended route:

1. Use Notes audio recording if transcript is needed quickly.
2. Use Voice Memos if raw audio fidelity and iCloud sync matter more.
3. Share/export the memo or transcript into Libby using a Shortcut share sheet.

Shortcut name:

```text
Send to Libby
```

Shortcut actions:

1. Accept file/text from Share Sheet.
2. Ask for source type: `voice_memo`, `notes_audio`, `call_recording`, `manual_text`.
3. Ask for trigger line or auto-fill `/raw_input`.
4. POST payload to `/.netlify/functions/apple-capture`.

---

### Mode C: Phone call recordings

Apple call recordings are saved in Notes, including transcript and summary when available.

Reliable ingestion route:

1. Record call in Phone app.
2. Open saved call recording in Notes.
3. Copy transcript/summary or share the note content.
4. Run `Send to Libby` from Share Sheet or paste into Libby.

Preferred trigger:

```text
/call_record
```

Recommended labels:

```text
phone_call, call_recording, apple_notes, transcript, raw_input
```

---

## Shortcut: Libby Capture

### Purpose

Hands-free or near-hands-free quick capture from AirPods/Siri.

### Suggested Actions

```text
1. Dictate Text
   Prompt: "What should Libby capture?"
   Stop Listening: After Pause

2. Text
   Content: Dictated Text

3. Ask for Input
   Prompt: "Trigger line?"
   Default Answer: "/event_update"

4. Dictionary
   triggerLine: Provided Input
   rawInput: Dictated Text
   sourceType: siri_dictation
   localDate: Current Date formatted yyyy-MM-dd
   timezone: America/Toronto
   participants: Matthew,Kellsie

5. Get Contents of URL
   URL: https://YOUR-NETLIFY-SITE/.netlify/functions/apple-capture
   Method: POST
   Headers:
     Content-Type: application/json
   Request Body: JSON Dictionary

6. Show Notification
   "Libby captured event."
```

---

## Shortcut: Send to Libby

### Purpose

Share Sheet ingestion for Notes transcripts, call recordings, Voice Memos exports, copied text, PDFs, and screenshots.

### Suggested Actions

```text
1. Receive Any input from Share Sheet

2. Ask for Input
   Prompt: "Trigger line"
   Default Answer: "/raw_input"

3. Choose from Menu
   voice_memo
   notes_audio
   call_recording
   manual_text
   screenshot
   document

4. If input is Text:
   rawInput = Shortcut Input

5. If input is File:
   fileName = Name of Shortcut Input
   fileType = File Extension
   fileNote = "Raw file captured by Shortcut; upload/storage handoff pending."

6. Dictionary
   triggerLine
   rawInput or fileNote
   sourceType
   fileName
   localDate
   timezone

7. Get Contents of URL
   POST to /.netlify/functions/apple-capture

8. Show Notification
   "Sent to Libby."
```

---

## Shortcut: Blood Pressure Capture

### Purpose

Fast structured vitals capture.

Suggested phrase:

```text
Libby blood pressure
```

Fields:

```text
systolic
diastolic
pulse
position: seated_at_rest | seated_transition | lying | standing | unknown
arm: left | right | unknown
notes
```

Trigger:

```text
/bp_log
```

---

## Shortcut: Itch / Symptom Capture

Suggested phrase:

```text
Libby symptom log
```

Fields:

```text
symptom
severity_0_to_10
location
sleep_disruption yes/no
skin_broken yes/no
possible_trigger
relief_attempted
notes
```

Trigger:

```text
/symptom_log
```

---

## Shortcut: Wake System Event

Suggested phrase:

```text
Libby wake log
```

Fields:

```text
scheduled_departure_time
first_wake_attempt
actual_out_of_bed_time
number_of_wake_attempts
alarm_used yes/no
human_escalation yes/no
friction_notes
appointment_related yes/no
```

Trigger:

```text
/wake_system
```

---

## Required Libby Endpoint

```text
/.netlify/functions/apple-capture
```

It accepts:

```json
{
  "triggerLine": "4:15am-4:49 /event_details",
  "rawInput": "captured text/transcript",
  "sourceType": "siri_dictation|voice_memo|notes_audio|call_recording|manual_text|screenshot|document",
  "localDate": "2026-04-28",
  "timezone": "America/Toronto",
  "participants": ["Matthew", "Kellsie"],
  "fileName": "optional"
}
```

---

## Implementation Rule

Do not depend on one perfect automation.

Use three capture paths:

1. `Libby capture` for fast dictation.
2. `Send to Libby` for share-sheet ingestion.
3. `Call recording in Notes -> Send to Libby` for phone calls.

This gives redundancy even when Apple blocks direct Voice Memos stop-trigger automation.
