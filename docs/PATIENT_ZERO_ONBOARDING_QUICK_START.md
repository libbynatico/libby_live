# Patient Zero Onboarding - Quick Start

**Goal:** Get your case materials from Google Drive into Libby Live as structured context files.

**No credit card required. Takes ~10 minutes.**

---

## Option A: Google Takeout (Recommended - No Setup)

### Step 1: Export your Drive with Takeout
1. Go to https://takeout.google.com/
2. Select **Google Drive**
3. Click "All Drive" or select your folder
4. Export as **ZIP**
5. Choose "Send download link via email"
6. Download the zip file

### Step 2: Extract and organize
Unzip the file. You'll see folders with your Drive structure. Look for:
- Case documents
- Medical/legal records
- Correspondence
- Timeline notes
- Evidence materials

### Step 3: Share key files
- Copy the TEXT content of your most important files
- Email them to yourself or paste in Claude Code
- I'll structure them into the repo as Patient Zero files

### Step 4: Libby Live reads them
Once files are in `/docs/patient_zero/`, the chat function automatically injects them as context when you ask questions.

---

## Option B: Manual Paste (Fastest for Starting)

Just tell me the essential information about your case:
1. **Timeline** - dates of key events, diagnoses, decisions
2. **Evidence** - what documents/records establish what facts
3. **Current status** - what you're working on right now
4. **Next steps** - what needs to happen

I'll structure it into the repo immediately, and Libby will reference it.

---

## Option C: Full OAuth (Requires Google Cloud Setup - Later)

Once you're comfortable with the system, we can set up OAuth for live Drive access:
1. Create a free Google Cloud project (no credit card with non-billing account)
2. Enable Drive API + Gmail API
3. Create OAuth 2.0 credentials
4. Share credentials with Netlify environment
5. Chat function pulls from Drive on demand

---

## What Happens After Onboarding?

Your case data becomes:
- **Patient Zero files** → `docs/patient_zero/mattherbert01_*.md`
- **Indexed and versioned** → Git history of changes
- **Available to chatbot** → Injected into every conversation
- **Searchable** → Find relevant context quickly
- **Exportable** → Save chat + case context as PDF/markdown

---

## Patient Zero File Structure

We'll organize your files as:

```
docs/patient_zero/
├── mattherbert01_case_timeline.md          # Chronological events
├── mattherbert01_evidence_ledger.csv      # What docs establish what facts
├── mattherbert01_key_context.md           # Current situation, diagnoses, barriers
├── mattherbert01_contacts.md              # Caseworkers, doctors, advocates
├── mattherbert01_actions.md               # What needs to happen next
└── mattherbert01_correspondence.md        # Key email threads
```

Each file is structured for easy search and context injection.

---

## How Libby Uses These Files

When you ask Libby a question:

1. **You**: "What do I need for the ODSP hearing next month?"
2. **Libby** reads your:
   - Case timeline (to know when hearing is)
   - Evidence ledger (to know what's documented)
   - Key context (to understand your barriers)
   - Actions (to know what's already in motion)
3. **Libby** synthesizes into a smart response: "Based on your file, you have audiology reports dated X, which establish Y. For ODSP hearing, you'll want to emphasize Z..."

---

## Next: Tell Me Your Case

**Paste or send me:**
- Your case files (Takeout export or copy-paste)
- OR a quick summary of your situation
- OR the key documents from your Drive

I'll have you running with context-aware chat within an hour.

