# iPad Briefing Console — UI/UX Design
**Version**: 2.05.0  
**Target**: Non-chatbot briefing system for field case work  
**Created**: 2026-04-22T21:25:00Z

---

## Core Philosophy

Not a chatbot. Not a dashboard. A **briefing console** — controlled information unfolding for meetings with system workers, doctors, or government agencies.

**Interaction pattern:**
```
Worker asks question
  ↓
System retrieves approved evidence
  ↓
Shows concise answer (3 sentences max) + [Confirmed] badge
  ↓
Offers: "Show source", "Show timeline context", "Create follow-up"
  ↓
Worker taps to expand
```

---

## 6-Tab Layout (iPad Portrait & Landscape)

### Tab 1: Summary
**Purpose**: At a glance, what's the current issue?

```
┌─────────────────────────────────┐
│ 📋 SUMMARY                      │
├─────────────────────────────────┤
│                                 │
│ ACTIVE MATTER: ODSP Review      │
│ ───────────────────────────────│
│ Situation:                      │
│ Matthew has been approved for   │
│ ODSP since Dec 2025. Annual    │
│ review due June 1, 2026.       │
│                                 │
│ Next Action:                    │
│ Submit medical documentation   │
│ package to ODSP office.         │
│ Deadline: May 15, 2026          │
│                                 │
│ Confidence Summary:             │
│ ✓ Confirmed: 78%               │
│ ⚠ Draft: 15%                   │
│ ? Inferred: 5%                 │
│ ✗ Missing: 2%                  │
│                                 │
└─────────────────────────────────┘
```

**Fields:**
- Active matter type (badge with color)
- 3-5 sentence plain-language summary
- Next action with deadline (largest text, high contrast)
- Confidence breakdown (% of evidence by level)
- Key contacts (quick reference, clickable)

---

### Tab 2: Timeline
**Purpose**: See what happened when, sourced and tagged with confidence

```
┌─────────────────────────────────┐
│ 📅 TIMELINE                     │
├─────────────────────────────────┤
│ Filter: [ODSP ▼] [2020-2026 ▼] │
├─────────────────────────────────┤
│                                 │
│ June 2002                       │
│ ├─ Crohn's disease diagnosed   │
│ │  [Confirmed] Pediatric      │
│ │  consult, Hospital Records   │
│ │  [Show source]              │
│                                 │
│ 2018                            │
│ ├─ ODSP application approved   │
│ │  [Confirmed] Ministry        │
│ │  Notice of Decision          │
│ │  [Show source]              │
│                                 │
│ Dec 1, 2025                     │
│ ├─ ODSP approval backdated    │
│ │  [Confirmed] Ministry Notice │
│ │  Effective Sept 1, 2025      │
│ │  [Show source]              │
│                                 │
│ ⚠ 2015-2020                     │
│ └─ [Inferred] Care gap:        │
│    No GI follow-ups recorded   │
│    [Show deeper analysis]      │
│                                 │
│ [Load more events]              │
│                                 │
└─────────────────────────────────┘
```

**Design rules:**
- Chronological, top-to-bottom
- Date | Event | Confidence badge | Source button
- Color-coded by event type (clinical = blue, admin = green, system = gray)
- Filterable by matter type and date range
- "Show source" expands to full document
- "Show deeper" explains inferences

---

### Tab 3: Evidence
**Purpose**: Direct source-backed facts, grouped by topic

```
┌─────────────────────────────────┐
│ 📌 EVIDENCE                     │
├─────────────────────────────────┤
│ Filter: [All topics ▼]          │
├─────────────────────────────────┤
│                                 │
│ MEDICAL / DIAGNOSIS             │
│ ───────────────────────────────│
│ • Crohn's disease (confirmed)  │
│   [Confirmed] Diagnosed June  │
│   2002, Pediatric consult &   │
│   Hospital Records             │
│   [Show source]               │
│                                 │
│ • Peripheral neuropathy (conf) │
│   [Confirmed] Diagnosed 2015,  │
│   neurology consult            │
│   [Show source]               │
│                                 │
│ INCOME / BENEFITS               │
│ ───────────────────────────────│
│ • ODSP approved Dec 2025       │
│   [Confirmed] $1,169/month     │
│   [Show official letter]       │
│                                 │
│ • Rent assistance eligible      │
│   [Draft] Based on income,     │
│   needs confirmation           │
│   [Show details]              │
│                                 │
│ MISSING / NEEDS REVIEW          │
│ ───────────────────────────────│
│ ⚠ Hospital discharge summary   │
│   (Cambridge, June 2024)        │
│   [MISSING] Request from       │
│   provider                      │
│   [Create task]               │
│                                 │
└─────────────────────────────────┘
```

