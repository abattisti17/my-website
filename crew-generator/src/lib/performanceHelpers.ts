/**
 * Performance optimization utilities for React components
 * These helpers improve rendering speed and reduce unnecessary re-renders
 */
import { useRef, useCallback, useMemo } from 'react'

/**
 * Optimized debounce hook that maintains stable function reference
 * Prevents unnecessary re-renders in components using debounced callbacks
 */
export function useStableDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const callbackRef = useRef(callback)
  
  // Keep callback reference up to date
  callbackRef.current = callback
  
  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    }) as T,
    [delay] // Only re-create if delay changes
  )
  
  return debouncedCallback
}

/**
 * Memoized object creator - prevents object recreation on every render
 * Useful for style objects, config objects, etc.
 */
export function useStableObject<T extends Record<string, any>>(factory: () => T, deps: any[]): T {
  return useMemo(factory, deps)
}

/**
 * Performance timing utility for development
 * Helps identify slow components and operations
 */
export const perfMonitor = {
  mark: (name: string) => {
    if (import.meta.env.DEV && typeof performance !== 'undefined') {
      performance.mark(`${name}-start`)
    }
  },
  
  measure: (name: string) => {
    if (import.meta.env.DEV && typeof performance !== 'undefined') {
      try {
        performance.mark(`${name}-end`)
        performance.measure(name, `${name}-start`, `${name}-end`)
        
        const measure = performance.getEntriesByName(name)[0]
        if (measure && measure.duration > 16) { // > 1 frame at 60fps
          console.log(`🐌 Slow operation: ${name} took ${measure.duration.toFixed(2)}ms`)
        }
      } catch (error) {
        // Ignore performance measurement errors
      }
    }
  }
}

/**
 * Component render tracking for development
 * Helps identify components that re-render too frequently
 */
export function useRenderTracker(componentName: string) {
  if (import.meta.env.DEV) {
    const renderCount = useRef(0)
    renderCount.current++
    
    if (renderCount.current > 10) {
      console.warn(`🔄 ${componentName} has rendered ${renderCount.current} times`)
    }
  }
}

/**
 * Stable array/object comparison for dependency arrays
 * Prevents unnecessary re-renders when array contents are the same
 */
export function useDeepCompareMemo<T>(factory: () => T, deps: any[]): T {
  const ref = useRef<{ deps: any[], value: T }>()
  
  if (!ref.current || !shallowEqual(ref.current.deps, deps)) {
    ref.current = { deps, value: factory() }
  }
  
  return ref.current.value
}

function shallowEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false
  
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  
  return true
}
