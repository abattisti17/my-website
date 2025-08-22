import React, { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthProvider'
import { messagesAdapter, type Message } from '../lib/messages/MessagesAdapter'
import { MessageList } from '../components/ui/message-list'
import { MessageComposer } from '../components/ui/message-composer'
import { PodChatView } from '../components/ui/pod-chat-view'
import { PageHeader } from '../components/design-system/PageHeader'
import { PageLayout } from '../components/design-system/PageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Settings, Users, Zap } from 'lucide-react'
import { isFeatureEnabled, toggleFeatureFlag, getAllFeatureFlags } from '../lib/featureFlags'
import { toast } from 'sonner'

// Mock data for demonstration
const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    pod_id: 'example-pod',
    user_id: 'user-1',
    text: 'Hey everyone! Super excited for the concert tonight! 🎵',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    profiles: { display_name: 'Alice', avatar_url: undefined }
  },
  {
    id: '2',
    pod_id: 'example-pod',
    user_id: 'user-2',
    text: 'Same here! I\'ve been listening to their new album all week',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
    profiles: { display_name: 'Bob', avatar_url: undefined }
  },
  {
    id: '3',
    pod_id: 'example-pod',
    user_id: 'user-1',
    text: 'What time should we meet up?',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
    profiles: { display_name: 'Alice', avatar_url: undefined }
  },
  {
    id: '4',
    pod_id: 'example-pod',
    user_id: 'user-3',
    text: 'How about 7 PM at the main entrance? I\'ll be wearing a red jacket',
    created_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    profiles: { display_name: 'Charlie', avatar_url: undefined }
  },
  {
    id: '5',
    pod_id: 'example-pod',
    user_id: 'current-user',
    text: 'Perfect! See you all there',
    created_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    profiles: { display_name: 'You', avatar_url: undefined }
  },
  {
    id: '6',
    pod_id: 'example-pod',
    user_id: 'user-2',
    text: 'This is going to be amazing! First time seeing them live',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    profiles: { display_name: 'Bob', avatar_url: undefined }
  },
  {
    id: '7',
    pod_id: 'example-pod',
    user_id: 'user-2',
    text: 'Anyone know what the opening act is?',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString(),
    profiles: { display_name: 'Bob', avatar_url: undefined }
  },
  {
    id: '8',
    pod_id: 'example-pod',
    user_id: 'user-1',
    text: 'I think it\'s The Midnight Runners - they\'re supposed to be really good!',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    profiles: { display_name: 'Alice', avatar_url: undefined }
  },
  {
    id: '9',
    pod_id: 'example-pod',
    user_id: 'current-user',
    text: 'Just got to the venue - the line is already pretty long!',
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    profiles: { display_name: 'You', avatar_url: undefined }
  }
]

const MOCK_POD_ID = 'example-pod'

