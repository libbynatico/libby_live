# Libby Live: Investor / Field Demo Brief + System Gaps

Generated: 2026-04-28  
Primary demo user: `userid=001` redacted public seed  
Positioning: practical assistive intelligence built from constrained, outdated, and broken technology

## The story to show people

Libby is not a generic chatbot. It is a field-tested life operations and advocacy console built because ordinary tools failed to handle a real, complex, high-stakes life admin load.

The founding user has been using outdated laptops, iPhone/iPad workflows, scattered cloud files, voice recordings, screenshots, paper binders, and AI chat sessions to build a source-backed life librarian. The point of the demo is not to pretend the infrastructure is finished. The point is to show that even with limited hardware, the workflow already proves the need:

```text
Real life produces scattered evidence.
Scattered evidence creates administrative failure.
Libby turns evidence into briefs, tasks, timelines, handshakes, and live meeting support.
```

The investor/supporter message:

> This is what has already been built with broken and outdated technology. With proper devices, reliable local processing, private storage, and a small engineering runway, this becomes an assistive intelligence platform for complex care, disability advocacy, and family operations.

---

## What is already visible in the repo

1. **Libby Live v2.05.0 briefing console**
   - Summary tab
   - Calendar tab
   - Timeline tab
   - Evidence tab
   - Live Notes tab
   - Responses tab
   - Tasks tab
   - Confidence language
   - Meeting-focused layout

2. **Gmail intake direction**
   - `Libby/Inbox` label concept
   - Google Sheet queue concept
   - Apps Script polling every 10 minutes

3. **Cost-controlled cloud intake plan**
   - Gmail + Drive + Sheets + Apps Script first
   - paid transcription only when explicitly routed
   - future local worker for low-cost scale

4. **Audio auto-splitting design**
   - large files should not fail
   - files should split into smaller chunks
   - transcripts should recombine in order

5. **Proactive needs agent**
   - predicts likely next outputs
   - detects missing evidence
   - reviews output quality
   - turns friction into automation candidates

6. **Heartbeat / handshake / blink protocol**
   - heartbeat = status of system
   - handshake = safe context transfer
   - blink = urgent signal
   - memory = durable fact/preference/rule
   - skill = repeatable operation

---

## Demo route for a live conversation

### 1. Open with the problem

Show the messy reality:

- medical, benefits, family, housing, consumer, and daily-life records are scattered;
- support meetings require memory, documentation, and calm communication;
- the person most affected is often the least able to organize everything live;
- the current system is built under hardware and accessibility constraints.

### 2. Show the console

Walk through:

- Summary: what is happening now;
- Timeline: how the story unfolded;
- Evidence: what supports the claims;
- Calendar: what needs preparation;
- Live Notes: what changes during a meeting;
- Responses: polished language ready to send;
- Tasks: what needs action.

### 3. Show the safety boundary

Explain:

- public repo only contains redacted schemas and demo seed data;
- private evidence belongs in Drive/Gmail/local vault;
- outputs separate confirmed facts, user-reported facts, inferred patterns, and missing evidence;
- this is designed to reduce hallucination, not hide uncertainty.

### 4. Show the intake path

Explain:

```text
Voice memo / email / screenshot / document
→ Gmail or Drive intake
→ queue row
→ transcript or OCR
→ source index
→ brief / timeline / task / handshake
```

### 5. Show the ask

The concrete support ask is not vague.

The system needs:

- reliable modern laptop or mini PC;
- stable local storage / backup drive;
- iPad-first presentation hardware;
- transcription-capable local processing device;
- engineering support for private vault + connector pipeline;
- privacy/security review;
- small runway to turn prototype into repeatable platform.

---

## Device / infrastructure ask list

### Minimum immediately useful setup

- Modern MacBook or equivalent laptop.
- iPad with keyboard and reliable battery.
- External SSD for private evidence vault.
- Backup drive.
- Quiet microphone / headset for voice notes and calls.
- Stable home network.

### Better local-worker setup

- Mac mini / small desktop / NUC-style box.
- 32GB+ RAM preferred.
- Enough SSD space for audio, OCR, transcripts, and local models.
- External storage for raw evidence.
- Local Whisper / faster-whisper / whisper.cpp.
- Optional Ollama for local summarization and classification.

