# Main Link Authentication Gate Requirement

Generated: 2026-04-28  
Status: required product behaviour  
Canonical public URL: `https://libbynatico.github.io/libby_live/`

## Product rule

The main link is public.

The private Libby app is not public.

Opening the main link should show a landing/login gate. A person should not be able to move into the private dashboard, calendar, letters, memory bank, worker cards, or evidence workspace unless they are authenticated and mapped to a Libby user account.

---

## Required front-door flow

```text
https://libbynatico.github.io/libby_live/
→ Libby landing/login gate
→ Sign in or create account
→ resolve identity provider subject
→ map to Libby user_id
→ load permitted cases
→ open correct workspace
```

---

## Required login options

### 1. Sign in with Apple

Required because the experience is iPhone/iPad-first.

Face ID can be used by the Apple device to approve Sign in with Apple, but Face ID itself is not the server-side account identity.

### 2. Google login

Required because Gmail, Google Drive, and Google Calendar are core Libby intake and memory-bank sources.

### 3. Passkey login

Preferred long-term route for Face ID-style login.

On Apple devices, Face ID can unlock the passkey, giving the user a Face ID acceptable login experience.

### 4. Create account

A new person should be able to create a Libby account, then connect Apple, Google, or passkey login.

### 5. Guest demo, if enabled

Guest mode may exist, but it must only load redacted/synthetic demo data.

Guest mode must never read private user cases, memory, calendar, evidence, letters, worker notes, or source files.

---

## Technical clarification

Face ID is not the account system by itself.

Correct model:

```text
Face ID
→ unlocks device credential/passkey or approves Sign in with Apple
→ authentication provider returns verified identity
→ Libby maps that identity to user_id and case permissions
```

---

## User mapping

### Matthew

```text
Apple/Google/passkey identity
→ user_id=001
→ case_001_life_librarian
→ private memory bank
→ live dashboard
```

### Kellsie

```text
Apple/Google/passkey identity
→ user_id=002
→ case_002_kellsie_private
→ shared household case only if explicitly granted
```

### Newfie Nikki

```text
Apple/Google/passkey identity
→ user_id=003
→ case_003_newfie_nikki_private
```

### Guest demo

```text
No account or guest mode
→ demo_001 only
→ case_demo_001 only
→ redacted/synthetic data only
```

---

## Access-control requirements

1. No private workspace without authentication.
2. No private memory without user_id resolution.
3. No cross-user memory leakage.
4. No shared household access unless explicitly granted.
5. No raw evidence in public repo or guest demo.
6. All account creation and login events should be audit logged.
7. All private exports should be tied to authenticated user_id and case_id.
8. Worker cards may have public seed versions, but user-specific notes must live in the secure memory bank.

---

## Recommended implementation path

### Fastest acceptable path

Use Firebase Auth:

- Google provider;
- Apple provider;
- passkey/WebAuthn support when available;
- Firestore or private backend mapping from auth subject to `user_id`;
- Cloud Storage or private Drive integration for evidence files.

### Alternative path

Use Supabase Auth:

- Google provider;
- Apple provider;
- Postgres user/case permission tables;
- Supabase Storage for private files;
- Row-level security for user/case separation.

### Avoid first

Avoid custom OAuth until after the MVP works.

---

## Root page behaviour

The root `index.html` should eventually become a small auth gate and router.

It should not contain stale case facts, hardcoded ODSP data, or demo evidence.

Required root buttons:

```text
Continue with Apple
Continue with Google
Create account
Use passkey
Guest demo, if enabled
```

After authentication:

```text
if user_id == 001 → open Matthew live dashboard
if user_id == 002 → open Kellsie workspace
if user_id == 003 → open Nikki workspace
if guest → open demo only
```

---

## Front-end mode gating

Before login, hide:

- dashboard;
- calendar;
- letters;
- memory bank;
- evidence;
- worker editor;
- private tasks;
- private chat;
- exports.

After login, show only the modes permitted for that user.

---

## One-line standard

`https://libbynatico.github.io/libby_live/` is the single front door; account creation or login is required before private Libby loads.
