import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
// import { Link } from 'react-router-dom' // Commented out - using IonicButton with onClick instead
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'
import { uploadAndSaveMedia } from '../lib/uploadMedia'
// import { Button } from "@/components/ui/button" // Commented out - using IonicButton instead
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from 'sonner'
import CreatePodForm from '../components/CreatePodForm'
import MediaGallery from '../components/MediaGallery'
import { PageLayout } from '../components/design-system/PageLayout'
import { Stack } from '../components/design-system/Stack'
// import { PageSection } from '../components/design-system/PageLayout' // Temporarily disabled
import { IonicButton } from '@/components/ui/ionic-button'
import { camera, images, add, chatbubble, rocket } from 'ionicons/icons'
// import IonicSuccessBanner from '../components/IonicSuccessBanner' // Removed test banner

interface Event {
  id: string
  slug: string
  artist: string
  city: string
  venue: string | null
  date_utc: string
  created_at: string
}

interface EventMember {
  user_id: string
  vibe_badges: string[]
  joined_at: string
  profiles: {
    display_name: string
    avatar_url: string | null
  } | null
}

interface Pod {
  id: string
  name: string | null
  created_by: string
  created_at: string
  pod_members: { user_id: string }[]
}

export default function EventPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [members, setMembers] = useState<EventMember[]>([])
  const [pods, setPods] = useState<Pod[]>([])
  const [isJoined, setIsJoined] = useState(false)
  const [loading, setLoading] = useState(true)
  const [joinLoading, setJoinLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (slug) {
      fetchEventData()
    }
  }, [slug, user])

  // Check membership status after event is loaded
  useEffect(() => {
    if (user && event?.id) {
      checkMembershipStatus()
    }
  }, [user, event?.id])

  // Check if user is already a member
  const checkMembershipStatus = async () => {
    if (!user || !event?.id) return
    
    try {
      // Try to select current user's membership
      const { data } = await supabase
        .from('event_members')
        .select('user_id')
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .single()
      
      if (data) {
        setIsJoined(true)
      }
    } catch (error) {
      // If error or no data, assume not joined
      setIsJoined(false)
    }
  }

  const fetchEventData = async () => {
    try {
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single()

      if (eventError) throw eventError
      setEvent(eventData)

      // Fetch event members now that RLS policies are fixed
      const { data: membersData, error: membersError } = await supabase
        .from('event_members')
        .select(`
          user_id,
          vibe_badges,
          joined_at,
          profiles:user_id (
            display_name,
            avatar_url
          )
        `)
        .eq('event_id', eventData.id)

      if (membersError) {
        console.error('Error fetching members:', membersError)
        setMembers([])
      } else {
        setMembers((membersData as any) || [])
      }

      // Fetch pods (without pod_members to avoid RLS recursion)
      const { data: podsData, error: podsError } = await supabase
        .from('pods')
        .select(`
          id,
          name,
          created_by,
          created_at
        `)
        .eq('event_id', eventData.id)

      if (podsError) throw podsError

      // Fetch all pod member counts in a single query to avoid N+1 pattern
      const { data: podMemberCounts } = await supabase
        .from('pod_members')
        .select('pod_id')
        .in('pod_id', (podsData || []).map(p => p.id))

      // Group member counts by pod_id
      const memberCountsByPod = (podMemberCounts || []).reduce((acc, member) => {
        acc[member.pod_id] = (acc[member.pod_id] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Add member counts to pods
      const podsWithMemberCount = (podsData || []).map(pod => ({
        ...pod,
        pod_members: Array(memberCountsByPod[pod.id] || 0).fill({ user_id: 'placeholder' })
      }))

      setPods(podsWithMemberCount)

    } catch (error) {
      console.error('Error fetching event data:', error)
      toast.error('Failed to load event details')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinEvent = async () => {
    if (!user || !event) return

    setJoinLoading(true)
    try {
      const { error } = await supabase
        .from('event_members')
        .insert({
          event_id: event.id,
          user_id: user.id,
          vibe_badges: []
        })

      if (error) throw error

      setIsJoined(true)
      toast.success('Welcome to the crew! 🎉')
      fetchEventData() // Refresh data
    } catch (error: any) {
      console.error('Error joining event:', error)
      
      // Handle duplicate key error (already joined)
      if (error?.code === '23505' && error?.message?.includes('event_members_pkey')) {
        setIsJoined(true)
        toast.success('You\'re already part of this crew! 🎉')
      } else {
        toast.error('Failed to join event')
      }
    } finally {
      setJoinLoading(false)
    }
  }

  const handleLeaveEvent = async () => {
    if (!user || !event) return

    setJoinLoading(true)
    try {
      const { error } = await supabase
        .from('event_members')
        .delete()
        .eq('event_id', event.id)
        .eq('user_id', user.id)

      if (error) throw error

      setIsJoined(false)
      toast.success('Left the event')
      fetchEventData() // Refresh data
    } catch (error) {
      console.error('Error leaving event:', error)
      toast.error('Failed to leave event')
    } finally {
      setJoinLoading(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !event) return

    setUploading(true)
    try {
      const result = await uploadAndSaveMedia(file, event.id)
      
      if (result.success) {
        toast.success('Photo uploaded successfully! 📸')
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        toast.error(result.error || 'Failed to upload photo')
      }
    } catch (error) {
      console.error('Photo upload error:', error)
      toast.error('Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-medium">🎵 Loading event...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
        <IonicButton 
          variant="default"
          onClick={() => window.location.href = '/'}
        >
          ← Back to Events
        </IonicButton>
      </div>
    )
  }

  const eventDate = new Date(event.date_utc)
  const isUpcoming = eventDate > new Date()

  return (
    <PageLayout className="max-w-4xl">
      <Stack spacing="lg">
        {/* Back Button */}
        <IonicButton 
          variant="outline" 
          size="default"
          onClick={() => window.location.href = '/'}
          className="self-start"
        >
          ← Back to Events
        </IonicButton>

        {/* Event Header */}
        <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-[var(--text-5xl)] font-bold mb-2">{event.artist}</h1>
              <CardDescription className="text-lg">
                {event.city}
                {event.venue && ` • ${event.venue}`}
              </CardDescription>
              <p className="text-sm text-gray-700 font-medium mt-2">
                {eventDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant={isUpcoming ? "default" : "secondary"}>
                {isUpcoming ? "Upcoming" : "Past Event"}
              </Badge>
              <Badge variant="outline">
                {members.length} {members.length === 1 ? 'Member' : 'Members'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        {user && isUpcoming && (
          <CardContent>
            {isJoined ? (
              <div className="flex gap-3 flex-wrap">
                <IonicButton 
                  onClick={handleLeaveEvent} 
                  disabled={joinLoading}
                  variant="outline"
                >
                  Leave Event
                </IonicButton>
                <IonicButton 
                  onClick={triggerFileInput}
                  disabled={uploading}
                  variant="default"
                  icon={camera}
                  className="ionic-green-button"
                >
                  {uploading ? 'Uploading...' : 'Add Photo'}
                </IonicButton>
                <IonicButton 
                  variant="default"
                  icon={images}
                  onClick={() => window.location.href = `/event/${slug}/memorabilia`}
                >
                  Add Memorabilia
                </IonicButton>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  aria-label="Upload photo"
                />
              </div>
            ) : (
              <IonicButton 
                onClick={handleJoinEvent} 
                disabled={joinLoading}
                variant="default"
              >
                {joinLoading ? 'Joining...' : '🎟️ Join Event'}
              </IonicButton>
            )}
          </CardContent>
        )}
      </Card>

      {/* Pods Section */}
      {isJoined && (
        <Card>
          <CardHeader>
            <CardTitle>Pods ({pods.length})</CardTitle>
            <CardDescription>
              Small groups for planning and chatting (max 5 members each)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                Create small groups for planning and coordination
              </span>
              {pods.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <IonicButton variant="outline" icon={add}>
                      New Pod
                    </IonicButton>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Pod</DialogTitle>
                      <DialogDescription>
                        Create a small group to hang out with at this event (max 5 people).
                      </DialogDescription>
                    </DialogHeader>
                    <CreatePodForm 
                      eventId={event.id} 
                      onSuccess={() => {
                        fetchEventData() // Refresh to show new pod
                      }} 
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
            {pods.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-800 mb-4">No pods created yet. Be the first!</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <IonicButton variant="default" icon={add}>
                      Create First Pod
                    </IonicButton>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create First Pod</DialogTitle>
                      <DialogDescription>
                        Start the first pod for this event! You can create a small group to hang out with (max 5 people).
                      </DialogDescription>
                    </DialogHeader>
                    <CreatePodForm 
                      eventId={event.id} 
                      onSuccess={() => {
                        fetchEventData() // Refresh to show new pod
                      }} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {pods.map((pod) => {
                  const memberCount = pod.pod_members.length
                  const isFull = memberCount >= 5
                  const isUserMember = pod.pod_members.some(m => m.user_id === user?.id)
                  
                  return (
                    <Card key={pod.id} className={`hover:shadow-md transition-shadow ${isFull ? 'opacity-75' : ''}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {pod.name || 'Unnamed Pod'}
                          {isFull && <Badge variant="secondary" className="text-xs">FULL</Badge>}
                        </CardTitle>
                        <CardDescription>
                          <span className={isFull ? 'text-orange-600 font-medium' : ''}>
                            {memberCount}/5 members
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isUserMember ? (
                          <IonicButton 
                            variant="default" 
                            fullWidth
                            icon={chatbubble}
                            onClick={() => window.location.href = `/event/${slug}/pod/${pod.id}`}
                          >
                            Open Chat
                          </IonicButton>
                        ) : isFull ? (
                          <IonicButton 
                            variant="outline" 
                            fullWidth
                            disabled
                          >
                            Pod Full
                          </IonicButton>
                        ) : (
                          <IonicButton 
                            variant="default" 
                            fullWidth
                            icon={rocket}
                            onClick={() => window.location.href = `/event/${slug}/pod/${pod.id}`}
                          >
                            Join Pod
                          </IonicButton>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Media Gallery Section */}
      {event && (
        <Card>
          <CardContent className="pt-6">
            <MediaGallery eventId={event.id} />
          </CardContent>
        </Card>
      )}

      {/* Members Section */}
      <Card>
        <CardHeader>
          <CardTitle>Crew Members ({members.length})</CardTitle>
          <CardDescription>
            Everyone who's joined this event
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-gray-800 text-center py-4">
              No members yet. Be the first to join!
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <div 
                  key={member.user_id} 
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium" aria-label={`Avatar for ${member.profiles?.display_name || 'Anonymous'}`}>
                    {member.profiles?.display_name?.[0] || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {member.profiles?.display_name || 'Anonymous'}
                    </p>
                    {member.vibe_badges.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {member.vibe_badges.slice(0, 2).map((badge, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        </Card>
      </Stack>
    </PageLayout>
  )
}