# Briefing for libbyclaudecode — Phase 2 Implementation

**From:** Claude (Session 1)  
**To:** libbyclaudecode (Session 2+)  
**Date:** 2026-04-22  
**Status:** Ready to start Phase 2

---

## Quick Summary

✅ **Phase 1 Done:**
- Website is live and functional
- Chat works with Ollama (free, local) or OpenRouter (cheap, cloud)
- All documentation written
- Deployed to GitHub Pages

🚀 **Phase 2 (Your Job):**
- Make it beautiful (dark/light theme, settings, polish)
- Add features (email, connectors, responsive design)
- Estimated effort: ~2-3 hours with this many tokens left

---

## Start Here (5 Minutes)

1. **Read these files** (in order):
   - `NEXT_STEPS.md` — What's done, what's next
   - `conversation.json` — Current status + priority
   - `docs/AGENT_COLLABORATION_PROTOCOL.md` — How we work together

2. **Open the website**:
   - https://libbynatico.github.io/libby_live/
   - It works. It's functional. It needs polish.

3. **Check the codebase**:
   - `index.html` — Main website (needs design improvements)
   - `netlify/functions/chat.js` — Chat backend (Ollama + fallback, ready)
   - `floating-widget.html` — Audio widget (local server tested)
   - `libby-local-server.js` — Node.js server for local testing

---

## Your Phase 2 Mission (Priority Order)

### 1. Dark/Light Theme Toggle ⭐⭐⭐ (HIGH VALUE)

**What:** Add theme toggle button in top-right header

**Where:** `index.html`

**Acceptance Criteria:**
- [ ] Toggle button appears in header (moon/sun icon)
- [ ] Clicking toggles dark ↔ light smoothly (0.3s transition)
- [ ] Preference saved to localStorage
- [ ] System preference detected on first visit
- [ ] All text maintains WCAG AA contrast in both modes
- [ ] Deployed and working at live URL

**Effort:** ~30 min

**Why:** Foundation for all other polish work. Users need this control.

---

### 2. Settings Panel ⭐⭐⭐ (HIGH VALUE)

**What:** Add settings modal with comprehensive controls

**Where:** `index.html` (new settings button, new modal)

**Sections to Include:**

A. **Appearance**
   - Theme selector (dark/light/auto)
   - Font size (small/normal/large)
   - Sidebar width preference

B. **Account & Profile**
   - Display name field
   - Email address
   - Default timezone
   - Active case ID

C. **Notifications**
   - Email on new messages (checkbox)
   - Email on case updates (checkbox)
   - Appointment reminders (radio: immediate/1hr/1day)

D. **Integrations** (Status display only, no wiring yet)
   - Google Calendar: [🔴 Not connected] [Connect]
   - Gmail: [🔴 Not connected] [Connect]
   - Google Drive: [🟢 Connected] [Disconnect]
   - Ollama: [🟢 Running] [Status]
   - OpenRouter: [⚪ Configured] [Test]

E. **Data & Privacy**
   - [Export Case Data] button
   - [Clear Cache] button
   - Read-only data retention policy

F. **Advanced** (for debugging)
   - Ollama URL (editable, default localhost:11434)
   - Chat model selector (dropdown: mistral, neural-chat, llama2)
   - Build version display

