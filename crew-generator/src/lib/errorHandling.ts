import { toast } from 'sonner'

/**
 * Enhanced error handler that provides user-friendly messages
 * and handles common Supabase/RLS errors
 */
export function handleError(error: any, context?: string) {
  console.error(`Error${context ? ` in ${context}` : ''}:`, error)

  // Handle Supabase RLS errors
  if (error?.code === '42501' || error?.status === 401) {
    toast.error('Action not allowed. Please check your permissions.')
    return
  }

  if (error?.status === 403) {
    toast.error('Access denied. You may not have permission for this action.')
    return
  }

  // Handle network errors
  if (error?.message?.includes('fetch')) {
    toast.error('Network error. Please check your connection and try again.')
    return
  }

  // Handle rate limiting
  if (error?.message?.includes('rate limit')) {
    toast.error('Too many requests. Please wait a moment and try again.')
    return
  }

  // Handle authentication errors
  if (error?.message?.includes('Invalid API key') || error?.message?.includes('JWT')) {
    toast.error('Authentication error. Please sign in again.')
    return
  }

  // Handle file upload errors
  if (error?.message?.includes('File size') || error?.message?.includes('storage')) {
    toast.error(error.message || 'File upload failed. Please try with a smaller file.')
    return
  }

  // Generic error with context
  const message = error?.message || 'An unexpected error occurred'
  const contextMessage = context ? `${context}: ${message}` : message
  
  toast.error(contextMessage)
}

/**
 * Handle realtime connection errors with retry logic
 */
let realtimeErrorCount = 0
const MAX_REALTIME_ERRORS = 3

export function handleRealtimeError(error: any, channelName?: string) {
  console.error(`Realtime error${channelName ? ` in ${channelName}` : ''}:`, error)
  
  realtimeErrorCount++
  
  // Only show toast for first few errors to avoid spam
  if (realtimeErrorCount <= MAX_REALTIME_ERRORS) {
    toast.error('Connection issue. Retrying...')
  }

  // Reset error count after 5 minutes
  setTimeout(() => {
    realtimeErrorCount = Math.max(0, realtimeErrorCount - 1)
  }, 5 * 60 * 1000)
}

/**
 * Success message helper for consistent messaging
 */
export function showSuccess(message: string) {
  toast.success(message)
}

/**
 * Info message helper
 */
export function showInfo(message: string) {
  toast.info(message)
}
