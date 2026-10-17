-- B777 Question Bank — admin edit/delete overrides for static-origin
-- questions (the built-in Interview/Theory bank from questions.js, and
-- the built-in Good to Know chapters from gotoknow.js). Those live in
-- static files, so they can't be edited or deleted at the source from a
-- live admin screen -- instead, one row here per question id either
-- patches its fields (question/options/answer/reference) or marks it
-- deleted, and the client applies these on top of the static arrays
-- every time it syncs (syncAdminQuestions() in index.html).
-- Admin-added questions (b777_admin_questions) are edited/deleted on
-- their own row directly and never need an entry here.
-- Paste this whole file into Supabase Dashboard → SQL Editor → Run.

create table if not exists public.b777_question_overrides (
  id text primary key,            -- the static question's own id, e.g. "00006" or "gtk-eng-01"
  deleted boolean not null default false,
  question text,
  options jsonb,
  answer text check (answer is null or answer in ('A','B','C','D')),
  reference text,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

alter table public.b777_question_overrides enable row level security;
create policy "question overrides read all" on public.b777_question_overrides
  for select to authenticated using (true);
create policy "question overrides write admin only" on public.b777_question_overrides
  for insert to authenticated with check ((auth.jwt() -> 'app_metadata' ->> 'b777_admin') = 'true');
create policy "question overrides update admin only" on public.b777_question_overrides
  for update to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'b777_admin') = 'true')
  with check ((auth.jwt() -> 'app_metadata' ->> 'b777_admin') = 'true');
create policy "question overrides delete admin only" on public.b777_question_overrides
  for delete to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'b777_admin') = 'true');
