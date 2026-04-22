# Multi-Patient Isolation & Shared Reference System

**Problem:** Multiple patients (mattherbert01, kellsie, others) need isolated data BUT may share overlapping experiences/evidence.

**Solution:** File metadata headers + permission model + shared reference layer.

---

## File Metadata Standard

Every patient MD file starts with:

```markdown
---
userID: mattherbert01
fileType: timeline | patient_truths | system_experiences | profile | custom
visibility: private | shared_with_[userID] | shared_with_[userID,userID]
owner: mattherbert01
lastModified: 2026-04-22
version: 1.0
---

# Actual Content Below
```

**Examples:**

```markdown
---
userID: mattherbert01
fileType: timeline
visibility: private
owner: mattherbert01
lastModified: 2026-04-22
version: 1.0
---
# Patient Chronological Timeline...

---
userID: kellsie
fileType: patient_truths
visibility: shared_with_mattherbert01
owner: kellsie
lastModified: 2026-04-22
version: 1.0
---
# Patient Truths (Kellsie)...

---
userID: shared_reference
fileType: provider_registry
visibility: shared_with_mattherbert01,kellsie
owner: system
lastModified: 2026-04-22
version: 1.0
---
# Shared Provider Registry...
```

---

## Directory Structure (Multi-Patient)

```
/data
├─ mattherbert01/
│  ├─ timeline.md (private)
│  ├─ patient_truths.md (private)
│  ├─ system_experiences.md (private)
│  ├─ profile.md (private)
│  ├─ ledgers/
│  │  ├─ correspondence.csv (userID: mattherbert01)
│  │  ├─ contacts_master.csv (userID: mattherbert01)
│  │  ├─ appointments_transportation.csv (userID: mattherbert01)
│  │  └─ evidence.csv (userID: mattherbert01)
│  └─ transcripts/ (real-time audio ingestion)
│
├─ kellsie/
│  ├─ timeline.md (shared_with_mattherbert01)
│  ├─ patient_truths.md (shared_with_mattherbert01)
│  ├─ system_experiences.md (shared_with_mattherbert01)
│  ├─ profile.md (private)
│  ├─ ledgers/
│  │  └─ [same structure]
│  └─ transcripts/
│
├─ _shared/
│  ├─ provider_registry.md (visible to: mattherbert01, kellsie)
│  ├─ dso_assessment_shared_context.md (visible to: mattherbert01, kellsie)
│  ├─ overlapping_experiences.md (visible to: mattherbert01, kellsie)
│  └─ mutual_evidence/
│     └─ shared_provider_docs.csv
│
└─ _system/
   ├─ user_permissions.json
   └─ file_access_log.json
```

---

## Permission Model

### File Ownership
- **Owner** = can read, write, modify permissions, delete
- **Shared viewers** = can read only (unless explicitly granted write)
- **Others** = no access (ERROR if attempted)

### Shared Reference Documents

When mattherbert01 and kellsie have **overlapping experiences**:

**Option 1: Mutual Documentation (One entry, both see it)**
- Store in `/data/_shared/`
- Both listed in `visibility` field
- Example: Both have DSO assessments → store once in shared folder
- Either user can update (with note of who updated)
- Both prompted: "Kellsie added to this entry"

**Option 2: Cross-Reference (Each has own entry, links to other)**
- mattherbert01's timeline → references kellsie's evidence (with permission)
- kellsie's timeline → references mattherbert01's evidence (with permission)
- Links use: `[mattherbert01#DSO_Assessment](../../mattherbert01/ledgers/evidence.csv#row_42)`
- Retrieval system: "You can see kellsie's assessment because she shared it with you"

---

## Backend Guardrails (JavaScript/Node)

### Read Function (Prevent Data Leakage)

