-- Optimize RLS Policies for Performance
-- Fixes all 31 auth.uid() performance warnings by using (select auth.uid())
-- This prevents re-evaluation of auth functions for each row

-- PROFILES TABLE
DROP POLICY IF EXISTS "profiles upsert self" ON profiles;
DROP POLICY IF EXISTS "profiles update self" ON profiles;

CREATE POLICY "profiles_upsert_self" ON profiles
  FOR INSERT 
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "profiles_update_self" ON profiles
  FOR UPDATE 
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "profiles_select_all" ON profiles
  FOR SELECT 
  USING (true); -- Profiles can be viewed by anyone

-- EVENTS TABLE (keep public read, optimize insert)
DROP POLICY IF EXISTS "events insert authed" ON events;

CREATE POLICY "events_insert_authed" ON events
  FOR INSERT 
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- POSTS TABLE
DROP POLICY IF EXISTS "posts select if in event" ON posts;
DROP POLICY IF EXISTS "posts insert self" ON posts;
DROP POLICY IF EXISTS "posts update/delete self" ON posts;
DROP POLICY IF EXISTS "posts delete self" ON posts;

CREATE POLICY "posts_select_if_in_event" ON posts
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM event_members 
      WHERE event_members.event_id = posts.event_id 
      AND event_members.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "posts_insert_self" ON posts
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "posts_update_delete_self" ON posts
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "posts_delete_self" ON posts
  FOR DELETE 
  USING (user_id = (SELECT auth.uid()));

-- MEDIA TABLE
DROP POLICY IF EXISTS "media insert owner" ON media;
DROP POLICY IF EXISTS "media delete owner" ON media;

CREATE POLICY "media_insert_owner" ON media
  FOR INSERT 
  WITH CHECK (owner_id = (SELECT auth.uid()));

CREATE POLICY "media_delete_owner" ON media
  FOR DELETE 
  USING (owner_id = (SELECT auth.uid()));

CREATE POLICY "media_select_if_in_event" ON media
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM event_members 
      WHERE event_members.event_id = media.event_id 
      AND event_members.user_id = (SELECT auth.uid())
    )
  );

-- MESSAGES TABLE
DROP POLICY IF EXISTS "messages select if in pod" ON messages;
DROP POLICY IF EXISTS "messages insert self" ON messages;

CREATE POLICY "messages_select_if_in_pod" ON messages
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM pod_members 
      WHERE pod_members.pod_id = messages.pod_id 
      AND pod_members.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "messages_insert_self" ON messages
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

-- MEET_POINTS TABLE
DROP POLICY IF EXISTS "meet_points select if in event" ON meet_points;
DROP POLICY IF EXISTS "meet_points upsert by member" ON meet_points;
DROP POLICY IF EXISTS "meet_points update by member" ON meet_points;

CREATE POLICY "meet_points_select_if_in_event" ON meet_points
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM event_members 
      WHERE event_members.event_id = meet_points.event_id 
      AND event_members.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "meet_points_upsert_by_member" ON meet_points
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM event_members 
      WHERE event_members.event_id = meet_points.event_id 
      AND event_members.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "meet_points_update_by_member" ON meet_points
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM event_members 
      WHERE event_members.event_id = meet_points.event_id 
      AND event_members.user_id = (SELECT auth.uid())
    )
  );

-- MEMORABILIA TABLE
DROP POLICY IF EXISTS "memorabilia select own" ON memorabilia;
DROP POLICY IF EXISTS "memorabilia insert/update self" ON memorabilia;
DROP POLICY IF EXISTS "memorabilia update self" ON memorabilia;

CREATE POLICY "memorabilia_select_own" ON memorabilia
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "memorabilia_insert_update_self" ON memorabilia
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "memorabilia_update_self" ON memorabilia
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- EVENT_MEMBERS TABLE
DROP POLICY IF EXISTS "em_select" ON event_members;
DROP POLICY IF EXISTS "em_insert" ON event_members;
DROP POLICY IF EXISTS "em_update" ON event_members;
DROP POLICY IF EXISTS "em_delete" ON event_members;

CREATE POLICY "em_select" ON event_members
  FOR SELECT 
  USING (
    user_id = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM event_members em2 
      WHERE em2.event_id = event_members.event_id 
      AND em2.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "em_insert" ON event_members
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "em_update" ON event_members
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "em_delete" ON event_members
  FOR DELETE 
  USING (user_id = (SELECT auth.uid()));

-- PODS TABLE
DROP POLICY IF EXISTS "pods_insert_auth" ON pods;
DROP POLICY IF EXISTS "pods_update_creator" ON pods;
DROP POLICY IF EXISTS "pods_delete_creator" ON pods;

CREATE POLICY "pods_insert_auth" ON pods
  FOR INSERT 
  WITH CHECK (created_by = (SELECT auth.uid()));

CREATE POLICY "pods_select_if_in_event" ON pods
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM event_members 
      WHERE event_members.event_id = pods.event_id 
      AND event_members.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "pods_update_creator" ON pods
  FOR UPDATE 
  USING (created_by = (SELECT auth.uid()))
  WITH CHECK (created_by = (SELECT auth.uid()));

CREATE POLICY "pods_delete_creator" ON pods
  FOR DELETE 
  USING (created_by = (SELECT auth.uid()));

-- POD_MEMBERS TABLE
DROP POLICY IF EXISTS "pm_select" ON pod_members;
DROP POLICY IF EXISTS "pm_insert" ON pod_members;
DROP POLICY IF EXISTS "pm_update" ON pod_members;
DROP POLICY IF EXISTS "pm_delete" ON pod_members;

CREATE POLICY "pm_select" ON pod_members
  FOR SELECT 
  USING (
    user_id = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM pod_members pm2 
      WHERE pm2.pod_id = pod_members.pod_id 
      AND pm2.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "pm_insert" ON pod_members
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "pm_update" ON pod_members
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "pm_delete" ON pod_members
  FOR DELETE 
  USING (user_id = (SELECT auth.uid()));

-- REPORTS TABLE
DROP POLICY IF EXISTS "reports_insert" ON reports;
DROP POLICY IF EXISTS "reports_select" ON reports;

CREATE POLICY "reports_insert" ON reports
  FOR INSERT 
  WITH CHECK (reporter = (SELECT auth.uid()));

CREATE POLICY "reports_select" ON reports
  FOR SELECT 
  USING (reporter = (SELECT auth.uid()));

-- Verify policies are optimized
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

