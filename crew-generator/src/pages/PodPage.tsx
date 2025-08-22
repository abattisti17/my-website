import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'
import { usePodChat } from '../hooks/usePodChat'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import ReportMenu from '../components/ReportMenu'
import { toast } from 'sonner'

interface Pod {
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

interface PodMember {
  user_id: string
  role: string
  joined_at: string
  profiles: {
    display_name: string
    avatar_url: string | null
  } | null
}

export default function PodPage() {
  const { slug, podId } = useParams<{ slug: string; podId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [pod, setPod] = useState<Pod | null>(null)
  const [members, setMembers] = useState<PodMember[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const [hiddenMessages, setHiddenMessages] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Use our new chat hook - only when user is a member
  const { messages, sendMessage, sending: chatSending, error: chatError } = usePodChat(
    isMember && podId ? podId : ''
  )

  useEffect(() => {
    if (podId) {
      fetchPodData()
    }
  }, [podId, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Show chat error if any
  useEffect(() => {
    if (chatError) {
      toast.error(chatError)
    }
  }, [chatError])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchPodData = async () => {
    try {
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

    // Client-side check for better UX (but database trigger is the source of truth)
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
        console.error('Error joining pod:', error)
        
        // Handle database trigger exception for pod full
        if (error.message?.includes('Pod is full') || error.code === 'P0001') {
          toast.error('Pod full — create another.')
          // Refresh pod data to get accurate member count
          fetchPodData()
          return
        }
        
        // Handle duplicate member constraint
        if (error.code === '23505') {
          toast.success('You\'re already in this pod! 🎉')
          setIsMember(true)
          return
        }
        
        throw error
      }

      setIsMember(true)
      toast.success('Welcome to the pod! 🎉')
      fetchPodData() // Refresh data
    } catch (error: any) {
      console.error('Error joining pod:', error)
      
      // Handle database trigger exception
      if (error?.message?.includes('Pod is full')) {
        toast.error('Pod full — create another.')
        fetchPodData() // Refresh to get accurate count
      } else {
        toast.error('Failed to join pod')
      }
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return

    try {
      await sendMessage(newMessage)
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      // Error handling is done in the hook
    }
  }

  const handleHideMessage = (messageId: string) => {
    setHiddenMessages(prev => new Set(prev).add(messageId))
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
      navigate(`/event/${slug}`)
    } catch (error) {
      console.error('Error leaving pod:', error)
      toast.error('Failed to leave pod')
    }
  }

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
          <Link to={`/event/${slug}`}>← Back to Event</Link>
        </Button>
      </div>
    )
  }

  if (!isMember) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="outline" className="mb-6" asChild>
          <Link to={`/event/${slug}`}>← Back to Event</Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{pod.name || 'Unnamed Pod'}</span>
              <Badge variant="outline">
                {members.length}/5 members
              </Badge>
            </CardTitle>
            <CardDescription>
              {pod.events.artist} • {pod.events.city}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Pod Members:</h3>
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.user_id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium" aria-label={`Avatar for ${member.profiles?.display_name || 'Anonymous'}`}>
                      {member.profiles?.display_name?.[0] || '?'}
                    </div>
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
                <p className="text-gray-800">Pod full (5/5 members)</p>
                <p className="text-sm text-gray-600 mt-1">Create another pod to join the crew!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to={`/event/${slug}`}>← Back</Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">{pod.name || 'Unnamed Pod'}</h1>
            <p className="text-sm text-gray-600">
              {pod.events.artist} • {members.length}/5 members
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleLeavePod}>
          Leave Pod
        </Button>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Pod Chat</CardTitle>
            <div className="flex -space-x-2">
              {members.slice(0, 3).map((member) => (
                <div 
                  key={member.user_id}
                  className="w-8 h-8 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-medium"
                  title={member.profiles?.display_name || 'Anonymous'}
                >
                  {member.profiles?.display_name?.[0] || '?'}
                </div>
              ))}
              {members.length > 3 && (
                <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">
                  +{members.length - 3}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto space-y-3 min-h-0 pb-20 md:pb-4">
          {messages.filter(msg => !hiddenMessages.has(msg.id)).length === 0 ? (
            <div className="text-center py-8 text-gray-700">
              <p>No messages yet. Start the conversation! 👋</p>
            </div>
          ) : (
            messages
              .filter(msg => !hiddenMessages.has(msg.id))
              .map((message) => (
                <div 
                  key={message.id}
                  className={`flex gap-3 group ${message.user_id === user?.id ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0" aria-label={`Avatar for ${message.profiles?.display_name || 'Anonymous'}`}>
                    {message.profiles?.display_name?.[0] || '?'}
                  </div>
                  <div className={`max-w-[70%] ${message.user_id === user?.id ? 'text-right' : ''}`}>
                    <div className="chat-timestamp mb-1">
                      {message.profiles?.display_name || 'Anonymous'} • {' '}
                      {new Date(message.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <div className="relative">
                      <div 
                        className={`p-3 rounded-lg ${
                          message.user_id === user?.id 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {message.text}
                      </div>
                      {/* Only show report menu for other users' messages */}
                      {message.user_id !== user?.id && (
                        <div className={`absolute top-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                          message.user_id === user?.id ? 'left-1' : 'right-1'
                        }`}>
                          <ReportMenu
                            targetType="message"
                            targetId={message.id}
                            onItemHidden={() => handleHideMessage(message.id)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Desktop Message Input - Remains in card for desktop */}
        <div className="hidden md:block p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={chatSending}
              className="flex-1"
              maxLength={500}
              aria-label="Message input"
              autoComplete="off"
            />
            <Button type="submit" disabled={chatSending || !newMessage.trim()} aria-label={chatSending ? 'Sending message' : 'Send message'}>
              {chatSending ? '📤' : '🚀'}
            </Button>
          </form>
        </div>
      </Card>

      {/* Fixed Mobile Message Input - Pinned above bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border md:hidden z-40" 
           style={{ bottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
        <div className="p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={chatSending}
              className="flex-1"
              maxLength={500}
              aria-label="Message input"
              autoComplete="off"
            />
            <Button type="submit" disabled={chatSending || !newMessage.trim()} aria-label={chatSending ? 'Sending message' : 'Send message'}>
              {chatSending ? '📤' : '🚀'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}