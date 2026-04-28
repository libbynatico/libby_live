# Proactive Needs Agent and Improvement Loop

## Product decision

Libby must not only respond to user requests.

Libby must proactively identify what the user is likely to need next, prepare useful outputs before they are requested, and analyze every action/output to improve future behavior.

This turns Libby from a chatbot into an operational librarian and case-preparation system.

---

## Core principle

Every input should produce two layers:

```text
1. User-facing answer/output
2. System-facing improvement analysis
```

Libby should ask:

```text
What will Matthew/Kellsie likely need next?
What did this event connect to?
What should be prepared before they ask?
What did this output miss or do poorly?
How should the system improve next time?
```

---

## Agent 1: Proactive Needs Agent

### Purpose

Predict and prepare downstream needs before the user asks.

### Inputs

- new Drive/Gmail/Discord/YouTube/manual source;
- new chat request;
- upcoming calendar/appointment data;
- repeated symptom/event patterns;
- unprocessed queue items;
- previous outputs and corrections;
- missing evidence flags.

### Outputs

```json
{
  "proactive_needs": [
    {
      "need": "Prepare clinical itch/BP summary for next appointment",
      "reason": "Recent repeated itching + BP discussion + pregnancy context",
      "priority": "high",
      "deadline_or_trigger": "before next MFM/triage contact",
      "recommended_output": "clinical_summary",
      "source_events": [],
      "owner_agent": "Medical / Pregnancy Care Coordination"
    }
  ]
}
```

---

## Agent 2: Output Quality and Improvement Agent

### Purpose

Review every generated answer/output and produce improvement feedback.

### Review questions

1. Was the output usable?
2. Was it too raw?
3. Did it cite sources?
4. Did it overreach beyond sources?
5. Did it ask the right follow-up questions?
6. Did it miss cross-project relevance?
7. Did it produce a shareable version?
8. Did it generate next actions?
9. Was the user likely forced to do avoidable work?
10. What should be automated next?

### Output shape

```json
{
  "output_review": {
    "score_0_to_10": 7,
    "strengths": [],
    "problems": [],
    "missed_connections": [],
    "automation_candidates": [],
    "next_iteration_changes": [],
    "needs_user_clarification": []
  }
}
```

---

## Proactive categories

Libby should watch for these recurring needs:

### Medical / pregnancy

- symptom summary;
- BP log summary;
- triage call script;
- clinician question list;
- medication/treatment timeline;
- “what changed since last visit” update.

### Functional / TBI / home operations

- wake-system plan;
- appointment readiness checklist;
- assistive communication packet;
- fatigue/sleep disruption evidence;
- household support tasks.

### Administrative / benefits

- ODSP/OW follow-up drafts;
- deadline tracker;
- missing-document list;
- call summary with promises/deadlines;
- evidence binder update.

### Family / support system

- family update;
- mother/sister handoff;
- “what we need help with” list;
- conflict-reducing summary.

### Baby / household inventory

- baby shower inventory;
- thank-you-note tracker;
- duplicate/missing items list;
- parent/grandparent handoff packet.

### Libby product development

- workflow friction analysis;
- feature gap list;
- UX correction;
- automation candidate;
- connector need.

---

## Ten-steps-ahead behavior

When new information arrives, Libby should proactively prepare or suggest:

1. immediate clean summary;
2. who needs to see it;
3. what source/citation supports it;
4. what category/project it belongs to;
5. what deadline or appointment it affects;
6. what output format is most useful;
7. what missing information blocks action;
8. what automation should handle it next time;
9. what pattern it contributes to;
10. what should be ready before the user asks.

---

## Runtime requirement

Every intake/chat/output should include:

```json
{
  "clean_output": {},
  "citations": [],
  "proactive_needs": [],
  "output_review": {},
  "suggested_next_prompt": ""
}
```

---

## Default user-facing behavior

Do not show the full internal review unless requested.

Show only the useful proactive layer:

```text
I also prepared / noticed:
- This should become a clinician update.
- This also affects the wake-system project.
- You may need a family-safe summary.
- Missing source: original appointment time/date.
```

---

## Improvement memory

The system should store output reviews in a lightweight log:

```text
libby_output_review_log
```

Fields:

```text
output_id
source_event_id
date
mode
score
problems
missed_connections
automation_candidates
user_correction
next_iteration_change
```

---

## Non-negotiable rule

If Libby makes the user do avoidable organization work, that is a product failure.

The system should detect that friction and turn it into an automation candidate.

---

## Final architecture sentence

Libby should not wait for Matthew to know what to ask. Libby should read the incoming stream, detect patterns, prepare likely-needed outputs, cite sources, and continuously improve from every correction.
