# Next Actions - April 22, 2026

## Current Status

✅ Portal UI fully restored (v2.02.0-byok regression recovered)  
✅ OAuth endpoints wired in Netlify function  
✅ Patient Zero file templates created  
✅ Chat context injection framework ready  
🔄 **BLOCKED**: Awaiting mattherbert01's case data from Google Drive

---

## What to Do RIGHT NOW

### User (mattherbert01) Tasks

**Deadline**: Send case data files + key context ASAP

#### Option A (Recommended - Takes 10 min):
1. Go to https://takeout.google.com/
2. Select Google Drive (select your case folder)
3. Download the ZIP export
4. Reply with the key documents:
   - Case timeline (dates of events)
   - Medical/legal records (what establishes what)
   - Current situation (what you're dealing with)
   - Next steps (what needs to happen)

#### Option B (Fastest - Takes 5 min):
Just paste/email your case summary:
- What's your current situation?
- What diagnoses/conditions?
- What system are you working with (ODSP, ODB, legal, medical)?
- What do you need help with right now?

#### Option C (Future):
Set up Google OAuth (requires Google Cloud project - we can do this later if needed)

---

### Claude Tasks (Waiting on User Data)

Once user provides case data:

1. **Structure Patient Zero files**
   - Parse provided documents
   - Fill in `docs/patient_zero/mattherbert01_*.md` files
   - Update evidence ledger CSV with real data

2. **Wire chat context injection**
   - Update Netlify function to read Patient Zero files
   - Inject into system prompt when user chats
   - Test: user asks question, Libby cites evidence/context

3. **Validate end-to-end**
   - Login to Libby Live
   - View Dashboard (should show Patient Zero count > 0)
   - Send chat message with case-specific context
   - Verify Libby references case data in response

4. **Deploy preview**
   - Push to Netlify preview
   - Test on mobile (you need on-the-go access)
   - Get user feedback

5. **Quality-of-life features** (Phase 2):
   - Evidence tagging (confirmed/assumption/resolved)
   - Timeline visualization
   - Task/action tracking
   - Export chat + context as PDF

---

## Branch & Deployment

- **Branch**: `claude/plan-chatbot-implementation-DOkaj`
- **Status**: 4 commits pushed, awaiting case data
- **Netlify**: Ready to deploy (just needs data structure)
- **Test URL**: Will be provided once deploy happens

---

## Blocker Resolution

**We are blocked on**: User providing their case materials from Google Drive.

**Options to unblock**:
1. ✉️ Email/paste Drive files + case summary
2. 📥 Use Google Takeout to export Drive + send key docs
3. 💬 Chat with Claude directly in this session with case details
4. 🔧 Set up Google OAuth (no credit card needed - free Google Cloud)

---

## Critical Success Factors

For v2.03.0 to be "done":

- [ ] mattherbert01's case data in `/docs/patient_zero/`
- [ ] Chat context injection reading those files
- [ ] User can ask Libby questions and get context-aware responses
- [ ] Patient Zero file count > 0 in Dashboard
- [ ] Mobile view works for on-the-go access
- [ ] One end-to-end test: login → navigate → chat → get smart response

---

## Questions for User

1. How do you want to provide your case data? (Takeout export, copy-paste, or share Drive?)
2. What's the most urgent thing Libby should help you with first?
3. Do you want to set up OAuth for live Drive access, or is the local file approach fine?

