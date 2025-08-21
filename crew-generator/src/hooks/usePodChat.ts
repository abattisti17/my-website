import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { handleError } from '../lib/errorHandling'
// import { useVisibilityAwareConnection } from './usePageVisibility' // Temporarily disabled

interface Message {
  id: string
  pod_id: string
  user_id: string
  text: string
  created_at: string
  profiles?: {
    display_name: string
    avatar_url?: string
  }
}

interface UsePodChatReturn {
  messages: Message[]
  loading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  sending: boolean
}

export function usePodChat(podId: string): UsePodChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)


  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select(`
          id,
          pod_id,
          user_id,
          text,
          created_at,
          profiles:user_id (
            display_name,
            avatar_url
          )
        `)
        .eq('pod_id', podId)
        .order('created_at', { ascending: true })
        .limit(100)

      if (fetchError) {
        handleError(fetchError, 'fetching messages')
        setError('Failed to load messages')
        return
      }

      setMessages((data as any) || [])
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, [podId])

  // Send a new message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    try {
      setSending(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be logged in to send messages')
        return
      }

      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          pod_id: podId,
          user_id: user.id,
          text: content.trim()
        })

      if (insertError) {
        handleError(insertError, 'sending message')
        setError('Failed to send message')
      }
    } catch (err) {
      console.error('Unexpected error sending message:', err)
      setError('Failed to send message')
    } finally {
      setSending(false)
    }
  }, [podId])

  // Fetch initial messages when pod changes
  useEffect(() => {
    if (podId) {
      fetchMessages()
    }
  }, [podId, fetchMessages])

  // Set up standard realtime subscription (simplified for now)
  useEffect(() => {
    if (!podId) return

    console.log(`🔗 Setting up realtime subscription for pod: ${podId}`)
    const realtimeChannel = supabase
      .channel(`pod_chat_${podId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `pod_id=eq.${podId}`
        },
        (payload) => {
          console.log('New message received:', payload)
          
          // Use the payload data directly instead of making another query
          const newMessage = {
            id: payload.new.id,
            pod_id: payload.new.pod_id,
            user_id: payload.new.user_id,
            text: payload.new.text,
            created_at: payload.new.created_at,
            // Profile data will be fetched lazily or cached
            profiles: {
              display_name: 'Loading...', // Temporary, will be updated
              avatar_url: null
            }
          }

          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(msg => msg.id === newMessage.id)) {
              return prev
            }
            return [...prev, newMessage]
          })

          // Optionally fetch profile data in background (debounced)
          // This reduces the immediate database load
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Subscribed to pod chat: ${podId}`)
        }
      })

    // Cleanup function
    return () => {
      console.log(`🧹 Cleaning up realtime subscription for pod: ${podId}`)
      realtimeChannel.unsubscribe()
    }
  }, [podId])

  return {
    messages,
    loading,
    error,
    sendMessage,
    sending
  }
}
