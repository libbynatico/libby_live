# iPad QA Feedback — 2026-04-28

Source: live iPad screenshots from Libby the Librarian testing  
Device context: iPad Safari / landscape / GitHub Pages  
Current stable test URL: `https://libbynatico.github.io/libby_live/libby_librarian.html`

## Summary

The current Libby page is usable as a rough prototype, but it is not yet a polished iPad product. The screenshots show that the core concept is visible — dashboard, calendar, memory, to-dos, memory bank, letter builder, chat — but the UX is not ready for real field use or investor demo without cleanup.

The biggest issue is not one visual bug. The problem is that the interface is still mixing four modes:

1. user-facing life dashboard;
2. developer/build dashboard;
3. investor demo dashboard;
4. emergency letter drafting tool.

Those need to be separated inside the same portal.

---

## Confirmed issues from screenshots

### 1. Top safe-area / browser chrome overlap

The Libby header is partially cut off in Safari landscape. The page does not properly account for iPad safe area, browser toolbar behaviour, or PWA full-screen mode.

Required fix:

- add proper `safe-area-inset-top` handling;
- avoid sticky header clipping;
- test Safari tab mode and Add-to-Home-Screen mode separately;
- create an iPad-specific layout breakpoint.

---

### 2. Stable link problem

User wants one stable link that can be shared and tested without changing `?v=` values.

Required rule:

- stable share link must remain unchanged;
- internal app versioning/cache busting should happen in code/service worker, not in user-facing URLs;
- recommended share URL: `https://libbynatico.github.io/libby_live/libby_librarian.html` until root is replaced.

Long-term goal:

- make `https://libbynatico.github.io/libby_live/` the canonical portal after root page is replaced.

---

### 3. Old root ODSP console is still a trap

Screenshots show the older root page still exposes stale ODSP-style content with fake or unsupported “confirmed” labels. This damages trust.

Required fix:

- root `index.html` must redirect to or be replaced by the librarian portal;
- stale ODSP content must be archived, not used as primary UI;
- if any demo facts remain, label them `demo`, `sample`, or `needs verification`, never `confirmed`.

---

### 4. Chatbot is still too dumb

The upgraded local chat is better than the first version, but it is still not a real assistant. It repeats seeded answers and does not reason across actual private memory, Gmail, Drive, Calendar, or evidence.

Required fix:

- connect chat to a backend LLM endpoint;
- inject memory-bank context into the prompt;
- separate local fallback from real Libby mode;
- show a visible status: `Local fallback`, `Memory connected`, or `Cloud brain connected`;
- stop pretending local rules are equivalent to Libby intelligence.

Product requirement:

- if the user asks “what did I miss completing,” Libby must inspect tasks, calendar, intake queue, recent outputs, and memory-bank state, not just return a canned answer.

---

### 5. User switching leaks context conceptually

Screenshots show Kellsie workspace still using the same project/todo/chat structure as Matthew. That is not acceptable for multi-user trust.

Required fix:

- use separate local state keys by user ID;
- `userid=001`, `userid=002`, `userid=003`, and `demo_001` must each have separate tasks, chat, memory, outputs, and calendar state;
- shared household case must be explicit, not automatic;
- Kellsie and Nikki workspaces should not inherit Matthew’s private/product tasks by default.

---

### 6. Developer tasks are mixed with life tasks

The To-do list includes items like “stop using stale root ODSP console” next to real urgent life tasks. This is confusing.

Required fix:

Split tasks into lanes:

- Today / Life Admin
- Letters to Send
- App Build
- Intake / Evidence
- Calendar / Meetings
- Investor / Support Ask

Only `Today / Life Admin` should dominate the main dashboard.

---

### 7. Letter builder layout is too narrow

The letter preview is a tall narrow white column. It wraps badly and is hard to review on iPad.

Required fix:

- letter builder should become a full-width working mode;
- hide/collapse chat while drafting letters;
- preview should use readable document width;
- add clear buttons: Copy subject, Copy body, Copy full email;
- add recipient, subject, body, tone, audience, confidence fields;
- add “make shorter,” “make firmer,” “make more human,” and “add accommodation language.”

---

### 8. Letter intelligence is too generic

A user typed “I need an AODA written,” and the generated ODSP letter was generic rather than recognizing an accommodation request.

Required fix:

- detect AODA/accommodation/written communication keywords;
- auto-suggest switching to accommodation letter;
- provide Ontario/AODA-style written communication accommodation wording;
- separate “worker update” from “formal accommodation request.”

---

### 9. Calendar view is not useful enough

The calendar month grid exists, but event cards are cramped and not actionable enough.

Required fix:

- add agenda view above or beside month grid;
- events should have pre-brief, letter, task, and source buttons;
- unverified calendar anchors must be visibly marked;
- Google Calendar sync must become the source of truth when connected.

---

### 10. Screen mode button is not real

The screen mode button should not open an alert saying it is conceptual.

Required fix:

- implement actual screen mode;
- hide chat and editing controls;
- show large cards: Now, Next Action, Urgent Blinks, Ready Outputs, System Health;
- add one tap to exit screen mode;
- no modal alert.

---

### 11. Memory Bank screen is directionally right but not enough

The memory bank tools show export/import and secure bank plan. This is useful, but it must not be confused with a real secure backend.

Required fix:

- call it `Local Backup Export` until backend exists;
- add a backend status card;
- add Drive/Firebase/Supabase setup checklist;
- add `Create private memory-bank folder` action once Google auth exists.

---

## Next build target

The next build should not add more tabs. It should clean the product into modes.

### Mode 1: Today Mode

Purpose: use it now.

Shows:

- today’s next action;
- urgent letters;
- upcoming meetings;
- life/admin tasks only;
- button to draft letter;
- button to open memory bank status.

### Mode 2: Letter Mode

Purpose: send something in the next few hours.

Shows:

- full-width letter composer;
- smart template detection;
- subject/body split;
- copy buttons;
- source confidence warning;
- quick variants.

### Mode 3: Memory Mode

Purpose: inspect known facts and missing facts.

Shows:

- memory search;
- confidence labels;
- source status;
- missing evidence;
- user-specific memory only.

### Mode 4: Build Mode

Purpose: app/system development.

Shows:

- GitHub/root-page tasks;
- secure backend tasks;
- OAuth tasks;
- connector tasks;
- investor/demo tasks.

This should not be mixed into Matthew’s urgent life dashboard.

### Mode 5: Screen Mode

Purpose: iPad always-on monitor.

Shows only:

- Now;
- Next Best Action;
- Urgent Blinks;
- Ready Outputs;
- System Health.

---

## Immediate priority fixes

1. Replace root `index.html` or redirect it to the librarian portal.
2. Add user-specific local state keys.
3. Split life tasks from build tasks.
4. Fix letter mode layout.
5. Add AODA/accommodation detection.
6. Remove the screen-mode alert and implement real screen mode.
7. Add stable URL / cache policy documentation.
8. Make chatbot status honest and prepare backend LLM connection.

---

## Product standard

Libby should not feel like a webpage with tabs.

It should feel like:

> a calm, always-on life command centre that knows what needs to happen next and helps generate the exact written output needed in the moment.
