import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthProvider'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Badge } from '@/components/ui/badge'
import { MessageList } from './message-list'
import { MessageComposer } from './message-composer'
import { UserAvatar } from './avatar'
import { useMessagesV2 } from '@/hooks/useMessagesV2'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ChevronLeft } from 'lucide-react'

export interface PodMember {
  user_id: string
  role: string
  joined_at: string
  profiles: {
    display_name: string
    avatar_url: string | null
  } | null
}

export interface Pod {
  id: string
  name: string | null
  created_by: string
  created_at: string
  event_id: string
  events: {
    slug: string
    artist: string
    city: string
  }
}

interface PodChatViewProps {
  podId: string
  eventSlug: string
  className?: string
  // Optional: allow overriding the mobile breakpoint
  mobileBreakpoint?: string
}

export const PodChatView: React.FC<PodChatViewProps> = ({
  podId,
  eventSlug,
  className,
  mobileBreakpoint = 'md'
}) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [pod, setPod] = useState<Pod | null>(null)
  const [members, setMembers] = useState<PodMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const [hiddenMessages, setHiddenMessages] = useState<Set<string>>(new Set())

  // Use Messages v2 hook when user is a member
  const {
    messages,
    sendMessage: sendMessageV2,
    sending,
    error,
    loadMore,
    hasMore,
    isConnected
  } = useMessagesV2({ 
    podId: isMember ? podId : '',
    enabled: isMember 
  })

  // Fetch pod data and members
  useEffect(() => {
    if (podId) {
      fetchPodData()
    }
  }, [podId, user])

  const fetchPodData = async () => {
    try {
      setLoading(true)

      // Fetch pod details
      const { data: podData, error: podError } = await supabase
        .from('pods')
        .select(`
          *,
          events (
            slug,
            artist,
            city
          )
        `)
        .eq('id', podId)
        .single()

      if (podError) throw podError
      setPod(podData)

      // Fetch pod members
      const { data: membersData, error: membersError } = await supabase
        .from('pod_members')
        .select(`
          user_id,
          role,
          joined_at,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .eq('pod_id', podId)

      if (membersError) throw membersError
      setMembers((membersData as any) || [])

      // Check if current user is a member
      if (user) {
        const userMember = membersData?.find(m => m.user_id === user.id)
        setIsMember(!!userMember)
      }

    } catch (error) {
      console.error('Error fetching pod data:', error)
      toast.error('Failed to load pod details')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinPod = async () => {
    if (!user || !pod) return

    if (members.length >= 5) {
      toast.error('Pod full — create another.')
      return
    }

    try {
      const { error } = await supabase
        .from('pod_members')
        .insert({
          pod_id: pod.id,
          user_id: user.id,
          role: 'member'
        })

      if (error) {
        if (error.message?.includes('Pod is full') || error.code === 'P0001') {
          toast.error('Pod full — create another.')
          fetchPodData()
          return
        }
        
        if (error.code === '23505') {
          toast.success('You\'re already in this pod! 🎉')
          setIsMember(true)
          return
        }
        
        throw error
      }

      setIsMember(true)
      toast.success('Welcome to the pod! 🎉')
      fetchPodData()
    } catch (error: any) {
      console.error('Error joining pod:', error)
      if (error?.message?.includes('Pod is full')) {
        toast.error('Pod full — create another.')
        fetchPodData()
      } else {
        toast.error('Failed to join pod')
      }
    }
  }

  const handleLeavePod = async () => {
    if (!user || !pod) return

    try {
      const { error } = await supabase
        .from('pod_members')
        .delete()
        .eq('pod_id', pod.id)
        .eq('user_id', user.id)

      if (error) throw error

      toast.success('Left the pod')
      navigate(`/event/${eventSlug}`)
    } catch (error) {
      console.error('Error leaving pod:', error)
      toast.error('Failed to leave pod')
    }
  }

  const handleSendMessage = async (text: string) => {
    try {
      await sendMessageV2(text)
    } catch (error) {
      console.error('Error sending message:', error)
      // Error handling is done in the hook
    }
  }

  const handleMessageHidden = (messageId: string) => {
    setHiddenMessages(prev => new Set([...prev, messageId]))
  }

  // Show error from messages hook
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-medium">💬 Loading pod...</div>
      </div>
    )
  }

  if (!pod) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Pod Not Found</h1>
        <p className="text-gray-600 mb-4">The pod you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to={`/event/${eventSlug}`}>← Back to Event</Link>
        </Button>
      </div>
    )
  }

  // Non-member view
  if (!isMember) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="outline" className="mb-6" asChild>
          <Link to={`/event/${eventSlug}`}>← Back to Event</Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{pod.name || 'Unnamed Pod'}</span>
              <Badge variant="outline">
                {members.length}/5 members
              </Badge>
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {pod.events.artist} • {pod.events.city}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Pod Members:</h3>
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.user_id} className="flex items-center gap-3">
                    <UserAvatar
                      src={member.profiles?.avatar_url}
                      alt={member.profiles?.display_name || 'Anonymous'}
                      fallback={member.profiles?.display_name || 'Anonymous'}
                      userId={member.user_id}
                      size="md"
                    />
                    <span className="text-sm">
                      {member.profiles?.display_name || 'Anonymous'}
                      {member.role === 'creator' && (
                        <Badge variant="secondary" className="ml-2 text-xs">Creator</Badge>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {members.length < 5 ? (
              <Button onClick={handleJoinPod}>
                🚀 Join Pod
              </Button>
            ) : (
              <div className="text-center py-4">
                <p className="text-foreground">Pod full (5/5 members)</p>
                <p className="text-sm text-muted-foreground mt-1">Create another pod to join the crew!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Member chat view - Fixed height container to prevent page scrolling
  return (
    <div className={cn("h-screen flex flex-col w-full overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-background/95 backdrop-blur-sm flex-shrink-0 page-padding-x" style={{ paddingTop: 'var(--chat-header-padding-y)', paddingBottom: 'var(--chat-header-padding-y)' }}>
        <div className="flex items-center" style={{ gap: 'var(--chat-details-gap)' }}>
          <IconButton variant="ghost" size="sm" asChild>
            <Link to={`/event/${eventSlug}`} aria-label="Back to event">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </IconButton>
          <div>
            <h1 className="text-xl font-bold">{pod.name || 'Unnamed Pod'}</h1>
            <p className="text-sm text-muted-foreground">
              {pod.events.artist} • {members.length}/5 members
              {isConnected && <span className="ml-2 text-green-600">🟢</span>}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleLeavePod}>
          Leave Pod
        </Button>
      </div>

      {/* Chat Area - Full width, no max-width constraint */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Chat Header */}
        <div className="border-b bg-background flex-shrink-0 page-padding-x" style={{ paddingTop: 'var(--chat-header-padding-y)', paddingBottom: 'var(--chat-header-padding-y)' }}>
          <div 
            className="flex items-center"
            style={{ gap: 'var(--chat-header-gap)' }}
          >
            <h2 className="text-lg font-semibold flex-1">Pod Chat</h2>
            {/* Member avatars */}
            <div className="flex -space-x-2 flex-shrink-0">
              {members.slice(0, 3).map((member) => (
                <div 
                  key={member.user_id}
                  className="border-2 border-background rounded-full"
                  title={member.profiles?.display_name || 'Anonymous'}
                >
                          <UserAvatar
          src={member.profiles?.avatar_url}
          alt={`${member.profiles?.display_name || 'Anonymous'} avatar`}
          fallback={member.profiles?.display_name || 'Anonymous'}
          userId={member.user_id}
          size="chat"
        />
                </div>
              ))}
              {members.length > 3 && (
                <div className="w-8 h-8 bg-muted rounded-full border-2 border-background flex items-center justify-center text-muted-foreground text-xs">
                  +{members.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages - Full height, scrollable with dynamic composer clearance */}
        <div 
          className="flex-1 overflow-hidden"
          style={{
            height: 'calc(100vh - var(--chat-header-height) - var(--safe-area-inset-top) - var(--safe-area-inset-bottom))',
            paddingBottom: 'var(--chat-scroll-bottom-clearance)' // Dynamic clearance using design tokens
          }}
        >
          <MessageList
            messages={messages.filter(msg => !hiddenMessages.has(msg.id || ''))}
            currentUserId={user?.id}
            loading={false}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onMessageHidden={handleMessageHidden}
            height={500} // Reasonable height for virtualization - container handles overall sizing
            className="h-full"
          />
        </div>

        {/* Desktop Composer - Full width edge-to-edge */}
        <div className={`hidden ${mobileBreakpoint}:block border-t flex-shrink-0`}>
          <MessageComposer
            onSend={handleSendMessage}
            disabled={sending || !user}
            podId={podId}
            placeholder={user ? "Type a message..." : "Sign in to send messages"}
            maxLength={500} // Match current limit
          />
        </div>
      </div>

      {/* Mobile Composer - Fixed bottom, full width */}
      <div className={cn(
        `${mobileBreakpoint}:hidden fixed bottom-0 left-0 right-0`,
        "bg-background/95 backdrop-blur-sm border-t"
      )} 
      style={{ 
        bottom: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom))',
        zIndex: 'var(--z-floating)'
      }}>
        <MessageComposer
          onSend={handleSendMessage}
          disabled={sending || !user}
          podId={podId}
          placeholder={user ? "Type a message..." : "Sign in to send messages"}
          maxLength={500}
          className="border-t-0" // Remove double border
        />
      </div>
    </div>
  )
}
