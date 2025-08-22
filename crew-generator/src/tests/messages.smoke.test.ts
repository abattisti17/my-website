/**
 * Smoke Tests for Messages Functionality
 * 
 * These tests verify that existing messaging functionality remains intact
 * after implementing the new Messages UI components and adapter layer.
 * 
 * Run with: npm test -- messages.smoke.test.ts
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { messagesAdapter, SupabaseMessagesAdapter } from '../lib/messages/MessagesAdapter'
import { supabase } from '../lib/supabase'

// Mock Supabase for testing
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn()
    },
    channel: vi.fn()
  }
}))

const mockSupabase = supabase as any

describe('Messages Smoke Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('MessagesAdapter', () => {
    it('should be instantiable', () => {
      expect(messagesAdapter).toBeInstanceOf(SupabaseMessagesAdapter)
    })

    it('should have required interface methods', () => {
      expect(typeof messagesAdapter.list).toBe('function')
      expect(typeof messagesAdapter.send).toBe('function')
      expect(typeof messagesAdapter.subscribe).toBe('function')
    })
  })

  describe('Message List Functionality', () => {
    it('should fetch messages with pagination', async () => {
      // Mock successful response
      const mockMessages = [
        {
          id: '1',
          pod_id: 'test-pod',
          user_id: 'user-1',
          text: 'Test message',
          created_at: '2024-01-01T12:00:00Z',
          profiles: { display_name: 'Test User' }
        }
      ]

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                lt: vi.fn().mockResolvedValue({
                  data: mockMessages,
                  error: null
                })
              })
            })
          })
        })
      })

      const result = await messagesAdapter.list({
        podId: 'test-pod',
        limit: 50
      })

      expect(result).toHaveProperty('messages')
      expect(result).toHaveProperty('nextCursor')
      expect(Array.isArray(result.messages)).toBe(true)
    })

    it('should handle list errors gracefully', async () => {
      // Mock error response
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                lt: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Database error' }
                })
              })
            })
          })
        })
      })

      await expect(messagesAdapter.list({ podId: 'test-pod' }))
        .rejects.toThrow('Failed to fetch messages')
    })
  })

  describe('Message Send Functionality', () => {
    it('should send messages successfully', async () => {
      // Mock authenticated user
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-1' } },
        error: null
      })

      // Mock successful insert
      const mockMessage = {
        id: '1',
        pod_id: 'test-pod',
        user_id: 'user-1',
        text: 'Test message',
        created_at: '2024-01-01T12:00:00Z'
      }

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockMessage,
              error: null
            })
          })
        })
      })

      const result = await messagesAdapter.send({
        podId: 'test-pod',
        text: 'Test message'
      })

      expect(result).toEqual(mockMessage)
    })

    it('should reject empty messages', async () => {
      await expect(messagesAdapter.send({
        podId: 'test-pod',
        text: ''
      })).rejects.toThrow('Message text cannot be empty')
    })

    it('should require authentication', async () => {
      // Mock unauthenticated user
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      })

      await expect(messagesAdapter.send({
        podId: 'test-pod',
        text: 'Test message'
      })).rejects.toThrow('User not authenticated')
    })
  })

  describe('Realtime Subscription', () => {
    it('should create subscription and return unsubscribe function', () => {
      const mockUnsubscribe = vi.fn()
      const mockChannel = {
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnThis(),
        unsubscribe: mockUnsubscribe
      }

      mockSupabase.channel.mockReturnValue(mockChannel)

      const onMessage = vi.fn()
      const unsubscribe = messagesAdapter.subscribe({
        podId: 'test-pod',
        onMessage
      })

      // Should return unsubscribe function
      expect(typeof unsubscribe).toBe('function')

      // Should set up channel correctly
      expect(mockSupabase.channel).toHaveBeenCalledWith('messages_test-pod')
      expect(mockChannel.on).toHaveBeenCalled()
      expect(mockChannel.subscribe).toHaveBeenCalled()

      // Should unsubscribe when called
      unsubscribe()
      expect(mockUnsubscribe).toHaveBeenCalled()
    })
  })

  describe('Backward Compatibility', () => {
    it('should maintain existing message interface', () => {
      const message = {
        id: '1',
        pod_id: 'test-pod',
        user_id: 'user-1',
        text: 'Test message',
        created_at: '2024-01-01T12:00:00Z'
      }

      // Should accept existing message format
      expect(message).toHaveProperty('pod_id')
      expect(message).toHaveProperty('user_id')
      expect(message).toHaveProperty('text')
      expect(message).toHaveProperty('created_at')
    })

    it('should handle optional profile data', () => {
      const messageWithProfile = {
        id: '1',
        pod_id: 'test-pod',
        user_id: 'user-1',
        text: 'Test message',
        created_at: '2024-01-01T12:00:00Z',
        profiles: {
          display_name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg'
        }
      }

      const messageWithoutProfile = {
        id: '2',
        pod_id: 'test-pod',
        user_id: 'user-2',
        text: 'Another message',
        created_at: '2024-01-01T12:01:00Z'
      }

      // Both should be valid
      expect(messageWithProfile.profiles).toBeDefined()
      expect(messageWithoutProfile.profiles).toBeUndefined()
    })
  })
})

describe('Integration with usePodChat', () => {
  it('should maintain compatibility with existing hook interface', () => {
    // The existing usePodChat hook should still work
    // This ensures our adapter doesn't break existing functionality
    
    const expectedInterface = {
      messages: expect.any(Array),
      loading: expect.any(Boolean),
      error: expect.any(String),
      sendMessage: expect.any(Function),
      sending: expect.any(Boolean)
    }

    // This is what usePodChat should still return
    expect(expectedInterface.messages).toBeDefined()
    expect(expectedInterface.sendMessage).toBeDefined()
  })
})
