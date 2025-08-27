import React, { useEffect, useRef, useState, useCallback } from 'react'
import { VariableSizeList as List } from 'react-window'
import { cn } from '@/lib/utils'
import type { Message } from '@/lib/messages/MessagesAdapter'
import { UserAvatar } from './avatar'
import ReportMenu from '../ReportMenu'

interface MessageGroup {
  id: string
  messages: Message[]
  sender: {
    user_id: string
    display_name: string
    avatar_url?: string
  }
  timestamp: string
  isOwn: boolean
}

interface MessageListProps {
  messages: Message[]
  currentUserId?: string
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onMessageHidden?: (messageId: string) => void
  className?: string
  height?: number
}

// Message grouping logic - group consecutive messages from same user within 2 minutes
function groupMessages(messages: Message[], currentUserId?: string): MessageGroup[] {
  const groups: MessageGroup[] = []
  let currentGroup: MessageGroup | null = null

  for (const message of messages) {
    const messageTime = new Date(message.created_at)
    const isOwn = message.user_id === currentUserId
    const profile = message.profiles || { display_name: 'Unknown User' }

    // Start new group if:
    // 1. No current group
    // 2. Different sender
    // 3. More than 2 minutes between messages
    const shouldStartNewGroup = !currentGroup ||
      currentGroup.sender.user_id !== message.user_id ||
      Math.abs(messageTime.getTime() - new Date(currentGroup.timestamp).getTime()) > 2 * 60 * 1000

    if (shouldStartNewGroup) {
      currentGroup = {
        id: message.id || `group_${groups.length}`,
        messages: [message],
        sender: {
          user_id: message.user_id,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url
        },
        timestamp: message.created_at,
        isOwn
      }
      groups.push(currentGroup)
    } else {
      // Add to existing group
      currentGroup!.messages.push(message)
      // Update timestamp to latest message
      currentGroup!.timestamp = message.created_at
    }
  }

  return groups
}

// Individual message bubble component
const MessageBubble: React.FC<{
  message: Message
  isGrouped: boolean
  isOwn: boolean
  showTail: boolean
  currentUserId?: string
  onMessageHidden?: (messageId: string) => void
}> = ({ message, isGrouped: _isGrouped, isOwn, showTail, currentUserId, onMessageHidden }) => {
  const [isHidden, setIsHidden] = useState(false)

  const handleMessageHidden = () => {
    setIsHidden(true)
    onMessageHidden?.(message.id || '')
  }

  if (isHidden) {
    return (
      <div       className={cn(
        "message-bubble break-words",
        "bg-muted/50 text-muted-foreground italic border border-dashed",
        isOwn ? "ml-auto" : "",

      )}
      style={{
        paddingLeft: 'var(--message-bubble-padding-x)',
        paddingRight: 'var(--message-bubble-padding-x)',
        paddingTop: 'var(--message-bubble-padding-y)',
        paddingBottom: 'var(--message-bubble-padding-y)',
        borderRadius: 'var(--message-bubble-radius)',
        maxWidth: 'min(var(--message-bubble-max-width-lg), 85vw)'
      }}>
        <p className="text-xs">Message hidden</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "message-bubble group relative break-words break-anywhere", // Added break-anywhere for better text wrapping
        isOwn 
          ? "bg-primary text-primary-foreground ml-auto" 
          : "bg-muted text-foreground",
        showTail && isOwn && "rounded-br-sm",
        showTail && !isOwn && "rounded-bl-sm"
      )}
      style={{
        paddingLeft: 'var(--message-bubble-padding-x)',
        paddingRight: 'var(--message-bubble-padding-x)',
        paddingTop: 'var(--message-bubble-padding-y)',
        paddingBottom: 'var(--message-bubble-padding-y)',
        borderRadius: 'var(--message-bubble-radius)',
        // ENTERPRISE FIX: Explicit max-width fallback using design tokens
        // Ensures bubbles don't exceed responsive breakpoints even if CSS class fails
        maxWidth: 'min(var(--message-bubble-max-width-lg), 85vw)'
      }}
      role="article"
      aria-label={`Message from ${message.profiles?.display_name || 'user'}`}
    >
      <p className="text-sm leading-5">{message.text}</p>
      
      {/* Report menu - only show for other users' messages */}
      {!isOwn && message.id && currentUserId && message.user_id !== currentUserId && (
        <div className={cn(
          "absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity",
          "bg-background/80 backdrop-blur-sm rounded p-0.5"
        )}>
          <ReportMenu
            targetType="message"
            targetId={message.id}
            onItemHidden={handleMessageHidden}
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          />
        </div>
      )}
    </div>
  )
}