**Design rules:**
- Group by topic (Medical, Housing, Income, Legal, etc)
- Card per evidence item
- Confidence badge (color-coded)
- Plain-language excerpt (no jargon)
- "Show source" button expands to full document
- Missing items show "Create task" to request from provider

---

### Tab 4: Live Notes
**Purpose**: What's happening RIGHT NOW in this meeting

```
┌─────────────────────────────────┐
│ 📝 LIVE NOTES                   │
│ Meeting with: ODSP Officer     │
│ Date: April 22, 2026, 2:00 PM  │
├─────────────────────────────────┤
│                                 │
│ [Auto-saving...]                │
│                                 │
│ Q: "Has he been hospitalized"  │
│    Worker asked at 14:03        │
│ A: "Yes, June 2024 flare,      │
│    Cambridge Memorial 5 days"   │
│    [Confirmed] [Show source]   │
│                                 │
│ Commitment:                     │
│ "Will submit discharge summary │
│  by end of week"               │
│ [✓ Logged as task]             │
│                                 │
│ Q: "Current medications?"       │
│    Worker asked at 14:07        │
│ A: [Retrieving...]              │
│                                 │
│ [New note...]                   │
│                                 │
│ ──────────────────────────────│
│ [End session] [Add note]        │
│ [Create multiple tasks]        │
│                                 │
└─────────────────────────────────┘
```

**Design rules:**
- Question + Answer format
- Timestamp on each exchange
- Confidence badge on answer
- "Show source" expandable
- Button to log commitment as task
- Auto-saves every change
- "End session" → triggers post-meeting recap

---

### Tab 5: Responses
**Purpose**: Pre-built templates and freshly compiled outputs

```
┌─────────────────────────────────┐
│ 📄 RESPONSES                    │
├─────────────────────────────────┤
│                                 │
│ READY TO SHARE:                 │
│ ───────────────────────────────│
│                                 │
│ Medical Chronology              │
│ "Healthcare summary for ODSP"   │
│ Version 7 (Approved)            │
│ [Show shorter] [Show fuller]    │
│ [Copy to clipboard] [Hand off]  │
│ Sources: 8 documents, all      │
│ confirmed                       │
│                                 │
│ Accommodation Statement          │
│ "Request for workplace accom."  │
│ Version 3 (Approved)            │
│ [Show] [Copy] [Hand off]       │
│                                 │
│ MEETING BRIEF (This meeting)    │
│ "What we discussed today"       │
│ Auto-compiled from live notes   │
│ [Show] [Edit] [Approve] [Hand] │
│ Sources: 4 live confirmations  │
│                                 │
│ DRAFT (Needs Approval):         │
│ ───────────────────────────────│
│                                 │
│ Appeal Letter Template          │
│ Draft based on new evidence     │
│ [Edit] [Review sources]         │
│ [Approve for use] [Discard]    │
│                                 │
│ [Create custom response]        │
│                                 │
└─────────────────────────────────┘
```

**Design rules:**
- Green badge = Approved for external use
- Yellow badge = Draft (needs review)
- "Show shorter / fuller" for length control
- "Hand off" = full-screen mode for showing worker/staff
- Source citations always visible
- Copy-to-clipboard for sharing
- All outputs template-based, never improvised

---

### Tab 6: Tasks
**Purpose**: What needs follow-up after this meeting

```
┌─────────────────────────────────┐
│ ✓ TASKS                         │
├─────────────────────────────────┤
│ Filter: [All ▼] [ODSP ▼]       │
├─────────────────────────────────┤
│                                 │
│ 🔴 URGENT / OVERDUE             │
│ ───────────────────────────────│
│                                 │
│ Submit ODSP documentation     │
│ Owner: Matthew                  │
│ Due: May 15, 2026              │
│ Matter: ODSP Review            │
│ Status: Created                │
│ [Move to in progress] [Done]   │
│                                 │
│ 🟡 THIS WEEK                    │
│ ───────────────────────────────│
│ Request discharge summary      │
│ Owner: Case Worker             │
│ Due: April 26, 2026            │
│ Matter: ODSP Review            │
│ Created in meeting: 14:06      │
│ Status: Created                │
│ [Drag ↑↓ to prioritize]        │
│                                 │
│ Request pain management notes  │
│ Owner: Case Worker             │
│ Due: April 26, 2026            │
│ Matter: Medical                 │
│ Status: Created                │
│                                 │
│ 🟢 NEXT WEEK                    │
│ ───────────────────────────────│
│ Follow up on ODSP response     │
│ Owner: Matthew                  │
│ Due: June 3, 2026              │
│ Status: Created                │
│ [Reassign] [Delete]            │
│                                 │
│ [Create task manually]         │
│                                 │
└─────────────────────────────────┘
```

