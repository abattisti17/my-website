import React, { useEffect, useRef, useState, useCallback } from 'react'
import { FixedSizeList as List } from 'react-window'
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

// Message grouping logic - group consecutive messages from same user within 5 minutes
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
    // 3. More than 5 minutes between messages
    const shouldStartNewGroup = !currentGroup ||
      currentGroup.sender.user_id !== message.user_id ||
      (new Date(currentGroup.timestamp).getTime() - messageTime.getTime()) > 5 * 60 * 1000

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
      currentGroup.messages.push(message)
      // Update timestamp to latest message
      currentGroup.timestamp = message.created_at
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
}> = ({ message, isGrouped, isOwn, showTail, currentUserId, onMessageHidden }) => {
  const [isHidden, setIsHidden] = useState(false)

  const handleMessageHidden = () => {
    setIsHidden(true)
    onMessageHidden?.(message.id || '')
  }

  if (isHidden) {
    return (
      <div className={cn(
        "max-w-[280px] px-3 py-2 rounded-2xl break-words",
        "bg-muted/50 text-muted-foreground italic border border-dashed",
        isOwn ? "ml-auto" : "",
        !isGrouped && "mt-1"
      )}>
        <p className="text-xs">Message hidden</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group relative max-w-[280px] px-3 py-2 rounded-2xl break-words",
        isOwn 
          ? "bg-primary text-primary-foreground ml-auto" 
          : "bg-muted text-foreground",
        !isGrouped && "mt-1",
        showTail && isOwn && "rounded-br-sm",
        showTail && !isOwn && "rounded-bl-sm"
      )}
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
}> = ({ group, showTimestamp, currentUserId, onMessageHidden }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div 
      className={cn("flex gap-2 mb-4", group.isOwn && "flex-row-reverse")}
      role="group"
      aria-labelledby={`sender-${group.id}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <UserAvatar
          src={group.sender.avatar_url}
          alt={`${group.sender.display_name} avatar`}
          fallback={group.sender.display_name}
          userId={group.sender.user_id}
        />
      </div>

      {/* Messages */}
      <div className={cn("flex flex-col gap-0.5", group.isOwn && "items-end")}>
        {/* Sender name and timestamp */}
        {!group.isOwn && (
          <div 
            id={`sender-${group.id}`}
            className="text-xs text-muted-foreground px-1 mb-1"
          >
            {group.sender.display_name}
            {showTimestamp && (
              <span className="ml-2">{formatTime(group.timestamp)}</span>
            )}
          </div>
        )}

        {/* Message bubbles */}
        {group.messages.map((message, index) => (
          <MessageBubble
            key={message.id || index}
            message={message}
            isGrouped={index > 0}
            isOwn={group.isOwn}
            showTail={index === group.messages.length - 1}
            currentUserId={currentUserId}
            onMessageHidden={onMessageHidden}
          />
        ))}

        {/* Timestamp for own messages */}
        {group.isOwn && showTimestamp && (
          <div className="text-xs text-muted-foreground px-1 mt-1">
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
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b py-2 mb-4">
      <div className="text-center">
        <span className="text-xs text-muted-foreground bg-background px-3 py-1 rounded-full border">
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

  // Auto-scroll to bottom on new messages - simple and reliable
  useEffect(() => {
    if (listRef.current && messageGroups.length > 0) {
      // Scroll to the last item
      listRef.current.scrollToItem(messageGroups.length - 1, 'end')
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

    return (
      <div style={style} className="px-4">
        {showDateDivider && <DateDivider date={group.timestamp} />}
        <MessageGroupComponent 
          group={group} 
          showTimestamp={true}
          currentUserId={currentUserId}
          onMessageHidden={onMessageHidden}
        />
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
      className={cn("relative w-full h-full", className)}
      role="log"
      aria-label="Message list"
      aria-live="polite"
    >
      {loading && hasMore && (
        <div className="absolute top-0 left-0 right-0 z-10 p-2 text-center">
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
        itemSize={100} // Smaller, more realistic item height
        onScroll={handleScroll}
        className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
        style={{ overflowX: 'hidden' }} // Prevent horizontal scroll
      >
        {rowRenderer}
      </List>
    </div>
  )
}
