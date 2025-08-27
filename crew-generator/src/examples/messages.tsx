/**
 * Message UI Testing Examples
 * Seeded states for manual verification of chat layout fixes
 */

import React from 'react'
import type { Message } from '@/lib/messages/MessagesAdapter'

// Avatar size from design tokens (--avatar-lg = 48px)
const AVATAR_SIZE = 48

// Mock user profiles for testing
const mockProfiles = {
  alice: {
    display_name: 'Alice Chen',
    avatar_url: `https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=${AVATAR_SIZE}&h=${AVATAR_SIZE}&fit=crop&crop=face`
  },
  bob: {
    display_name: 'Bob Martinez',
    avatar_url: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=${AVATAR_SIZE}&h=${AVATAR_SIZE}&fit=crop&crop=face`
  },
  charlie: {
    display_name: 'Charlie O\'Sullivan',
    avatar_url: null
  },
  diana: {
    display_name: 'Diana K.',
    avatar_url: `https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=${AVATAR_SIZE}&h=${AVATAR_SIZE}&fit=crop&crop=face`
  }
}

// Test data for various scenarios
export const messageTestData = {
  // Basic conversation flow
  basic: [
    {
      id: '1',
      pod_id: 'test-pod',
      user_id: 'alice',
      text: 'Hey everyone! Excited for the show tonight 🎵',
      created_at: '2024-01-15T18:00:00Z',
      profiles: mockProfiles.alice
    },
    {
      id: '2', 
      pod_id: 'test-pod',
      user_id: 'bob',
      text: 'Same here! What time should we meet up?',
      created_at: '2024-01-15T18:01:00Z',
      profiles: mockProfiles.bob
    },
    {
      id: '3',
      pod_id: 'test-pod', 
      user_id: 'alice',
      text: 'How about 7:30 at the main entrance?',
      created_at: '2024-01-15T18:01:30Z',
      profiles: mockProfiles.alice
    },
    {
      id: '4',
      pod_id: 'test-pod',
      user_id: 'current-user', // This will be the user's own message (right-aligned)
      text: 'Perfect! I\'ll be there. Should I bring anything?',
      created_at: '2024-01-15T18:02:00Z',
      profiles: { display_name: 'You', avatar_url: null }
    },
    {
      id: '5',
      pod_id: 'test-pod',
      user_id: 'current-user', // Another user message to test grouping
      text: 'Maybe some snacks for the group?',
      created_at: '2024-01-15T18:02:15Z',
      profiles: { display_name: 'You', avatar_url: null }
    }
  ] as Message[],

  // Long messages and edge cases
  longMessages: [
    {
      id: '10',
      pod_id: 'test-pod',
      user_id: 'charlie',
      text: 'This is a really long message to test how the chat bubbles handle text wrapping and ensure that the max-width constraints work properly across different screen sizes. The bubble should wrap nicely without breaking the layout.',
      created_at: '2024-01-15T18:05:00Z',
      profiles: mockProfiles.charlie
    },
    {
      id: '11',
      pod_id: 'test-pod',
      user_id: 'diana',
      text: 'Short reply',
      created_at: '2024-01-15T18:05:30Z',
      profiles: mockProfiles.diana
    },
    {
      id: '12',
      pod_id: 'test-pod',
      user_id: 'alice',
      text: 'Here\'s a message with multiple lines\n\nLine 2 after double newline\nLine 3 with single newline\n\nAnd a final paragraph to test multi-line rendering in bubbles.',
      created_at: '2024-01-15T18:06:00Z',
      profiles: mockProfiles.alice
    }
  ] as Message[],

  // Message grouping scenarios
  groupedMessages: [
    {
      id: '20',
      pod_id: 'test-pod',
      user_id: 'bob',
      text: 'First message in group',
      created_at: '2024-01-15T18:10:00Z',
      profiles: mockProfiles.bob
    },
    {
      id: '21',
      pod_id: 'test-pod',
      user_id: 'bob', 
      text: 'Second message same user',
      created_at: '2024-01-15T18:10:15Z',
      profiles: mockProfiles.bob
    },
    {
      id: '22',
      pod_id: 'test-pod',
      user_id: 'bob',
      text: 'Third consecutive message',
      created_at: '2024-01-15T18:10:30Z', 
      profiles: mockProfiles.bob
    },
    {
      id: '23',
      pod_id: 'test-pod',
      user_id: 'alice',
      text: 'Breaking the group',
      created_at: '2024-01-15T18:11:00Z',
      profiles: mockProfiles.alice
    }
  ] as Message[],

  // Emoji and special characters
  emojiMessages: [
    {
      id: '30',
      pod_id: 'test-pod',
      user_id: 'diana',
      text: '🎵🎸🥁 Let\'s rock! 🤘',
      created_at: '2024-01-15T18:15:00Z',
      profiles: mockProfiles.diana
    },
    {
      id: '31',
      pod_id: 'test-pod',
      user_id: 'charlie',
      text: 'Testing unicode: ñáéíóú 中文 العربية 🚀 ➡️ ⭐',
      created_at: '2024-01-15T18:15:30Z',
      profiles: mockProfiles.charlie
    },
    {
      id: '32',
      pod_id: 'test-pod',
      user_id: 'alice',
      text: 'Code snippet: `const test = "hello";` and **bold** text',
      created_at: '2024-01-15T18:16:00Z',
      profiles: mockProfiles.alice
    }
  ] as Message[],

  // Mixed date scenarios (for date dividers)
  mixedDates: [
    {
      id: '40',
      pod_id: 'test-pod',
      user_id: 'alice',
      text: 'Message from yesterday',
      created_at: '2024-01-14T18:00:00Z',
      profiles: mockProfiles.alice
    },
    {
      id: '41',
      pod_id: 'test-pod',
      user_id: 'bob',
      text: 'Message from today',
      created_at: '2024-01-15T18:00:00Z',
      profiles: mockProfiles.bob
    },
    {
      id: '42',
      pod_id: 'test-pod',
      user_id: 'diana',
      text: 'Another today message',
      created_at: '2024-01-15T18:30:00Z',
      profiles: mockProfiles.diana
    }
  ] as Message[],

  // System/error messages
  systemMessages: [
    {
      id: '50',
      pod_id: 'test-pod',
      user_id: 'system',
      text: 'Alice joined the pod',
      created_at: '2024-01-15T17:55:00Z',
      profiles: { display_name: 'System', avatar_url: null }
    },
    {
      id: '51',
      pod_id: 'test-pod', 
      user_id: 'alice',
      text: 'Thanks for the invite!',
      created_at: '2024-01-15T17:56:00Z',
      profiles: mockProfiles.alice
    }
  ] as Message[],

  // Comprehensive test combining all scenarios
  comprehensive: [] as Message[]
}

// Combine all test data for comprehensive testing
messageTestData.comprehensive = [
  ...messageTestData.basic,
  ...messageTestData.longMessages,
  ...messageTestData.groupedMessages,
  ...messageTestData.emojiMessages,
  ...messageTestData.mixedDates,
  ...messageTestData.systemMessages
].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

// Test scenarios aligned with Tailwind breakpoint system
export const testScenarios = {
  mobile: {
    name: 'Mobile (640px)',
    width: 640,
    breakpoint: 'sm',
    description: 'Test small screen layout, bubble max-width, keyboard handling'
  },
  tablet: {
    name: 'Tablet (768px)', 
    width: 768,
    breakpoint: 'md',
    description: 'Test medium screen layout, responsive bubble widths'
  },
  desktop: {
    name: 'Desktop (1024px+)',
    width: 1024,
    breakpoint: 'lg',
    description: 'Test large screen layout, full bubble widths'
  }
}

// Current user for testing "own" vs "other" message styling
export const mockCurrentUser = {
  id: 'alice',
  profile: mockProfiles.alice
}
