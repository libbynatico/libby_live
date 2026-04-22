# Setting Up Local Patient Zero Data

This guide explains how to set up the `data/` directory locally (which is NOT committed to git for privacy reasons).

## Why Data is Local-Only

- `data/` directory is in `.gitignore` for security
- Sensitive patient information should never be in a public repository
- Each installation can have different patient cases
- Netlify environment variables can point to a secure private data directory

## Directory Structure

```
data/
├── mattherbert01/                    # Patient user ID
│   ├── profile.md                    # Demographics, diagnoses, situation
│   ├── timeline.md                   # Historical events chronology
│   ├── evidence_ledger.csv           # Medical documents inventory
│   ├── transcripts/                  # Voice recordings (optional)
│   │   ├── calls/                    # Call transcripts
│   │   └── transcript_YYYY-MM-DD_*.md
│   ├── ledgers/                      # Operational records
│   │   ├── correspondence.csv        # Emails, letters, communications
│   │   ├── contacts_master.csv       # Provider/contact registry
│   │   └── appointments_transportation.csv  # Scheduled visits
│   ├── evidence/                     # Supporting documents (optional)
│   └── drafts/                       # Draft communications (optional)
└── [other-patient-id]/
```

## How to Create Patient Data

### Step 1: Create Directory Structure

```bash
cd /home/user/libby_live
mkdir -p data/[patient-id]/ledgers data/[patient-id]/transcripts
```

Replace `[patient-id]` with the patient's username (e.g., `mattherbert01`)

### Step 2: Create Core Files

#### 2a. Profile (`data/[patient-id]/profile.md`)
Use the template at `docs/patient_zero/templates/profile_template.md`:
- Patient demographics
- Diagnoses and medications
- Social determinants (employment, housing, income)
- Current priorities
- Key dates and deadlines

**Example**:
```markdown
# Patient Zero Profile - John Smith

## Core Information
- **Name**: John Smith
- **Age**: 45
- **Location**: Ontario, Canada
- **Status**: Active case management
- **Updated**: 2026-04-22

## Diagnoses & Health Status
### Confirmed Diagnoses
- **Type 2 Diabetes** (2010, diagnosed age 40)
  - Current status: Stable with medication
  - Treatment: Metformin 2000mg daily
```

#### 2b. Timeline (`data/[patient-id]/timeline.md`)
Create a chronological record of key events:
- Initial diagnosis date
- Major life transitions
- System interactions
- Recent developments
- Upcoming deadlines

**Example**:
```markdown
# Timeline for John Smith

## 2010 - Initial Diagnosis
- **Date**: June 2010
- **Age**: 40
- **Event**: Type 2 Diabetes diagnosed
- **Impact**: Started medication management

## 2026-04 - Current Status
- **Date**: April 22, 2026
- **Event**: A1C levels stable at 6.8
- **Next**: Retinal exam scheduled May 15
```

#### 2c. Evidence Ledger (`data/[patient-id]/evidence_ledger.csv`)
CSV tracking all supporting documents:

| Column | Meaning |
|--------|---------|
| `date` | Document date (YYYY-MM-DD) |
| `document_type` | medical_record, legal_document, correspondence, etc. |
| `title` | Document title |
| `source` | Provider/organization name |
| `confidence_level` | confirmed, draft, inferred, or needs_review |
| `agent_domain` | Which agent system domain (e.g., "Agent-32-Income") |
| `summary` | Brief description of contents |
| `action_required` | What needs to happen next |

**Example**:
```csv
date,document_type,title,source,confidence_level,agent_domain,summary,action_required
2026-04-15,medical_record,A1C Lab Results,Dr. Chen MD,confirmed,Agent-40-Medical-Management,A1C 6.8 - stable,Review at May appointment
2026-03-20,letter,ODSP Approval Notice,Ontario Ministry,confirmed,Agent-10-Income-Support,ODSP approved $1200/month,Update income records
```

### Step 3: Create Ledgers (in `data/[patient-id]/ledgers/`)

#### 3a. Correspondence Ledger (`correspondence.csv`)
Track all communications:

| Column | Meaning |
|--------|---------|
| `date` | Communication date |
| `document_type` | email, letter, phone_call, etc. |
| `from` | Sender |
| `to` | Recipient |
| `subject` | Email subject or letter title |
| `status` | received, sent, pending, etc. |
| `summary` | What the communication was about |

**Example**:
```csv
date,document_type,from,to,subject,status,summary
2026-04-15,email,Dr. Chen,John Smith,Lab Results Available,received,A1C results show good control
2026-04-10,letter,Landlord,John Smith,Lease Renewal,received,Asking for income proof for renewal
```

