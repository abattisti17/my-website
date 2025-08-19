-- Reports table for content moderation
-- Step 10: Basic report/block safety system

-- Create reports table
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter uuid references profiles(id) not null,
  target_type text not null check (target_type in ('post','message','media','profile')),
  target_id uuid not null,
  reason text,
  created_at timestamptz default now()
);

-- Enable RLS on reports table
alter table reports enable row level security;

-- RLS Policies for reports
-- Allow users to insert their own reports
create policy "reports_insert" on reports
  for insert
  with check (reporter = auth.uid());

-- Allow users to select only their own reports (MVP - basic privacy)
create policy "reports_select" on reports
  for select
  using (reporter = auth.uid());

-- Index for performance
create index if not exists idx_reports_reporter on reports(reporter);
create index if not exists idx_reports_target on reports(target_type, target_id);
create index if not exists idx_reports_created_at on reports(created_at desc);

-- Add helpful comment
comment on table reports is 'Content moderation reports - users can report posts, messages, media, or profiles';
comment on column reports.target_type is 'Type of content being reported: post, message, media, or profile';
comment on column reports.target_id is 'UUID of the reported content (references the specific table based on target_type)';
comment on column reports.reason is 'User-provided reason for the report (optional)';
