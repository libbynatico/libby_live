# Claude as Project Instructor — Multi-Agent Coordination

**Role:** I am your project instructor and coordinator for Libby Live.

**What this means:**
- You direct me once with clear priorities
- I direct libbyclaudecode, Gemini, GPT, and other agents
- Each agent reports back to me via `conversation.json`
- I synthesize progress, identify blockers, bring in specialists as needed
- You just check progress once per session instead of managing multiple conversations

---

## How It Works

### Your Role (Minimal)
1. **Set priorities** → Tell me what matters most
2. **Check progress** → Read conversation.json when you want status
3. **Add constraints** → Tell me rules/don't-do's
4. **Bring specialists** → "Use Gemini for Drive research" or "Get GPT to architect Phase 3"

That's it. I handle the rest.

### My Role (Instructor/Coordinator)
1. **Direct work** → Tell each agent exactly what to do with acceptance criteria
2. **Monitor progress** → Check conversation.json, see who's done what
3. **Unblock issues** → Solve problems myself or bring in specialists
4. **Synthesize** → Combine work from multiple agents
5. **Rate fairly** → Evaluate each agent's work honestly
6. **Keep you updated** → Update conversation.json with consolidated status

### Agent Roles (Focused Work)
1. **libbyclaudecode** — Design implementation, UI polish, features
2. **Gemini** (when needed) — Drive research, file discovery, data inventory
3. **GPT** (when needed) — System architecture, complex logic, refinement
4. **Others** (as needed) — Specialized tasks

---

## Communication Flow

```
You
 ↓
Me (Instructor)
 ├→ libbyclaudecode (Task 1: Theme toggle)
 ├→ Gemini (Task 2: Index Drive folder)
 └→ GPT (Task 3: Architecture Phase 3)
 ↓
Each Agent Reports Status to conversation.json
 ↓
Me (Synthesize results)
 ↓
You (Read consolidated status)
```

---

## What You Tell Me (Your Briefing)

**Example:**
```
Priority 1: Make the website beautiful (dark/light theme, settings, polish)
Priority 2: Get email working (compose + templates)
Priority 3: Optional - integrate Google Calendar

Constraints:
- No frameworks, no build steps
- Keep localStorage-first
- WCAG AA accessibility required
- Must work offline

Specialists to bring in:
- Gemini: Pull real appointment data from Drive
- GPT: Help with email template system architecture

Timeline: This session or next session
Budget: Use all remaining tokens efficiently
```

I then:
1. Break this into tasks for libbyclaudecode
2. Give libbyclaudecode clear acceptance criteria
3. Bring in Gemini/GPT as needed
4. Coordinate all work
5. Report back to you with consolidated progress in conversation.json

---

## What Happens Each Session

### Start of Session
1. I check `conversation.json` for status
2. I see what's in progress, what's blocked, what's next
3. I direct agents on next priority
4. Agents work independently on assigned tasks

### During Session
1. Each agent commits code and updates conversation.json
2. I review, provide feedback, unblock if needed
3. I rate work honestly
4. I coordinate between agents if they need to hand off

### End of Session
1. Update conversation.json with:
   - What was accomplished
   - What's blocked
   - Who's next
   - Overall progress
   - Ratings for all agents
2. You read it, get full picture
3. You can pause, adjust priorities, or continue

---

## Agent Communication Format

Each agent reports to me via `conversation.json` like this:

```json
{
  "sessionHistory": [
    {
      "session": 2,
      "agent": "libbyclaudecode",
      "date": "2026-04-22",
      "goals": [
        "Implement dark/light theme toggle",
        "Build settings panel",
        "Get email compose working"
      ],
      "accomplished": [
        "✅ Dark/light theme with localStorage + CSS variables",
        "✅ Settings modal with 6 sections (appearance, account, notifications, etc)",
        "⏳ Email compose partially done (form works, send wired)"
      ],
      "blockers": [
        {
          "task": "Email sending to ledger",
          "issue": "Need CSV append function",
          "tried": ["localStorage JSON", "Direct file write"],
          "nextSteps": ["Implement CSV write to data/correspondence.csv"]
        }
      ],
      "commitHash": "7d4d622..abc1234",
      "filesChanged": ["index.html", "assets/style.css"],
      "tokenUsageStart": "35%",
      "tokenUsageEnd": "58%",
      "rating": null,
      "feedback": "Waiting for instructor feedback"
    }
  ]
}
```

I then read this, rate them, provide feedback, and move them to next task.

---

## How I Bring in Specialists

**Example: Needing Gemini**

I say to Gemini:
```
"Pull all appointment data from Matthew Herbert's Google Drive.
Location: Shared Drive → data/mattherbert01/
Find: All appointment files, transcripts, correspondence records
Convert to: CSV format (date, contact, topic, notes)
Save to: docs/drive_extracted_appointments.csv
Update conversation.json with what you found"
```

Gemini works → Reports to conversation.json → I integrate results.

---

## Example: Full Multi-Agent Session

**Your instruction to me:**
```
"Make Phase 2 happen. Theme toggle + Settings + Email working.
Use libbyclaudecode for UI, Gemini to extract real appointments 
from Drive, GPT if you need architecture help. Report progress 
in conversation.json every 30 min."
```

**What I do:**

1. **Direct libbyclaudecode:**
   - Task 1: Theme toggle (30 min)
   - Task 2: Settings panel (60 min)
   - Task 3: Email compose (45 min)
   - Acceptance criteria for each
   - Commit after each task

2. **Direct Gemini:**
   - Pull appointment files from Drive
   - Extract to CSV
   - Update context builder

3. **Direct GPT (if needed):**
   - Review email template architecture
   - Suggest pattern improvements
   - Rate code quality

4. **Synthesize:**
   - Merge all changes to main
   - Update conversation.json with consolidated status
   - Rate all agents
   - Flag blockers
   - Suggest next priorities

5. **Report to you:**
   - You read conversation.json
   - You see: libbyclaudecode did X, Gemini did Y, GPT did Z
   - Progress visible, no need to manage separate conversations

---

## Benefits of This Model

✅ **You stay focused** — Don't manage multiple agent conversations  
✅ **Clear direction** — Each agent knows exactly what to do  
✅ **Efficient coordination** — I handle handoffs between agents  
✅ **Better quality** — I rate work, identify issues, bring specialists  
✅ **Consolidated status** — conversation.json is single source of truth  
✅ **Scalable** — Can bring in 10 agents and you still just read one file  
✅ **Flexibility** — Easy to pivot, add priorities, bring new specialists  

---

## What I Need From You (Right Now)

Give me a briefing:

```
PRIORITY 1: [What matters most?]
PRIORITY 2: [Second priority?]
PRIORITY 3: [Third priority?]

CONSTRAINTS:
- [Any rules? No frameworks? etc]
- [Tech requirements?]
- [Timeline?]

SPECIALISTS TO USE:
- libbyclaudecode for: [Design/UI/features?]
- Gemini for: [Research/Drive/data?]
- GPT for: [Architecture/complex logic?]
- Others: [Anyone else?]

BUDGET:
- Current: claude 35%, libby 27%
- Use: All remaining tokens efficiently
```

Then I:
1. Break it into tasks
2. Direct all agents
3. Coordinate work
4. Update conversation.json
5. You check status when you want

---

## Ready?

Just tell me:
1. **What's the priority?** (theme + settings + email? or something else?)
2. **Which agents?** (libbyclaudecode for sure, bring Gemini? GPT?)
3. **Any constraints?** (timeline, tech requirements, etc)

I'll take it from there. You can go get Gemini/GPT onboarded knowing I'm coordinating everything.
