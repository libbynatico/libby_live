# Life Librarian Architecture: 100-Agent Governance Framework

**Status**: Canonical governance model for Libby Live  
**Last Updated**: 2026-04-22  
**Architects**: Gemini (system planner), Claude (implementation)  
**Purpose**: Define the operational roles, data flows, and coordination rules that transform Libby Live from a static portal into an active case management system.

---

## Core Vision

The Life Librarian system is a **specialized micro-agent network** designed to manage Matthew Herbert's case with minimal token burn, maximum efficiency, and full evidentiary integrity. Rather than a monolithic chatbot, it distributes responsibilities across 100 highly focused agents, each responsible for a single, low-token task.

This architecture serves three purposes:
1. **Operational Excellence**: Each agent has a clear, narrow responsibility with defined inputs/outputs
2. **Evidentiary Integrity**: All facts are tagged with confidence levels (Confirmed/Draft/Inferred/Missing/Needs Review)
3. **Proactive Case Management**: Automated monitoring, alerts, and handoffs reduce manual coordination burden

---

## Foundational Layer: The Patient Master File

All 100 agents operate on a single source of truth: the **Patient Master File**, which consists of five canonical artifacts:

### 1. Life Events Timeline
Chronological ledger of critical events (surgeries, moves, system failures, financial crises).  
**Ownership**: Surgical/GI Lead Agent, Disability/Income Systems Agent  
**Updates**: Monthly or on major events  

**Key Events for Matthew:**
- June 2024: Diagnostic confirmation (ileoscopy) + emergency surgery + 44-day hospital stay
- July 2025: ODSP effective backdate
- Dec 3, 2025: ODSP approval (after ~5 previous attempts)
- Jan 20, 2026: Surgical revision at Juravinski
- Jan 22, 2026: Pain management crisis (PCA discontinued)

### 2. Patient Realities Ledger
Plain-language records of daily functional barriers and system effects.  
**Ownership**: Functional/Rehabilitation Agent  
**Updates**: Weekly or as symptoms change  

**Example entries:**
- Cognitive overload during system calls → requires written communication only
- Memory fragmentation from TBI → needs daily briefing sheets before appointments
- Chronic pain after surgery → limits sitting time to 45 minutes

### 3. System Experiences Narrative
Detailed accounts of specific interactions with healthcare/government systems, noting failures.  
**Ownership**: Administrative Oversight Agent  
**Updates**: As encounters occur  

**Example entries:**
- Ontario Works case closure during June 2024 hospitalization (failed to flag medical crisis)
- DSO psychological assessment (Nov 14, 2025) with procedural errors
- Multiple ODSP application attempts without adequate physician documentation

### 4. Patient Truths (Stable Statements)
High-confidence, reusable statements about functioning and needs for automated inclusion in letters.  
**Ownership**: Chief Communications Officer (Claude Scribe)  
**Updates**: Quarterly review  

**Example truths:**
- "Matthew requires written-only communication due to TBI-related processing difficulties"
- "Matthew's ileostomy requires consistent access to specialized medical supplies"
- "Matthew's pain management requires 24/7 support access"

### 5. Evidence Library (Source Cards)
Metadata-tagged index of all primary source files with associated confidence labels.  
**Ownership**: Data & Operational Backbone Layer (agents 22-31)  
**Updates**: Real-time as files are ingested  

**Schema**: [Date] | [Document Type] | [Title] | [What It Establishes] | [Confidence Level] | [Source Location] | [Agent Responsible]

---

## Core Coordination Layer: Five Specialist Agents

These roles own specific domains and coordinate across the micro-agent network.

### A. Surgical/GI Lead Agent
**Ownership**: All Crohn's, ileostomy, surgical, and nutritional follow-up coordination  
**Critical Files**: Hospital Discharge Summaries, Surgical Operative Notes, Pathology Reports, Diagnostic Imaging  
**Key Contacts**: Dr. S. Forbes (Juravinski), GI specialists, nutritionists  
**Micro-Agent Support**: Agents 7-9 (Surgical File Receiver, GI Treatment Strategist, Surgical Follow-up Scheduler)

