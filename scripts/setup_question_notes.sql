-- B777 Question Bank — per-question community notes.
-- Lets any signed-in user add a note under a question's answer (e.g. the
-- FCOM/QRH page an answer actually comes from). Shown only once the
-- question is graded/revealed, newest note first.
-- Paste this whole file into Supabase Dashboard → SQL Editor → Run.

create table if not exists public.b777_question_notes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  question_id text not null,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nickname text not null default '',
  text text not null check (char_length(text) between 1 and 500)
);
create index if not exists b777_question_notes_qid_idx
  on public.b777_question_notes (question_id, created_at desc);

alter table public.b777_question_notes enable row level security;
create policy "question notes read" on public.b777_question_notes
  for select to authenticated using (true);
create policy "question notes write" on public.b777_question_notes
  for insert to authenticated with check (auth.uid() = user_id);
create policy "question notes delete own" on public.b777_question_notes
  for delete to authenticated using (auth.uid() = user_id);