**Design rules:**
- Color-coded by urgency (red = critical, yellow = soon, green = later)
- Drag to reorder
- Owner, due date, matter always visible
- Status buttons (created/in-progress/done)
- Task count in tab badge
- Auto-created from "Create follow-up" buttons in other tabs

---

## Responsive Behavior

### iPad Portrait (< 1024px)
- Single-column layout
- Tabs at top (horizontal scroll if needed)
- Full width main content
- Chat panel hidden (tap icon to toggle right-side)
- Touch targets: 44px minimum (Apple standard)

### iPad Landscape (≥ 1024px)
- 3 columns: Sidebar | Main (tabs) | Chat/Context
- All tabs visible, full width
- Chat always visible on right
- Optimized for dual-monitor presentations

### Mobile (< 640px)
- 1 column
- Hamburger menu for tabs
- Full-screen modals for evidence/responses
- Large text (18px+ for labels)
- Nonverbal-friendly (no keyboard needed)

---

## Color Scheme (Existing Palette)

```
Confidence Badges:
  Confirmed     → #42c08c (Green, safe to use)
  Draft         → #f2bb5e (Amber, needs review)
  Inferred      → #75a7ff (Blue, appears/suggests)
  Missing       → #ef6f6f (Red, needs sourcing)
  Needs Review  → #ffc3c3 (Light red, contradiction)

Background:    #0b1020 (Dark blue)
Sidebar:       #111831 (Darker blue)
Cards:         #182243 (Blue-gray)
Text:          #eef2ff (Off-white)
Accents:       #75a7ff (Light blue)
```

---

## Interaction Patterns

### Pattern 1: Evidence Lookup
```
User taps evidence card
  ↓
Confidence badge + source button highlighted
  ↓
User taps "Show source"
  ↓
Full document expands (modal or side panel)
  ↓
User taps "Back"
  ↓
Returns to card
```

### Pattern 2: Meeting QA
```
Worker asks question (text or voice)
  ↓
System searches approved matter pack
  ↓
Shows answer with confidence badge + [Show source]
  ↓
Worker taps "Create follow-up"
  ↓
Task auto-creates and appears in Tasks tab
  ↓
Session logged automatically
```

### Pattern 3: Document Hand-Off
```
User selects "Response" (e.g., Medical Chronology)
  ↓
Taps "Hand off"
  ↓
Full-screen mode (no UI chrome)
  ↓
Worker/Doctor/ODSP officer reads on screen
  ↓
Tap "Copy" to clipboard
  ↓
Back to console
```

---

## Accessibility (WCAG AA)

✓ High contrast (7:1 ratio on all text)  
✓ Large touch targets (44px)  
✓ Clear focus indicators (blue outline)  
✓ Screen reader support (semantic HTML)  
✓ Text sizing: 18px minimum for body  
✓ Color not sole indicator (badges + icons)  
✓ No time-dependent interactions  

---

## Data Flow

```
Input: Evidence + Confidence + Source
  ↓
Storage: 12 entities in localStorage
  ↓
Display: Rendered by JS (no external generation)
  ↓
Output: Templates only, never improvised
  ↓
Audit: Handshake logged for every interaction
```

---

## Implementation Checklist (for libbyclaudecode)

- [ ] 6 tab buttons in header
- [ ] Tab 1: Summary (badge + key dates + confidence %)
- [ ] Tab 2: Timeline (chronological, filterable, confidence badges)
- [ ] Tab 3: Evidence (grouped by topic, source buttons)
- [ ] Tab 4: Live Notes (QA format, auto-save, create task buttons)
- [ ] Tab 5: Responses (approved + draft, show shorter/fuller)
- [ ] Tab 6: Tasks (urgent/this week/later, drag to reorder)
- [ ] Confidence badges rendering (5 colors, all tabs)
- [ ] "Show source" modal expansion working
- [ ] "Create follow-up" task creation working
- [ ] iPad portrait responsive (single column)
- [ ] iPad landscape responsive (3 columns)
- [ ] All touch targets 44px+
- [ ] localStorage persistence for session
- [ ] Auto-save on Live Notes every change
- [ ] WCAG AA contrast + focus indicators

---

**Ready for libbyclaudecode to implement.**
