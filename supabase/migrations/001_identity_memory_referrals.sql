-- Libby Live: app-grade identity, memory, referrals, and private file storage.
-- Apply in Supabase SQL Editor before live user testing.

create extension if not exists pgcrypto;

create or replace function public.libby_code()
returns text
language sql
as $$ select upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 8)); $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  phone text,
  referral_code text unique not null default public.libby_code(),
  referred_by uuid references public.profiles(id) on delete set null,
  verification_status text not null default 'pending',
  preferred_contact_method text not null default 'written/email',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.circles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  circle_type text not null default 'household',
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.circle_members (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique(circle_id, user_id)
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  circle_id uuid references public.circles(id) on delete set null,
  intended_role text not null default 'member',
  max_uses int not null default 1,
  used_count int not null default 0,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.profiles(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  circle_id uuid references public.circles(id) on delete set null,
  memory_type text not null default 'note',
  title text,
  body text not null,
  source text,
  confidence text not null default 'user_provided',
  visibility text not null default 'private',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.profiles(id) on delete cascade,
  filename text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  status text not null default 'uploaded',
  created_at timestamptz not null default now()
);

create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending',
  request_note text not null default 'Government ID front/back requested later. Does not block first login.',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.circles enable row level security;
alter table public.circle_members enable row level security;
alter table public.referrals enable row level security;
alter table public.memories enable row level security;
alter table public.documents enable row level security;
alter table public.verification_requests enable row level security;

create policy if not exists profiles_own on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy if not exists circles_read on public.circles for select using (created_by = auth.uid() or exists (select 1 from public.circle_members m where m.circle_id = id and m.user_id = auth.uid() and m.status = 'active'));
create policy if not exists circles_create on public.circles for insert with check (created_by = auth.uid());
create policy if not exists members_read on public.circle_members for select using (user_id = auth.uid() or exists (select 1 from public.circles c where c.id = circle_id and c.created_by = auth.uid()));
create policy if not exists members_create_owner on public.circle_members for insert with check (exists (select 1 from public.circles c where c.id = circle_id and c.created_by = auth.uid()));
create policy if not exists referrals_owner on public.referrals for all using (created_by = auth.uid()) with check (created_by = auth.uid());
create policy if not exists memories_read on public.memories for select using (owner_user_id = auth.uid() or (visibility = 'circle' and exists (select 1 from public.circle_members m where m.circle_id = memories.circle_id and m.user_id = auth.uid() and m.status = 'active')));
create policy if not exists memories_write on public.memories for all using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());
create policy if not exists documents_own on public.documents for all using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());
create policy if not exists verification_own on public.verification_requests for all using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());

insert into storage.buckets (id, name, public) values ('libby-files', 'libby-files', false) on conflict (id) do nothing;

create policy if not exists storage_libby_read_own on storage.objects for select using (bucket_id = 'libby-files' and auth.uid()::text = (storage.foldername(name))[1]);
create policy if not exists storage_libby_insert_own on storage.objects for insert with check (bucket_id = 'libby-files' and auth.uid()::text = (storage.foldername(name))[1]);
create policy if not exists storage_libby_update_own on storage.objects for update using (bucket_id = 'libby-files' and auth.uid()::text = (storage.foldername(name))[1]);
create policy if not exists storage_libby_delete_own on storage.objects for delete using (bucket_id = 'libby-files' and auth.uid()::text = (storage.foldername(name))[1]);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
drop trigger if exists memories_touch on public.memories;
create trigger memories_touch before update on public.memories for each row execute function public.touch_updated_at();

create or replace function public.create_referral(circle_id_input uuid default null, role_input text default 'member')
returns public.referrals
language plpgsql security definer set search_path = public
as $$
declare r public.referrals; c text;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  loop c := public.libby_code(); exit when not exists(select 1 from public.referrals where code = c); end loop;
  insert into public.referrals(code, created_by, circle_id, intended_role)
  values (c, auth.uid(), circle_id_input, role_input)
  returning * into r;
  return r;
end; $$;

create or replace function public.claim_referral(code_input text)
returns void
language plpgsql security definer set search_path = public
as $$
declare r public.referrals;
begin
  if auth.uid() is null or code_input is null or length(trim(code_input)) = 0 then return; end if;
  select * into r from public.referrals
  where upper(code) = upper(trim(code_input))
    and used_count < max_uses
    and (expires_at is null or expires_at > now())
  limit 1 for update;
  if not found then raise exception 'Invalid or expired referral code'; end if;
  update public.profiles set referred_by = r.created_by where id = auth.uid();
  if r.circle_id is not null then
    insert into public.circle_members(circle_id, user_id, role, status)
    values (r.circle_id, auth.uid(), r.intended_role, 'active')
    on conflict(circle_id, user_id) do update set role = excluded.role, status = 'active';
  end if;
  update public.referrals set used_count = used_count + 1 where id = r.id;
end; $$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare cid uuid;
begin
  insert into public.profiles(id, email, display_name, phone, preferred_contact_method)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'preferred_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'preferred_contact_method', 'written/email')
  ) on conflict(id) do nothing;
  insert into public.verification_requests(owner_user_id) values(new.id) on conflict do nothing;
  insert into public.circles(name, circle_type, created_by)
  values(coalesce(new.raw_user_meta_data->>'display_name', 'Libby User') || ' Libby Space', 'household', new.id)
  returning id into cid;
  insert into public.circle_members(circle_id, user_id, role, status)
  values(cid, new.id, 'owner', 'active') on conflict do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

grant usage on schema public to anon, authenticated;
grant execute on function public.create_referral(uuid, text) to authenticated;
grant execute on function public.claim_referral(text) to authenticated;