### B. Disability/Income Systems Agent
**Ownership**: All ODSP, Ontario Works, DSO, Passport Program, and income-related coordination  
**Critical Files**: ODSP Notice of Decision, Ontario Works Correspondence, DSO Applications, Medical Forms, Tax/Income Statements  
**Key Contacts**: Sarah (ODSP Caseworker), Diala Elm (OW), Lauren Mathias (DSO), Jennifer Lekavy (OW Intake)  
**Micro-Agent Support**: Agents 10-12 (Benefits Document Intake, ODSP Eligibility Checker, Retroactivity Claim Drafter)

### C. Functional/Rehabilitation Agent
**Ownership**: TBI, neurology, physiatry, physiotherapy, SLP, and chronic pain management  
**Critical Files**: TBI Assessment Reports (Neuropsych), Physiatry Consults, Physiotherapy/SLP Intake Assessments, Chronic Pain Clinic notes  
**Key Contacts**: TBI specialist, physiatrist, physiotherapist, speech-language pathologist, pain clinic  
**Micro-Agent Support**: Agents 13-15 (TBI Assessment Log Bot, Accommodation Request Planner, Physiatry Consult Synthesizer)

### D. Administrative Oversight Agent
**Ownership**: High-level administrative disputes, ombudsman/advocacy escalations, legal intake  
**Critical Files**: Legal Correspondence, Ombudsman Complaints, Tribunal Filings, Organizational Policies, Dispute Documentation  
**Key Contacts**: Lawyer/Paralegal, ombudsman office, tribunal staff, Employment Ontario contact (Stephanie Banks), ESDC (Vincent Seguin)  
**Micro-Agent Support**: Agents 16-18 (Dispute Record Tagger, Ombudsman Escalation Strategist, Legal Review Package Builder)

### E. Housing & Community Stability Agent
**Ownership**: Housing applications, support navigation, community resource coordination  
**Critical Files**: Lease/Rental Agreements, Housing Application Forms, Utility Bills, Community Support Contact Lists  
**Key Contacts**: Community Housing Access Centre (CHAC), Region of Waterloo Housing, local community supports  
**Micro-Agent Support**: Agents 19-21 (Housing Application Triage, Community Resource Finder, Stability Support Handoff)

---

## Micro-Agent Roster: Organized by Layer

### Layer I: Executive & Governance (6 Agents)
1. **CEO (Matthew Herbert)**: Final decision-maker, auditor
2. **Chief Architect (Gemini)**: System planner, strategic counsel
3. **Chief Communications Officer (Claude Scribe)**: High-nuance documentation
4. **Systems Automation Specialist (GPT Engineer)**: APIs, Python scripts, technical troubleshooting
5. **Logic & Efficiency Specialist (DeepSeek Logic)**: Code review, optimization, second opinion
6. **Local Operator (Heartbeat/Sentinel OpenClaw)**: 24/7 physical presence, file syncing, server health

### Layer II: Core Coordination & Advocacy (15 Agents)
*Broken into Intake → Strategy → Handoff for each domain*

**Surgical/GI**: Agents 7-9  
**Disability/Income**: Agents 10-12  
**Functional/Rehabilitation**: Agents 13-15  
**Administrative**: Agents 16-18  
**Housing & Stability**: Agents 19-21  

### Layer III: Data & Operational Backbone (25 Agents)

**Core Intake & Triage** (Agents 22-25):
- File Receiver, Priority Sorter, Source Logger, Human Triage Alert

**Document Processing** (Agents 26-31):
- PDF Slicer, OCR Text Extractor, Markdown Converter, PII Redactor, Metadata Indexer, Duplicate Deleter

**Communication Operations** (Agents 32-37):
- Email Drafter, Internal Comms Bot, Appointment Reminder Bot, Follow-Up Tracker, Sentiment Analyzer, Tone Adjuster

**Research & Policy** (Agents 38-41):
- Policy Searcher, Eligibility Checker, Conflict Identifier, Citation Builder

**Proactive Health & Daily Support** (Agents 42-46):
- Appointment Prep Agent, Bedtime Protection Agent, Partner Handoff Agent, Symptom Logger, Pain Event Alerter

### Layer IV: Specialized Professional Support (30 Agents)

