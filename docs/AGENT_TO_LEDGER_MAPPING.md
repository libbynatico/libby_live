# Agent-to-Ledger Mapping: Data Flow Architecture

**Status**: Operational guide for ledger ingestion  
**Last Updated**: 2026-04-22  
**Purpose**: Define which ledgers feed which agents and how data flows through the system.

---

## Core Ledger Ecosystem

The Life Librarian system consumes four primary ledgers generated from Matthew's case materials (Gmail, Calendar, Drive, and local records):

### 1. **Correspondence Ledger** (`ledgers/correspondence.csv`)
**Purpose**: Track all email, letters, and formal communications with external agencies and providers.

**Schema:**
```
date,direction,person_org,email,subject,source_reference,category,linked_case,linked_action
2026-04-15,outbound,Disability/Income Systems Agent,sarah@odsp.gov.on.ca,ODSP Benefits Inquiry - Medical Documentation,gmail_thread_xyz123,operational,ODSP_APPROVAL_2025,RESPOND_BY_2026-04-30
2026-04-10,inbound,Dr. S. Forbes,s.forbes@juravinski.ca,Post-Surgical Pain Management Follow-up,gmail_msg_abc789,medical,SURGICAL_REVISION_JAN2026,SCHEDULE_CONSULT
```

**Key Fields:**
- **date**: ISO 8601 format (YYYY-MM-DD)
- **direction**: "inbound" or "outbound"
- **person_org**: Name of contact person or organization
- **email**: Email address or communication channel
- **subject**: Exact subject line or communication topic
- **source_reference**: Link to primary source (gmail_thread_ID, file_path, etc.)
- **category**: operational | medical | legal | advocacy | admin
- **linked_case**: Reference to major case event (e.g., "ODSP_APPROVAL_2025")
- **linked_action**: Deadline or required follow-up (e.g., "RESPOND_BY_2026-04-30")

---

### 2. **Contacts Master** (`ledgers/contacts_master.csv`)
**Purpose**: Central registry of all external contacts with deduplicated records and history.

**Schema:**
```
name,organization,role_title,email_primary,phone_primary,first_seen,last_seen,source_evidence,contact_type,priority_level
Sarah,Ontario Disability Support Program,ODSP Caseworker,sarah@odsp.gov.on.ca,416-555-0100,2024-06-15,2026-04-15,correspondence_ledger_2024-06,government,HIGH
Dr. S. Forbes,Juravinski Hospital,Surgical Specialist,s.forbes@juravinski.ca,905-521-2100,2026-01-20,2026-01-22,surgical_notes_JAN2026,medical_provider,HIGH
Lauren Mathias,Developmental Services Ontario,Intake Resource Coordinator,lauren.mathias@dso.ca,1-888-941-1121,2025-09-23,2025-10-03,dso_correspondence,government,MEDIUM
```

**Key Fields:**
- **name**: Contact person's name
- **organization**: Legal entity or employer
- **role_title**: Job title or role
- **email_primary**: Primary email address
- **phone_primary**: Primary phone number (with area code)
- **first_seen**: Date of first documented contact (YYYY-MM-DD)
- **last_seen**: Date of most recent contact (YYYY-MM-DD)
- **source_evidence**: Reference to ledger or document proving contact exists
- **contact_type**: government | medical_provider | legal | support_staff | other
- **priority_level**: HIGH | MEDIUM | LOW (for alert prioritization)

**Deduplication Rule**: If the same person appears under multiple email addresses or roles, maintain a single master record with multiple email/phone fields. Tag duplicates with "see_also" references.

---

### 3. **Appointments & Transportation Ledger** (`ledgers/appointments_transportation.csv`)
**Purpose**: Track medical appointments, required transportation, and associated costs.

