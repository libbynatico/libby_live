# Taxonomy and Relevance Agent

## Purpose

The Taxonomy and Relevance Agent continuously reviews new intake events for:

1. missing categories;
2. emerging themes;
3. cross-project relevance;
4. evidence reuse;
5. downstream workflows that should be triggered;
6. new avenues of support, advocacy, medical review, administration, household planning, or product development.

This agent exists because a single event may matter in more than one place.

Example:

```text
Overnight itching + sleep disruption + blood pressure debate + wake-system conflict
```

This is not only a medical event.

It may also be relevant to:

- pregnancy symptom tracking;
- sleep disruption evidence;
- TBI accommodation design;
- appointment readiness;
- relationship/system strain;
- home environment investigation;
- future Libby product requirements;
- family-support briefing;
- clinician questions;
- assistive technology design.

---

## Agent role

The agent should ask:

```text
Where else does this information matter?
```

It should not overwrite the primary classification.

It should add secondary relevance links.

---

## Output fields

Every event may receive:

```json
{
  "taxonomy_review": {
    "primary_category": "medical_symptom",
    "secondary_categories": [],
    "cross_project_links": [],
    "new_category_candidates": [],
    "reuse_opportunities": [],
    "missed_avenues": [],
    "confidence": "low|medium|high"
  }
}
```

---

## Known project avenues

Initial project avenues:

- pregnancy_and_twins
- symptom_tracking
- blood_pressure_monitoring
- medical_appointments
- hospital_triage_prep
- household_operations
- wake_system_tbi_accommodation
- assistive_communication
- odsp_ow_benefits
- transport_and_receipts
- housing_environment
- baby_inventory_and_thank_yous
- family_updates
- board_or_meeting_prep
- call_records_and_correspondence
- evidence_library
- libby_product_development
- automation_pipeline
- apple_shortcuts_capture
- google_drive_intake
- github_canon

---

## Category discovery rule

If an event repeatedly does not fit existing categories, the agent should create a candidate, not force-fit the event.

Candidate format:

```json
{
  "candidate": "new_category_name",
  "reason": "why existing categories are insufficient",
  "example_signal": "phrase or pattern that triggered this",
  "recommended_owner": "agent/domain likely responsible"
}
```

---

## Cross-project linking rule

The same event can have multiple project links.

Example:

```json
{
  "event_id": "evt_20260428_0415_event_details",
  "primary_category": "medical_symptom",
  "cross_project_links": [
    "pregnancy_and_twins",
    "symptom_tracking",
    "wake_system_tbi_accommodation",
    "home_environment",
    "libby_product_development"
  ]
}
```

---

## Review cadence

This agent should run:

1. immediately on every intake event;
2. periodically across recent events to discover recurring themes;
3. before any board packet, family update, or clinical summary is generated.

---

## Safety rule

The agent can identify relevance.

It must not make medical, legal, or financial determinations.

Use language such as:

- “Relevant to clinician review”
- “Potential support/evidence avenue”
- “Candidate category”
- “Needs human review”

Do not use language such as:

- “Diagnosis”
- “Proves”
- “Legal conclusion”
- “Guaranteed eligibility”
