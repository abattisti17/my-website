import React, { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Send, Paperclip, Smile } from 'lucide-react'
import { isFeatureEnabled } from '@/lib/featureFlags'

interface MessageComposerProps {
  onSend: (text: string) => Promise<void>
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  podId?: string
  className?: string
}

const DRAFT_STORAGE_PREFIX = 'message_draft_'
const MAX_LINES = 6 // Maximum lines before scrolling

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  maxLength = 1000,
  podId,
  className
}) => {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const draftKey = podId ? `${DRAFT_STORAGE_PREFIX}${podId}` : null

  // Load draft from localStorage on mount
  useEffect(() => {
    if (!isFeatureEnabled('DRAFT_PERSISTENCE') || !draftKey) return

    try {
      const draft = localStorage.getItem(draftKey)
      if (draft) {
        setText(draft)
        // Auto-resize after setting text
        setTimeout(() => adjustTextareaHeight(), 0)
      }
    } catch (error) {
      console.warn('Failed to load draft:', error)
    }
  }, [draftKey])

  // Save draft to localStorage
  const saveDraft = useCallback((value: string) => {
    if (!isFeatureEnabled('DRAFT_PERSISTENCE') || !draftKey) return

    try {
      if (value.trim()) {
        localStorage.setItem(draftKey, value)
      } else {
        localStorage.removeItem(draftKey)
      }
    } catch (error) {
      console.warn('Failed to save draft:', error)
    }
  }, [draftKey])

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto'
    
    // Calculate the number of lines using consistent line height
    const lineHeight = 20 // This matches the CSS line-height: 20px in the textarea
    const lines = Math.min(Math.ceil(textarea.scrollHeight / lineHeight), MAX_LINES)
    
    // Set height based on content, with max limit derived from design tokens
    const minHeight = 40 // Minimum single line height
    const maxHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--space-24') || '120px')
    textarea.style.height = `${Math.min(Math.max(lines * lineHeight, minHeight), maxHeight)}px`
  }, [])

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    
    // Enforce max length
    if (value.length > maxLength) return

    setText(value)
    saveDraft(value)
    adjustTextareaHeight()
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter: Insert new line (default behavior)
        return
      } else {
        // Enter: Send message
        e.preventDefault()
        handleSend()
      }
    }
  }

  // Send message
  const handleSend = async () => {
    const trimmedText = text.trim()
    if (!trimmedText || sending || disabled) return

    try {
      setSending(true)
      await onSend(trimmedText)
      
      // Clear input and draft on successful send
      setText('')
      if (draftKey) {
        try {
          localStorage.removeItem(draftKey)
        } catch (error) {
          console.warn('Failed to clear draft:', error)
        }
      }
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
      
      // Focus back to textarea
      textareaRef.current?.focus()
    } catch (error) {
      console.error('Failed to send message:', error)
      // Text remains in input for retry
    } finally {
      setSending(false)
    }
  }

  // Focus management
  useEffect(() => {
    adjustTextareaHeight()
  }, [adjustTextareaHeight])

  const canSend = text.trim().length > 0 && !sending && !disabled
  const characterCount = text.length

  return (
    <div 
      className={cn(
        "bg-background border-t border-border",
        "chat-composer-positioned", // Uses design system positioning with safe area
        className
      )}
      style={{
        padding: 'var(--composer-padding)'
      }}
    >
      <div 
        className="flex items-end w-full"
        style={{ gap: 'var(--composer-element-gap)' }}
      >
        {/* Action buttons - emoji/attachments */}
        <div 
          className="flex pb-2"
          style={{ gap: 'var(--composer-action-gap)' }}
        >
          <IconButton
            variant="ghost"
            size="sm"
            className="touch-target"
            disabled={disabled}
            aria-label="Add emoji"
          >
            <Smile className="h-4 w-4" />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            className="touch-target"
            disabled={disabled}
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </IconButton>
        </div>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || sending}
            className={cn(
              "w-full min-h-[40px] max-h-[120px] resize-none border border-input bg-background",
              "text-sm placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
            )}
            style={{
              borderRadius: 'var(--composer-border-radius)',
              paddingLeft: 'var(--space-4)',
              paddingRight: 'var(--space-4)',
              paddingTop: 'var(--space-2)',
              paddingBottom: 'var(--space-2)',
              lineHeight: '20px',
              overflow: text.split('\n').length > MAX_LINES ? 'auto' : 'hidden'
            }}
            aria-label="Message input"
            aria-describedby={characterCount > maxLength * 0.8 ? "char-count" : undefined}
          />
          
          {/* Character count - only show when approaching limit */}
          {characterCount > maxLength * 0.8 && (
            <div 
              id="char-count"
              className={cn(
                "absolute -top-6 right-2 text-xs",
                characterCount > maxLength * 0.9 ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {characterCount}/{maxLength}
            </div>
          )}
        </div>

        {/* Send button */}
        <IconButton
          onClick={handleSend}
          disabled={!canSend}
          size="sm"
          variant={canSend ? "default" : "ghost"}
          className={cn(
            "touch-target",
            !canSend && "bg-muted hover:bg-muted"
          )}
          aria-label="Send message"
        >
          {sending ? (
            <span className="text-lg">📤</span>
          ) : canSend ? (
            <span className="text-lg">🚀</span>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </IconButton>
      </div>

      {/* Keyboard hint */}
      <div className="mt-2 text-center">
        <p className="text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
