# Account Creation, Consent, and User Intake Requirement

Generated: 2026-04-28  
Status: required product behaviour  
Applies to: Libby Live, account creation, secure memory bank, letters, user onboarding, and multi-user support

## Product requirement

Libby needs a real account creation and onboarding flow before it can responsibly store memory, draft letters for people, or share information with helpers.

The account creation flow must collect only the information required to provide the service, explain why it is being collected, ask for specific privacy/authorization choices, and record the user’s agreement.

The current public GitHub app is not the secure memory bank. Any account-intake page in the public repo must be treated as a local-first prototype until authentication, private storage, and audit logging are connected.

---

## Required flow

```text
Main link
→ Login / Create Account
→ Account intake
→ Contact profile
→ Letter identity profile
→ Consent and privacy sharing choices
→ Terms acknowledgement
→ Electronic signature
→ Create user_id
→ Store in secure memory bank
→ Load permitted workspace
```

---

## Account creation fields

### 1. Identity

Minimum:

- legal name;
- preferred name;
- date of birth or age confirmation;
- email;
- phone;
- mailing address;
- preferred communication method;
- accessibility/communication preferences.

For letters, the user should be able to choose which identity details appear in outgoing letters.

### 2. Contact and support circle

Optional but useful:

- trusted support person;
- relationship;
- support person email/phone;
- whether this person can view information;
- whether this person can help draft letters;
- whether this person can receive copies.

No support person should receive access by default.

### 3. Agency/provider contacts

Optional:

- agency/provider name;
- worker/provider name;
- role;
- email;
- phone;
- file/reference number;
- notes about communication preference.

### 4. Letter authorization profile

The user should explicitly choose what Libby can help with:

- draft letters only;
- draft and prepare attachments;
- prepare but require user approval before sending;
- send directly only after separate explicit authorization;
- never send directly.

Default should be:

```text
Draft only. User must review and send.
```

### 5. Connector permissions

Separate permissions should be requested for:

- Gmail;
- Google Drive;
- Google Calendar;
- Apple files/Shortcuts, if available;
- local uploads;
- contacts.

Each connector needs its own purpose statement.

### 6. Privacy-sharing scopes

Each user should explicitly choose whether Libby may:

- store private memory;
- store uploaded evidence;
- use information to draft letters;
- use information to create calendar/task reminders;
- share information with named support people;
- share information with named agencies/providers;
- use redacted/de-identified examples for demo/product improvement;
- use their case in investor/supporter demonstrations.

Default for demos must be:

```text
No demo use unless explicitly opted in and redacted.
```

### 7. Terms and acknowledgements

Required acknowledgement examples:

- I understand Libby is an assistance and drafting tool, not a lawyer, doctor, or government decision-maker.
- I understand I must review letters before they are sent.
- I understand Libby may be wrong and should not be treated as the only source of truth.
- I understand I can withdraw or change consent choices later.
- I understand private information should be stored only in the secure memory bank, not public GitHub.
- I agree to the Terms of Use.
- I agree to the Privacy Statement.

### 8. Electronic signature

Record:

- typed name;
- checkbox confirmation;
- timestamp;
- IP/device metadata when backend exists;
- version of terms/privacy shown;
- consent choices selected.

---

## User ID assignment

Production should not rely on a public JavaScript counter.

Correct backend model:

```text
new authenticated account
→ backend creates next available user_id or UUID
→ maps auth provider subject to user_id
→ creates private case_id
→ creates memory-bank folder/storage
→ logs creation event
```

For early internal testing, user IDs may be manually assigned:

```text
001 = Matthew
002 = Kellsie
003 = Newfie Nikki
004+ = next onboarded user
```

But production should use a backend-generated ID to avoid collisions.

---

## Consent rules

Consent must be meaningful, specific, and changeable.

The user must understand:

- what is collected;
- why it is collected;
- how it is used;
- who it may be shared with;
- what happens if they do not consent;
- how to withdraw consent.

Health, disability, benefits, and family information should be treated as sensitive.

---

## Privacy-first defaults

Default settings:

```text
Store memory: yes, only after login and only in secure private storage.
Draft letters: yes.
Send letters automatically: no.
Share with support people: no, unless selected.
Use in demo: no.
Use in investor presentation: no.
Use for product improvement: de-identified only if selected.
Public GitHub storage: never.
```

---

## Secure storage requirements

The completed intake packet must be stored in the secure memory bank, not public GitHub.

Minimum private storage objects:

- user profile;
- contact profile;
- accessibility/communication profile;
- consent profile;
- terms acceptance record;
- support-circle permissions;
- provider/agency contacts;
- audit log entry.

---

## Local prototype rule

A public static page may temporarily:

- collect form data locally in the browser;
- export onboarding JSON;
- demonstrate the flow.

It must not claim to have created a secure production account unless backend auth and storage are actually connected.

---

## One-line standard

No private Libby memory, letter drafting on behalf of another person, connector access, or support-person sharing should happen without account creation, consent, and secure storage.
