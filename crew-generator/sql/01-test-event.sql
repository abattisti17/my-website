-- Create test event for smoke testing
-- This creates the "[test] Taylor Swift - NYC 2025" event mentioned in the smoke test

-- Insert test event (will not duplicate if it already exists)
insert into events (slug, artist, city, venue, date_utc)
values ('taylor-nyc-2025', '[test] Taylor Swift', 'NYC', 'Madison Square Garden', '2025-03-15T20:00:00Z')
on conflict (slug) do nothing;

-- Verify the event was created
select * from events where slug = 'taylor-nyc-2025';
