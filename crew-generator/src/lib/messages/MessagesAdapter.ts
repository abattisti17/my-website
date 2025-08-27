import { supabase } from '../supabase'
import { handleError } from '../errorHandling'

// Adapter interface for compatibility
export interface MessagesAdapter {
  list(params: { podId: string; cursor?: string; limit?: number }): Promise<{ messages: Message[]; nextCursor?: string }>
  send(params: { podId: string; text: string }): Promise<Message>
  subscribe(params: { podId: string; onMessage: (m: Message) => void }): () => void
}

// Normalized message type
export type Message = {
  id?: string
  pod_id: string
  user_id: string
  text: string
  created_at: string
  profiles?: {
    display_name: string
    avatar_url?: string
  }
}

// Supabase-specific implementation
export class SupabaseMessagesAdapter implements MessagesAdapter {
  /**
   * Cursor-based pagination for messages
   * Cursor is the created_at timestamp for efficient pagination
   */
  async list({ podId, cursor, limit = 50 }: { podId: string; cursor?: string; limit?: number }) {
    try {
      let query = supabase
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
        .order('created_at', { ascending: false }) // Latest first for cursor pagination
        .limit(limit + 1) // Fetch one extra to determine if there are more

      // Apply cursor pagination if cursor provided
      if (cursor) {
        query = query.lt('created_at', cursor)
      }

      const { data, error } = await query

      if (error) {
        handleError(error, 'fetching messages')
        throw new Error('Failed to fetch messages')
      }

      const messages = (data as any[]) || []
      
      // Check if we have more results for pagination
      const hasMore = messages.length > limit
      const resultMessages = hasMore ? messages.slice(0, limit) : messages
      
      // Reverse to show oldest first in UI (cursor pagination fetches newest first)
      const orderedMessages = resultMessages.reverse()
      
      // Next cursor is the created_at of the oldest message in this batch
      const nextCursor = hasMore && resultMessages.length > 0 
        ? resultMessages[resultMessages.length - 1].created_at 
        : undefined

      return {
        messages: orderedMessages as Message[],
        nextCursor
      }
    } catch (error) {
      console.error('MessagesAdapter.list error:', error)
      throw error
    }
  }

  /**
   * Send a new message with optimistic update support
   */
  async send({ podId, text }: { podId: string; text: string }): Promise<Message> {
    try {
      if (!text.trim()) {
        throw new Error('Message text cannot be empty')
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      const messageData = {
        pod_id: podId,
        user_id: user.id,
        text: text.trim()
      }

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
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
        .single()

      if (error) {
        handleError(error, 'sending message')
        throw new Error('Failed to send message')
      }

      return data as unknown as Message
    } catch (error) {
      console.error('MessagesAdapter.send error:', error)
      throw error
    }
  }

  /**
   * Subscribe to real-time message updates
   * Returns unsubscribe function for cleanup
   */
  subscribe({ podId, onMessage }: { podId: string; onMessage: (m: Message) => void }): () => void {
    console.log(`🔗 Setting up realtime subscription for pod: ${podId}`)
    
    const realtimeChannel = supabase
      .channel(`messages_${podId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `pod_id=eq.${podId}`
        },
        (payload: any) => {
          console.log('New message received:', payload)
          
          // Transform realtime payload to Message format
          const newMessage: Message = {
            id: payload.new.id,
            pod_id: payload.new.pod_id,
            user_id: payload.new.user_id,
            text: payload.new.text,
            created_at: payload.new.created_at,
            // Profile data will be fetched lazily or from cache
            profiles: {
              display_name: 'Loading...',
              avatar_url: undefined
            }
          }

          onMessage(newMessage)

          // Optionally fetch profile data in background
          this.enrichMessageWithProfile(newMessage).then(enrichedMessage => {
            if (enrichedMessage.profiles?.display_name !== 'Loading...') {
              onMessage(enrichedMessage)
            }
          }).catch(console.warn)
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status for ${podId}:`, status)
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Subscribed to messages for pod: ${podId}`)
        }
      })

    // Return unsubscribe function
    return () => {
      console.log(`🧹 Unsubscribing from messages for pod: ${podId}`)
      realtimeChannel.unsubscribe()
    }
  }

  /**
   * Helper to enrich message with profile data
   * Used for lazy loading profile info in realtime messages
   */
  private async enrichMessageWithProfile(message: Message): Promise<Message> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', message.user_id)
        .single()

      if (profile) {
        return {
          ...message,
          profiles: {
            display_name: profile.display_name || 'Anonymous',
            avatar_url: profile.avatar_url || undefined
          }
        }
      }
    } catch (error) {
      console.warn('Failed to fetch profile for message:', error)
    }

    return message
  }
}

// Factory function for easy instantiation
export const createMessagesAdapter = (): MessagesAdapter => {
  return new SupabaseMessagesAdapter()
}

// Export default instance
export const messagesAdapter = createMessagesAdapter()
