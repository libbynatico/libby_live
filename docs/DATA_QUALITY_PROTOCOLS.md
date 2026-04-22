# Data Quality Protocols & Governance

**Status**: Canonical governance framework for Libby Live  
**Last Updated**: 2026-04-22  
**Purpose**: Ensure evidentiary integrity, prevent hallucination, and maintain audit trails.

---

## The Confidence Model

All facts stored in Libby Live must be tagged with a confidence level. This prevents AI hallucination and ensures claims can be backed up with evidence.

### Tag Definitions

| Tag | Definition | When to Use | Example |
|-----|-----------|------------|---------|
| **Confirmed** | Fact verified against two or more primary source documents, OR stated directly in official government/medical records | Safe for external submissions (letters, tribunal applications, etc.) | "ODSP approved December 3, 2025" (Notice of Decision document) |
| **Draft** | AI-generated synthesis awaiting human review/approval | Internal working documents only | Email reply draft pending Matthew's review |
| **Inferred** | Logical deduction from multiple facts; expert interpretation; not a direct quote | Requires human consultation before advocacy use | "Pattern of system failures across 5 ODSP application attempts" (synthesized from correspondence) |
| **Missing Evidence** | A factual claim exists but the supporting document hasn't been located/indexed | Immediate priority task for Missing Document Alerter | "Dr. Forbes performed surgical revision Jan 20, 2026" but operative note not yet in system |
| **Needs Review** | Draft output requiring final human sign-off before external use | Cannot be used externally until status changes | Legal letter draft awaiting lawyer approval |

---

## Applying Confidence Labels

### Rule 1: Every Fact in External Communications Must Be Confirmed or Inferred (with disclosure)

**External communications** = anything sent outside the case system:
- Letters to agencies (ODSP, OW, DSO, housing, hospitals)
- Tribunal/legal applications
- Formal advocacy documents
- Ombudsman complaints

**Internal communications** = notes, drafts, working memos, chat responses to Matthew alone:
- Can include Draft and Inferred claims
- Should still track sources for auditing

### Rule 2: Confidence is Tagged at Source Entry, Not Synthesis

When you first add a fact to the system, you determine its confidence:

**Example: Adding a surgical date**

Source: Hospital discharge summary PDF (official medical record)  
Fact: "Emergency surgery June 15, 2024 at Cambridge Memorial Hospital"  
Confidence: **Confirmed** (official medical document)

If the same fact appears in an email without supporting document:

Source: Email from patient to caseworker  
Fact: "I had surgery in June"  
Confidence: **Inferred** (patient report, not official record; matches other sources)

### Rule 3: If Supporting Evidence is Missing, Tag as "Missing Evidence"

Example:

```csv
date,document_type,title,establishes,confidence,location,linked_agent,category
2026-01-20,Surgical Note,Bowel Resection Operative Report,Surgical intervention for diseased bowel,Missing Evidence,UNKNOWN,Surgical/GI Lead Agent,medical
```

This triggers Agent 86 (Missing Document Alerter) to search for the document.

---

## Citation Protocol: "Claim → Source"

Every claim made in an external document must point to a source.

### Citation Format

In Libby Live system (internal):
```
Claim: Matthew was hospitalized June 15-July 29, 2024.
Source: Hospital Discharge Summary (Cambridge Memorial, evidence_ledger.csv row 8)
Confidence: Confirmed
```

In External Document (letter/application):
```
Matthew was hospitalized June 15-July 29, 2024 at Cambridge Memorial Hospital following 
diagnostic confirmation of serious intestinal pathology. [See attached Discharge Summary, 2024-06-15]
```

### The "Golden Rule"

**If you can't point to a document that directly states or implies the fact, don't use it in external communications.**

---

## Handshake Audit Logs

Every handoff between agents or from agent to human is logged with:

1. **Input Prompt**: What was asked of the agent?
2. **Agent Name & ID**: Which agent processed this?
3. **Timestamp**: When did this happen?
4. **Input Data**: Ledgers/files consumed
5. **Output**: What the agent produced
6. **Confidence Labels Applied**: Which tags were assigned?
7. **Next Destination**: Who receives this output?
8. **Human Review Required**: Yes/No

**Example Handshake Log Entry**:

