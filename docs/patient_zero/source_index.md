---
userID: mattherbert01
fileType: source_index
visibility: public_doc
owner: system
lastModified: 2026-04-22
version: 2.0
gemini_searched: true
gemini_search_date: 2026-04-22
---

# Source Index — mattherbert01

> Tracks all known sources: found, missing, and pending retrieval.  
> Updated from Gemini Drive discovery (April 22, 2026).

---

## Drive Sources Found (Gemini Discovery — April 22, 2026)

| ID | Filename | Date | Type | Confidence | Status |
|----|----------|------|------|------------|--------|
| SRC_001 | Agent_workflows | 2026-03-22 | Timeline / Workflow | HIGH | Confirmed Match |
| SRC_002 | MISC_DSO_Developmental_Services | 2025-12-10 | Assessment / Index | HIGH | Confirmed Match |
| SRC_003 | Herbert_Appeal_Letter_v2 | 2026-03-12 | Letter / Appeal | HIGH | Confirmed Match |
| SRC_004 | Report_cards_v1.0.pdf | Unknown | School Records | HIGH | Referenced (sub-folder) |
| SRC_005 | Report_cards_v1.1.pdf | Unknown | School Records | HIGH | Referenced (sub-folder) |
| SRC_006 | Report_cards_v1.2.pdf | Unknown | School Records | HIGH | Referenced (sub-folder) |
| SRC_007 | CT Enterography report | 2024-10-23 | Diagnostic Report | HIGH | Referenced (sub-folder) |
| SRC_008 | DSO_BINDER_SUPPORTING_DOCS.pdf | 2025-12-10 | DSO Evidence Binder | HIGH | Referenced — not found as standalone |
| SRC_009 | Patient_Truth_TBI_2001.md | 2026-03-22 | Advocacy Document | HIGH | Gemini-generated |
| SRC_010 | Medical_Chronology_2002_2026.md | 2026-03-22 | Advocacy Document | HIGH | Gemini-generated |
| SRC_011 | Advocacy_Brief_Systemic_Failures.md | 2026-03-22 | Advocacy Document | HIGH | Gemini-generated |

**Drive folder:** https://drive.google.com/drive/folders/1gcaYvxHoz_anlWEsq0KsLk_7IYYJCAcK

---

## Sources Missing — FOI / Direct Request Required

### Medical Records

| Missing ID | What | From | Priority |
|------------|------|------|----------|
| MISS_001 | TBI clinical records — 2001, age 12 | Hotel Dieu / McMaster Children's Hospital (2001–2008) / Guelph General (2001–present) / Kingston General | CRITICAL |
| MISS_002 | Crohn's Disease diagnosis — Summer 2002 | Diagnosing gastroenterologist's office | CRITICAL |
| MISS_003 | Colectomy operative note — 2013 | Hospital medical records dept (performing hospital) | CRITICAL |
| MISS_004 | Ileostomy operative/follow-up notes — 2015 | Hospital medical records dept | HIGH |
| MISS_005 | CMH discharge summary — June/July 2024 (first stay) | Cambridge Memorial Hospital | CRITICAL |
| MISS_006 | CMH operative note — June/July 2024 emergency surgery | Cambridge Memorial Hospital | CRITICAL |
| MISS_007 | CMH complete inpatient chart — June 26–Aug 8, 2025 | Cambridge Memorial Hospital (FOI) | CRITICAL |
| MISS_008 | CMH Medication Administration Records — 2025 | Cambridge Memorial Hospital (FOI) | CRITICAL |
| MISS_009 | CMH weight/vital sign charts — 2025 | Cambridge Memorial Hospital (FOI) | CRITICAL |
| MISS_010 | CMH incident report (Aug 2 wrong medication) | Cambridge Memorial Hospital (FOI) | HIGH |
| MISS_011 | Juravinski operative note — Jan 20, 2026 | Juravinski Hospital / Hamilton Health Sciences | CRITICAL |
| MISS_012 | Juravinski discharge summary — Jan 2026 | Juravinski Hospital / Hamilton Health Sciences | HIGH |
| MISS_013 | Pain management notes / PCA records — Jan 22, 2026 | Juravinski Hospital / Hamilton Health Sciences | HIGH |

