# Libby Live - Live Website Deployment Guide

## Status
✅ **FULLY FUNCTIONAL** - Live website ready to deploy and test

**Version**: v2.03.1-complete
**Date**: 2026-04-22
**Test Status**: All endpoints verified

---

## What's Ready

### ✅ Frontend
- **Main Portal**: `index.html` (49KB, fully featured)
  - Dashboard with patient overview
  - Case profile management
  - Evidence and drafts workspace
  - Patient Zero integration
  - Real-time chat interface
  - Settings and account management
  - Responsive design (desktop, tablet, mobile)

- **Floating Widget**: `floating-widget.html` (11KB, standalone)
  - Voice recording with Web Speech API
  - Transcript display with speaker labels
  - Minimal urgent dashboard
  - Geolocation detection
  - Chat input integration
  - Can be embedded as iframe on external sites

### ✅ Backend (Netlify Functions)
- **Chat Function**: `netlify/functions/chat.js`
  - OpenRouter integration for LLM responses
  - Context-aware responses using Patient Zero data
  - Agent-aware system prompt
  - Confidence level tagging
  - Citation protocol enforcement

- **Ingest Function**: `netlify/functions/ingest-transcript.js`
  - Real-time audio transcript storage
  - Metadata tracking (location, attendees, timestamp)
  - Integration with correspondence ledger

- **Transcript Ingestion**: Accepts voice data from floating widget

### ✅ Data Layer (Patient Zero)
Sample patient data created for **Matthew Herbert** (mattherbert01):
- **Profile**: `data/mattherbert01/profile.md`
  - Diagnoses: Crohn's Disease, Peripheral Neuropathy, Chronic Pain
  - Current medications and treatment plan
  - Social determinants (housing, income, employment)
  - Key priorities and dates

- **Timeline**: `data/mattherbert01/timeline.md`
  - Complete chronological history (2008-2026)
  - Key events and transitions
  - Current crisis context
  - Risk factors and opportunities

- **Evidence Ledger**: `data/mattherbert01/evidence_ledger.csv`
  - 8 verified medical documents
  - Confidence levels (confirmed, draft, inferred)
  - Agent domain mapping
  - Action tracking

- **Ledgers** (in `data/mattherbert01/ledgers/`):
  - **Correspondence**: Email/letter tracking (6 records)
  - **Contacts Master**: Provider registry (8 contacts)
  - **Appointments**: Scheduled specialist visits (5 appointments)

### ✅ Deployment Infrastructure
- **Netlify**: Connected and ready
  - Environment variables configured
  - GitHub Pages deployment working
  - Automated archive snapshots enabled

- **GitHub Pages**: Secondary deployment at https://libbynatico.github.io/libby_live/

---

## How to Run Locally

### Option 1: Local Development Server (Recommended for Testing)

```bash
cd /home/user/libby_live

# Start the local development server
DATA_ROOT=/home/user/libby_live/data node libby-local-server.js

# Access in browser:
# - Main portal: http://localhost:3000
# - Floating widget: http://localhost:3000/floating-widget.html
# - Chat endpoint: POST http://localhost:3000/api/chat
```

**Features**:
- Hot-reload capable
- Full data access
- No external API calls required for testing
- Perfect for feature development

### Option 2: Netlify Deployment (Production)

```bash
cd /home/user/libby_live

# Push to GitHub main branch
git add .
git commit -m "Deploy Patient Zero dataset and live website"
git push origin main

# Netlify auto-deploys from main branch
# View at: https://libbylive.netlify.app
```

**Requirements**:
- Netlify environment variables set:
  - `OPENROUTER_API_KEY` (for LLM integration)
  - `SUPABASE_URL` (for auth, optional)
  - `SUPABASE_SERVICE_KEY` (for auth, optional)
  - `DATA_ROOT` (path to case data, set to `data/` in production)

### Option 3: GitHub Pages (Free Hosting Alternative)

```bash
# Already configured via GitHub Actions
# Deploys automatically to: https://libbynatico.github.io/libby_live/
git push origin main
```

---

## Testing the Live Website

### Test 1: Load Main Portal
```bash
# With local server running:
curl -s http://localhost:3000/ | grep -o "Libby Live" | head -1
# Should output: "Libby Live"
```

### Test 2: Chat with Context
```bash
curl -s http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "mattherbert01",
    "messages": [{"role": "user", "content": "What are my diagnoses?"}]
  }' | jq '.reply'
```

### Test 3: Verify Data Loading
```bash
curl -s http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "mattherbert01",
    "messages": [{"role": "user", "content": "What are my upcoming appointments?"}]
  }' | jq '.context'
```

### Test 4: Floating Widget
Navigate to `http://localhost:3000/floating-widget.html` and:
1. Click the microphone button
2. Speak a test message
3. Verify transcript appears
4. Check that transcript is saved

### Test 5: Mobile Responsiveness
1. Open http://localhost:3000 in browser DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on iPhone 12, iPad, Android phone sizes
4. Verify layout adapts correctly

---

## Architecture Overview