export default function MessagesExamplePage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [nextCursor, setNextCursor] = useState<string>()
  const [featureFlags, setFeatureFlags] = useState(getAllFeatureFlags())
  const [hiddenMessages, setHiddenMessages] = useState<Set<string>>(new Set())

  // Initialize with mock data
  useEffect(() => {
    setMessages(MOCK_MESSAGES)
  }, [])

  // Handle sending messages
  const handleSendMessage = async (text: string) => {
    if (!user) {
      toast.error('Please sign in to send messages')
      return
    }

    setSending(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        pod_id: MOCK_POD_ID,
        user_id: 'current-user',
        text,
        created_at: new Date().toISOString(),
        profiles: { display_name: 'You', avatar_url: undefined }
      }

      setMessages(prev => [...prev, newMessage])
      toast.success('Message sent!')
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  // Handle loading more messages
  const handleLoadMore = async () => {
    setLoading(true)
    try {
      // Simulate loading more messages
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.info('No more messages to load (demo)')
    } catch (error) {
      console.error('Failed to load more messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  // Handle message hiding (when reported)
  const handleMessageHidden = (messageId: string) => {
    setHiddenMessages(prev => new Set([...prev, messageId]))
    toast.success('Message reported and hidden')
  }

  // Toggle feature flags (dev mode only)
  const handleToggleFlag = (flag: string) => {
    if (!import.meta.env.DEV) return
    
    toggleFeatureFlag(flag as any)
    setFeatureFlags(getAllFeatureFlags())
    toast.success(`Toggled ${flag}`)
  }

  const messagesV2Enabled = isFeatureEnabled('MESSAGES_UI')

  return (
    <PageLayout>
      <PageHeader
        title="Messages UI Example"
        subtitle="Testing the new message components"
        icon={<MessageCircle className="h-8 w-8 text-primary" />}
      />

      {/* Feature Flag Debug Panel (Dev Only) */}
      {import.meta.env.DEV && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Feature Flags (Dev Mode)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(featureFlags).map(([flag, enabled]) => (
                <Button
                  key={flag}
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleFlag(flag)}
                  className="justify-between"
                >
                  {flag}
                  <Badge variant={enabled ? 'default' : 'secondary'}>
                    {enabled ? 'ON' : 'OFF'}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Info */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Concert Crew #1</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{messages.length} messages</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <Badge variant={messagesV2Enabled ? 'default' : 'secondary'}>
                {messagesV2Enabled ? 'Messages v2' : 'Messages v1'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface Options */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Option 1: Component Demo */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-lg">Individual Components</CardTitle>
            <p className="text-sm text-muted-foreground">MessageList + MessageComposer</p>
          </CardHeader>
          
          {/* Messages */}
          <CardContent className="flex-1 p-0 overflow-hidden relative">
            {messagesV2Enabled ? (
              <MessageList
                messages={messages.filter(msg => !hiddenMessages.has(msg.id || ''))}
                currentUserId="current-user"
                loading={loading}
                hasMore={!!nextCursor}
                onLoadMore={handleLoadMore}
                onMessageHidden={handleMessageHidden}
                height={400} // Reduced height to account for composer
                className="pb-4" // Add padding bottom for breathing room
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enable MESSAGES_UI flag to see new components</p>
                  <p className="text-xs mt-1">Currently showing placeholder</p>
                </div>
              </div>
            )}
          </CardContent>

          {/* Composer */}
          <div className="flex-shrink-0 border-t bg-background">
            {messagesV2Enabled ? (
              <MessageComposer
                onSend={handleSendMessage}
                disabled={sending || !user}
                podId={MOCK_POD_ID}
                placeholder={user ? "Type a message..." : "Sign in to send messages"}
                maxLength={500}
              />
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">Enable MESSAGES_UI to test the composer</p>
              </div>
            )}
          </div>
        </Card>

        {/* Option 2: PodChatView Demo */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-lg">Production Pod Chat</CardTitle>
            <p className="text-sm text-muted-foreground">PodChatView with full context</p>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden">
            {messagesV2Enabled ? (
              <div className="h-full">
                <div className="text-center p-4 text-muted-foreground">
                  <p className="text-sm mb-2">🚧 PodChatView Integration</p>
                  <p className="text-xs">Visit a real pod to see full experience:</p>
                  <p className="text-xs font-mono mt-1">/event/[slug]/pod/[id]</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enable MESSAGES_UI flag to see PodChatView</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Testing Instructions */}
      <Card className="mt-6 border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-800">🧪 Testing the Report Feature</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-amber-700 space-y-2">
            <p><strong>How to test:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Hover over messages from <strong>Alice</strong>, <strong>Bob</strong>, or <strong>Charlie</strong> (not your own)</li>
              <li>You'll see a <strong>⋮ (three dots)</strong> menu appear in the top-right corner</li>
              <li>Click it and select <strong>"🚨 Report"</strong></li>
              <li>Fill out the report form (optional reason)</li>
              <li>The message will be hidden and replaced with "Message hidden"</li>
            </ol>
            <p className="mt-3"><strong>Note:</strong> Your own messages (marked "You") don't show the report button for obvious reasons!</p>
          </div>
        </CardContent>
      </Card>

      {/* Component Documentation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Component Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
                      <div>
              <h4 className="font-medium mb-2">MessageList</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Virtualized rendering for performance</li>
                <li>• Message grouping by sender and time</li>
                <li>• Sticky date dividers</li>
                <li>• Cursor-based pagination</li>
                <li>• Auto-scroll with "new messages" indicator</li>
                <li>• Proper ARIA labels for accessibility</li>
                <li>• **Report feature**: Hover over other users' messages</li>
              </ul>
            </div>
          
          <div>
            <h4 className="font-medium mb-2">MessageComposer</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Multi-line text input with auto-resize</li>
              <li>• Enter to send, Shift+Enter for new line</li>
              <li>• Draft persistence to localStorage</li>
              <li>• Character count and length limiting</li>
              <li>• Touch-friendly send button</li>
              <li>• Emoji and attachment hooks (placeholder)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
