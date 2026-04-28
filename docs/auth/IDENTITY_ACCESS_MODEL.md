# Libby Identity and Access Model

Generated: 2026-04-28  
Status: system design scaffold  
Applies to: `libby_live`, future `libby_demo`, private case vault, and multi-user onboarding

## Product decision

Libby needs two separate experiences:

1. **`libby_live`** — authenticated real-user workspace.
2. **`libby_demo`** — redacted investor / supporter / public walkthrough using mild, non-sensitive, demo-safe case material.

The live system must support multiple users, including:

- `userid=001` — founding user / Patient Zero.
- `userid=002` — Kellsie onboarding profile.
- `userid=003` — Newfie Nikki onboarding profile.

The demo system may use synthetic, redacted, or mild versions of real workflows, but must not expose raw private evidence.

---

## Authentication direction

### Preferred authentication providers

Libby should support:

- Google OAuth for users who already live in Gmail / Google Drive / Google Calendar.
- Sign in with Apple for iPhone/iPad-first users.
- Passkeys / platform biometrics where available.

Important clarification:

- Face ID itself is not the cloud identity provider.
- Face ID can unlock a passkey or device credential.
- Sign in with Apple is the Apple identity provider.
- Google OAuth is the Google identity provider.

The app should not store passwords.

---

## Identity objects

### User

```json
{
  "user_id": "001",
  "auth_subjects": [
    {
      "provider": "google",
      "provider_subject_id": "opaque_google_sub",
      "email": "user@example.com",
      "verified": true
    },
    {
      "provider": "apple",
      "provider_subject_id": "opaque_apple_sub",
      "email": "private_relay_or_user_email@example.com",
      "verified": true
    }
  ],
  "display_name": "User display name",
  "role": "case_owner | support_person | demo_viewer | admin",
  "case_ids": ["case_001"],
  "created_at": "ISO-8601 timestamp",
  "status": "active | invited | suspended | demo_only"
}
```

### Case

```json
{
  "case_id": "case_001",
  "primary_user_id": "001",
  "case_type": "life_librarian | demo | family_support | advocacy",
  "privacy_level": "private | shared_family | demo_redacted | public_safe",
  "allowed_user_ids": ["001"],
  "default_calendar_id": null,
  "default_drive_root": null,
  "created_at": "ISO-8601 timestamp"
}
```

### Session

```json
{
  "session_id": "sess_001_timestamp",
  "user_id": "001",
  "case_id": "case_001",
  "mode": "live | demo | meeting | intake | admin | pitch",
  "created_at": "ISO-8601 timestamp",
  "device_type": "iphone | ipad | mac | windows | unknown",
  "last_heartbeat_at": "ISO-8601 timestamp"
}
```

---

## Role model

### `case_owner`

Can:

- view private case data;
- connect Gmail/Drive/Calendar;
- add evidence;
- generate outputs;
- approve sharing;
- invite support users.

### `support_person`

Can:

- view only explicitly shared items;
- help create summaries and outputs;
- add notes if permitted;
- see handshakes assigned to them.

Cannot:

- see full private evidence vault by default;
- export raw source files unless granted;
- impersonate the case owner.

### `admin`

Can:

- manage app configuration;
- manage repo/deployment;
- debug system health;
- see redacted telemetry by default.

Should not automatically see private case content unless explicitly granted.

### `demo_viewer`

Can:

- view redacted demo material;
- click through workflows;
- understand product value;
- see system gaps and device/infrastructure ask.

Cannot:

- access real user evidence;
- access private calendar;
- access private Gmail/Drive;
- trigger real messages or exports.

---

## Live vs demo boundary

### `libby_live`

Real app. Requires authentication.

Contains:

- actual user workspace;
- private case vault connection;
- Gmail/Drive/Calendar connectors;
- source-backed memory;
- real tasks and blinks;
- private handshakes;
- export tools.

### `libby_demo`

Safe pitch/demo app. Public or controlled-access.

Contains:

- synthetic or redacted version of `userid=001`;
- mild life operations scenario;
- fake or anonymized evidence;
- demo heartbeat;
- demo blinks;
- demo handshakes;
- investor story;
- device/support ask.

### Hard rule

No raw private case evidence should be copied from `libby_live` to `libby_demo` without explicit redaction and review.

---

## Multi-user onboarding plan

### `userid=001`

Purpose:

- founding case;
- real workflow proving ground;
- private life librarian;
- investor demo inspiration, but not public raw data.

### `userid=002`

Purpose:

- Kellsie onboarding;
- separate user identity;
- shared household/family workflows where consented;
- pregnancy/household support planning only where explicitly allowed.

### `userid=003`

Purpose:

- Newfie Nikki onboarding;
- second user pattern validation;
- prove Libby is not only one person’s custom notebook;
- test repeatable intake, memory, and output generation.

---

## Access-control rules

1. A user can own multiple cases.
2. A case can have multiple users.
3. Every evidence item belongs to a case.
4. Every output must record which case generated it.
5. Shared household items must not automatically expose each person’s private records.
6. Demo data must be marked `demo_redacted` or `synthetic`.
7. Public repo data must be safe if indexed by search engines.
8. Google/Apple identity IDs must be treated as secrets/private identifiers.

---

## What is missing technically

### Authentication implementation

Need to choose one path:

- Firebase Authentication with Google + Apple providers;
- Supabase Auth with Google + Apple providers;
- Auth.js / NextAuth if the app moves to a Next.js backend;
- custom OAuth only later, not recommended first.

### Authorization storage

Need a private database for:

- users;
- auth subjects;
- cases;
- memberships;
- roles;
- permissions;
- audit logs;
- connected accounts.

### Private vault

Need non-public storage for:

- source files;
- transcripts;
- OCR text;
- private calendar/event data;
- generated private outputs;
- user-specific memory.

### Audit log

Need to log:

- sign-ins;
- connector access;
- evidence viewed;
- exports generated;
- permissions changed;
- demo/private boundary crossings.

---

## Implementation order

1. Add `users_manifest_seed.json` for public-safe seed users.
2. Add demo/live boundary doc.
3. Add `demo_mode` flag to UI.
4. Add login placeholder screen.
5. Choose Firebase/Supabase/Auth.js.
6. Implement Google login first.
7. Add Apple login/passkey support second.
8. Add user-to-case mapping.
9. Add private vault storage.
10. Add Kellsie and Newfie Nikki invite flow.

---

## One-line rule

`libby_live` is where real people sign in and work; `libby_demo` is where supporters understand the mission without seeing private evidence.