**Legal & Financial** (Agents 47-56):
- Legal Intake Coordinator, Discovery File Organizer, Litigation Deadline Tracker, Financial/Tax Agent, Expense Logger, Budget Tracker, Insurance Analyst, Coverage Gap Finder, Medical Travel Auditor, Reimbursement Claim Bot

**Health & Rehabilitation** (Agents 57-66):
- SLP Agent, TBI Accommodation Planner, Physiatry Log Bot, Chronic Pain Tracker, Wound Care Manager, Supplies Inventory Alert, Pharmacy Manager, Refill Notification Bot, Therapy Navigator, Mental Health Check-in Bot

**Housing & Transportation** (Agents 67-76):
- Housing Application Drafter, Waitlist Status Monitor, Accessible Transport Coordinator, MTO/License Status Agent, Utility Bill Tracker, Lease Expiration Alert, Community Resource Finder, Eviction/Dispute Prep Agent, Address Change Coordinator, Emergency Contact Validator

### Layer V: System Efficiency & Alert (24 Agents)

**Heartbeat & System Health** (Agents 77-82):
- Server Health Monitor, Token Usage Logger, Error Log Analyzer, Backup Confirmation Alert, API Connection Tester, Cron Job Status Bot

**Document Integrity & Audit** (Agents 83-88):
- File Naming Standardizer, Metadata Compliance Checker, Citation Auditor, Missing Document Alerter, Policy Version Updater, Evidence Source Validator

**Advocacy & Escalation Alerts** (Agents 89-94):
- 90-Day Deadline Monitor, AODA Accommodation Tracker, Escalation Threshold Bot, Ombudsman Intake Prepper, Tribunal Date Alerter, Adverse Event Log Bot

**Financial Watch & Planning** (Agents 95-100):
- Low Balance Alert, Pending Payment Tracker, Reimbursement Due Date Alert, Subscription Renewal Monitor, Tax Document Sorter, Uncategorized Expense Flag

---

## Data Quality Model: Confidence Labels

All factual claims and outputs must be tagged with confidence levels to prevent hallucination and ensure evidentiary value.

| Tag | Meaning | Actionable Use |
|-----|---------|----------------|
| **Confirmed** | Fact verified against two or more primary source documents (e.g., Operative Note + Discharge Summary) | Safe for external submissions |
| **Draft** | Generated by AI agent, internally consistent, awaiting human review/approval | Must be reviewed before use |
| **Inferred** | Logical interpretation/synthesis of multiple facts, not a direct statement from primary source | Requires human consultation before advocacy use |
| **Missing Evidence** | Factual claim or policy assertion without corresponding source document yet indexed | High-priority task for Missing Document Alerter (86) |
| **Needs Review** | Draft output requiring final human sign-off before external use | Cannot be used externally until status changes to Confirmed or Draft |

---

## Governance: Handshake Audit & Heartbeat Snapshots

### Handshake Logs
Every formal transfer between contexts (e.g., PDF Slicer processing, Email Drafter generating output) is logged with:
- Input Prompt (exact request)
- Agent Reasoning Path (verbatim AI reasoning)
- Output Schema
- Timestamp
- Confidence Label Applied
- Destination Agent/Human

**Purpose**: Transparent internal review for continuous agent performance improvement.

### Heartbeat Snapshots
System state captured at key moments (boot, major file sync, daily checkpoint) with:
- Timestamp
- System Health Status (CPU, memory, storage, uptime)
- File Sync Status (last successful backup, files pending ingestion)
- Token Usage (daily/weekly burn rate)
- Open Alerts (deadlines, escalations, missing documents)
- Agent Status (which agents are active, any failures)

**Purpose**: Continuity assurance and audit trail for system resilience.

---

## Integration into Libby Live

### How the 100-Agent Framework Shapes the App

1. **Data Ingestion**: Ledgers are structured to feed agent responsibilities
   - Correspondence ledger → feeds Email Drafter, Escalation Threshold Bot, Follow-Up Tracker
   - Contacts ledger → feeds all agents requiring external coordination
   - Appointments/Transportation ledger → feeds Travel Auditor, Accessibility Coordinator, Deadline Monitor
   - Evidence ledger → feeds all agents requiring source verification

