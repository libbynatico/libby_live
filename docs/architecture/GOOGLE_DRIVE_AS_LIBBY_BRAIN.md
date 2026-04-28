# Google Drive as Libby’s Brain

## Decision

Google Drive is the primary knowledge base for Libby the Librarian.

GitHub is not the source of truth for the user’s life records. GitHub is the app shell, canonized outputs, schemas, and generated public/static artifacts.

Google Drive is where raw life data lives:

- audio files;
- call recordings;
- transcripts;
- screenshots;
- PDFs;
- medical documents;
- letters;
- benefit records;
- receipts;
- photos;
- baby inventory;
- appointment notes;
- personal operating documents.

Libby must be able to reference Drive records and cite them.

---

## System Principle

Libby should not answer from chat memory when a Drive source exists.

The answer path should be:

```text
User question
→ search Drive index
→ retrieve relevant source chunks
→ answer with citations
→ expose source file links / IDs
```

---

## Roles

### Google Drive

The durable personal archive and raw evidence store.

Drive owns:

- original files;
- source folders;
- audio/video/photo files;
- OCR/transcript artifacts;
- source metadata;
- file IDs;
- human-readable folder organization.

### Google Sheet

The operational index and queue.

Sheets own:

- intake queue;
- file inventory;
- processing status;
- extracted metadata;
- citation map;
- chunk index;
- agent routing log.

### Google Apps Script

The no-Netlify automation layer.

Apps Script owns:

- Drive folder scanning;
- queue creation;
- file metadata extraction;
- transcript/OCR handoff;
- JSON export;
- lightweight API endpoints for Libby UI.

### GitHub

The app, schemas, and generated canon.

GitHub owns:

- Libby UI on GitHub Pages;
- schemas;
- agent docs;
- generated summaries;
- static JSON exports when needed;
- durable versioned outputs.

### Local Worker

The heavy processing layer.

The local worker owns:

- large audio transcription;
- OCR if needed;
- embedding/chunk generation;
- batch cleanup;
- GitHub commits;
- optional local LLM processing.

---

## Required Drive Folder Structure

```text
Google Drive/
  Libby Brain/
    00_Inbox/
      Audio/
      Calls/
      Photos/
      Screenshots/
      Documents/
      Transcripts/
    01_Processed/
      Events/
      Summaries/
      Clinical/
      Family_Updates/
      Board_Updates/
    02_Index/
      libby_file_index.csv
      libby_chunk_index.csv
      libby_citation_map.csv
      libby_intake_queue.csv
    03_Source_Areas/
      Medical/
      ODSP_OW_Benefits/
      Housing/
      Transportation/
      Baby_Inventory/
      Family/
      Rogers_Admin/
      Product_Libby/
    99_Archive/
```

---

## Citation Model

Every cited fact should trace back to:

```json
{
  "citation_id": "drive_1abc_chunk_004",
  "drive_file_id": "1abc...",
  "drive_url": "https://drive.google.com/file/d/1abc/view",
  "file_name": "example.pdf",
  "mime_type": "application/pdf",
  "source_area": "Medical",
  "chunk_id": "chunk_004",
  "quote_or_snippet": "short source-supported excerpt or paraphrase anchor",
  "created_time": "ISO-8601",
  "modified_time": "ISO-8601",
  "confidence": "source_text|ocr|transcript|manual|inferred"
}
```

Libby’s user-facing answers should cite:

- file name;
- source area;
- Drive link when available;
- chunk/snippet reference;
- confidence label.

---

## Chatbot Rule

When answering a question, Libby should separate:

```text
Confirmed from Drive
Likely but needs verification
Missing from Drive
Next action
```

This prevents the assistant from blending memory, inference, and evidence.

---

## Retrieval Strategy

### Phase 1: Sheet-based retrieval

No vector database required.

Apps Script/local worker maintains a Google Sheet index with:

```text
file_id
file_name
folder_path
source_area
file_type
created_time
modified_time
text_extract
summary
tags
people
organizations
event_date
confidence
processed_status
```

The chatbot can search this index by keyword, tag, date, person, organization, and folder.

### Phase 2: Chunk index

Long documents/transcripts are chunked into smaller records:

```text
chunk_id
file_id
chunk_text
start_time
end_time
page_number
tags
summary
```

### Phase 3: embeddings or local search

Only after the Sheet index is stable, add embeddings/local vector search.

Do not make embeddings the first dependency.

---

## Intake Flow

```text
User uploads or saves file to Drive Inbox
→ Apps Script detects new file
→ adds row to libby_intake_queue
→ local worker processes transcript/OCR/summary
→ writes source metadata to file index
→ writes chunks to chunk index
→ generates event JSON
→ optional GitHub commit for static display
→ Libby UI reads searchable index
```

---

## Chat Flow

```text
User asks Libby a question
→ query Drive/Sheet index
→ retrieve matching files/chunks
→ build answer only from retrieved records
→ cite each important claim
→ list missing evidence
```

---

## Why not Netlify as the brain

Netlify should not be the central dependency because the system must not stop working when credits run out.

Netlify can be optional, but the critical path should be:

```text
GitHub Pages + Google Drive + Google Sheets + Apps Script + local worker
```

---

## First Implementation Target

Build this before anything more complex:

```text
Drive folder scanner
→ Google Sheet file index
→ Libby UI search page
→ cited results
```

This creates source-grounded answers before full automation.

---

## Non-negotiable Requirements

1. Drive file IDs must be preserved.
2. Every generated output must link back to source files.
3. Chat answers must cite Drive-backed sources when available.
4. Raw files stay in Drive.
5. GitHub Pages stays functional without backend compute.
6. Netlify must not be required for normal viewing or source lookup.
7. Heavy processing must be replaceable: local worker, Apps Script, GitHub Action, or paid API.

---

## Final Architecture Sentence

Google Drive is Libby’s brain. GitHub Pages is Libby’s face. Google Sheets is Libby’s card catalog. Apps Script is Libby’s clerk. The local worker is Libby’s heavy-processing assistant.
