-- B777 Question Bank — "My Question Bank" self-upload feature.
-- Lets a signed-in user (currently gated to staff 467988 in the app UI)
-- upload their own JSON question bank and practice it with the same
-- spaced-repetition engine as the rest of the app. One row per user,
-- replaced wholesale on each upload.
-- Paste this whole file into Supabase Dashboard → SQL Editor → Run.

create table if not exists public.b777_custom_bank (
  user_id uuid primary key references auth.users(id) on delete cascade,
  questions jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.b777_custom_bank enable row level security;
create policy "custom bank read own" on public.b777_custom_bank
  for select to authenticated using (auth.uid() = user_id);
create policy "custom bank write own" on public.b777_custom_bank
  for insert to authenticated with check (auth.uid() = user_id);
create policy "custom bank update own" on public.b777_custom_bank
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "custom bank delete own" on public.b777_custom_bank
  for delete to authenticated using (auth.uid() = user_id);
