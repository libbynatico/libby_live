# Libby Connector Ingestion Model

## Product decision

Libby must not depend on a single upload path.

Libby should support many connectors that all normalize into one source queue:

```text
Google Drive
Gmail
YouTube links
Discord exports/webhooks
Manual chat uploads
Apple Shortcuts / Share Sheet
GitHub canon outputs
```

The user experience remains ChatGPT-like:

```text
Open Libby → type / upload / share → Libby finds context → Libby answers with citations
```

The backend architecture is connector-based:

```text
Connector → Intake Queue → Source Index → Chunk Index → Chat Retrieval → Cited Output
```

---

## Google Drive role

Drive is the primary brain and raw evidence store.

Drive contains:

- audio files;
- transcripts;
- photos;
- PDFs;
- screenshots;
- medical records;
- baby inventory;
- exported Notes;
- exported Voice Memos;
- YouTube source descriptions/transcripts;
- Gmail exports when needed.

---

## Gmail role

Gmail is an incoming stream, not the brain itself.

Gmail should be scanned for relevant messages, then normalized into the same source queue.

Useful Gmail categories:

- ODSP / Ontario Works;
- medical appointments;
- hospital systems;
- landlord/condo/housing;
- Rogers/admin disputes;
- receipts/transport;
- family updates;
- Libby/NATICO product work.

---

## YouTube role

YouTube is a share/view layer.

It is useful for:

- unlisted video sharing;
- public demo material;
- review links;
- externally viewable media.

YouTube is not the private source of truth.

Original files and transcripts should remain in Drive.

---

## Discord role

Discord should be treated as either:

1. a collaboration stream; or
2. an exportable message source.

Discord messages should be indexed only when they are intentionally routed to Libby.

---

## Canonical queue row

All connectors should write this shape:

```json
{
  "source_id": "gmail_abc123",
  "connector": "gmail",
  "source_type": "email|drive_file|youtube_link|discord_message|manual_chat|apple_shortcut",
  "title": "Email subject or file name",
  "url": "source link",
  "source_owner": "person or account",
  "created_time": "ISO-8601",
  "modified_time": "ISO-8601",
  "raw_text": "extracted text, transcript, or description",
  "raw_file_reference": "Drive file ID or URL if applicable",
  "tags": [],
  "people": [],
  "organizations": [],
  "project_links": [],
  "status": "new|indexed|processed|needs_review|archived",
  "confidence": "source_text|transcript|ocr|manual|metadata_only"
}
```

---

## Chatbot retrieval rule

When answering, Libby should:

1. search the indexed connector queue;
2. retrieve matching records;
3. cite source title + connector + URL/ID;
4. separate confirmed source-backed facts from inferred notes;
5. ask clarifying questions when the source coverage is weak.

---

## Minimal viable connector order

Build in this order:

1. Manual source paste in chat.
2. Google Drive folder index.
3. Gmail label/query ingestion.
4. YouTube link + transcript indexing.
5. Apple Share Sheet into Drive/queue.
6. Discord export/webhook ingestion.
7. Local worker transcription/OCR.

---

## Gmail ingestion options

### Option A: Gmail label-based ingestion

Create a Gmail label:

```text
Libby/Inbox
```

Any email with that label gets indexed by Apps Script.

This is safest and avoids pulling the entire mailbox.

### Option B: Gmail query-based ingestion

Use searches such as:

```text
newer_than:30d (ODSP OR "Ontario Works" OR McMaster OR Sinai OR Rogers)
```

This finds likely relevant messages but needs review.

### Option C: Manual share/forward

Forward important emails to a dedicated Libby inbox or save them to Drive.

---

## Non-negotiable safety/privacy rule

Do not indiscriminately ingest the whole mailbox.

Start with:

- a Gmail label;
- explicit queries;
- user-controlled folder/label routing.

---

## Final architecture

```text
Gmail/Drive/YouTube/Discord/Apple
→ Apps Script or local worker
→ Google Sheet source index
→ static GitHub Pages Libby chat
→ cited answers and clean outputs
```
