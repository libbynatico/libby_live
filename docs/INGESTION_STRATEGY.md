# Ingestion Strategy — Large, Messy Drive Folders

Your Drive has ~1TB with duplicates, versions, extras, and poor organization. Don't migrate it all at once.

## The approach: Minimal → Grow

### MVP (do this first):
1. Fill in the 4 template files in `data/mattherbert01/`:
   - `profile.md` — your situation, diagnoses, contacts
   - `timeline.md` — key dates and events (even if rough)
   - `evidence_ledger.csv` — your important documents (20-30 rows is enough)
   - `context.md` — extra context

2. Run:
   ```bash
   node importers/ingest.js --user mattherbert01
   ```

3. Test: Log into Libby Live, sign in as Patient Zero, send a chat message. Libby should now know your case.

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
