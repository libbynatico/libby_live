# Raw Dump — Ingestion Queue
# Location: raw_dump/
# Purpose: Staging area for unprocessed files before structured ingest into data/mattherbert01/

## Status: Active

---

## SOURCE FILES (Drive-Identified by Gemini)

### CRITICAL PRIORITY — Litigation Core

```yaml
SOURCE: CMH_MED_RECORD.pdf
  PAGES: 1,293
  STATUS: Needs slicing / OCR extraction
  PRIORITY: CRITICAL
  KEY_EXTRACTS:
    - Nursing Flowsheets (weight charts June 26–Aug 8, 2025)
    - Medication Administration Record (MAR) — July 9, 2025 codeine
    - Clinical Note July 22, 2025: "Symptoms likely functional/psychosomatic" (SMOKING GUN)
    - Discharge summary Aug 8, 2025
  TARGET_FOLDER: evidence/cmh-2025/
  LINKED_EVIDENCE_CARDS: EV_001, EV_002, EV_003, EV_004
```

```yaml
SOURCE: 2026-03-19_MED-CMH_RECD_MASTER EVIDENCE INDEX Herbert v CMH.pdf
  STATUS: In Drive — import confirmed
  PRIORITY: CRITICAL
  CONTENTS: Master evidence index mapping 18 files + email threads; Dr. Green refusal of service; Cora incident log
  TARGET_FOLDER: legal/cmh_litigation/
```

```yaml
SOURCE: 0000-00-00_UNC_2026-03-18_CMH_PERSONAL_INJURY_DAMAGES_CONSULTATION.pdf
  STATUS: In Drive — import confirmed
  PRIORITY: CRITICAL
  CONTENTS: 
    - Damages range: $285,000–$995,000
    - Thin Skull Doctrine application
    - Legal strategy briefing for lawyer
  TARGET_FOLDER: legal/cmh_litigation/
```

```yaml
SOURCE: 0000-00-00_UNC_Medical_Negligence_Master_Introduction_Letter.pdf
  STATUS: In Drive
  PRIORITY: HIGH
  CONTENTS: Most legally comprehensive summary of CMH events; coerced medication trial; improper catheter removal details
  TARGET_FOLDER: legal/cmh_litigation/
```

```yaml
SOURCE: 0000-00-00_UNC_DocC_LawyerIntake_Herbert.pdf
  STATUS: In Drive
  PRIORITY: HIGH
  CONTENTS: Lawyer intake summary; 29% weight loss; CMH and HHS wound care + post-surgical staple failure
  TARGET_FOLDER: legal/cmh_litigation/
```

### HIGH PRIORITY — Complaints and Patient Experience

```yaml
SOURCE: Bbb complaint CMH.pdf
  STATUS: In Drive
  PRIORITY: HIGH
  CONTENTS: Draft complaint Issues 1–4; ostomy supply failure; "no fixed address" false claim documentation
  TARGET_FOLDER: complaints/
```

```yaml
SOURCE: MISC_Re- Follow up patient care & concerns.pdf
  STATUS: In Drive
  PRIORITY: HIGH
  CONTENTS: Direct email to Steph Rauscher (CMH Patient Relations); contemporaneous 10/10 pain documentation; Imodium trial concerns
  TARGET_FOLDER: complaints/patient_relations/
```

### HIGH PRIORITY — Accessibility and AODA

```yaml
SOURCE: CLINICAL CONTEXT AND CARE PLANNING PACKET-11_20260331051627.pdf
  STATUS: In Drive
  PRIORITY: HIGH
  CONTENTS: AODA Accommodation Statement (2026); written reinforcement requirement; segmented communication requirement; TBI-related cognitive deficits
  TARGET_FOLDER: evidence/accessibility/
```

```yaml
SOURCE: M. Herbert-Beamish.records_20260331051627
  STATUS: In Drive
  PRIORITY: HIGH
  CONTENTS: AODA Statement; home care denial (no fixed address); admin negligence evidence; clinical context packet
  TARGET_FOLDER: evidence/accessibility/
```

---

## GMAIL CORRESPONDENCE (To be extracted)

```yaml
SOURCE: GMAIL_CORRESPONDENCE
  STATUS: Not yet connected — mattherbert01@gmail.com not linked
  PRIORITY: HIGH
  KEY_ITEMS:
    - 32 failed ODSP call attempts log (July–December 2025)
    - Patient Relations emails (Steph Rauscher, Ellen Richards)
    - CMH discharge planning correspondence
    - ODSP caseworker correspondence (Sarah)
  TARGET_FOLDER: correspondence/
  BLOCKER: Gmail connector not active — resolve to unlock this stream
```

---

## WITNESS MATERIALS

```yaml
SOURCE: Cora_Witness_Statement
  STATUS: Referenced in Drive records — formal PDF needed
  PRIORITY: HIGH
  CONTENTS: August 2, 2025 — wrong medication administered (another patient's drops)
  TARGET_FOLDER: evidence/witness_logs/
  ACTION: Obtain formal signed statement from Cora
```

---

## PHYSICAL FILES (Not yet digitized)

```yaml
SOURCE: TBI_2001_RECORDS (Physical copies)
  STATUS: Physical — location possibly Hotel Dieu or stored locally
  PRIORITY: CRITICAL
  ACTION: Scan to PDF; name as TBI_RECORDS_2001_[FACILITY].pdf
  TARGET_FOLDER: evidence/medical_history/
```

---

## PROCESSING QUEUE

| File | Status | Assigned To | Due |
|------|--------|-------------|-----|
| CMH_MED_RECORD.pdf (1,293 pp) | Needs OCR/slicing | Gemini/Claude | Next pass |
| Master Evidence Index | Ready to import | Claude | This session |
| Damages Consultation | Ready to import | Claude | This session |
| Lawyer Intake | Ready to import | Claude | This session |
| BBB Complaint | Ready to import | Claude | This session |
| AODA Packet (records_20260331051627) | Ready to import | Claude | This session |
| Gmail correspondence | Blocked | TBD | Requires connector |
| Cora statement | Pending | Matthew | ASAP |
| TBI 2001 physical | Pending | Matthew | ASAP |

---

## Processing Notes

1. CMH_MED_RECORD.pdf should be processed in sections: (a) Weight charts, (b) MAR, (c) July 22 psychosomatic note, (d) Discharge summary
2. All Drive files should be confirmed via filename search — some may be in sub-folders not yet scanned
3. Once Gmail is connected, auto-ingest all CMH/ODSP/DSO correspondence threads
4. Physical TBI records should be priority-scanned when available
