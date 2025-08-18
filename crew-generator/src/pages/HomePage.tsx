import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import CreateEventForm from '../components/CreateEventForm'


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

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date_utc', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          🎵 Travel Crew Generator
        </h1>
        <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
          Find your concert crew and make memories together
        </p>
      </div>

      {!user && (
        <Card className="text-center mb-12 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Join the Community</CardTitle>
            <CardDescription className="text-gray-700">
              Connect with fellow music fans and find your perfect concert crew!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-medium">
              <Link to="/auth">Sign In / Sign Up</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Upcoming Events</h2>
          {user && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium">
                  ➕ Create Event
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
      </div>

      {user && (
        <div className="text-center mb-8">
          <Button asChild variant="outline" size="lg">
            <Link to="/tour">📚 View Your Tour Book</Link>
          </Button>
        </div>
      )}

    </div>
  )
}
