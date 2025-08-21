import { useEffect, useState, useCallback, useRef } from 'react'

/**
 * Hook to handle page visibility changes with debouncing
 * Prevents issues when browser tabs are switched or backgrounded
 */
export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(!document.hidden)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleVisibilityChange = useCallback(() => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Debounce visibility changes to avoid rapid reconnections
    timeoutRef.current = setTimeout(() => {
      setIsVisible(!document.hidden)
    }, 100) // 100ms debounce
  }, [])

  useEffect(() => {
    // Listen for page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [handleVisibilityChange])

  return isVisible
}

/**
 * Hook to manage connections that should pause/resume based on page visibility
 */
export function useVisibilityAwareConnection<T>(
  setupConnection: () => T,
  cleanupConnection: (connection: T) => void,
  dependencies: any[] = []
) {
  const isVisible = usePageVisibility()
  const [connection, setConnection] = useState<T | null>(null)

  useEffect(() => {
    if (isVisible) {
      // Page is visible, setup connection
      const newConnection = setupConnection()
      setConnection(newConnection)

      return () => {
        // Cleanup when effect re-runs or component unmounts
        if (newConnection) {
          cleanupConnection(newConnection)
        }
        setConnection(null)
      }
    } else {
      // Page is hidden, cleanup existing connection
      if (connection) {
        cleanupConnection(connection)
        setConnection(null)
      }
    }
  }, [isVisible, ...dependencies])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (connection) {
        cleanupConnection(connection)
      }
    }
  }, [])

  return connection
}