**Schema:**
```
date,appointment_type,provider_name,appointment_location,city,transport_mode,estimated_distance_km,taxi_cost_cad,parking_cost_cad,receipt_obtained,receipt_location,reimbursement_status,linked_contact,notes
2026-04-22,Surgical Follow-up,Dr. S. Forbes,Juravinski Hospital,Hamilton,car_accessible_taxi,78,45.00,5.00,yes,email_receipt_apr22,pending_odsp,Sarah,Post-operative pain assessment; requires pain diary
2026-04-30,Disability Benefits,Sarah,ODSP Office - Cambridge,Cambridge,accessible_transit,25,0.00,0.00,n/a,n/a,approved_by_ow,Sarah,Monthly check-in; bring income records
2026-05-10,Physiotherapy,PT Smith,Grand River Hospital,Kitchener,family_support,12,0.00,0.00,n/a,n/a,not_billable,Contact TBD,Weekly pain management session
```

**Key Fields:**
- **date**: Appointment date (YYYY-MM-DD)
- **appointment_type**: Surgical Follow-up | Disability Benefits | Physiotherapy | Medical Testing | Mental Health | Other
- **provider_name**: Name of healthcare provider or agency staff
- **appointment_location**: Full address or facility name
- **city**: City where appointment occurs
- **transport_mode**: car_accessible_taxi | family_vehicle | accessible_transit | walk | hybrid
- **estimated_distance_km**: One-way distance
- **taxi_cost_cad**: Actual or estimated cost in CAD
- **parking_cost_cad**: Parking cost if applicable
- **receipt_obtained**: yes | no | pending
- **receipt_location**: Where receipt document is stored (email_receipt_DATE, file_path, etc.)
- **reimbursement_status**: pending_odsp | pending_ow | approved_by_odsp | approved_by_ow | not_billable | denied
- **linked_contact**: Name of primary contact person (matches contacts_master.name)
- **notes**: Clinical context, special accommodations, follow-up actions

---

### 4. **Evidence Ledger** (`evidence_ledger.csv`)
**Purpose**: Central index of all primary source documents with metadata and confidence labels.

**Schema:**
```
date,document_type,title,establishes,confidence,location,linked_agent,category,source_date,accessibility_notes
2026-01-20,Surgical Note,Bowel Resection Operative Report - Jan 20 2026,Surgical intervention for diseased bowel sections; 50-60cm removed; repositioning performed,Confirmed,drive://patient_files/surgical_jan2026/,Surgical/GI Lead Agent,medical,2026-01-20,Readable; high-nuance terminology
2025-12-03,Government Document,ODSP Notice of Decision - Approval,Formal disability recognition effective backdated to July 2025,Confirmed,email://odsp_approval_dec2025/,Disability/Income Systems Agent,administrative,2025-12-03,Full text searchable
2025-11-14,Assessment Report,DSO Psychological Assessment - Denial,Procedural errors documented; assessment conducted without required documents present,Inferred,drive://dso_files/assessment_nov2025/,Functional/Rehabilitation Agent,administrative,2025-11-14,Requires human review for inference accuracy
2024-06-15,Hospital Discharge,Cambridge Memorial Hospital Discharge Summary,Emergency admission; acute medical collapse; ileoscopy confirmed intestinal pathology; 44-day stay with TPN/PICC,Confirmed,drive://hospital_files/discharge_june2024/,Surgical/GI Lead Agent,medical,2024-06-15,Scanned; OCR required
```