### Why hardware matters

Without reliable hardware:

- long audio transcription fails;
- OCR batches stall;
- browser sessions disappear;
- context gets lost;
- the user has to do manual copy/paste work;
- meetings happen before the evidence package is ready.

With reliable hardware:

- intake can run continuously;
- large files can split and process;
- private evidence can stay local;
- outputs can be generated before meetings;
- the system becomes a real assistive device, not just a chat experiment.

---

## Current system gaps

### Critical gaps

1. **Private evidence vault**
   - Need a secure place for raw files, transcripts, medical records, benefits records, and family documents.
   - Public GitHub must not become the evidence vault.

2. **Connector execution**
   - Gmail/Drive intake scripts exist in early form, but need installation, permissions, and live testing.

3. **Calendar truth layer**
   - Calendar events must be pulled from Google Calendar and linked to source evidence.
   - Current repo seed events are placeholders or user-reported anchors until verified.

4. **Audio transcription worker**
   - Need real working path for `.m4a`, `.mp4`, `.wav`, and long recordings.
   - Large-file splitting design exists, implementation still required.

5. **Citation and evidence binding**
   - Every generated output needs source IDs.
   - Claims need confidence labels.

6. **Privacy/auth model**
   - Multi-user case vault must separate users.
   - `userid=001` is the founding case, not a public data dump.

### Major gaps

1. Dashboard currently has hardcoded/sample data in places.
2. Live note capture needs persistence.
3. Export to PDF/DOCX/slides needs reliable templates.
4. Task system needs real status storage.
5. Calendar pre-briefs need actual event data.
6. Mobile/iPad layout needs field testing.
7. Local-worker status needs heartbeat reporting.
8. Failed jobs need visible blinks.
9. Investor demo needs a clean one-page script and device ask.
10. Public repo needs clear README separation between demo data and private case data.

---

## Next build sequence

### Phase 1 — Stabilize the public demo

- Remove or clearly label placeholder case facts.
- Load `user_001_seed.json` into the UI.
- Add demo toggle: `Public Demo` vs `Private Case Mode`.
- Add heartbeat panel.
- Add blink panel.
- Add handshake generator panel.
- Add “device/infrastructure ask” panel.

### Phase 2 — Make intake real

- Install Apps Script in Google Sheets.
- Create Gmail labels.
- Create Drive folder structure.
- Test one email with attachment.
- Confirm Sheet row creation.
- Confirm no paid transcription runs automatically.

### Phase 3 — Make evidence useful

- Add source index schema.
- Add confidence labels.
- Add output generator for one-page briefs.
- Add manual citation picker.
- Add calendar-linked pre-briefs.

### Phase 4 — Add local worker

- Watch Drive inbox or local sync folder.
- Split large audio with ffmpeg.
- Transcribe with local Whisper.
- Save transcript.
- Update queue status.
- Push redacted heartbeat summary.

### Phase 5 — Pitch-ready package

- One-page investor brief.
- Five-minute demo script.
- Device/support ask list.
- Before/after workflow visual.
- Architecture map.
- Safety/privacy explanation.
- Founding case story without raw private exposure.

---

## Five-minute pitch script

```text
This began as a survival workflow, not a startup exercise.

A person with complex medical, disability, family, housing, and administrative needs had information scattered across recordings, screenshots, emails, paper binders, calls, and memory.

The failure point was not lack of information. The failure point was retrieval, timing, communication, and trust.

Libby is a life librarian. It listens for incoming evidence, stores the source, creates a timeline, detects what is missing, prepares meeting handshakes, and turns scattered information into human-facing outputs.

The current prototype was built with limited hardware, mobile devices, old laptops, public GitHub, Google tools, and AI assistants. That constraint is part of the proof: even a rough version is already useful.

With proper hardware, secure storage, and connector automation, this becomes a repeatable assistive intelligence platform for people navigating complex systems.

The ask is practical: help us get the devices, secure vault, local processing, and engineering support needed to turn a fragile prototype into a reliable tool.
```

---

## North star

Libby should make it possible for someone under cognitive, medical, financial, or communication load to show up prepared — even when their life is too complex for ordinary notes, folders, and memory.