```javascript
// Load timeline for currentUser
function loadPatientData(userID, currentUser) {
  const filePath = `data/${userID}/timeline.md`;
  const metadata = readMetadata(filePath);
  
  // Check permission
  if (userID === currentUser) {
    // Own data - full access
    return readFile(filePath);
  }
  
  if (metadata.visibility.includes(`shared_with_${currentUser}`)) {
    // Explicitly shared - allow
    return readFile(filePath);
  }
  
  // Access denied
  throw new Error(`Access denied: ${userID}'s data not shared with you`);
}
```

### Write Function (Only Owner Can Modify)

```javascript
function updatePatientData(userID, filePath, newContent, currentUser) {
  const metadata = readMetadata(filePath);
  
  if (metadata.owner !== currentUser) {
    throw new Error(`Only ${metadata.owner} can edit this file`);
  }
  
  // Owner can modify
  writeFile(filePath, newContent);
  logAccess(userID, filePath, 'write', currentUser);
}
```

### Shared Update (Both Can Prompt)

```javascript
function promptSharedDataUpdate(sharedFilePath, currentUser, change) {
  const metadata = readMetadata(sharedFilePath);
  
  // Both users in visibility can trigger update
  if (!metadata.visibility.includes(`shared_with_${currentUser}`)) {
    throw new Error(`You don't have access to this shared file`);
  }
  
  // Propose change (goes to notification for all viewers)
  const proposal = {
    proposedBy: currentUser,
    change: change,
    timestamp: new Date().toISOString(),
    status: 'pending_approval'
  };
  
  // Notify all viewers
  notifyViewers(metadata.visibility, proposal);
}
```

### Audit Log

```json
{
  "timestamp": "2026-04-22T21:45:00Z",
  "userID": "mattherbert01",
  "filePath": "data/kellsie/timeline.md",
  "action": "read",
  "currentUser": "mattherbert01",
  "status": "allowed (shared_with_mattherbert01)",
  "notes": "Retrieved for briefing"
}
```

---

## CSV Tagging (Ledgers)

Each row in correspondence.csv, evidence.csv, etc. includes:

```csv
id,userID,date,type,content,confidence,source,shared_with,last_modified
1,mattherbert01,2026-04-20,email,DSO assessment appointment,confirmed,dso_letter.pdf,,2026-04-20
2,mattherbert01,2026-04-21,note,Pain management disrupted,confirmed,hospital_note.pdf,,2026-04-21
3,kellsie,2026-04-20,email,DSO assessment appointment,confirmed,dso_letter.pdf,mattherbert01,2026-04-20
4,kellsie,2026-04-19,note,Similar GI complexity,inferred,personal_note.md,mattherbert01,2026-04-19
```

**Logic:**
- `userID` = owner of this record
- `shared_with` = comma-separated list of other users who can see this
- Retrieval: "Filter by userID=current_user OR (userID=other AND shared_with contains current_user)"

---

## Shared Reference Examples

### Scenario 1: Both Have DSO Assessments (Overlapping)

**File: `/data/_shared/dso_assessment_shared_context.md`**

```markdown
---
userID: shared_reference
fileType: shared_context
visibility: shared_with_mattherbert01,kellsie
owner: system
lastModified: 2026-04-22
version: 1.0
---

# DSO Assessment Shared Context

Both mattherbert01 and kellsie have undergone DSO assessments.

## Shared observations
- Both assessments involved procedural barriers / incomplete documentation
- Both cases involve cognitive disability + complex medical history
- Both require structured presentation to effectively communicate needs

