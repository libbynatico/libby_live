# Cost-Controlled Cloud Intake

## Decision

Use cloud automation now, but keep recurring costs as close to zero as possible.

The system should use free Google infrastructure for routing, storage, and queueing:

- Gmail labels;
- Google Drive folders;
- Google Sheets indexes;
- Google Apps Script triggers.

Paid AI APIs should be optional, explicit, and replaceable.

---

## Cost-control principle

Do not send everything to a paid AI API.

First route and classify cheaply:

```text
Gmail / Drive / Share Sheet
→ Apps Script
→ Drive save
→ Sheet queue
→ status = needs_transcription / needs_review
```

Only then process selected files:

```text
needs_transcription
→ OpenAI cloud transcription OR local Whisper later
```

---

## Processing modes

### Mode 1: Free / near-free cloud routing

Uses:

- Gmail;
- Drive;
- Sheets;
- Apps Script.

Does:

- receives emailed voice memos;
- saves attachments to Drive;
- indexes email text;
- adds queue rows;
- marks audio as `needs_transcription`.

Cost: usually $0 beyond existing Google account limits.

### Mode 2: Controlled paid transcription

Uses:

- OpenAI transcription only for selected audio files.

Does:

- transcribes `.m4a`, `.mp3`, `.wav`, etc.;
- writes transcript to Drive;
- writes source index row;
- makes content available to Libby chat.

Cost: variable. Must be opt-in or limited.

### Mode 3: Future local processing

Uses:

- Ollama for local LLM outputs;
- Whisper / faster-whisper / whisper.cpp for transcription;
- local worker on Mac/Toshiba when reliable.

Does:

- processes queued Drive files locally;
- writes transcripts/summaries back to Drive/GitHub;
- removes paid API dependency.

Cost: $0 API cost, but requires a running machine.

---

## Recommended current setup

Start with:

```text
Gmail label: Libby/Inbox
Drive folder: Libby Brain / 00_Inbox
Sheet tabs: libby_intake_queue, libby_source_index
Apps Script: saves email attachments + queues them
```

Then add transcription behind one of these controls:

1. manual column flag: `process_now = yes`;
2. only files shorter than a size threshold;
3. only files from a specific label, e.g. `Libby/Transcribe`;
4. daily limit, e.g. max 3 files/day.

---

## Safe default

The default should be:

```text
Email received
→ attachment saved to Drive
→ queue row created
→ no paid transcription unless approved
```

This prevents silent spending.

---

## When OpenAI should run

Run transcription only when:

- source is important;
- file is not too large;
- user has explicitly routed it for processing;
- there is no existing transcript.

---

## When Ollama/local should be used later

Use local processing when:

- a reliable machine is available;
- batch processing is needed;
- recordings are long;
- privacy/cost matters more than instant results.

---

## Architecture sentence

Free Google tools move and organize the data. Paid AI is only a replaceable processing engine, not the foundation of Libby.
