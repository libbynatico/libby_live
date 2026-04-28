-- Libby identity verification schema
-- Generated: 2026-04-28
-- Purpose: non-blocking government ID verification metadata and secure storage policy notes.
-- Run inside Supabase SQL editor after core auth/profile schema exists.

-- Required private storage bucket, create from Supabase Storage UI or SQL if available:
-- bucket name: identity-verification
-- public: false

create table if not exists public.identity_verifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  user_id text not null,
  verification_status text not null default 'pending' check (verification_status in (
    'not_started',
    'pending',
    'submitted',
    'under_review',
    'verified',
    'rejected',
    'expired',
    'not_required'
  )),
  front_object_path text,
  back_object_path text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  review_notes text,
  reminder_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists identity_verifications_profile_id_idx on public.identity_verifications(profile_id);
create index if not exists identity_verifications_user_id_idx on public.identity_verifications(user_id);
create index if not exists identity_verifications_status_idx on public.identity_verifications(verification_status);

alter table public.identity_verifications enable row level security;

-- Account owners may read their own verification metadata.
create policy "Users can read own identity verification metadata"
  on public.identity_verifications
  for select
  using (profile_id in (select id from public.profiles where auth_user_id = auth.uid()));

-- Account owners may insert their own verification metadata.
create policy "Users can insert own identity verification metadata"
  on public.identity_verifications
  for insert
  with check (profile_id in (select id from public.profiles where auth_user_id = auth.uid()));

-- Account owners may update their own record only before admin review is underway.
create policy "Users can update own pending identity verification metadata"
  on public.identity_verifications
  for update
  using (
    profile_id in (select id from public.profiles where auth_user_id = auth.uid())
    and verification_status in ('not_started', 'pending', 'submitted')
  )
  with check (
    profile_id in (select id from public.profiles where auth_user_id = auth.uid())
  );

-- Admin review policy assumes profiles.role exists and can equal 'admin'.
create policy "Admins can review identity verification metadata"
  on public.identity_verifications
  for all
  using (exists (select 1 from public.profiles p where p.auth_user_id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.auth_user_id = auth.uid() and p.role = 'admin'));

-- Optional audit table for review access.
create table if not exists public.identity_verification_audit_logs (
  id uuid primary key default gen_random_uuid(),
  verification_id uuid not null references public.identity_verifications(id) on delete cascade,
  actor_profile_id uuid references public.profiles(id),
  action text not null,
  reason text,
  created_at timestamptz not null default now()
);

alter table public.identity_verification_audit_logs enable row level security;

create policy "Admins can read identity verification audit logs"
  on public.identity_verification_audit_logs
  for select
  using (exists (select 1 from public.profiles p where p.auth_user_id = auth.uid() and p.role = 'admin'));

create policy "Admins can insert identity verification audit logs"
  on public.identity_verification_audit_logs
  for insert
  with check (exists (select 1 from public.profiles p where p.auth_user_id = auth.uid() and p.role = 'admin'));

-- Storage policy notes for private bucket identity-verification:
-- Object paths should be scoped by user_id/profile_id, for example:
-- user_003/<verification_id>/front.jpg
-- user_003/<verification_id>/back.jpg
--
-- Recommended storage policies:
-- 1. User may upload to their own folder only.
-- 2. User may read their own uploaded objects.
-- 3. Admin may read objects only during explicit review.
-- 4. No public object URLs.
-- 5. All admin object access should be logged in identity_verification_audit_logs.