// Message group component with avatar and timestamp
const MessageGroupComponent: React.FC<{
  group: MessageGroup
  showTimestamp: boolean
  currentUserId?: string
  onMessageHidden?: (messageId: string) => void
  style?: React.CSSProperties
}> = ({ group, showTimestamp, currentUserId, onMessageHidden, style }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div 
      className={cn("flex", group.isOwn && "flex-row-reverse")}
      style={{
        gap: 'var(--message-group-gap)',
        ...style // Apply marginTop spacing from parent
      }}
      role="group"
      aria-labelledby={`sender-${group.id}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0" style={{ flex: 'none' }}>
        <UserAvatar
          src={group.sender.avatar_url}
          alt={`${group.sender.display_name} avatar`}
          fallback={group.sender.display_name}
          userId={group.sender.user_id}
          size="chat"
        />
      </div>

      {/* Messages */}
      <div className={cn("flex flex-col", group.isOwn && "items-end")}>
        {/* Sender name and timestamp */}
        {!group.isOwn && (
          <div 
            id={`sender-${group.id}`}
            className="text-xs text-muted-foreground"
            style={{ 
              paddingLeft: 'var(--space-1)', 
              paddingRight: 'var(--space-1)',
              marginBottom: 'var(--space-1)' 
            }}
          >
            {group.sender.display_name}
            {showTimestamp && (
              <span style={{ marginLeft: 'var(--space-3)' }}>{formatTime(group.timestamp)}</span>
            )}
          </div>
        )}

        {/* Message bubbles container with margin-based spacing */}
        <div 
          className={cn("flex flex-col", group.isOwn && "items-end")}
        >
          {group.messages.map((message, index) => (
            <div
              key={message.id || index}
              style={{
                marginTop: index > 0 ? 'var(--message-bubble-gap)' : '0'
              }}
            >
              <MessageBubble
                message={message}
                isGrouped={index > 0}
                isOwn={group.isOwn}
                showTail={index === group.messages.length - 1}
                currentUserId={currentUserId}
                onMessageHidden={onMessageHidden}
              />
            </div>
          ))}
        </div>

        {/* Timestamp for own messages */}
        {group.isOwn && showTimestamp && (
          <div 
            className="text-xs text-muted-foreground"
            style={{ 
              paddingLeft: 'var(--space-1)', 
              paddingRight: 'var(--space-1)',
              marginTop: 'var(--space-1)' 
            }}
          >
            {formatTime(group.timestamp)}
          </div>
        )}
      </div>
    </div>
  )
}

// Date divider for sticky date headers
const DateDivider: React.FC<{ date: string }> = ({ date }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  return (
    <div 
      className="relative bg-background border-b border-border/50"
      style={{
        paddingTop: 'var(--divider-spacing-y)',
        paddingBottom: 'var(--divider-spacing-y)',
        marginTop: 'var(--divider-margin-top)',
        marginBottom: 'var(--divider-margin-bottom)'
        // REMOVED z-index - let normal document flow handle layering
      }}
    >
      <div className="text-center">
        <span className="text-xs text-muted-foreground bg-background/95 px-3 py-1 rounded-full border border-border/30">
          {formatDate(date)}
        </span>
      </div>
    </div>
  )
}

// Main MessageList component with virtualization
export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  loading = false,
  hasMore = false,
  onLoadMore,
  onMessageHidden,
  className,
  height = 400
}) => {
  const listRef = useRef<List>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Group messages for efficient rendering
  const messageGroups = groupMessages(messages, currentUserId)

  // Calculate height for each message group (for VariableSizeList)
  const getItemSize = useCallback((index: number) => {
    const group = messageGroups[index]
    if (!group) return 100 // fallback

    // Check if this group has a date divider
    const prevGroup = index > 0 ? messageGroups[index - 1] : null
    const showDateDivider = !prevGroup || 
      new Date(group.timestamp).toDateString() !== new Date(prevGroup.timestamp).toDateString()

    // Base heights - using design token values consistently
    const avatarHeight = 32 // --avatar-md size from tokens
    const nameHeight = !group.isOwn ? 20 : 0 // sender name height
    const timestampHeight = group.isOwn ? 20 : 0 // timestamp for own messages
    const messageGroupGap = 8 // var(--space-2) equivalent, from design tokens
    const marginTop = index === 0 ? 0 : 12 // var(--space-3) equivalent, from design tokens
    
    // Date divider height (if present) - using design tokens
    const dateDividerHeight = showDateDivider ? (8 + 8 + 16 + 20) : 0 // var(--divider-spacing-y) + var(--divider-margin-top) + var(--divider-margin-bottom) + text height

    // Calculate message bubble heights (estimate - more conservative)
    let bubblesHeight = 0
    group.messages.forEach((message, msgIndex) => {
      // Estimate bubble height based on text length - more accurate estimation
      const textLength = message.text.length
      const estimatedLines = Math.max(1, Math.ceil(textLength / 40)) // ~40 chars per line (more conservative)
      const bubbleHeight = Math.max(48, estimatedLines * 24 + 24) // min 48px, ~24px per line + 24px padding (12px x 2)
      const bubbleGap = msgIndex > 0 ? 8 : 0 // var(--message-bubble-gap) from design tokens
      bubblesHeight += bubbleHeight + bubbleGap
    })

    const totalHeight = marginTop + dateDividerHeight + avatarHeight + nameHeight + timestampHeight + bubblesHeight + messageGroupGap
    
    return Math.max(120, totalHeight) // Ensure minimum height with extra buffer for spacing
  }, [messageGroups])

  // Auto-scroll to bottom on new messages - works with VariableSizeList
  useEffect(() => {
    if (listRef.current && messageGroups.length > 0) {
      // Use setTimeout to ensure DOM has updated after new message
      setTimeout(() => {
        if (listRef.current) {
          // Reset cached sizes to ensure accurate calculations
          listRef.current.resetAfterIndex(0)
          // Scroll to last item with 'end' alignment
          listRef.current.scrollToItem(messageGroups.length - 1, 'end')
        }
      }, 0)
    }
  }, [messageGroups.length])

  // Handle scroll for load more
  const handleScroll = useCallback(({ scrollOffset }: { scrollOffset: number }) => {
    // Trigger load more when scrolling near top
    if (scrollOffset < 200 && hasMore && onLoadMore) {
      onLoadMore()
    }
  }, [hasMore, onLoadMore])

  // Row renderer for react-window - simplified and more reliable
  const rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const group = messageGroups[index]
    if (!group) return null

    const prevGroup = index > 0 ? messageGroups[index - 1] : null
    const showDateDivider = !prevGroup || 
      new Date(group.timestamp).toDateString() !== new Date(prevGroup.timestamp).toDateString()

    // Add top spacing if this is NOT the first group
    const isFirstGroup = index === 0
    
    return (
      <div 
        style={{
          ...style,
          paddingLeft: 'var(--content-padding-sm)',
          paddingRight: 'var(--content-padding-sm)'
        }}
      >
        <div>
          {showDateDivider && <DateDivider date={group.timestamp} />}
          <MessageGroupComponent 
            group={group} 
            showTimestamp={true}
            currentUserId={currentUserId}
            onMessageHidden={onMessageHidden}
            style={{
              marginTop: isFirstGroup ? '0' : 'var(--message-group-margin-bottom)'
            }}
          />
        </div>
      </div>
    )
  }

  if (loading && messageGroups.length === 0) {
    return (
      <div className={cn("flex items-center justify-center", className)} style={{ height }}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading messages...</span>
      </div>
    )
  }

  if (messageGroups.length === 0) {
    return (
      <div className={cn("flex items-center justify-center flex-col gap-2 text-center", className)} style={{ height }}>
        <div className="text-muted-foreground">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm">No messages yet</p>
          <p className="text-xs text-muted-foreground">Start the conversation!</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full h-full chat-list-container", className)}
      role="log"
      aria-label="Message list"
      aria-live="polite"
    >
      {loading && hasMore && (
        <div 
          className="absolute top-0 left-0 right-0 p-2 text-center"
          style={{ zIndex: 'var(--z-content)' }}
        >
          <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 border text-xs">
            <div className="animate-spin rounded-full h-3 w-3 border-b border-primary" />
            Loading more...
          </div>
        </div>
      )}
      
      <List
        ref={listRef}
        height={height}
        width="100%"
        itemCount={messageGroups.length}
        itemSize={getItemSize} // Dynamic height calculation
        onScroll={handleScroll}
        className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
        style={{ overflowX: 'hidden' }} // Prevent horizontal scroll
      >
        {rowRenderer}
      </List>
    </div>
  )
}
