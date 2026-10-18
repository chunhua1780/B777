-- B777 Question Bank — full monetization backend: admin-configurable
-- settings, multiple pricing plans, paid access with expiry, a daily
-- free-trial time budget for the paid features, and admin replies to
-- user feedback. Everything here is driven from the Admin Dashboard —
-- no redeploy needed to change a price, turn the paywall on, or adjust
-- the trial length.
-- Paste this whole file into Supabase Dashboard → SQL Editor → Run.
-- (Depends on public.b777_is_admin(), created by setup_v2.sql.)

-- ── App-wide settings (key/value), e.g. paywall_enabled, trial_minutes_per_day ──
create table if not exists public.b777_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
alter table public.b777_settings enable row level security;
drop policy if exists "settings read all" on public.b777_settings;
create policy "settings read all" on public.b777_settings
  for select to authenticated using (true);
drop policy if exists "settings write admin only" on public.b777_settings;
create policy "settings write admin only" on public.b777_settings
  for insert to authenticated with check (public.b777_is_admin());
drop policy if exists "settings update admin only" on public.b777_settings;
create policy "settings update admin only" on public.b777_settings
  for update to authenticated using (public.b777_is_admin()) with check (public.b777_is_admin());

insert into public.b777_settings (key, value) values
  ('paywall_enabled', 'false'),
  ('trial_minutes_per_day', '5')
on conflict (key) do nothing;

-- ── Pricing plans, admin-managed. Each maps to one Stripe Payment Link ──
-- (created by the admin in the Stripe Dashboard, no code needed on that
-- side). duration_days is how long a purchase of this plan unlocks access
-- for; null means lifetime. stripe_payment_link_id is the "plink_..." id
-- (NOT the full checkout URL) visible in the Stripe Dashboard / API for
-- that Payment Link -- the webhook uses it to know which plan was bought.
create table if not exists public.b777_plans (
  id text primary key,                 -- e.g. 'yearly', 'monthly', 'lifetime'
  label text not null,                  -- e.g. '年卡'
  price_display text not null,         -- e.g. '¥99 / 年' -- just display text, admin edits freely
  duration_days int,                    -- null = lifetime
  payment_link_url text,                -- the full Stripe Payment Link URL to send the user to
  stripe_payment_link_id text,          -- the plink_... id, used by the webhook to match purchases
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.b777_plans enable row level security;
drop policy if exists "plans read all" on public.b777_plans;
create policy "plans read all" on public.b777_plans
  for select to authenticated using (true);
drop policy if exists "plans write admin only" on public.b777_plans;
create policy "plans write admin only" on public.b777_plans
  for insert to authenticated with check (public.b777_is_admin());
drop policy if exists "plans update admin only" on public.b777_plans;
create policy "plans update admin only" on public.b777_plans
  for update to authenticated using (public.b777_is_admin()) with check (public.b777_is_admin());
drop policy if exists "plans delete admin only" on public.b777_plans;
create policy "plans delete admin only" on public.b777_plans
  for delete to authenticated using (public.b777_is_admin());

-- ── Paid access now expires, and remembers which plan granted it ──
alter table public.b777_paid_users add column if not exists expires_at timestamptz;
alter table public.b777_paid_users add column if not exists plan_id text references public.b777_plans(id);

-- ── Daily trial-usage budget for Good to Know / My Question Bank ──
-- One row per user per day; incremented via the RPC below so concurrent
-- ticks from the same tab never race each other.
create table if not exists public.b777_trial_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  seconds int not null default 0,
  primary key (user_id, day)
);
alter table public.b777_trial_usage enable row level security;
drop policy if exists "trial usage read own" on public.b777_trial_usage;
create policy "trial usage read own" on public.b777_trial_usage
  for select to authenticated using (auth.uid() = user_id or public.b777_is_admin());

create or replace function public.increment_trial_usage(p_seconds int)
returns void language plpgsql security definer as $$
begin
  insert into public.b777_trial_usage(user_id, day, seconds)
  values (auth.uid(), current_date, greatest(p_seconds, 0))
  on conflict (user_id, day) do update
    set seconds = public.b777_trial_usage.seconds + greatest(p_seconds, 0);
end;
$$;
revoke all on function public.increment_trial_usage(int) from public;
grant execute on function public.increment_trial_usage(int) to authenticated;

-- ── Admin replies to feedback ──
alter table public.b777_feedback add column if not exists reply text;
alter table public.b777_feedback add column if not exists replied_at timestamptz;
alter table public.b777_feedback add column if not exists replied_by uuid references auth.users(id);
-- Users could only ever write their feedback, never read it back (no select
-- policy existed for non-admins) -- add one so they can see the admin's reply.
drop policy if exists "feedback read own" on public.b777_feedback;
create policy "feedback read own" on public.b777_feedback
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "feedback reply admin only" on public.b777_feedback;
create policy "feedback reply admin only" on public.b777_feedback
  for update to authenticated using (public.b777_is_admin()) with check (public.b777_is_admin());