#### 3b. Contacts Master (`contacts_master.csv`)
Central registry of all important people:

| Column | Meaning |
|--------|---------|
| `name` | Full name |
| `title` | Job title/role |
| `organization` | Organization/company |
| `specialty` | Area of expertise |
| `contact_method` | How to reach (email, phone, etc.) |
| `phone` | Phone number |
| `email` | Email address |
| `last_contact` | When last contacted |
| `relationship_status` | primary_provider, specialist, landlord, case_coordinator, etc. |
| `notes` | Additional context |

**Example**:
```csv
name,title,organization,specialty,contact_method,phone,email,last_contact,relationship_status,notes
Dr. Sarah Chen,Endocrinologist,Mount Sinai Hospital,Diabetes Management,email/phone,416-555-0142,s.chen@mountsinai.ca,2026-04-15,primary_provider,Responsive; manages diabetes care
John's Landlord,Property Manager,Heritage Housing,Housing,phone,416-555-0300,landlord@heritage.ca,2026-04-10,landlord,Lease renewal in August
```

#### 3c. Appointments & Transportation (`appointments_transportation.csv`)
Scheduled medical visits:

| Column | Meaning |
|--------|---------|
| `date` | Appointment date (YYYY-MM-DD) |
| `appointment_type` | Type of visit (follow-up, lab work, etc.) |
| `provider_name` | Doctor/specialist name |
| `location` | Clinic or hospital name |
| `city` | City |
| `phone` | Contact number |
| `notes` | Appointment details |
| `transport_mode` | How patient will get there |
| `estimated_distance_km` | Distance to travel |
| `confirmation_status` | confirmed, pending, cancelled |
| `accessibility_notes` | Wheelchair access, parking, etc. |

**Example**:
```csv
date,appointment_type,provider_name,location,city,phone,notes,transport_mode,estimated_distance_km,confirmation_status,accessibility_notes
2026-05-15,Diabetes Specialist Follow-up,Dr. Sarah Chen,Mount Sinai Hospital,Toronto,416-555-0142,Discuss A1C results and medication,Medical Transport,8.5,confirmed,Wheelchair accessible
2026-05-20,Eye Exam,Dr. James Wong,Toronto Retinal Clinic,Toronto,416-555-0200,Annual diabetic retinal screening,TTC Streetcar,12.0,pending,Accessible building
```

### Step 4: Optional - Add Transcripts

Voice transcripts go in `data/[patient-id]/transcripts/` in markdown format:

```markdown
# Transcript — April 22, 2026, 2:15 PM

**Location**: Downtown, Toronto
**Attendees**: John Smith, Dr. Chen, Nurse Lisa

---

**Dr. Chen**: How are your glucose levels at home?

**John**: Pretty steady, mostly in the 120-140 range.

**Dr. Chen**: That's good. Let's look at the A1C results...
```

### Step 5: Test Locally

```bash
# Start the local server with your data
DATA_ROOT=/home/user/libby_live/data node libby-local-server.js

# Test chat endpoint
curl -s http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "[patient-id]",
    "messages": [{"role": "user", "content": "What are my upcoming appointments?"}]
  }' | jq '.context'
```

## Adding Multiple Patients

Repeat the above steps for each patient, using different userIds:

```
data/
├── mattherbert01/
├── john_smith_42/
├── jane_doe_56/
└── ...
```

Each patient logs in with their unique userId and sees only their own data.

## Security Best Practices

1. **Never commit `data/` directory** - it's in .gitignore
2. **Use .env.local for development** - set `DATA_ROOT=/path/to/data`
3. **Netlify environment variables** - store data path securely in dashboard
4. **File permissions** - `chmod 700 data/` on production servers
5. **Backup separately** - data should be backed up outside the repository
6. **Audit access** - log who accesses sensitive patient files

## Deployment to Netlify

Once you have local data working:

1. Copy the `data/` directory to a secure location (NOT the repo)
2. In Netlify dashboard:
   - Go to Site settings → Build & deploy → Environment
   - Set `DATA_ROOT` to the path of your data directory on the Netlify server
3. Redeploy the site

For cloud deployment, use:
- AWS S3 for data storage (encrypted)
- Google Cloud Storage with IAM controls
- Private Supabase database
- Encrypted volumes on your own servers

## Questions?

See:
- `docs/ARCHITECTURE.md` - System design
- `docs/LIFE_LIBRARIAN_ARCHITECTURE.md` - Agent framework
- `DEPLOYMENT_GUIDE.md` - Full deployment instructions
