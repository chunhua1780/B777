-- Manual Reader — text-selection marks (highlight / underline / box, each
-- in 6 colors, plus an optional short inline label/symbol). On top of the
-- existing manual_annotations table (per-paragraph note + bookmark, still
-- used as-is) -- these are finer-grained, anchored to a character range
-- within one paragraph's text rather than the whole paragraph.
-- Run this once in Supabase SQL Editor.

create table if not exists manual_marks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  section_id text not null,
  para_key text not null,
  start_offset int not null,
  end_offset int not null,
  style text not null check (style in ('highlight','underline','box')),
  color text not null,
  label text,                  -- optional short custom symbol/text shown as a small badge after the marked text
  lang text not null default 'zh',  -- English and Chinese text differ, so offsets only make sense within the language they were made in
  created_at timestamptz default now()
);

alter table manual_marks enable row level security;
drop policy if exists "own marks" on manual_marks;
create policy "own marks" on manual_marks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_manual_marks_lookup on manual_marks(user_id, section_id, para_key);