**Acceptance Criteria:**
- [ ] Settings button accessible from header or sidebar
- [ ] Modal opens/closes smoothly
- [ ] All form inputs save to localStorage
- [ ] Theme setting persists across sessions
- [ ] Connector status displays correctly
- [ ] Mobile responsive (doesn't overflow)

**Effort:** ~60 min

**Why:** Central hub for all user controls. Makes app feel complete.

---

### 3. Email Compose + Templates ⭐⭐⭐ (HIGH VALUE)

**What:** Email compose interface with pre-built templates

**Where:** `index.html` (new "Compose Email" button, new modal)

**Features:**

A. **Compose Form**
   - To: [Contact selector dropdown from ledger]
   - Subject: [Text input]
   - Body: [Rich text area]
   - [Attach evidence] button
   - [Use template] dropdown
   - [Preview] button
   - [Send] button

B. **Email Templates**
   - "Request medical records from [provider]"
   - "Follow-up on ODSP application"
   - "Document evidence for legal case"
   - "Appointment reminder to [contact]"
   - [+ Create custom template]

C. **On Send:**
   - Log to correspondence ledger (CSV) locally
   - Show success message
   - Clear form
   - Store in case files (localStorage)

**Acceptance Criteria:**
- [ ] Compose form opens from header or nav
- [ ] Contact dropdown works (populate from contacts_master.csv)
- [ ] Templates load and populate body
- [ ] Send logs to correspondence.csv locally
- [ ] Sent email appears in sent history
- [ ] Mobile responsive
- [ ] All fields validated before send

**Effort:** ~45 min

**Why:** Core feature for daily advocacy work. High user value.

---

### 4. Connector Status Dashboard ⭐⭐ (MEDIUM VALUE)

**What:** Show integration status with connect/disconnect buttons

**Where:** `index.html` (in Settings panel or separate tab)

**Display Format:**

```
╔═══════════════════════════════════════╗
║ INTEGRATIONS & CONNECTORS             ║
╠═══════════════════════════════════════╣
║ Google Calendar     [🔴] [Connect]    ║
║ Gmail              [🔴] [Connect]    ║
║ Google Drive       [🟢] [Disconnect] ║
║ Supabase           [🟢] Connected    ║
║ Ollama             [🟢] Running      ║
║ OpenRouter         [⚪] Configured   ║
╚═══════════════════════════════════════╝
```

**Acceptance Criteria:**
- [ ] Shows all connector status
- [ ] Color-coded (🔴 = not connected, 🟢 = connected, ⚪ = configured)
- [ ] Connect/disconnect buttons available
- [ ] Last sync timestamp displayed
- [ ] Manual "Sync now" button
- [ ] Clear status messages

**Effort:** ~20 min (UI only, no wiring)

**Why:** Users need visibility into what's connected. Foundation for Phase 3.

---

### 5. Mobile Responsive Design ⭐⭐ (MEDIUM VALUE)

**What:** Make website work beautifully on mobile/tablet

**Where:** `index.html` (CSS + layout adjustments)

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Mobile Changes:**
- Hamburger menu for sidebar (hide on mobile, toggle on click)
- Right chat panel: Hide initially, access via button in header
- Main content: Full width
- Cards: Stack instead of grid
- Modals: Full screen (minus safe area)

**Acceptance Criteria:**
- [ ] Website usable on iPhone (375px width)
- [ ] Website usable on iPad (768px width)
- [ ] No horizontal scroll
- [ ] Touch targets ≥ 44px
- [ ] Text readable without zooming
- [ ] Forms work on mobile keyboard
- [ ] All features accessible

**Effort:** ~40 min

**Why:** Users will use this on phones for case notes in the field.

---

## Implementation Roadmap

**Session 2 (libbyclaudecode):**
1. Theme toggle → Test
2. Settings panel → Test
3. Email compose → Test
4. Commit + push + rate claude

**Session 3 (if needed):**
5. Connector status → Test
6. Mobile responsive → Test
7. Polish + edge cases

**Session 4:**
8. Google Calendar integration (wire actual API)
9. Live ledger data (pull real appointments)
10. v2.05.0 release

---

## How We Collaborate

**Read `conversation.json` before you start.**

**After each major task:**
1. Commit code with clear message
2. Update `conversation.json` with what you did
3. Add session details (goals, accomplished, issues, token usage)

**When you're done:**
1. Update `activeAgent` to whoever picks it up next
2. Rate my work (be honest)
3. Leave clear next steps

**See `docs/AGENT_COLLABORATION_PROTOCOL.md` for full protocol.**

---

## Key Files Reference

| File | Purpose | Current State |
|------|---------|---|
| `index.html` | Main website | ✅ v2.04.0, working, needs polish |
| `netlify/functions/chat.js` | Chat backend | ✅ Ready (Ollama + fallback) |
| `floating-widget.html` | Audio widget | ✅ Ready for local testing |
| `libby-local-server.js` | Local Node.js server | ✅ Ready |
| `conversation.json` | Collaboration tracker | ✅ Ready (UPDATE THIS) |
| `data/mattherbert01/` | Case data | ✅ Ready (local only) |
| `docs/` | Documentation | ✅ Complete |

---

## What NOT to Do

❌ Add frameworks (Vue, React, Next.js)  
❌ Add build steps or npm dependencies  
❌ Break localStorage-first philosophy  
❌ Expose secrets in code  
❌ Remove Ollama fallback (free is critical)  
❌ Add comments (only if WHY is non-obvious)  

---

## What TO Do

✅ Keep it vanilla HTML/CSS/JS  
✅ Save state to localStorage  
✅ Make it work offline-first  
✅ Test on real devices before deploying  
✅ Update conversation.json frequently  
✅ Be honest in your ratings  
✅ Commit code frequently  

---

## Success Looks Like

**After Phase 2:**

- ✅ Dark/light theme working smoothly
- ✅ Settings panel functional with all controls
- ✅ Email compose wired and logging to CSV
- ✅ Connectors show status
- ✅ Website usable on mobile
- ✅ Professional, polished appearance
- ✅ WCAG AA accessible
- ✅ <3s load time
- ✅ All code committed
- ✅ Ready for v2.05.0 release

---

## Questions?

- **Tech questions:** See code comments + docs
- **Design questions:** Follow the spec in NEXT_STEPS.md
- **Collaboration questions:** See AGENT_COLLABORATION_PROTOCOL.md
- **Blocked?** Document in conversation.json + try 2 approaches first

---

## Let's Go

You have ~65% of token budget left. This is a 2-3 hour lift with good token allocation.

Focus, iterate, commit often, and update conversation.json after each win.

**Phase 2 is all yours. Make it beautiful.**

---

*— Claude, Session 1*  
*Ready to hand off to you on 2026-04-22 @ 20:45 UTC*
