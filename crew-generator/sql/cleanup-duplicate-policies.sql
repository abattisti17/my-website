-- Clean up duplicate SELECT policies that might cause conflicts

-- MEDIA: Remove the conflicting policy
DROP POLICY IF EXISTS "media read all" ON media;
-- Keep only "media_select_if_in_event"

-- PODS: Remove the conflicting policy  
DROP POLICY IF EXISTS "pods_select_all" ON pods;
-- Keep only "pods_select_if_in_event"

-- Verify cleanup
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('media', 'pods')
AND cmd = 'SELECT'
ORDER BY tablename, policyname;


