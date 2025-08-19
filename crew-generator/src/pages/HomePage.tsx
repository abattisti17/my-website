import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import CreateEventForm from '../components/CreateEventForm'
import ProfileEditor from '../components/ProfileEditor'




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

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
            const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('id, slug, artist, city, venue, date_utc')
        .limit(10)

      if (eventError) {
        throw eventError
      }

      setEvents(eventData || [])
      setError(null)
    } catch (error: any) {
      console.error('Error fetching events:', error)
      setError('Failed to load events. Please try again.')
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
            <Button onClick={fetchEvents} className="bg-purple-600 hover:bg-purple-700 text-white">
              🔄 Try Again
            </Button>
            
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen-dynamic flex flex-col safe-scroll-content">
      {/* Hero Section - Mobile-first with proper spacing */}
      <div className="px-safe pt-safe pb-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            🎵 Travel Crew Generator
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Find your concert crew and make memories together
          </p>
        </div>
      </div>

      {/* Auth CTA Section - Modern card design */}
      {!user ? (
        <div className="px-safe pb-8">
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
              <Button asChild size="lg" className="w-full touch-target-lg rounded-xl font-semibold">
                <Link to="/auth">Sign In / Sign Up</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="px-safe pb-8">
          <ProfileEditor />
        </div>
      )}

      {/* Events Section - Modern layout */}
      <section className="flex-1 px-safe pb-safe">
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
        {events.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <p className="text-gray-800 text-lg mb-4">No events yet. Check back soon!</p>
              <Badge variant="secondary">Sample events will appear here</Badge>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                    {event.artist}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-700">
                    {event.city}
                    {event.venue && ` • ${event.venue}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700 font-medium">
                      {new Date(event.date_utc).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <Button asChild size="sm">
                      <Link to={`/event/${event.slug}`}>View Event</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Tour Book CTA - Modern design */}
      {user && (
        <div className="px-safe pb-safe">
          <Card className="border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📚</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Your Tour Book</h3>
                  <p className="text-sm text-muted-foreground mb-4">Relive your concert memories and experiences</p>
                </div>
                <Button asChild variant="outline" size="lg" className="touch-target-lg rounded-xl font-semibold bg-primary/5 hover:bg-primary hover:text-primary-foreground border-primary/30">
                  <Link to="/tour">View Tour Book</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  )
}