```json
{
  "timestamp": "2026-04-22T15:32:00Z",
  "agent_id": 32,
  "agent_name": "Email Drafter",
  "input_prompt": "Draft a letter to ODSP requesting reconsideration of benefits for transportation costs. Cite the Disability/Income Systems Agent's retroactivity analysis.",
  "input_data": [
    "data/mattherbert01/ledgers/correspondence.csv (rows 1-10)",
    "data/mattherbert01/ledgers/appointments_transportation.csv",
    "output_from_agent_12_retroactivity_analysis"
  ],
  "output": "draft_letter_odsp_reconsideration_2026-04-22.txt",
  "confidence_labels_applied": [
    "Confirmed: ODSP approval date (from Notice of Decision)",
    "Draft: letter structure and tone (awaiting human review)",
    "Inferred: transportation cost justification (synthesized from ledger)"
  ],
  "next_destination": "Matthew Herbert (for review and approval)",
  "human_review_required": true,
  "notes": "Letter cites 3 receipts from appointments_transportation ledger. Agent found 2 of 3 original receipts; flagged 1 as Missing Evidence."
}
```

### How to Access Handshake Logs

Handshake logs are stored in: `data/mattherbert01/audit/handshake_logs/`

Named by date and agent: `2026-04-22_agent_32_email_drafter.json`

Query logs by agent, date, or output status.

---

## Heartbeat Snapshots: System State Records

At key moments (system startup, major file sync, daily checkpoint), the system records its state:

**Example Heartbeat Snapshot**:

```json
{
  "timestamp": "2026-04-22T06:00:00Z",
  "type": "daily_checkpoint",
  "system_health": {
    "uptime_hours": 168,
    "storage_used_gb": 12.3,
    "cpu_load": 0.15,
    "last_backup": "2026-04-21T23:00:00Z",
    "backup_status": "success"
  },
  "file_sync_status": {
    "files_pending_ingestion": 0,
    "last_ingest_run": "2026-04-21T18:30:00Z",
    "errors": []
  },
  "ledger_status": {
    "correspondence_ledger_rows": 45,
    "contacts_master_rows": 18,
    "appointments_transportation_rows": 12,
    "evidence_ledger_rows": 38
  },
  "token_usage": {
    "day_total": 2847,
    "week_average": 2301,
    "estimated_cost_usd": 0.85
  },
  "active_alerts": [
    {
      "agent": 89,
      "alert_type": "deadline_approaching",
      "message": "ODSP 90-day medical review window closes 2026-05-03",
      "priority": "HIGH",
      "actions_taken": ["notification_sent_to_matthew"]
    }
  ],
  "agents_active": {
    "total": 100,
    "running": 12,
    "idle": 88,
    "failed": 0
  }
}
```

### Heartbeat Snapshots Location

Stored in: `data/mattherbert01/audit/heartbeat_snapshots/`

Named by timestamp: `2026-04-22_06-00-00_checkpoint.json`

Use these for:
- System resilience audits ("Did I back up today?")
- Cost analysis ("How much am I spending?")
- Performance monitoring ("Are agents working?")
- Incident review ("What was system state when X happened?")

---

## Review Gates: Before External Use

All external-facing communications pass through two gates:

### Gate 1: Evidence Gate
**Question**: Can every claim in this output be traced to a source document?

**Process**:
1. Citation Auditor (Agent 85) reviews every claim
2. Checks if confidence level is Confirmed or (Inferred with disclosure)
3. Verifies source document exists in evidence ledger
4. Flags Missing Evidence gaps

**Result**: Pass or Fail (with remediation required)

### Gate 2: Review Gate (Milestone 3)
**Question**: Is a human ready to sign off on this?

**Process**:
1. Output is marked as "Needs Review"
2. Matthew or his representative reviews the text
3. Makes corrections or approvals
4. Status changes to "Approved" or "Draft" (if minor revisions needed)
5. Only "Approved" outputs can be transmitted

**Result**: Matthew's explicit sign-off

---

## Confidence Escalation Workflow

When a fact starts as "Missing Evidence", here's how it becomes "Confirmed":

1. **Day 1**: Upload operative note PDF, tag as "Missing Evidence"
   ```
   establishes: "Surgical intervention Jan 20, 2026"
   confidence: Missing Evidence
   location: /drive/folder/operative_note_jan20.pdf
   ```

