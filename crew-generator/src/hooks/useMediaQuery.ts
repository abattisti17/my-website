import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') {
      console.log('useMediaQuery: window undefined, returning false')
      return
    }

    const media = window.matchMedia(query)
    
    // Set initial value
    setMatches(media.matches)
    console.log(`useMediaQuery: ${query} = ${media.matches}`)

    // Create listener function
    const listener = (event: MediaQueryListEvent) => {
      console.log(`useMediaQuery: ${query} changed to ${event.matches}`)
      setMatches(event.matches)
    }

    // Add listener
    media.addEventListener('change', listener)

    // Cleanup
    return () => {
      media.removeEventListener('change', listener)
    }
  }, [query])

  return matches
}
