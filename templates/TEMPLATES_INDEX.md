# Template Library — Matthew Herbert / NATICO Libby Live
# Last updated: 2026-04-22
# Purpose: Reusable templates for recurring correspondence and presentations

---

## PRINTABLE PRESENTATIONS (HTML — print or show on iPad)

| File | Purpose | Format | Print Notes |
|------|---------|--------|-------------|
| `presentations/AODA_accommodation_card.html` | Hand out everywhere — AODA accommodation request | Double-sided letter | Print double-sided, laminate for carry |
| `presentations/ODSP_nonverbal_brief.html` | Show at ODSP meetings instead of speaking | Single letter page | Print OR show on iPad |

**HOW TO PRINT:**
1. Open HTML file in Chrome or Safari
2. File → Print
3. Select "Letter" size
4. For AODA card: select "Two-sided" / "Duplex" printing
5. For ODSP brief: single-sided

---

## LETTER TEMPLATES (Markdown — copy into email or word processor)

| File | Use For | Key Contacts |
|------|---------|-------------|
| `letters/TEMPLATE_medical_records_request.md` | Any hospital/clinic records request | Privacy Officer / Medical Records dept |
| `letters/TEMPLATE_ODSP_correspondence.md` | All ODSP communication (general, backdate appeal, document request) | Sarah (caseworker), Gaylord Albrecht |
| `letters/TEMPLATE_hospital_complaint_escalation.md` | CMH/hospital complaints, Ombudsman referral | Steph Rauscher, Ellen Richards (CMH PR) |
| `letters/TEMPLATE_DSO_correspondence.md` | DSO eligibility appeal, third-party support documentation | Lisa Sedore, DSO Regional Office |
| `letters/TEMPLATE_general_accommodation_request.md` | Any organization — AODA accommodation (long or short form) | Any recipient |

---

## ALREADY CREATED (Ready to Send)

| File | Status | Action |
|------|--------|--------|
| `../raw_dump/foi_requests/FOI_CMH_2025_INPATIENT_RECORDS.md` | Ready — fill in DOB/OHIP/phone | Send to CMH Medical Records NOW |

---

## QUICK-USE REFERENCE

### Most Common Letters (Priority Order)

**1. Medical Records — use `TEMPLATE_medical_records_request.md`**
- CMH 2025 records (FOI ready in raw_dump)
- Juravinski Jan 2026 records
- Hotel Dieu / McMaster Children's (2001 TBI)
- Guelph General / Groves Memorial (FOI drafts already in Drive)

**2. ODSP Backdate — use `TEMPLATE_ODSP_correspondence.md` (Template B)**
- Caseworker: Sarah
- Sheri Roberts (ILWR) — copy on v3 letters

**3. Ombudsman — use `TEMPLATE_hospital_complaint_escalation.md` (Template B)**
- Ontario Patient Ombudsman: info@patientombudsman.ca
- Attach: CMH Patient Relations prior correspondence

**4. AODA — hand `presentations/AODA_accommodation_card.html` (printed)**
- Give this at every intake, appointment, and meeting
- Keep 5–10 printed copies in bag at all times

**5. ODSP Meeting — show `presentations/ODSP_nonverbal_brief.html`**
- Open on iPad / phone when entering meeting
- Or print single-sided and hand to caseworker

---

## RECORD KEEPING

After every letter sent, log it in the correspondence ledger:

```csv
date,to,template_used,subject,method_sent,tracking_number,response_due,response_received
```

Example:
```
2026-04-22, CMH Medical Records, FOI_CMH, "Complete inpatient records June-Aug 2025", Registered mail, [tracking#], 2026-05-22, —
```

---

## ADVOCACY-GRADE PHRASES (Copy-Paste)

**For TBI:**
> "While 2001 imaging was unremarkable for structural damage, the clinical presentation of post-concussive sequelae — specifically photophobia, auditory processing deficits, and memory disruption — has been persistent and disabling since the developmental period (age 12)."

**For ODSP Backdate:**
> "Per ODSP Directive 2.1, the effective date of eligibility should align with the completed financial and medical application submission (July 2025), regardless of the delay in adjudication processing."

**For Administrative Barriers:**
> "32 documented call attempts across 22 occasions constitute an administrative barrier within the meaning of the Ontario Human Rights Code Duty to Accommodate."

**For CMH Weight Loss:**
> "A 29% body weight loss under continuous hospital supervision (June 26–August 8, 2025) without clinical intervention constitutes prima facie evidence of failure of the standard of care for post-operative nutritional monitoring."

**For CMH Diagnostic Gap:**
> "CMH attributed patient symptoms to 'functional/psychosomatic' causes (July 22, 2025). Juravinski Hospital subsequently confirmed structural kinked bowel and hernia (January 20, 2026) — a mechanical obstruction that was present during the 43-day CMH admission and was identifiable by imaging."

**For Unsafe Discharge:**
> "On August 8, 2025, the patient was discharged in a medically unstable state over a formal written discharge objection. Home care was denied based on a documented false claim of 'no fixed address,' in violation of the Excellent Care for All Act, 2010."

**For DSO Developmental Period:**
> "Eligibility is established via Developmental Period Onset (TBI: age 12, 2001; Crohn's: age 13, 2002). The persistent adaptive impairments documented in school records (A-1 to A-54) and the Sedore assessment (Nov 2025) confirm the disability originated before age 18 and continues to the present."
