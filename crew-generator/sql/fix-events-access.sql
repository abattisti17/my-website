-- Fix events table access - make it publicly readable
-- This allows anyone to view events (which is what we want for a public event listing)

-- Enable RLS on events table (if not already enabled)
alter table events enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "events_select_public" on events;
drop policy if exists "events_public_read" on events;

-- Allow public read access to events
create policy "events_public_read" on events
  for select
  using (true);

-- Verify the policy works
select * from events limit 1;
