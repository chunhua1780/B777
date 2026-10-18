-- B777 Question Bank — paid access flag.
-- One row per user who has paid (or been manually granted access) — presence
-- of a row means "paid", there is nothing else to check. No real payment
-- processor is wired up yet: the admin grants/revokes this from the Admin
-- Dashboard's Users list after confirming payment through whatever channel
-- (WeChat/Alipay transfer, cash, etc.) until a real checkout is added later.
-- Everyone can read their OWN row (so the app can gate their own UI); the
-- admin can read every row (to show paid status in the Users list) and is
-- the only one who can grant/revoke.
-- Paste this whole file into Supabase Dashboard → SQL Editor → Run.

create table if not exists public.b777_paid_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_by uuid references auth.users(id),
  granted_at timestamptz not null default now(),
  note text
);

alter table public.b777_paid_users enable row level security;
create policy "paid users read own" on public.b777_paid_users
  for select to authenticated using (auth.uid() = user_id);
create policy "paid users read admin" on public.b777_paid_users
  for select to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'b777_admin') = 'true');
create policy "paid users write admin only" on public.b777_paid_users
  for insert to authenticated with check ((auth.jwt() -> 'app_metadata' ->> 'b777_admin') = 'true');
create policy "paid users delete admin only" on public.b777_paid_users
  for delete to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'b777_admin') = 'true');