## Individual entries
- [mattherbert01 DSO Assessment](../../mattherbert01/ledgers/evidence.csv#dso_nov_2025)
- [kellsie DSO Assessment](../../kellsie/ledgers/evidence.csv#dso_march_2026)

## Cross-references (both can see)
- Similar patterns in assessment failure
- Both may benefit from joint advocacy strategy
- Shared provider contact: [Dr. Lisa Sedore](provider_registry.md#dso_assessor)

**Last updated by:** mattherbert01 (2026-04-22)  
**Next review:** kellsie or mattherbert01 can update
```

### Scenario 2: Mutual Evidence

**File: `/data/_shared/mutual_evidence/provider_contacts.csv`**

```csv
providerID,name,role,organization,mattherbert01_contact,kellsie_contact,shared_notes,lastUpdated
p1,Dr. Lisa Sedore,DSO Assessor,Government Office,yes,yes,"Both assessed by; note: procedural barriers in both cases",2026-04-22
p2,DSO Appeals Unit,Government,Government Office,yes,yes,"Same office for both appeals",2026-04-22
```

Both users see this. Either can update (with audit trail showing who).

---

## Permission Matrix

| User | Can Read Own? | Can Read Shared? | Can Write Own? | Can Write Shared? | Can Grant Share? |
|------|---------------|------------------|----------------|-------------------|------------------|
| mattherbert01 | ✅ Yes | ✅ If shared | ✅ Yes | ✅ Yes (with other owner) | ✅ Yes |
| kellsie | ✅ Yes | ✅ If shared | ✅ Yes | ✅ Yes (with other owner) | ✅ Yes |
| Other user | ❌ No | ❌ Unless shared | ❌ No | ❌ No | ❌ No |

---

## Implementation Checklist

- [ ] Add metadata header to all patient MD files
- [ ] Create `/data/_shared/` directory for mutual docs
- [ ] Create `/data/_system/user_permissions.json`
- [ ] Implement `readPatientData()` with permission check
- [ ] Implement `updatePatientData()` with ownership check
- [ ] Implement `promptSharedDataUpdate()` with notification
- [ ] Add `userID` + `shared_with` to all CSV ledgers
- [ ] Create audit log in `/data/_system/file_access_log.json`
- [ ] Add access check to all API endpoints (`/api/chat`, `/api/ingest-transcript`, etc)
- [ ] Create user_permissions.json with mutual grants
- [ ] Test: mattherbert01 tries to read kellsie's private data (should error)
- [ ] Test: kellsie reads mattherbert01's shared data (should succeed)
- [ ] Test: Either user updates shared reference doc (both notified)

---

## user_permissions.json Template

```json
{
  "mattherbert01": {
    "owns": ["mattherbert01"],
    "canRead": ["mattherbert01", "_shared"],
    "canWrite": ["mattherbert01"],
    "mutualWith": ["kellsie"],
    "lastModified": "2026-04-22"
  },
  "kellsie": {
    "owns": ["kellsie"],
    "canRead": ["kellsie", "_shared"],
    "canWrite": ["kellsie"],
    "mutualWith": ["mattherbert01"],
    "lastModified": "2026-04-22"
  },
  "_shared": {
    "visibleTo": ["mattherbert01", "kellsie"],
    "editableBy": ["mattherbert01", "kellsie"],
    "topics": ["dso_assessments", "provider_contacts", "overlapping_experiences"]
  }
}
```

---

## In Practice (User Experience)

**Scenario: mattherbert01 shares DSO assessment with kellsie**

1. mattherbert01 views their DSO assessment
2. Sees "Share with..." button
3. Selects kellsie
4. System updates:
   - Metadata: `visibility: private` → `visibility: shared_with_kellsie`
   - Audit log: "mattherbert01 shared with kellsie"
   - kellsie gets notification: "mattherbert01 shared DSO assessment with you"
5. kellsie can now read mattherbert01's assessment
6. If kellsie has similar assessment, can link in shared reference
7. Either can update shared reference → both notified

**No confusion. No accidental cross-patient leakage. Clear audit trail.**

---

## Safety Rules

1. **Default deny** — If not explicitly owned or shared, access denied
2. **Owner only for write** — Can't modify another patient's private data
3. **Audit everything** — Every read/write logged with timestamp + actor
4. **Tag at creation** — Every file/row created with `userID` tag
5. **Shared docs centralized** — All multi-patient data in `/_shared/`
6. **Notification required** — When permissions change, notify affected users

---

This architecture lets you:
- ✅ Keep mattherbert01 and kellsie data separate by default
- ✅ Share overlapping experiences without duplication
- ✅ Have mutual prompting (either can update shared docs)
- ✅ Prevent accidental cross-patient data leakage
- ✅ Maintain audit trail for compliance
- ✅ Scale to 10+ patients cleanly