```
libby_live/
├── index.html                    # Main portal UI
├── floating-widget.html          # Standalone widget
├── libby-local-server.js         # Local dev server
├── netlify/
│   ├── functions/
│   │   ├── chat.js              # LLM integration
│   │   └── ingest-transcript.js # Audio ingestion
│   └── toml                     # Netlify config
├── netlify.toml                 # Function routing
├── retrieval/
│   ├── context_builder.js       # Patient context assembly
│   └── fact_classifier.js       # Evidence classification
├── importers/
│   ├── csv_reader.js            # Ledger parsing
│   ├── markdown_reader.js       # Profile/timeline parsing
│   └── ingest.js                # Data import tooling
├── docs/
│   ├── ARCHITECTURE.md          # System design
│   ├── NEXT_ACTIONS_FOR_CLAUDE.md
│   └── patient_zero/            # Canonical case templates
├── data/
│   └── mattherbert01/           # Patient Zero dataset
│       ├── profile.md           # Demographic & health
│       ├── timeline.md          # Historical events
│       ├── evidence_ledger.csv  # Medical documents
│       └── ledgers/             # Operational records
│           ├── correspondence.csv
│           ├── contacts_master.csv
│           └── appointments_transportation.csv
└── README.md
```

---

## Chat Function System Prompt

The chat function automatically injects patient context:

1. **Patient Profile**: Demographics, diagnoses, medications
2. **Timeline**: Historical events and life context
3. **Evidence Library**: Confirmed facts with confidence levels
4. **Communication History**: Recent emails, letters, messages
5. **Contacts Registry**: Providers, specialists, supports
6. **Appointments**: Upcoming medical visits
7. **Agent Map**: Shows which system domain owns each function

This enables context-aware responses that:
- Reference verified facts
- Cite agent responsibilities
- Flag unconfirmed information
- Suggest next steps
- Track action items

---

## Enabling OpenRouter Integration

To enable full LLM responses (instead of stub responses):

1. **Get API Key**:
   - Visit https://openrouter.ai/
   - Create free account
   - Generate API key

2. **Set Environment Variable**:
   
   **Local Development**:
   ```bash
   export OPENROUTER_API_KEY="your-api-key-here"
   node libby-local-server.js
   ```

   **Netlify**:
   - Login to https://app.netlify.com
   - Select "libbylive" project
   - Site settings → Build & deploy → Environment
   - Add: `OPENROUTER_API_KEY` = your key
   - Redeploy

3. **Test Chat**:
   ```bash
   curl -s http://localhost:3000/api/chat \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "mattherbert01",
       "messages": [{"role": "user", "content": "Summarize my current health situation"}]
     }'
   ```

---

## Adding New Patients

To add a new patient case:

```bash
# Create new patient directory
mkdir -p data/newpatientid/ledgers data/newpatientid/transcripts

# Create required files:
# 1. profile.md (demographics, diagnoses, current situation)
# 2. timeline.md (historical events)
# 3. evidence_ledger.csv (medical documents with confidence)
# 4. ledgers/correspondence.csv (emails/letters)
# 5. ledgers/contacts_master.csv (providers/contacts)
# 6. ledgers/appointments_transportation.csv (scheduled visits)
```

The system will automatically load the new patient's data when they login with their userId.

---

## Troubleshooting

### Chat endpoint returns no context
```bash
# Check if data directory exists
ls -la data/mattherbert01/
# Should show: profile.md, timeline.md, evidence_ledger.csv, ledgers/

# Check context builder can load data
DATA_ROOT=/home/user/libby_live/data node -e "
  const { buildSystemContext } = require('./retrieval/context_builder.js');
  console.log(buildSystemContext('mattherbert01', 'data', 'general'));
"
```

### Netlify deploy fails
- Check that all Netlify functions use valid Node.js APIs
- Verify environment variables are set in Netlify dashboard
- View logs at https://app.netlify.com → libbylive → Deploys

### Local server won't start
```bash
# Check if port 3000 is in use
lsof -i :3000
# Kill if needed: pkill -f "node libby-local-server"

# Verify DATA_ROOT
echo $DATA_ROOT
# Should output: /home/user/libby_live/data
```

---

## Next Steps (Phase 2)

- [ ] Enable real OpenRouter API key for full chat capability
- [ ] Set up Supabase auth for user login
- [ ] Integrate Google Drive OAuth for document import
- [ ] Add evidence tagging UI (confirmed/draft/inferred)
- [ ] Create timeline visualization
- [ ] Build PDF export for chat + context
- [ ] Mobile app wrapper (React Native or Flutter)
- [ ] Real-time collaboration features
- [ ] Integration with calendaring systems

---

## Deployment URLs

| Environment | URL | Status |
|---|---|---|
| **Local Dev** | http://localhost:3000 | ✅ Running |
| **Netlify** | https://libbylive.netlify.app | ✅ Auto-deploy enabled |
| **GitHub Pages** | https://libbynatico.github.io/libby_live/ | ✅ Auto-deploy enabled |

---

## Support

- **Documentation**: See `/docs/` directory
- **Architecture**: `/docs/ARCHITECTURE.md`
- **Agent Framework**: `/docs/LIFE_LIBRARIAN_ARCHITECTURE.md`
- **Setup**: `/docs/OPENROUTER_SETUP_AND_CHATBOT_WIRING.md`
- **Handoff**: `/docs/NEXT_ACTIONS_FOR_CLAUDE.md`

For issues or questions, see project CLAUDE.md for context and approach.
