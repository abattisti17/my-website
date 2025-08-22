-- Fix duplicate RLS policies causing performance issues
-- Based on Supabase performance lints showing multiple permissive policies

-- Events table: Remove duplicate policies
DROP POLICY IF EXISTS "events read" ON events;
-- Keep only the "events_public_read" policy which allows public access

-- Verify no duplicate policies remain
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'events' 
ORDER BY policyname;


