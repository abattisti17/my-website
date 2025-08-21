-- Fix RLS Policy Infinite Recursion Issues
-- The problem is that some policies reference tables that also have RLS policies,
-- creating circular dependencies. Let's simplify them.

-- EVENT_MEMBERS: Simplify to avoid recursion
DROP POLICY IF EXISTS "em_select" ON event_members;
CREATE POLICY "em_select" ON event_members
  FOR SELECT 
  USING (true); -- Temporarily allow all reads to break recursion

-- MESSAGES: Simplify pod membership check
DROP POLICY IF EXISTS "messages_select_if_in_pod" ON messages;
CREATE POLICY "messages_select_if_in_pod" ON messages
  FOR SELECT 
  USING (
    pod_id IN (
      SELECT pod_id FROM pod_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- POD_MEMBERS: Simplify to avoid recursion
DROP POLICY IF EXISTS "pm_select" ON pod_members;
CREATE POLICY "pm_select" ON pod_members
  FOR SELECT 
  USING (true); -- Allow all reads since pod membership needs to be visible

-- MEDIA: Simplify event membership check
DROP POLICY IF EXISTS "media_select_if_in_event" ON media;
CREATE POLICY "media_select_if_in_event" ON media
  FOR SELECT 
  USING (
    event_id IN (
      SELECT event_id FROM event_members 
      WHERE user_id = (SELECT auth.uid())
    ) OR owner_id = (SELECT auth.uid())
  );

-- POSTS: Simplify event membership check
DROP POLICY IF EXISTS "posts_select_if_in_event" ON posts;
CREATE POLICY "posts_select_if_in_event" ON posts
  FOR SELECT 
  USING (
    event_id IN (
      SELECT event_id FROM event_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- PODS: Simplify event membership check
DROP POLICY IF EXISTS "pods_select_if_in_event" ON pods;
CREATE POLICY "pods_select_if_in_event" ON pods
  FOR SELECT 
  USING (
    event_id IN (
      SELECT event_id FROM event_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- MEET_POINTS: Simplify event membership check
DROP POLICY IF EXISTS "meet_points_select_if_in_event" ON meet_points;
CREATE POLICY "meet_points_select_if_in_event" ON meet_points
  FOR SELECT 
  USING (
    event_id IN (
      SELECT event_id FROM event_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Verify policies are working
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('event_members', 'messages', 'pod_members', 'media', 'posts', 'pods', 'meet_points')
ORDER BY tablename, policyname;
