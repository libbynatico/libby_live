# Agent Collaboration Protocol — Handshake & Heartbeat System

**Purpose:** Track work, quality, and coordination between Claude agents working on Libby Live.

**File:** `conversation.json` (root directory)

---

## How It Works

### Before Starting a Session

1. **Read** `conversation.json`
2. Check:
   - What's the current phase?
   - What agent was last active?
   - What are the blockers?
   - What's the priority order?

### While Working

- Complete one major task at a time
- Focus on high-value work from the priority list
- If you get blocked, note it in the file
- Commit code frequently

### After Completing a Task

Update `conversation.json`:

```json
{
  "lastUpdated": "2026-04-22T20:30:00Z",
  "activeAgent": "libbyclaudecode",
  "agents": {
    "libbyclaudecode": {
      "lastActive": "2026-04-22T20:30:00Z",
      "tasksCompleted": [
        "Previous tasks...",
        "✅ Implemented dark/light theme toggle"
      ]
    }
  },
  "sessionHistory": [
    {
      "existing entries..."
    },
    {
      "session": 2,
      "agent": "libbyclaudecode",
      "date": "2026-04-22",
      "goals": [
        "Implement dark/light theme",
        "Build settings panel"
      ],
      "accomplished": [
        "✅ Dark/light theme with localStorage persistence",
        "✅ Settings panel opened in modal",
        "✅ Theme toggle in top-right header"
      ],
      "issues": [
        "Modal overflow on mobile (fixed with max-height)"
      ],
      "tokenUsageStart": "35%",
      "tokenUsageEnd": "62%",
      "notes": "Theme switching is smooth. Settings panel needs more work next session."
    }
  ]
}
```

---

## Rating System (5 Dimensions)

After each session, rate the other agent. Use honest feedback.

**Dimensions:**

1. **Code Quality** (1-5)
   - Is it clean, maintainable, following patterns?
   - No magic, no hacks, no dependencies?
   - Future-proof?

2. **Feature Completeness** (1-5)
   - Did it do what was asked?
   - No gaps, edge cases handled?
   - Works end-to-end?

3. **UX/Polish** (1-5)
   - Does it look professional?
   - Smooth interactions, good typography?
   - Accessible, responsive?

4. **Documentation** (1-5)
   - Clear explanations?
   - Handoff notes good?
   - Future coder can understand?

5. **Communication** (1-5)
   - Clear status updates?
   - Asked for clarification when needed?
   - Proactive, not reactive?

**Format:**
```json
{
  "ratings": {
    "Code Quality": 4,
    "Feature Completeness": 5,
    "UX/Polish": 3,
    "Documentation": 5,
    "Communication": 5
  },
  "average": 4.4,
  "feedback": "Strong work. Theme toggle is smooth. Settings panel needs more polish in Phase 3."
}
```

---

## Priority Queue (Current Phase 2)

Work in this order:

1. **Dark/Light Theme Toggle** — High impact, foundation for polish
2. **Settings Panel** — Controls all features, must be comprehensive
3. **Email Compose + Templates** — High user value
4. **Connector Status Dashboard** — Shows integration state
5. **Mobile Responsive** — Ensure usable on any device

Each task should:
- Have a clear done criteria
- Be testable (no stubbed functionality)
- Include helpful error messages
- Be accessible (WCAG AA)

---

## Blocker Escalation

If you hit a blocker:

1. **Try 2 approaches** before declaring blocked
2. **Document the issue** in `conversation.json` under `"blockers"`
3. **Suggest next steps** for whoever picks it up
4. **Don't proceed** until resolved (no workarounds)

Example:
```json
{
  "blockers": [
    {
      "task": "Google Calendar OAuth",
      "issue": "Supabase project doesn't have OAuth provider configured",
      "tried": [
        "Direct Google OAuth API",
        "Supabase docs"
      ],
      "nextSteps": [
        "Check Supabase dashboard settings",
        "Verify client_id + client_secret"
      ]
    }
  ]
}
```

---

## Handoff Checklist

Before handing off to next agent:

- [ ] Code committed to main with clear commit messages
- [ ] `conversation.json` updated with session details
- [ ] All blockers documented
- [ ] Next priority clearly stated
- [ ] No broken code (tests pass, website loads)
- [ ] README or guide for what was done
- [ ] Rating provided for previous agent

---

## File Structure

```json
{
  "project": "...",
  "version": "2.04.0",
  "lastUpdated": "ISO timestamp",
  "activeAgent": "current agent name",
  
  "agents": {
    "agent_name": {
      "role": "...",
      "lastActive": "...",
      "sessionsCompleted": 0,
      "tasksCompleted": [],
      "rating": 4.2,
      "notes": "..."
    }
  },
  
  "currentPhase": {
    "number": 2,
    "name": "...",
    "status": "in_progress",
    "priority": [],
    "estimatedTokens": "~40%",
    "owner": "agent_name"
  },
  
  "blockers": [],
  
  "nextMilestone": {
    "name": "v2.05.0",
    "target": "Next session",
    "criteria": []
  },
  
  "handoff": {
    "from": "...",
    "to": "...",
    "timestamp": "...",
    "context": { ... },
    "message": "..."
  },
  
  "ratingSystem": {
    "scale": "1-5 stars",
    "dimensions": [],
    "example": { ... }
  },
  
  "sessionHistory": [
    {
      "session": 1,
      "agent": "...",
      "date": "...",
      "goals": [],
      "accomplished": [],
      "issues": [],
      "tokenUsageStart": "35%",
      "tokenUsageEnd": "62%",
      "ratings": { ... },
      "feedback": "..."
    }
  ],
  
  "collaboration": {
    "protocol": "...",
    "heartbeat": "...",
    "handshake": "..."
  }
}
```

---

## Quick Reference

| Agent | Role | Last Active | Rating |
|-------|------|-------------|--------|
| claude | Primary builder | 2026-04-22 | TBD |
| libbyclaudecode | Design implementation | Awaiting start | TBD |

**Current Phase:** 2 (Design Polish + Features)  
**Active Agent:** libbyclaudecode (next)  
**Priority:** Dark/light theme → Settings → Email → Connectors  
**Blockers:** None  

---

## Example Session Flow

**Session 2 (libbyclaudecode):**

1. Read `conversation.json` → Understand Phase 2 priorities
2. Start with dark/light theme (highest priority)
3. After theme is done:
   - Commit code
   - Update `conversation.json` sessionHistory
   - Add accomplishments + issues
   - Rate claude's previous work
4. Move to settings panel
5. At end of session:
   - Update `activeAgent` to next person
   - Document blockers
   - Leave clear handoff notes
   - Commit conversation.json

---

## Benefits

✅ **Clear handoffs** — Know exactly what's done and what's next  
✅ **Quality feedback** — Rate each other honestly  
✅ **Progress tracking** — See what's been built  
✅ **Accountability** — Everyone knows what they're responsible for  
✅ **Context recovery** — New session? Read the JSON, get up to speed in 2 min  

---

This is your "Life Librarian" agent coordination pattern for the Libby project. Keep it updated, be honest with ratings, and communicate clearly.
