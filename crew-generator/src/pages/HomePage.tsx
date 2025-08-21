import { useEffect, useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'
import { supabaseWithRetry, devLog, devError, devSuccess } from '../lib/devAccelerators'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EventListItem } from '@/components/EventListItem'
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import CreateEventForm from '../components/CreateEventForm'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import { createEventsSearchService } from '../lib/searchService'
import type { SearchResult } from '../lib/searchService'
import { Stack } from '../components/design-system'




interface Event {
  id: string
  slug: string
  artist: string
  city: string
  venue: string | null
  date_utc: string
}

export default function HomePage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult<Event>[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  // Create search service when events change
  // Optimized search service with memoization for better performance
  const searchService = useMemo(() => {
    if (events.length === 0) return null
    return createEventsSearchService(events)
  }, [events])

  useEffect(() => {
    fetchEvents()
  }, [])

  // Handle search with debouncing built into SearchBar
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query)
    
    // Always create fresh search service with current events data
    if (events.length === 0) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    
    try {
      // Use requestAnimationFrame for smoother UX
      requestAnimationFrame(() => {
        try {
          // Use memoized search service for better performance
          if (!searchService) {
            devLog('Search service not ready')
            setSearchResults([])
            return
          }
          const results = searchService.search(query, 20) // Limit to 20 results
          setSearchResults(results)
        } catch (error) {
          devError(error, 'search execution')
          setSearchResults([])
        } finally {
          setSearchLoading(false)
        }
      })
    } catch (error) {
      devError(error, 'search initialization')
      setSearchResults([])
      setSearchLoading(false)
    }
  }, [events, searchService]) // Include searchService for proper optimization

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
    setSearchResults([])
  }, [])

  const fetchEvents = async () => {
    try {
      devLog('Fetching events')
      
      // Use retry logic for more reliable loading (eliminates timeout issues!)
      const result = await supabaseWithRetry.select(supabase, 'events')
      const eventData = result.data

      if (!eventData) {
        devLog('No events found')
        setEvents([])
        setError(null)
        return
      }

      devSuccess('Events loaded', { count: eventData.length })
      setEvents(eventData as unknown as Event[])
      setError(null)
    } catch (error: any) {
      console.error('❌ Error fetching events:', error)
      setError(`Failed to load events: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-medium">🎵 Loading your concert experiences...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-2xl">
          <div className="text-xl font-medium text-red-600 mb-4">❌ Error Loading Events</div>
          <div className="text-gray-600 mb-4 whitespace-pre-line bg-gray-50 p-4 rounded border text-sm">
            {error}
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={fetchEvents}>
              🔄 Try Again
            </Button>
            
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen-dynamic flex flex-col safe-scroll-content">
      <Stack spacing="lg" className="flex-1">
        {/* Hero Section - Mobile-first with proper spacing */}
        <div className="page-padding-x page-padding-y">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              🎵 Travel Crew Generator
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Find your concert crew and make memories together
            </p>
          </div>
        </div>

        {/* Auth CTA Section - Always present but conditionally visible */}
        <div className="page-padding-x">
          {!user ? (
            <Card className="mx-auto max-w-md border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30 shadow-lg">
              <CardHeader className="text-center space-y-4 pb-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🎤</span>
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">Join the Community</CardTitle>
                  <CardDescription className="text-muted-foreground mt-2 leading-relaxed">
                    Connect with fellow music fans and find your perfect concert crew!
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild fullWidth={true}>
                  <Link to="/auth">Sign In / Sign Up</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Empty div to maintain consistent spacing when signed in
            <div></div>
          )}
        </div>

        {/* Events Section - Modern layout */}
        <section className="page-padding-x pb-safe">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Upcoming Events</h2>
          {user && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="touch-target rounded-xl font-semibold shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground">
                  <span className="mr-2">➕</span>
                  <span className="hidden sm:inline">Create Event</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Create a new event to gather your crew for concerts, festivals, or any music experience.
                  </DialogDescription>
                </DialogHeader>
                <CreateEventForm onSuccess={() => {
                  // Refresh events after creation
                  fetchEvents()
                }} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search Bar and Events with proper spacing */}
        <Stack spacing="md">
          {/* Search Bar */}
          {events.length > 0 && (
            <SearchBar
              placeholder="Search events by artist, city, or venue..."
              onSearch={handleSearch}
              onClear={handleClearSearch}
              loading={searchLoading}
              className="max-w-md"
              debounceMs={300}
            />
          )}
          
          {/* Events Display */}
        {events.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <p className="text-gray-800 text-lg mb-4">No events yet. Check back soon!</p>
              <Badge variant="secondary">Sample events will appear here</Badge>
            </CardContent>
          </Card>
        ) : searchQuery ? (
          // Show search results when searching - using Stack for consistent spacing
          <SearchResults
            results={searchResults}
            query={searchQuery}
            renderItem={(event) => {
              const e = event as any
              return (
                <EventListItem
                  event={{
                    id: e.id,
                    slug: e.slug,
                    artist: e.artist,
                    venue: e.venue || '',
                    city: e.city,
                    date: e.date_utc
                  }}
                />
              )
            }}
            emptyMessage="No events match your search"
            maxResults={12}
          />
        ) : (
          // Show all events when not searching - using Stack for consistent spacing
          <Stack spacing="sm">
            {events.map((event) => (
              <EventListItem
                key={event.id}
                event={{
                  id: event.id,
                  slug: event.slug,
                  artist: event.artist,
                  venue: event.venue || '',
                  city: event.city,
                  date: event.date_utc
                }}
              />
            ))}
          </Stack>
        )}
        </Stack>
        </section>

        {/* Create Event Button - Full width at bottom */}
        <div className="mt-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button fullWidth={true} className="bg-slate-900 hover:bg-slate-800 text-white">
                Add event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Add a new concert or event for people to join.
                </DialogDescription>
              </DialogHeader>
              <CreateEventForm onSuccess={() => {
                fetchEvents() // Refresh events list
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </Stack>
    </div>
  )
}
