# Government ID Verification Requirement

Generated: 2026-04-28  
Status: required privacy-sensitive design  
Applies to: account creation, onboarding, user verification, admin review

## Product decision

Libby may ask users to verify their account with government ID, but this must not block early onboarding or access to a limited dashboard.

The verification status should appear as a notification until completed.

For Newfie Nikki and other early users:

```text
Account/onboarding may continue.
Dashboard may open.
Verification status remains pending.
Libby reminds the user that ID verification is still needed.
```

---

## Critical privacy rule

Government ID photos are highly sensitive.

Do not collect front/back ID photos through a public static GitHub Pages prototype.

Do not store ID photos in:

- public GitHub;
- browser localStorage;
- plain JSON exports;
- unsecured email;
- unprotected Google Drive folders;
- demo data;
- screenshots.

ID upload should only be enabled after secure private storage is connected.

---

## Required user experience

During onboarding, show a card:

```text
Identity verification
Status: Pending

To fully verify your account later, Libby may ask for photos of the front and back of government ID.
This is not required to continue onboarding today.
Do not upload ID photos until secure storage is connected.
```

Buttons:

```text
Continue without ID for now
Notify me to verify later
Upload ID — disabled until secure storage is available
```

---

## Verification states

```text
not_started
pending
submitted
under_review
verified
rejected
expired
not_required
```

Default for new users:

```text
pending
```

---

## Non-blocking access rule

The user should be able to:

- complete onboarding;
- enter a limited workspace;
- create tasks;
- draft letters;
- create calendar reminders;
- export local onboarding packet.

The user should not be able to:

- use high-trust representative features;
- authorize direct sending on behalf of the user;
- share sensitive evidence widely;
- access advanced admin/representative functions;
- claim verified status.

until ID verification is complete.

---

## Secure storage requirement

When implemented with Supabase:

1. Create a private storage bucket, for example `identity-verification`.
2. Store front/back ID images as private objects.
3. Store only metadata and status in the database.
4. Enforce row-level security.
5. Allow upload by the account owner.
6. Allow review only by verified admins.
7. Log every admin access in `admin_access_logs` or a dedicated verification audit table.
8. Never expose public URLs for ID images.

---

## Database metadata should include

- profile_id;
- verification_status;
- front_object_path;
- back_object_path;
- submitted_at;
- reviewed_at;
- reviewed_by;
- review_notes;
- expiry/reminder date;
- audit log entries.

---

## Dashboard notification

Every daily briefing should include a verification reminder while status is pending:

```text
Account verification is still pending. This does not block today’s onboarding, but some higher-trust actions may stay locked until verification is complete.
```

---

## Admin review rule

Admin view may show:

- status;
- submission date;
- whether front/back are present;
- review actions.

Admin view must not show ID images casually on the main dashboard.

ID images should open only through an explicit review action with audit logging.

---

## One-line standard

ID verification should be visible and trackable, but never collected insecurely and never required to simply begin using Libby.
