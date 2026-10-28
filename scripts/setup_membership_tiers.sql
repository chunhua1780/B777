-- B777 Question Bank — named membership tiers on top of the existing
-- paid-access system (setup_paid_users.sql / setup_monetization.sql must
-- already be applied). Lets the admin define tiers (e.g. 普通会员 /
-- 高级会员 / VIP) from the Admin Dashboard instead of a flat paid/unpaid
-- flag, while keeping the existing gate behavior: any active row in
-- b777_paid_users still unlocks Good to Know / My Question Bank, same as
-- before -- the tier is for labeling/organizing members today, and is
-- there for future features that might want to require a specific tier.
-- Paste this whole file into Supabase Dashboard → SQL Editor → Run.

create table if not exists public.b777_membership_tiers (
  id text primary key,            -- e.g. 'premium', 'vip'
  label text not null,            -- e.g. '高级会员'
  rank int not null default 1,    -- higher = more access (0 is reserved for the implicit free tier, which has no row)
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.b777_membership_tiers enable row level security;
drop policy if exists "tiers read all" on public.b777_membership_tiers;
create policy "tiers read all" on public.b777_membership_tiers
  for select to authenticated using (true);
drop policy if exists "tiers write admin only" on public.b777_membership_tiers;
create policy "tiers write admin only" on public.b777_membership_tiers
  for insert to authenticated with check (public.b777_is_admin());
drop policy if exists "tiers update admin only" on public.b777_membership_tiers;
create policy "tiers update admin only" on public.b777_membership_tiers
  for update to authenticated using (public.b777_is_admin()) with check (public.b777_is_admin());
drop policy if exists "tiers delete admin only" on public.b777_membership_tiers;
create policy "tiers delete admin only" on public.b777_membership_tiers
  for delete to authenticated using (public.b777_is_admin());

insert into public.b777_membership_tiers (id, label, rank, sort_order) values
  ('premium', '高级会员', 10, 10)
on conflict (id) do nothing;

alter table public.b777_paid_users add column if not exists tier_id text references public.b777_membership_tiers(id);
-- Backfill anyone granted before tiers existed onto the default tier, so nothing they already have breaks.
update public.b777_paid_users set tier_id = 'premium' where tier_id is null;

-- Each pricing plan now also says which tier a purchase of it grants.
alter table public.b777_plans add column if not exists tier_id text references public.b777_membership_tiers(id);
update public.b777_plans set tier_id = 'premium' where tier_id is null;
