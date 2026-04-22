# Gemini Source-Finding Prompt

**Mission:** Find and surface sources for all "Missing Evidence" and "Inferred" items in Matthew Herbert's timeline.

---

## Your Task

Matthew's case has gaps. I'm giving you a list of unanswered questions / missing sources. Your job is to:

1. **Search** Matthew's Google Drive (`https://drive.google.com/drive/folders/1gcaYvxHoz_anlWEsq0KsLk_7IYYJCAcK`)
2. **Find** any files that answer these questions
3. **Report** what you found (file name, date, relevance, confidence)
4. **Flag** any dead-end items that should be requested from providers

---

## Priority Missing Sources (Search These First)

### Medical Records (2001-2015)
- [ ] Early neurological follow-up notes or school records from 2001 TBI (Kingston, ON)
- [ ] Crohn's disease diagnosis letter / GI documentation (Summer 2002)
- [ ] Pediatric or adolescent gastroenterology records (2002-2013)
- [ ] 2013 colectomy operative note + discharge summary
- [ ] 2015 ostomy establishment / surgical follow-up records

**Search terms:** "TBI", "neurology", "Crohn's", "colectomy", "ileostomy", "2001", "2002", "2013", "2015"

### Administrative Records (Pre-2024)
- [ ] First ODSP application attempt + physician rejection / missing documentation
- [ ] Ontario Works enrollment letter / start date
- [ ] OW correspondence during pre-2024 period

**Search terms:** "ODSP", "Ontario Works", "OW", "application", "rejected", "physician note"

### 2024 Crisis & Emergency (June 2024)
- [ ] Ileoscopy report / procedure notes (June 2024)
- [ ] Cambridge Memorial emergency admission / discharge summary
- [ ] Operative note from June 2024 surgery
- [ ] Pathology report from June 2024 procedure
- [ ] Hospital inpatient records / nursing notes
- [ ] TPN / PICC-line care documentation

**Search terms:** "ileoscopy", "June 2024", "Cambridge Memorial", "emergency", "surgery", "TPN", "PICC", "44-day"

### 2025 Disability Recognition (July-December 2025)
- [ ] ODSP backdate letter / effective July 2025
- [ ] ODSP Notice of Decision (December 3, 2025)
- [ ] MyBenefits records or payment confirmation
- [ ] DSO assessment or correspondence (November 2025 assessment mentioned)
- [ ] Appeal documentation if DSO decision was contested

**Search terms:** "ODSP", "approval", "December 2025", "July 2025", "backdate", "DSO", "Notice of Decision", "MyBenefits"

### 2026 Surgical Revision & Pain Crisis (January 2026)
- [ ] Juravinski Hospital discharge summary (January 20, 2026)
- [ ] Dr. S. Forbes operative note (January 20, 2026 bowel resection)
- [ ] Pathology report from January 2026 surgery
- [ ] Inpatient pain-management notes (January 22, 2026 crisis onward)
- [ ] Nursing charting / care notes from pain management period
- [ ] Follow-up notes / pain clinic assessment (post-January 2026)

**Search terms:** "Juravinski", "January 2026", "Forbes", "bowel", "surgical revision", "pain", "PCA", "analgesia"

---

## What You're Looking For

For each file found, report:

```
FILE FOUND: [File Name]
Location: [Google Drive path]
Date: [Document date]
Type: [Letter | Operative Note | Discharge Summary | Assessment | Other]
Relevance: [Which timeline gap does this fill?]
Confidence: [High | Medium | Low - based on date, specificity, source]
Status: [Confirmed | Draft | Needs Verification]
Example content: [Key excerpt or summary]
```

---

## If You Find Nothing

For each missing gap, report:

```
MISSING: [What was searched]
Search terms used: [list]
Result: [File not found in Drive | Found related but not exact match | Possibly in physical files only]
Recommendation: [Request from Cambridge Memorial | Request from Juravinski | Request from ODSP office | Request from Dr. Forbes office | Other]
```

---

## Output Format

Create a file called `GEMINI_SOURCE_REPORT.md` with structure:

```markdown
# Gemini Source Discovery Report

## Found (High Confidence)
- [File 1]
- [File 2]

## Found (Medium Confidence)
- [File 3]

## Not Found / Request from Provider
- [Missing Item 1] → Request from [Provider]

## Notes
- Any patterns you noticed
- Duplicates or related files
- Recommendations for organization
```

Then update `conversation.json` with your findings.

---

## Success Criteria

- [ ] Searched all priority gaps
- [ ] Found at least 5-10 files (or documented why they don't exist in Drive)
- [ ] Classified each by confidence level
- [ ] Produced GEMINI_SOURCE_REPORT.md
- [ ] Identified which items need external requests
- [ ] Reported status to conversation.json

---

## Access

- **Drive folder:** `https://drive.google.com/drive/folders/1gcaYvxHoz_anlWEsq0KsLk_7IYYJCAcK`
- **Secondary folder (if one exists):** [Check Matthew's Drive for shared folders]
- **Credentials:** Use your Gemini/Gmail access

---

## Timeline to Support

Use this expanded timeline as your search anchor:

**2001 TBI** → Need early neuro records  
**2002 Crohn's** → Need GI diagnosis docs  
**2013 Colectomy** → Need operative note + discharge  
**2015 Ileostomy** → Need ostomy clinic notes  
**June 2024 Collapse** → Need Cambridge Memorial discharge + operative note  
**July 2025 ODSP Backdate** → Need ODSP letter  
**December 2025 ODSP Approval** → Need Notice of Decision  
**January 2026 Surgery** → Need Juravinski discharge + operative note  
**January 2026 Pain Crisis** → Need pain management notes  

---

## Report Back

When done:
1. Commit GEMINI_SOURCE_REPORT.md to repo
2. Update conversation.json with session summary
3. Flag any items that need manual follow-up (provider requests, paper files, etc.)

This becomes the **source registry** for all future Libby output.
