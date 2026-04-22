# Ingestion Strategy — Building the Patient Master File

Your Drive has ~1TB with duplicates, versions, extras, and poor organization. The Life Librarian framework solves this by ingesting only what feeds the 100-agent system.

## The approach: Minimal → Grow via Agent Framework

### MVP Phase 1 (do this first): Foundation Files
1. Fill in the 4 template files in `data/mattherbert01/`:
   - `profile.md` — your situation, diagnoses, key contacts (maps to System Experiences Narrative + Patient Truths)
   - `timeline.md` — key dates and events (maps to Life Events Timeline)
   - `evidence_ledger.csv` — your important documents with confidence labels (maps to Evidence Library)
   - `context.md` — extra context (maps to Patient Realities Ledger)

2. Understand the agent framework:
   - Read `docs/LIFE_LIBRARIAN_ARCHITECTURE.md` to understand the 5 Core Coordinator Agents
   - Read `docs/AGENT_TO_LEDGER_MAPPING.md` to see how data feeds agents

3. Run ingestion:
   ```bash
   node importers/ingest.js --user mattherbert01
   ```

4. Test: Log into Libby Live, sign in as mattherbert01, send a chat message. Libby should now know your case and cite the agents responsible for each domain.

### MVP Phase 2 (after foundation): The 4 Ledgers
Once Phase 1 is stable, create the ledger files that feed the 5 Core Coordinator Agents:

1. **Correspondence Ledger** (`data/mattherbert01/ledgers/correspondence.csv`)
   - All email/letter communication with agencies (ODSP, OW, DSO, hospitals, lawyers)
   - Feeds: Email Drafter (Agent 32), Escalation Threshold Bot (Agent 91), Follow-Up Tracker (Agent 35)
   - Data source: Gmail thread history (date, direction, person/org, subject, category)
   - MVP: 20-30 key communications (focus on system-critical interactions)

2. **Contacts Master** (`data/mattherbert01/ledgers/contacts_master.csv`)
   - Central registry of all external contacts with deduplication
   - Feeds: ALL 5 Core Coordinator Agents + all specialist agents requiring external coordination
   - Data source: Gmail sender/recipient deduplication + manual contact info from Drive
   - MVP: 15-20 unique contacts (caseworkers, doctors, lawyers, housing staff)

3. **Appointments & Transportation Ledger** (`data/mattherbert01/ledgers/appointments_transportation.csv`)
   - Medical appointments, required transportation, associated costs
   - Feeds: Travel Auditor (Agent 55), Accessibility Coordinator (Agent 69), Deadline Monitor (Agent 89)
   - Data source: Google Calendar events + transportation cost estimates + receipt tracking
   - MVP: 10-15 upcoming/past appointments with transportation details

4. **Evidence Library** (update `evidence_ledger.csv`)
   - Expand from initial 1 row to include all key source documents
   - Maps documents to agent responsibilities and confidence levels
   - Feeds: Citation Auditor (Agent 85), Missing Document Alerter (Agent 86), all specialist agents
   - Data source: Drive file index (date, type, location, what it establishes, confidence)
   - MVP: 30-40 key medical, administrative, and legal documents

2. Run ingestion:
   ```bash
   node importers/ingest.js --user mattherbert01
   ```

3. Test: Chat should now cite correspondence history, known contacts, appointment logistics, and evidence with agent ownership attribution.

### Phase 2 (as you sort Drive):
- Create `data/mattherbert01/transcripts/calls/` directory
- Add `.md` transcripts as you sort/clean your recordings
- Update `evidence_ledger.csv` with more rows as you find documents
- Add `indexes/master_interaction_ledger.csv` if you have a cleaned call log

### What NOT to do:
- ❌ Don't dump your whole 1TB Drive into the app
- ❌ Don't try to organize/convert everything to markdown first
- ❌ Don't include duplicates or unrelated files
- ❌ Don't wait until everything is perfect to start using Libby

---

## For your specific Drive structure

You have:
```
01_source_materials/       ← raw files (audio, PDFs, emails, etc.)
02_markdown_archive/       ← already partially converted?
  calls/
  audio_transcripts/
03_structured_indexes/     ← CSVs (your organized metadata)
```

**Do this**:
1. **CSV indexes** → copy directly to `data/mattherbert01/indexes/`
   - `master_interaction_ledger.csv` → use as-is
   - `call_history_normalized.csv` → optional
   - Others → optional for MVP

2. **Markdown archive/transcripts** → gradually migrate to `data/mattherbert01/transcripts/calls/`
   - Pick your 5-10 most important calls
   - Copy their `.md` files
   - Add more later as you clean

3. **Source materials** → only extract what you need
   - Identify 20-30 key documents (medical reports, legal docs, correspondence)
   - Add their titles + what they establish to `evidence_ledger.csv`
   - Don't copy the files themselves yet

4. **Duplicates / extras / unrelated** → ignore them for now
   - Don't import 100MB of noise
   - The ingestion script will fail cleanly if files are missing

---

## Template filling workflow

For someone in your situation (busy, messy Drive, lots of material):

**Week 1: Get it running**
- Fill in `profile.md` (30 min)
- Fill in `timeline.md` with major events (20 min)
- Create basic `evidence_ledger.csv` (10 key documents) (30 min)
- Run ingest script, test chat

**Week 2+: Grow incrementally**
- As you sort your Drive, add transcripts to `transcripts/calls/`
- As you find documents, add rows to `evidence_ledger.csv`
- Run ingest script when you add files — it reloads automatically

---

## The key insight

**The app works today** with just those 4 template files filled in.
**You don't need to sort your entire Drive first.**
**You build the knowledge base as you work.**

This is actually how Libby should be used: as an ongoing knowledge capture tool, not a "upload everything once and you're done" system.
