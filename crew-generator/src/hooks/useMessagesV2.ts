import { useState, useEffect, useCallback, useRef } from 'react'
import { messagesAdapter, type Message } from '../lib/messages/MessagesAdapter'
import { isFeatureEnabled } from '../lib/featureFlags'
import { toast } from 'sonner'

interface UseMessagesV2Options {
  podId: string
  enabled?: boolean
  initialLimit?: number
}

interface UseMessagesV2Return {
  messages: Message[]
  loading: boolean
  error: string | null
  hasMore: boolean
  nextCursor?: string
  sending: boolean
  
  // Actions
  sendMessage: (text: string) => Promise<void>
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
  
  // State
  isConnected: boolean
}

/**
 * Modern hook for messages using the MessagesAdapter
 * Features cursor pagination, realtime updates, optimistic sends
 */
export function useMessagesV2({ 
  podId, 
  enabled = true,
  initialLimit = 50 
}: UseMessagesV2Options): UseMessagesV2Return {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [nextCursor, setNextCursor] = useState<string>()
  const [isConnected, setIsConnected] = useState(false)
  
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const initialLoadDone = useRef(false)

  // Load initial messages
  const loadMessages = useCallback(async (cursor?: string, append = false) => {
    if (!enabled || !podId) return

    try {
      setLoading(true)
      setError(null)

      const result = await messagesAdapter.list({
        podId,
        cursor,
        limit: initialLimit
      })

      setMessages(prev => append ? [...prev, ...result.messages] : result.messages)
      setHasMore(!!result.nextCursor)
      setNextCursor(result.nextCursor)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages'
      setError(errorMessage)
      console.error('Failed to load messages:', err)
    } finally {
      setLoading(false)
    }
  }, [enabled, podId, initialLimit])

  // Load more messages (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !nextCursor) return
    await loadMessages(nextCursor, true)
  }, [hasMore, loading, nextCursor, loadMessages])

  // Refresh messages
  const refresh = useCallback(async () => {
    initialLoadDone.current = false
    setMessages([])
    setNextCursor(undefined)
    setHasMore(true)
    await loadMessages()
    initialLoadDone.current = true
  }, [loadMessages])

  // Send message with optimistic update
  const sendMessage = useCallback(async (text: string) => {
    if (!enabled || !podId || sending) return

    try {
      setSending(true)
      setError(null)

      // Optimistic update (if feature enabled)
      const optimisticMessage: Message = {
        id: `optimistic-${Date.now()}`,
        pod_id: podId,
        user_id: 'current-user', // Will be replaced by real data
        text,
        created_at: new Date().toISOString(),
        profiles: { display_name: 'You' }
      }

      if (isFeatureEnabled('MESSAGES_UI')) {
        setMessages(prev => [...prev, optimisticMessage])
      }

      // Send actual message
      const sentMessage = await messagesAdapter.send({ podId, text })

      // Replace optimistic message with real one
      if (isFeatureEnabled('MESSAGES_UI')) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === optimisticMessage.id ? sentMessage : msg
          )
        )
      }

    } catch (err) {
      // Remove optimistic message on error
      if (isFeatureEnabled('MESSAGES_UI')) {
        setMessages(prev => 
          prev.filter(msg => !msg.id?.startsWith('optimistic-'))
        )
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Failed to send message:', err)
    } finally {
      setSending(false)
    }
  }, [enabled, podId, sending])

  // Handle realtime messages
  const handleRealtimeMessage = useCallback((newMessage: Message) => {
    setMessages(prev => {
      // Avoid duplicates (optimistic updates)
      const exists = prev.some(msg => msg.id === newMessage.id)
      if (exists) return prev
      
      // Remove any optimistic message that matches
      const withoutOptimistic = prev.filter(msg => 
        !msg.id?.startsWith('optimistic-') || 
        msg.text !== newMessage.text
      )
      
      return [...withoutOptimistic, newMessage]
    })
  }, [])

  // Set up realtime subscription
  useEffect(() => {
    if (!enabled || !podId || !isFeatureEnabled('MESSAGES_UI')) return

    console.log(`🔗 Setting up realtime subscription for pod: ${podId}`)
    
    try {
      const unsubscribe = messagesAdapter.subscribe({
        podId,
        onMessage: handleRealtimeMessage
      })

      unsubscribeRef.current = unsubscribe
      setIsConnected(true)

      return () => {
        console.log(`🧹 Cleaning up realtime subscription for pod: ${podId}`)
        unsubscribe()
        unsubscribeRef.current = null
        setIsConnected(false)
      }
    } catch (err) {
      console.error('Failed to set up realtime subscription:', err)
      setIsConnected(false)
    }
  }, [enabled, podId, handleRealtimeMessage])

  // Load initial messages
  useEffect(() => {
    if (!initialLoadDone.current && enabled && podId) {
      loadMessages()
      initialLoadDone.current = true
    }
  }, [enabled, podId, loadMessages])

  return {
    messages,
    loading,
    error,
    hasMore,
    nextCursor,
    sending,
    sendMessage,
    loadMore,
    refresh,
    isConnected
  }
}
