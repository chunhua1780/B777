-- B777 Question Bank — admin-added questions for the shared banks.
-- Lets the real admin (app_metadata.b777_admin = true, same flag that
-- shows the Admin Dashboard card) paste new questions straight into the
-- Interview bank, Theory bank, or Good to Know, with no code deploy.
-- Everyone can read these rows (so the questions actually show up in
-- practice/exams); only the admin can write or delete them.
-- Paste this whole file into Supabase Dashboard → SQL Editor → Run.

create table if not exists public.b777_admin_questions (
  id uuid primary key default gen_random_uuid(),
  bank text not null check (bank in ('interview','theory','gtk')),
  chapter text,                 -- only meaningful for bank = 'gtk'
  question text not null,
  options jsonb not null,
  answer text not null check (answer in ('A','B','C','D')),
  reference text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists b777_admin_questions_bank_idx on public.b777_admin_questions (bank);

alter table public.b777_admin_questions enable row level security;
create policy "admin questions read all" on public.b777_admin_questions
  for select to authenticated using (true);
create policy "admin questions write admin only" on public.b777_admin_questions
  for insert to authenticated with check ((auth.jwt() -> 'app_metadata' ->> 'b777_admin') = 'true');
create policy "admin questions delete admin only" on public.b777_admin_questions
  for delete to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'b777_admin') = 'true');