2. **Retrieval Layer**: Context builder prioritizes facts by agent role and confidence
   - When generating chat context, system checks: "Which agents are most relevant to this query?"
   - Only retrieves Confirmed or Draft facts (not Inferred without notation)
   - Surfaces Missing Evidence gaps to user

3. **Chatbot Awareness**: System prompt includes agent framework
   - Chatbot understands agent responsibilities and handoff protocols
   - When responding, chatbot can cite which agent owns the domain
   - Can suggest escalations to appropriate specialist agents

4. **UI Workflows**: App panels map to agent clusters
   - "Case Profile" panel → Surgical/GI + Functional agents' views
   - "Evidence" panel → Evidence Library source cards with confidence labels
   - "Disability Benefits" panel → Disability/Income Systems agents' view
   - "Housing" panel → Housing & Community Stability agents' view
   - "Legal & Disputes" panel → Administrative Oversight agents' view

---

## Standard Operating Procedure Template (SOP)

Every micro-agent must be defined using this structure:

```
# AGENT SOP: [Agent Name & Number]

## 1. PURPOSE
Single-sentence mission statement (low-token focus).

## 2. INPUTS
Mandatory file types or data streams required for execution.

## 3. TOOLS & PERMISSIONS
Specific system access (Drive, Obsidian, GitHub, etc.).

## 4. EXECUTION STEPS
Step-by-step logic for the agent to follow.

## 5. OUTPUT FORMAT
Exact schema or structure for resulting data (JSON, CSV, Markdown, etc.).

## 6. QA CHECKLIST & HANDOFF
Verification steps and target destination (next agent or human dashboard).
```

---

## Key Files That Feed This Architecture

**Patient Master File Artifacts:**
- `data/mattherbert01/timeline.md` — Life Events Timeline
- `data/mattherbert01/context.md` — Patient Realities Ledger (daily functional barriers)
- `data/mattherbert01/profile.md` — System Experiences Narrative + Stable Truths
- `data/mattherbert01/evidence_ledger.csv` — Evidence Library (source cards)

**Ledger Sources:**
- `data/mattherbert01/ledgers/correspondence.csv` — feeds Email Drafter, Escalation agents
- `data/mattherbert01/ledgers/contacts_master.csv` — feeds all coordination agents
- `data/mattherbert01/ledgers/appointments_transportation.csv` — feeds Travel, Accessibility, Deadline agents

**System Configuration:**
- `docs/AGENT_TO_LEDGER_MAPPING.md` — explicit mapping of which ledgers feed which agents
- `docs/DATA_QUALITY_PROTOCOLS.md` — detailed guidance on confidence labeling
- Individual agent SOPs in `docs/agents/` directory

---

## Next Steps: Implementation Phases

### Phase 1 (Current): Wire 5 Core Coordinator Agents
- Document the 5 specialist agents' SOPs
- Map their inputs to ledger sources
- Integrate into chatbot context generation
- Update UI to highlight agent ownership

### Phase 2: Activate Micro-Agent Tiers Gradually
- Start with Layer III (Data & Operational Backbone) — these are the "workers"
- Add Layer IV (Professional Support) — these are the "specialists"
- Add Layer V (System Efficiency) — these are the "monitors"

### Phase 3: Build Handoff Automation
- Implement Handshake Log tracking
- Build Heartbeat Snapshot system
- Create inter-agent routing (e.g., when Email Drafter generates output, route to Tone Adjuster automatically)

### Phase 4: Launch Proactive Alerting
- Activate 90-day deadline monitors
- Enable appointment reminder bot
- Implement adverse event logging for litigation support

---

## Governance Philosophy: "Privacy by Architecture"

This system is designed to respect Matthew's autonomy and data dignity:
- **Minimal token burn**: 100 specialized agents > 1 bloated LLM
- **Evidentiary integrity**: Confidence labels prevent hallucination
- **Transparent auditing**: Handshake logs and Heartbeat snapshots allow human oversight
- **Clear delegation**: Each agent has one responsibility; no mission creep
- **Proactive not reactive**: Alerts, deadline monitors, and escalation trackers reduce crisis management

The system serves Matthew, not the other way around.

