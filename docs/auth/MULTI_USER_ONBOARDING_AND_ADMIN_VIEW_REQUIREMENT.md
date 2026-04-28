# Multi-User Onboarding and Admin View Requirement

Generated: 2026-04-28  
Status: required product behaviour  
Immediate use case: Newfie Nikki onboarding from iPad

## Product requirement

Libby needs a seamless new-user onboarding path that works from an iPad and creates a user workspace without exposing private information publicly.

The first non-Matthew onboarding target is:

```text
user_id=003
Display label: Newfie Nikki
Status: invited / onboarding
```

The same system must also support an admin/debug mode where an authorized admin can select a user_id and view the user’s dashboard in the same dashboard style that the user sees.

---

## Immediate demo/onboarding flow

```text
Nikki opens invite link
→ sees Libby account creation / consent page
→ enters contact and communication info
→ reviews privacy and letter authorization choices
→ electronically signs acknowledgement
→ creates local onboarding packet
→ exports or saves onboarding JSON
→ continues into her Libby workspace shell
```

Until real auth/backend is connected, the page must clearly say:

```text
This is a local-first onboarding packet.
It is not yet a secure production account.
Export or submit this packet only through a secure channel.
```

---

## Prepopulation rule

Known information about Nikki may be prefilled only if it is safe and minimal.

Allowed public-safe defaults:

- display label: Newfie Nikki;
- provisional user_id: 003;
- status: invited;
- role: second-user validation;
- blank contact fields for user completion.

Do not store private medical, legal, benefits, family, financial, address, or health details for Nikki in public GitHub.

---

## Account creation fields

Minimum fields:

- legal name;
- preferred name;
- email;
- phone;
- mailing address;
- preferred communication method;
- accessibility/communication preferences;
- emergency/support contact, optional;
- agencies/providers/workers, optional;
- what Libby can help draft;
- privacy-sharing choices;
- terms/privacy acknowledgement;
- typed electronic signature.

---

## Letter authorization defaults

Default must be safe:

```text
Libby may draft letters for review.
Libby may not send directly.
User must review before anything is sent.
```

The user can later choose stronger permissions, but not by default.

---

## Admin view requirement

Authorized admin should be able to:

- select user_id;
- view dashboard as that user;
- inspect user-specific tasks, calendar, memory status, outputs, and worker behaviour;
- debug without changing data unless explicitly editing;
- see which mode is active: admin-view, user-view, demo-view, or local-dev.

Admin must not automatically bypass privacy rules in production.

Production admin mode must require:

- authentication;
- admin role;
- audit log;
- clear “viewing as user” banner;
- reason for access;
- read-only default;
- explicit edit mode.

---

## Local prototype rule

In the static GitHub Pages prototype, admin mode can exist as a local debugging surface only.

It must be labelled:

```text
Local dev admin viewer — not production auth.
```

---

## Required user IDs

```text
001 = Matthew / founding user
002 = Kellsie / invited placeholder
003 = Newfie Nikki / invited onboarding
004+ = future users, backend assigned
```

Production should use backend-generated IDs or UUIDs to prevent collisions.

---

## Secure backend requirement

Real user onboarding must eventually create:

- authenticated account;
- user profile;
- private case_id;
- secure memory-bank folder/storage;
- consent record;
- terms acceptance record;
- audit log;
- permissions map;
- dashboard state.

---

## One-line standard

Nikki should be able to open one invite link on iPad, create her Libby account, consent to what Libby can do, and enter a workspace that can later be administered and debugged without leaking private information.
