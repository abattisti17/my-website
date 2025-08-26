-- Add Strategic Indexes for Performance
-- Based on query patterns identified in the codebase

-- EVENT_MEMBERS table indexes (heavily queried for membership checks)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_event_members_event_id 
ON event_members(event_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_event_members_user_id 
ON event_members(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_event_members_event_user 
ON event_members(event_id, user_id);

-- PODS table indexes (queried by event_id frequently)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pods_event_id 
ON pods(event_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pods_created_by 
ON pods(created_by);

-- POD_MEMBERS table indexes (chat membership checks)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pod_members_pod_id 
ON pod_members(pod_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pod_members_user_id 
ON pod_members(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pod_members_pod_user 
ON pod_members(pod_id, user_id);

-- MESSAGES table indexes (chat queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_pod_id_created 
ON messages(pod_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_user_id 
ON messages(user_id);

-- EVENTS table indexes (public queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_date_utc 
ON events(date_utc);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_city 
ON events(city);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_artist 
ON events(artist);

-- MEDIA table indexes (event galleries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_media_event_id_created 
ON media(event_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_media_owner_id 
ON media(owner_id);

-- POSTS table indexes (event feeds)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_event_id_created 
ON posts(event_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_user_id 
ON posts(user_id);

-- MEMORABILIA table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_memorabilia_event_user 
ON memorabilia(event_id, user_id);

-- MEET_POINTS table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_meet_points_event_id 
ON meet_points(event_id);

-- Verify indexes were created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;




