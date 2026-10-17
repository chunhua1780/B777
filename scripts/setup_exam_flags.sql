-- B777 Question Bank — "recently tested in a real exam" crowd flags.
-- Lets any signed-in pilot flag a question as something they were actually
-- asked on a recent real exam/check. One flag per person per question
-- (toggle) -- the count reflects how many different pilots saw it, not
-- repeat clicks. Individual flags are private (RLS lets you see only your
-- own row); a view aggregates just the counts for everyone to browse.
-- Paste this whole file into Supabase Dashboard → SQL Editor → Run.

create table if not exists public.b777_exam_flags (
  question_id text not null,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (question_id, user_id)
);

alter table public.b777_exam_flags enable row level security;
create policy "exam flags read own" on public.b777_exam_flags
  for select to authenticated using (auth.uid() = user_id);
create policy "exam flags write own" on public.b777_exam_flags
  for insert to authenticated with check (auth.uid() = user_id);
create policy "exam flags delete own" on public.b777_exam_flags
  for delete to authenticated using (auth.uid() = user_id);

-- Aggregated, anonymous counts -- this view is owned by the role that runs
-- this script (normally "postgres", which bypasses RLS), so it sees every
-- pilot's flags and counts them correctly, while the table above still
-- only ever lets a pilot read their own row directly.
create or replace view public.b777_exam_flag_counts as
  select question_id, count(*)::int as flag_count
  from public.b777_exam_flags
  group by question_id;
grant select on public.b777_exam_flag_counts to authenticated;
