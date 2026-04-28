# Libby Secure Memory Bank Architecture

Generated: 2026-04-28  
Status: required architecture; public-safe design only  
Applies to: Libby Live, userid=001, future users 002 and 003

## Core clarification

The Libby web page is only the interface.

The secure memory bank is the private source-of-truth layer behind the interface.

The current public GitHub repo must not contain raw private case memory, medical details, benefits records, family records, financial details, provider details, emails, transcripts, or documents.

## Required separation

```text
Public GitHub repo
→ app shell
→ demo data
→ schemas
→ architecture
→ redacted examples

Private secure memory bank
→ real user profile
→ private memory
→ source files
→ transcripts
→ OCR
→ calendar data
→ evidence ledger
→ generated private letters
→ audit log
```

## Why local browser memory is not enough

The iPad/browser version can save local state for quick use, but browser local storage is not the secure long-term memory bank.

Local browser storage is useful for:

- temporary draft letters;
- testing the dashboard;
- offline-ish continuity on one device;
- quick demo state.

It is not sufficient for:

- private medical memory;
- multi-user access;
- audit logging;
- secure evidence storage;
- device loss protection;
- reliable backup;
- Google Calendar/Gmail/Drive sync;
- Kellsie/Newfie Nikki onboarding.

## Secure memory bank requirement

Libby needs a private backend that stores user memory by `user_id` and `case_id`.

Minimum private objects:

1. users
2. cases
3. memberships
4. memories
5. patient_tags
6. evidence_sources
7. transcripts
8. calendar_events
9. tasks
10. blinks
11. handshakes
12. generated_outputs
13. audit_logs

## Recommended implementation path

### Phase 1: Google-private MVP

Use tools already close to the current workflow:

```text
Google OAuth
→ private Google Drive folder
→ private Google Sheet index
→ Apps Script intake
→ Libby dashboard reads/writes through backend proxy
```

Private Drive folder structure:

```text
Libby Secure Memory Bank/
  users/
    001/
      profile.json
      memory_bank.jsonl
      patient_tags.json
      calendar_events.jsonl
      tasks.jsonl
      blinks.jsonl
      handshakes.jsonl
      outputs/
      evidence/
        raw/
        transcripts/
        ocr/
        metadata/
      audit_log.jsonl
    002/
    003/
  shared_cases/
    case_household_001/
  demo/
    demo_001/
```

This is the fastest practical path because the user already uses Google Drive/Gmail/Calendar heavily.

### Phase 2: Proper app backend

Use one of:

- Firebase Auth + Firestore + Cloud Storage;
- Supabase Auth + Postgres + Storage;
- Next.js/Auth.js + encrypted database + object storage.

The backend must enforce:

- authentication;
- authorization;
- per-user case access;
- private source storage;
- audit logs;
- export controls;
- role-based sharing.

### Phase 3: Local encrypted worker

For privacy and cost control:

```text
local Mac/mini PC worker
→ watches private sync folder
→ runs OCR/transcription locally
→ writes transcript/metadata back to private vault
→ sends redacted status to dashboard
```

## Memory object schema

```json
{
  "memory_id": "mem_001_YYYYMMDD_NNN",
  "user_id": "001",
  "case_id": "case_001_life_librarian",
  "category": "communication | medical | functional | benefits | family | housing | product | preference | workflow | legal_admin | consumer",
  "statement": "atomic memory statement",
  "confidence": "confirmed_source | user_reported | derived_pattern | system_rule | needs_review",
  "sensitivity": "public_safe | private | restricted | highly_sensitive",
  "source_ids": [],
  "created_at": "ISO-8601 timestamp",
  "updated_at": "ISO-8601 timestamp",
  "last_reviewed_at": null,
  "created_by": "user | libby | imported_source | support_person",
  "use_in_outputs": true,
  "requires_citation_for_external_use": true
}
```

## Evidence source schema

```json
{
  "source_id": "src_001_YYYYMMDD_NNN",
  "user_id": "001",
  "case_id": "case_001_life_librarian",
  "source_type": "email | audio | transcript | document | image | calendar | note | call_log | receipt",
  "title": "source title",
  "original_file_uri": "private vault URI, never public GitHub raw path",
  "derived_text_uri": "private transcript/OCR URI",
  "captured_at": "ISO-8601 timestamp",
  "event_at": "ISO-8601 timestamp or null",
  "people": [],
  "agencies": [],
  "topics": [],
  "sensitivity": "private",
  "processing_status": "new | needs_ocr | needs_transcription | processed | reviewed | failed",
  "confidence": "source_original | imported | user_reported | needs_review"
}
```

## Patient tag schema

```json
{
  "tag_id": "ptag_001_communication_accommodation",
  "user_id": "001",
  "case_id": "case_001_life_librarian",
  "tag": "communication_accommodation",
  "description": "Written-first communication and iPad-readable output preferred.",
  "confidence": "user_reported | confirmed_source | needs_review",
  "sensitivity": "private",
  "source_ids": [],
  "use_for_routing": true,
  "use_for_external_outputs": true
}
```

## Dashboard connection rule

The dashboard must not be the memory bank.

The dashboard should request a safe view from the memory bank:

```text
Dashboard asks:
Give me today’s safe dashboard state for user 001.

Memory bank returns:
- today’s events;
- urgent blinks;
- next best action;
- ready outputs;
- task counts;
- source-backed summary snippets;
- no raw evidence unless explicitly opened by authorized user.
```

## Access rules

1. Guest users only receive demo data.
2. Signed-in users receive only their permitted cases.
3. Shared household cases do not automatically merge private records.
4. Raw evidence requires explicit private access.
5. Public demo mode cannot read private memory.
6. External letters must use citation/confidence rules.
7. Every memory change must be audit logged.

## Immediate build target

The next functioning build should connect the dashboard to a private memory file, even before full OAuth is complete.

Minimum safe MVP:

```text
private Drive folder
+ user_001_memory_bank.jsonl
+ user_001_tasks.jsonl
+ user_001_calendar_events.jsonl
+ user_001_outputs.jsonl
+ Apps Script or backend proxy
+ dashboard reads private state after login
```

## Non-negotiable product rule

Libby is not allowed to treat public GitHub, local browser storage, or chat history as the secure memory bank.

Those are interfaces or temporary working surfaces only.

The secure memory bank must be private, backed up, access-controlled, and organized by user_id and case_id.