### Administrative Records

| Missing ID | What | From | Priority |
|------------|------|------|----------|
| MISS_014 | ODSP Notice of Decision — December 3, 2025 | ODSP office (Caseworker: Sarah) | CRITICAL |
| MISS_015 | ODSP backdate letter / July 2025 effective date documentation | ODSP office (Caseworker: Sarah) | CRITICAL |
| MISS_016 | Gaylord Albrecht's ODSP refusal letter (pre-2024) | ODSP office | HIGH |
| MISS_017 | Ontario Works start letter and file notes | OW office | MEDIUM |
| MISS_018 | DSO_BINDER_SUPPORTING_DOCS.pdf (standalone) | Search Drive sub-folders OR request DSO | HIGH |
| MISS_019 | Lisa Sedore full psychological assessment (Nov 14, 2025) | Lisa Sedore's office / DSO | HIGH |

### Legal / Claims Records

| Missing ID | What | From | Priority |
|------------|------|------|----------|
| MISS_020 | Cora witness statement (Aug 2, 2025 medication error) | Cora (directly) | HIGH |
| MISS_021 | CMH Patient Relations correspondence (Rauscher/Richards) | Matthew's records | MEDIUM |
| MISS_022 | Statement of Claim (Dec 5, 2025) — final signed version | Matthew's files / lawyer | HIGH |

---

## FOI Targets (Priority Order)

1. **Cambridge Memorial Hospital (CMH)** — complete 2025 inpatient chart, MAR, weight charts, incident reports, discharge docs
2. **Juravinski Hospital / Hamilton Health Sciences** — Jan 2026 operative note, discharge summary, pain management records
3. **Hotel Dieu** — 2001 TBI records
4. **McMaster Children's Hospital** — 2001–2008 records
5. **Guelph General Hospital** — 2001–present records (FOI draft reportedly in Drive)
6. **Groves Memorial Hospital** — 2001–present records (FOI draft reportedly in Drive)
7. **ODSP Office** — Notice of Decision, backdate documentation, Albrecht refusal letter

---

## Gemini Search Completion Status

| Priority Area | Searched | Files Found | Files Missing |
|---------------|----------|-------------|---------------|
| 2001-2015 Medical Records | ✅ | Referenced in binder only | Primary source PDFs missing |
| Pre-2024 Administrative | ✅ | Appeal letter found | ODSP refusal letter missing |
| 2024 Crisis Documents | ✅ | Referenced in timeline | CMH records missing |
| 2025 Recognition Documents | ✅ | DSO binder found | ODSP Notice of Decision missing |
| 2026 Surgery Documents | ✅ | Referenced in timeline | Juravinski operative notes missing |

**Pattern observed by Gemini:** Drive is highly organized in terms of summaries and advocacy indices, but raw medical evidence (operative notes, discharge summaries, official decision letters as standalone PDFs) appears to be stored in sub-folders or was never uploaded to the main folder. Drive needs subfolder deep-scan.

---

## Import Instructions (When Files Are Retrieved)

**For files added to Drive:**
1. Run Gemini search again against the specific file
2. Report using the standard format in `GEMINI_PROMPT_READY_TO_SEND.txt`
3. POST to `/api/import-sources` or manually add to this index

**For physical files scanned:**
1. Scan to PDF
2. Name using convention: `[TYPE]_[DATE]_[DESCRIPTION].pdf` (e.g., `OP_NOTE_2013_COLECTOMY.pdf`)
3. Upload to Drive folder
4. Run Gemini search pass

**Naming convention for new evidence files:**
```
OP_NOTE_2013_COLECTOMY.pdf
DISCHARGE_CMH_2025_AUG.pdf
ODSP_NOD_2025_DEC03.pdf
DSO_SEDORE_ASSESSMENT_2025_NOV.pdf
TBI_RECORDS_2001_HOTEL_DIEU.pdf
```