**Key Fields:**
- **date**: When document was indexed (YYYY-MM-DD)
- **document_type**: Surgical Note | Hospital Discharge | Assessment Report | Government Document | Email | Letter | Other
- **title**: Human-readable title of the document
- **establishes**: One-sentence description of what this document proves or clarifies
- **confidence**: Confirmed | Draft | Inferred | Missing Evidence | Needs Review
- **location**: Where document is stored (drive://path, email://thread, file_path, etc.)
- **linked_agent**: Which specialist agent owns this evidence (from 5 Core Agents or specific micro-agent)
- **category**: medical | administrative | legal | advocacy | financial
- **source_date**: Original document date (YYYY-MM-DD)
- **accessibility_notes**: Whether searchable, requires OCR, high-nuance language, etc.

---

## Agent-to-Ledger Data Flow Map

### **TIER 1: Core Coordinator Agents**

#### Surgical/GI Lead Agent (Intake → Strategy → Handoff)
**Agent 7: Surgical File Receiver**
- **Inputs**: Evidence Ledger (medical documents), Correspondence (medical providers), Appointments/Transportation
- **Process**: Receives new surgical notes, imaging reports, pathology results
- **Output**: Validated surgical file package ready for Agent 8
- **Confidence Label Applied**: Confirmed (for primary documents), Inferred (for synthesis)

**Agent 8: GI Treatment Strategist**
- **Inputs**: Surgical files from Agent 7, Timeline (key medical dates), Contacts Master (provider info)
- **Process**: Synthesizes treatment trajectory, identifies gaps in specialist follow-up
- **Output**: Treatment strategy memo with recommendations
- **Confidence Label Applied**: Draft (awaiting review), Inferred (for pattern analysis)

**Agent 9: Surgical Follow-up Scheduler**
- **Inputs**: GI Strategy from Agent 8, Appointments/Transportation Ledger, Contacts Master
- **Process**: Identifies overdue appointments, calculates optimal scheduling windows
- **Output**: Appointment calendar with provider contacts and transportation logistics
- **Confidence Label Applied**: Draft (pending confirmation with providers)

---

#### Disability/Income Systems Agent (Intake → Strategy → Handoff)
**Agent 10: Benefits Document Intake**
- **Inputs**: Correspondence Ledger (ODSP/OW emails), Evidence Ledger (official forms/notices)
- **Process**: Receives and validates ODSP/OW correspondence, tax documents, medical forms
- **Output**: Organized benefits file package ready for Agent 11
- **Confidence Label Applied**: Confirmed (official documents)

**Agent 11: ODSP Eligibility Checker**
- **Inputs**: Benefits documents from Agent 10, Timeline (approval/denial dates), Evidence Ledger
- **Process**: Cross-references current status against policy, identifies eligibility windows, flags deadlines
- **Output**: Eligibility status memo with 90-day deadline alerts
- **Confidence Label Applied**: Inferred (synthesis of policy + facts)

**Agent 12: Retroactivity Claim Drafter**
- **Inputs**: Eligibility memo from Agent 11, Correspondence Ledger, Evidence Ledger (backdating evidence)
- **Process**: Constructs retroactive claim packages for unpaid periods
- **Output**: Draft claim letter with supporting evidence citations
- **Confidence Label Applied**: Draft (awaiting lawyer review)

---

#### Functional/Rehabilitation Agent (Intake → Strategy → Handoff)
**Agent 13: TBI Assessment Log Bot**
- **Inputs**: Correspondence (neurology/physiatry notes), Evidence Ledger (assessment reports), Patient Realities Ledger
- **Process**: Logs and categorizes TBI-related functional barriers (cognitive, processing, memory)
- **Output**: TBI functional profile with accommodation needs
- **Confidence Label Applied**: Confirmed (from clinical assessments), Inferred (synthesis of barriers)

**Agent 14: Accommodation Request Planner**
- **Inputs**: TBI profile from Agent 13, Contacts Master (therapists), Timeline (major life events)
- **Process**: Identifies required accommodations across systems (written-only comms, brief appointments, etc.)
- **Output**: Accommodation plan memo for distribution to agencies/providers
- **Confidence Label Applied**: Draft (pending Matthew's approval)

**Agent 15: Physiatry Consult Synthesizer**
- **Inputs**: Accommodation plan from Agent 14, Appointments/Transportation Ledger, Contacts Master
- **Process**: Prepares pre-appointment briefing notes for physiatry consultations
- **Output**: 5-point briefing (key questions, necessary items, barriers to address, accommodation reminders, follow-up actions)
- **Confidence Label Applied**: Draft (internal use only)

---

#### Administrative Oversight Agent (Intake → Strategy → Handoff)
**Agent 16: Dispute Record Tagger**
- **Inputs**: Correspondence Ledger (disputed communications), Evidence Ledger (relevant documents)
- **Process**: Tags and logs all disputes/contradictions with dates, parties, and key evidence references
- **Output**: Dispute timeline log ready for escalation
- **Confidence Label Applied**: Confirmed (direct citations to ledgers)

**Agent 17: Ombudsman Escalation Strategist**
- **Inputs**: Dispute log from Agent 16, Evidence Ledger (policy violations), Contacts Master (agency contacts)
- **Process**: Determines escalation readiness and prepares formal complaint packages
- **Output**: Ombudsman intake memo with evidence attachments
- **Confidence Label Applied**: Draft (awaiting lawyer input)

**Agent 18: Legal Review Package Builder**
- **Inputs**: Escalation memo from Agent 17, Correspondence Ledger (full communication history), Evidence Ledger
- **Process**: Organizes discovery files for litigation; applies legal discovery standards
- **Output**: Indexed legal evidence package with citations
- **Confidence Label Applied**: Confirmed (for direct citations), Inferred (for legal theories)

---

#### Housing & Community Stability Agent (Intake → Strategy → Handoff)
**Agent 19: Housing Application Triage**
- **Inputs**: Correspondence Ledger (housing authority emails), Evidence Ledger (lease/application docs)
- **Process**: Monitors housing application status, identifies missing documentation
- **Output**: Application status report with next-step checklist
- **Confidence Label Applied**: Confirmed (from housing authority), Draft (internal synthesis)

**Agent 20: Community Resource Finder**
- **Inputs**: Contacts Master (expanded to community services), Correspondence Ledger (referrals), Patient Realities Ledger
- **Process**: Searches for community-based supports aligned to identified barriers
- **Output**: Resource directory with eligibility requirements and access instructions
- **Confidence Label Applied**: Inferred (synthesis of available services)

**Agent 21: Stability Support Handoff**
- **Inputs**: Application status from Agent 19, Resource directory from Agent 20, Appointments/Transportation Ledger
- **Process**: Coordinates housing waitlist monitoring and community support transitions
- **Output**: Monthly stability status report with upcoming milestones
- **Confidence Label Applied**: Draft (status updates)

---

### **TIER 2: Data & Operational Backbone (Examples)**

#### Document Processing Micro-Agents (26-31)
**Input Stream**: Raw files from Drive, scanned PDFs, email attachments

**Agent 26: PDF Slicer**
- **Inputs**: Large multi-page PDFs (e.g., hospital records 50+ pages)
- **Process**: Segments PDF by topic (discharge summary, operative notes, lab results)
- **Output**: Individual topic files ready for OCR
- **Confidence Label Applied**: Confirmed (direct slicing)

**Agent 27: OCR Text Extractor**
- **Inputs**: Scanned PDFs from Agent 26
- **Process**: Runs Tesseract/AWS Textract on non-searchable scans
- **Output**: Searchable text files (.txt) ready for markdown conversion
- **Confidence Label Applied**: Draft (OCR may have errors)

**Agent 28: Markdown Converter**
- **Inputs**: Text files from Agent 27
- **Process**: Formats text into clean markdown with headers, lists, tables
- **Output**: Markdown files (.md) ready for evidence ledger indexing
- **Confidence Label Applied**: Draft (formatting standard)

**Agent 29: PII Redactor**
- **Inputs**: Markdown files from Agent 28
- **Process**: Scans for personally identifiable information (phone, address, health card #)
- **Output**: Redacted markdown with PII flagged for manual review
- **Confidence Label Applied**: Draft (awaiting security review)

**Agent 30: Metadata Indexer**
- **Inputs**: Redacted markdown from Agent 29
- **Process**: Extracts keywords, dates, key claims for indexing
- **Output**: Evidence ledger entry with metadata
- **Confidence Label Applied**: Draft (until Agent 30 creates official index entry)

**Agent 31: Duplicate Deleter**
- **Inputs**: All indexed files + metadata from Agent 30
- **Process**: Identifies duplicates by hash, date, content similarity
- **Output**: Deduplication report; marks duplicates for archival
- **Confidence Label Applied**: Confirmed (hash-based deduplication)

---

#### Communication Operations (32-37)
**Input Stream**: Outbound requests from specialist agents, inbound communications

**Agent 32: Email Drafter**
- **Inputs**: Requests from specialist agents (e.g., Agent 12 needs a benefits inquiry letter)
- **Process**: Generates professional email/letter templates
- **Output**: Draft email ready for review
- **Confidence Label Applied**: Draft (awaiting Chief Communications Officer review)

**Agent 37: Tone Adjuster**
- **Inputs**: Draft emails from Agent 32 or Matthew's manual drafts
- **Process**: Rewrites for professional tone and high-nuance empathy
- **Output**: Final email ready for Agent 32 transmission
- **Confidence Label Applied**: Draft (final review before sending)

---

### **TIER 3: Proactive Monitoring & Alerts**

#### Deadline & Escalation Monitoring (89-94)
**Input Stream**: Evidence Ledger (linked_action deadlines), Correspondence Ledger (follow-up dates), Appointments/Transportation (appointment dates)

**Agent 89: 90-Day Deadline Monitor**
- **Inputs**: Evidence Ledger (ODSP/OW dates), Correspondence Ledger (response due dates)
- **Process**: Monitors critical deadlines (ODSP medical review windows, OW recertification dates)
- **Output**: Alert at 30/15/7 days before deadline
- **Confidence Label Applied**: Confirmed (system-generated from ledger dates)

**Agent 93: Tribunal Date Alerter**
- **Inputs**: Correspondence Ledger (legal proceedings), Contacts Master (lawyer contact)
- **Process**: Triggers multi-channel alerts for tribunal/court dates
- **Output**: Email + internal notification to Matthew + calendar sync
- **Confidence Label Applied**: Confirmed (official documents)

---

## Ledger Creation Workflow (for Gemini/Claude/User)

### Input: Gmail + Calendar + Drive sources
1. **Correspondence Ledger**: Extract from Gmail thread history (direction, date, subject, sender/recipient)
2. **Contacts Master**: Deduplicate all unique people/orgs across Gmail, Drive metadata, Calendar attendees
3. **Appointments/Transportation**: Extract from Google Calendar (event title, date, location), add transportation estimates
4. **Evidence Ledger**: Index all Drive files with metadata (date, type, location, what it establishes, confidence level)

### Output: Four CSV files ready for Libby Live ingestion
- `data/mattherbert01/ledgers/correspondence.csv`
- `data/mattherbert01/ledgers/contacts_master.csv`
- `data/mattherbert01/ledgers/appointments_transportation.csv`
- `data/mattherbert01/evidence_ledger.csv` (replaces the template)

### Ingestion: Importers validate and load into system
- `importers/csv_reader.js` parses ledgers
- `retrieval/context_builder.js` prioritizes facts by agent responsibility
- `netlify/functions/chat.js` feeds agent-aware context to chatbot

---

## Confidence Label Application Guidelines

**Confirmed** ← Use when:
- Direct citation to primary source document (operative note, official letter, hospital discharge)
- Two or more independent sources corroborate the fact
- Official government or medical records explicitly state the fact

**Draft** ← Use when:
- AI-generated synthesis awaiting human review
- Internal working documents not yet approved
- Professional correspondence drafted but not yet sent

**Inferred** ← Use when:
- Logical deduction from multiple facts (e.g., "pattern of system failures")
- Expert interpretation of clinical/policy data
- Synthesis of evidence requiring professional judgment

**Missing Evidence** ← Use when:
- A critical claim exists but the supporting document hasn't been located/indexed
- Example: "Dr. Forbes performed the Jan 20 surgical revision" but operative note not yet retrieved

**Needs Review** ← Use when:
- Human approval required before external use
- Legal/sensitive claims requiring verification
- Medical assertions requiring specialist confirmation

---

## Integration Checkpoint

Once these four ledgers are created and committed to `data/mattherbert01/ledgers/`, run:

```bash
node importers/ingest.js --user mattherbert01
```

This will:
1. Validate ledger schemas
2. Load them into the retrieval layer
3. Make them available to all 100 agents via the context builder
4. Enable chatbot context generation that respects agent roles and confidence labels

**Expected outcome**: Chatbot can now reference correspondence history, known contacts, appointment logistics, and evidence with proper citations and agent ownership attribution.

