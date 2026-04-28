# Libby Runtime Protocol: Heartbeat, Handshake, Blinks, Memory, Skills

Generated: 2026-04-28  
Timezone: America/Toronto  
Public safety mode: ON — this file describes system behaviour without publishing raw private evidence.

## Purpose

This protocol gives Libby a durable operating rhythm. It defines how the system knows what happened, what changed, what needs attention, what is safe to remember, and what can be handed to a human or another agent without losing context.

The goal is to make Libby usable in two modes at once:

1. **Live field mode** — Matthew can use the system during a meeting, appointment, family discussion, or support call.
2. **Investor / teammate demo mode** — a helper can see the architecture, constraints, evidence discipline, and product direction without needing access to private records.

---

## Runtime Objects

### 1. Heartbeat

A heartbeat is the recurring status check of the whole system.

It answers:

- Is Libby alive?
- What changed since the last check?
- What inputs arrived?
- What outputs were generated?
- What remains unprocessed?
- What needs human attention?
- What is blocked because evidence is missing?

Minimum heartbeat shape:

```json
{
  "heartbeat_id": "hb_001_YYYYMMDD_NNN",
  "user_id": "001",
  "created_at": "ISO-8601 timestamp with America/Toronto offset",
  "mode": "live | demo | intake | recovery | meeting | pitch",
  "system_status": "green | yellow | red",
  "new_inputs": [],
  "new_outputs": [],
  "stale_items": [],
  "urgent_blinks": [],
  "blocked_items": [],
  "next_best_actions": []
}
```

Suggested heartbeat cadence:

- Manual: whenever Matthew opens Libby.
- Meeting mode: before, during, and after a meeting.
- Intake mode: after Gmail/Drive queue changes.
- Nightly: summarize unprocessed inputs and tomorrow’s calendar.

---

### 2. Handshake

A handshake is the safe transfer packet between people, devices, agents, or sessions.

It answers:

- Who is this for?
- What is the current situation?
- What should the next person know first?
- What must not be assumed?
- What is source-backed vs user-reported?
- What is the next action?

Minimum handshake shape:

```json
{
  "handshake_id": "hs_001_YYYYMMDD_NNN",
  "user_id": "001",
  "audience": "teammate | clinician | family | investor | worker | AI agent",
  "created_at": "ISO-8601 timestamp",
  "context_tldr": "short readable summary",
  "current_objective": "what we are trying to accomplish now",
  "confirmed_facts": [],
  "reported_facts": [],
  "source_gaps": [],
  "risks_if_missed": [],
  "next_actions": [],
  "do_not_do": []
}
```

Handshakes should be created before:

- a live meeting;
- a phone call;
- a medical appointment;
- handing work to Zach / Claude / Gemini / another helper;
- showing the system to a potential supporter or investor;
- pushing a major repo change.

---

### 3. Blinks

A blink is a small, fast signal that something may need attention.

Examples:

- New email with attachment arrived.
- Calendar event is today.
- Audio file is too large and needs splitting.
- A source was added but not indexed.
- A deadline is near.
- A generated output lacks citations.
- A transcript failed.
- A meeting note contains a promise, deadline, or escalation path.

Blink shape:

```json
{
  "blink_id": "blink_001_YYYYMMDD_NNN",
  "user_id": "001",
  "created_at": "ISO-8601 timestamp",
  "type": "deadline | source_gap | failed_job | meeting | health_admin | product_gap | evidence_ready",
  "severity": "info | watch | urgent | blocked",
  "message": "human-readable signal",
  "linked_source_id": null,
  "linked_task_id": null,
  "recommended_action": "what Libby should do next"
}
```

Blink rules:

- Blinks are not conclusions.
- Blinks are signals that need routing, review, or action.
- Urgent blinks should appear in the live console.
- Low-severity blinks can roll into the next heartbeat.

---

### 4. Memory

A memory is a durable fact, preference, pattern, or instruction.

Memory must always carry a confidence level and provenance status.

Memory confidence:

- `confirmed_source`: supported by a document, email, transcript, image, calendar item, or file.
- `user_reported`: supplied by Matthew or a trusted helper, not yet independently sourced.
- `derived_pattern`: inferred from repeated events; must not be treated as a fact without review.
- `placeholder`: system scaffold; not real evidence.

Minimum memory shape:

```json
{
  "memory_id": "mem_001_YYYYMMDD_NNN",
  "user_id": "001",
  "category": "medical | benefits | family | housing | communication | product | preference | workflow",
  "statement": "atomic memory statement",
  "confidence": "confirmed_source | user_reported | derived_pattern | placeholder",
  "source_ids": [],
  "last_reviewed_at": "ISO-8601 timestamp",
  "public_safe": false,
  "use_in_outputs": true
}
```

Private details belong in a private evidence store, not in the public GitHub repo.

---

### 5. Skills

A skill is a repeatable operation Libby can perform.

Examples:

- Clean transcript into family-safe update.
- Convert call transcript into evidence item.
- Build ODSP meeting brief.
- Create clinician one-page summary.
- Ingest Gmail label into queue.
- Detect missing citations.
- Split large audio.
- Generate investor demo brief.

Skill shape:

```json
{
  "skill_id": "skill_name",
  "name": "Readable skill name",
  "status": "planned | draft | working | blocked | deprecated",
  "input_types": [],
  "output_types": [],
  "requires_sources": true,
  "privacy_level": "public_safe | private_case | restricted",
  "runtime": "manual | browser | apps_script | github_action | local_worker | api_worker",
  "next_build_step": "specific next implementation step"
}
```

---

## Runtime Loop

Every meaningful Libby interaction should follow this loop:

```text
Input arrives
→ Create blink
→ Classify source and topic
→ Update heartbeat
→ Decide whether memory should be created or updated
→ Decide which skill should run
→ Generate user-facing output
→ Generate internal quality review
→ Add next-best-action
→ Prepare handshake if another person/session needs context
```

---

## Non-Negotiable Safety Rules

1. Public GitHub gets schemas, redacted demo data, and architecture only.
2. Private case files stay in private Drive/Gmail/local vault until access controls are ready.
3. No medical, benefits, legal, or family claim is presented as confirmed unless source-backed.
4. Every polished output should show what is confirmed, what is reported, what is missing, and what needs review.
5. If the system forces Matthew to organize avoidable mess by hand, that friction becomes an automation candidate.

---

## One-Line Product Definition

Libby is a heartbeat-driven life librarian that converts scattered evidence into live handshakes, urgent blinks, durable memory, repeatable skills, and source-backed human-facing outputs.