2. **Day 2**: Missing Document Alerter (Agent 86) sends alert
   ```
   "Looking for: Operative Note dated 2026-01-20 from Dr. S. Forbes"
   ```

3. **Day 3**: File located in Drive, pulled into system
   ```
   location: data/mattherbert01/evidence/operative_note_jan20_2026.md (OCR'd)
   ```

4. **Day 4**: Surgical/GI Lead Agent (Agent 8) reviews operative note
   ```
   Extracted key facts:
   - Extent of resection: 50-60 cm of diseased bowel
   - Complication: adhesions requiring extended surgery time
   - Outcome: successful repositioning
   ```

5. **Day 5**: Update confidence tag to "Confirmed"
   ```
   confidence: Confirmed
   linked_agent: Surgical/GI Lead Agent
   ```

Now the fact is safe to use in external communications.

---

## Common Mistakes (and How to Fix Them)

### Mistake 1: Using "Draft" in External Communication

❌ **Wrong**:
```
Letter to ODSP says: "Matthew's pain management requires 24/7 support access"
Confidence: Draft
(Because it's in a letter sent to an agency)
```

✅ **Right**:
Either:
- Change to "Confirmed" (cite: Pain Management Clinic Assessment, dated 2026-01-15)
- Change to "Inferred" with disclosure: "Based on clinical assessments and physician recommendations..."
- Or don't send until Matthew's doctor provides a written statement

### Mistake 2: Missing Source Reference

❌ **Wrong**:
```
Claim: "Matthew was approved for ODSP in December 2025"
Confidence: Confirmed
Location: "somewhere in the Drive"
```

✅ **Right**:
```
Claim: "Matthew was approved for ODSP effective December 3, 2025"
Confidence: Confirmed
Location: data/mattherbert01/evidence/ODSP_Notice_of_Decision_Dec_2025.pdf
Linked Agent: Disability/Income Systems Agent
```

### Mistake 3: Conflicting Confidence Levels

❌ **Wrong**:
```
Fact appears in two rows with different confidence:
Row 1: "Surgery was June 15, 2024" | Confirmed (hospital discharge)
Row 2: "Surgery was June 16, 2024" | Draft (email draft)
```

✅ **Right**:
- Resolve conflict by checking dates
- Update the Draft row to match the Confirmed source
- If dates actually differ, investigate which is correct
- Add note: "Discrepancy flagged: Email states June 16, but hospital discharge confirms June 15"

---

## Auditing for Compliance

### Monthly Audit Checklist

**For Matthew or his case manager:**

- [ ] Review Handshake Logs for the past month: Any Drafts transmitted externally? (They shouldn't be)
- [ ] Check Heartbeat Snapshots: All backups succeeded?
- [ ] Review Evidence Ledger: Any "Missing Evidence" for > 2 weeks? (Escalate to Agent 86)
- [ ] Spot-check a recent external communication: Can each claim be traced to a source?
- [ ] Check token usage: On budget? Any spikes suggesting errors or runaway agents?

### Annual Audit Checklist

**For governance/oversight:**

- [ ] All 100 agents documented with SOP templates?
- [ ] All handoff logs accessible and searchable?
- [ ] No evidence of systemic agent failures or data corruption?
- [ ] Contacts registry deduplication working?
- [ ] Citation audit pass rate > 95%?

---

## Privacy & Security Notes

**No secrets in ledgers**: Never include:
- Passwords, API keys, tokens
- Full health card numbers (use format: HCN-XXXX-XXXX-NNNN)
- Full SINs (use format: XXX-XX-NNNN)
- Home address (use format: City, Province only in public communications)

**Redaction protocol** (Agent 29):
- All incoming files are scanned for PII
- Flagged items are redacted before indexing
- Original unredacted files stored separately in `data/mattherbert01/private/` (git-ignored)

**Access control**:
- Ledgers and evidence library visible only to authenticated users with appropriate role
- Chat context shared only with Matthew's account
- Handshake/Heartbeat logs visible to Matthew + audit administrators only

---

## Questions? Escalation Path

1. **Data quality question about a specific fact?** → Check evidence_ledger.csv and linked_agent field
2. **Which agent should handle this task?** → See AGENT_TO_LEDGER_MAPPING.md
3. **Need to challenge a confidence level?** → Contact Chief Communications Officer (Claude Scribe)
4. **System audit or compliance concern?** → Create issue in GitHub with `audit` label

