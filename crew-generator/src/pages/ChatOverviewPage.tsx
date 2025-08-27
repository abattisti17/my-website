import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom' // Unused
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card" // Unused
// import { Badge } from "@/components/ui/badge" // Unused
import { PageHeader } from '../components/design-system/PageHeader'
import { PageLayout, PageSection } from '../components/design-system/PageLayout'
import { CardList, PodCard } from '../components/design-system'
import { EmptyState } from '../components/design-system/EmptyState'
import { LoadingSpinner } from '../components/design-system/LoadingSpinner'
import { MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

interface PodWithEvent {
  id: string
  name: string | null
  created_by: string
  created_at: string
  event_id: string
  member_count: number
  latest_message_at: string | null
  events: {
    slug: string
    artist: string
    city: string
    date_utc: string
  }
}

export default function ChatOverviewPage() {
  const { user } = useAuth()
  const [pods, setPods] = useState<PodWithEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserPods()
    }
  }, [user])

  const fetchUserPods = async () => {
    try {
      setLoading(true)

      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )

      // Get all pods where user is a member, along with event details and stats
      const { data, error } = await Promise.race([
        supabase
        .from('pod_members')
        .select(`
          pod_id,
          pods!inner (
            id,
            name,
            created_by,
            created_at,
            event_id,
                          events!inner (
                slug,
                artist,
                city,
                date_utc
              )
          )
        `)
        .eq('user_id', user?.id),
        timeoutPromise
      ]) as any

      if (error) {
        console.error('Error fetching user pods:', error)
        toast.error('Failed to load your chats')
        return
      }

      if (!data || data.length === 0) {
        setPods([])
        return
      }

      // Extract pod IDs for batch queries
      const podIds = data.map((item: any) => item.pods.id)

      // Batch fetch member counts and latest messages for all pods
      const [memberCounts, latestMessages] = await Promise.all([
        // Get all member counts in one query
        supabase
          .from('pod_members')
          .select('pod_id')
          .in('pod_id', podIds),
        // Get latest message for each pod in one query
        supabase
          .from('messages')
          .select('pod_id, created_at')
          .in('pod_id', podIds)
          .order('created_at', { ascending: false })
      ])

      // Group results by pod_id for efficient lookup
      const memberCountsByPod = memberCounts.data?.reduce((acc: any, member) => {
        acc[member.pod_id] = (acc[member.pod_id] || 0) + 1
        return acc
      }, {}) || {}

      const latestMessagesByPod = latestMessages.data?.reduce((acc: any, message) => {
        if (!acc[message.pod_id] || message.created_at > acc[message.pod_id]) {
          acc[message.pod_id] = message.created_at
        }
        return acc
      }, {}) || {}

      // Combine data efficiently
      const podsWithStats = data.map((item: any) => {
        const pod = item.pods
        return {
          ...pod,
          member_count: memberCountsByPod[pod.id] || 0,
          latest_message_at: latestMessagesByPod[pod.id] || null
        }
      })

      // Sort by latest message first, then by creation date
      podsWithStats.sort((a: any, b: any) => {
        if (a.latest_message_at && b.latest_message_at) {
          return new Date(b.latest_message_at).getTime() - new Date(a.latest_message_at).getTime()
        }
        if (a.latest_message_at && !b.latest_message_at) return -1
        if (!a.latest_message_at && b.latest_message_at) return 1
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })

      setPods(podsWithStats)

    } catch (error) {
      console.error('Error fetching pods:', error)
      toast.error('Failed to load your chats')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatRelativeTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return formatDate(dateString)
  }

  if (loading) {
    return (
      <div className="safe-scroll-content">
        <PageHeader
          title="Your Chats"
          subtitle="All your group chats across events"
          icon={<MessageCircle className="h-8 w-8 text-primary" />}
        />
        <LoadingSpinner />
      </div>
    )
  }

  if (pods.length === 0) {
    return (
      <div className="safe-scroll-content">
        <PageHeader
          title="Your Chats"
          subtitle="All your group chats across events"
          icon={<MessageCircle className="h-8 w-8 text-primary" />}
        />
        <EmptyState
          icon={<MessageCircle className="h-8 w-8 text-primary" />}
          title="No chats yet"
          description="Join some events and connect with other attendees to start chatting!"
        />
      </div>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title="Your Chats"
        subtitle={`${pods.length} active chat${pods.length === 1 ? '' : 's'}`}
        icon={<MessageCircle className="h-8 w-8 text-primary" />}
      />

      <PageSection>
        <CardList
          items={pods}
          renderCard={(pod) => (
            <PodCard 
              key={pod.id}
              pod={pod} 
              formatRelativeTime={formatRelativeTime}
            />
          )}
          loading={loading}
          spacing="sm"
          emptyState={{
            title: "No chats yet",
            message: "Join some events to start chatting with your crew!",
            icon: <MessageCircle className="h-12 w-12 text-muted-foreground" />
          }}
          testId="chat-list"
        />
      </PageSection>
    </PageLayout>
  )
}
