import { useState, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from './AuthProvider'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { supabaseWithRetry, validateRequired, sanitizeInput, devLog, devError, devSuccess } from '../lib/devAccelerators'

interface CreateEventFormProps {
  onSuccess?: () => void
}

const CreateEventForm = memo(function CreateEventForm({ onSuccess }: CreateEventFormProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    artist: '',
    city: '',
    venue: '',
    date: '',
    time: ''
  })

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const generateSlug = (artist: string, city: string, date: string) => {
    const cleanArtist = artist.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const cleanCity = city.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const dateObj = new Date(date)
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    
    return `${cleanArtist}-${cleanCity}-${year}-${month}-${day}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('You must be signed in to create an event')
      return
    }

    // Simple validation with better error messages
    const validationError = validateRequired(formData, ['artist', 'city', 'date'])
    if (validationError) {
      toast.error(validationError)
      return
    }

    // Sanitize inputs to prevent issues
    const cleanData = {
      artist: sanitizeInput(formData.artist),
      city: sanitizeInput(formData.city),
      venue: sanitizeInput(formData.venue),
      date: formData.date,
      time: formData.time
    }

    devLog('Creating event with clean data', cleanData)
    setLoading(true)
    
    try {
      // Combine date and time into a proper UTC timestamp
      const dateTime = cleanData.time 
        ? `${cleanData.date}T${cleanData.time}:00`
        : `${cleanData.date}T20:00:00` // Default to 8 PM if no time specified
      
      const dateUtc = new Date(dateTime).toISOString()
      const slug = generateSlug(cleanData.artist, cleanData.city, cleanData.date)

      // Create the event with automatic retry (eliminates most refresh needs!)
      const eventResult = await supabaseWithRetry.insert(supabase, 'events', {
        slug,
        artist: cleanData.artist,
        city: cleanData.city,
        venue: cleanData.venue || null,
        date_utc: dateUtc
      })

      const event = eventResult.data

      // Automatically join the creator to the event (with retry)
      try {
        await supabaseWithRetry.insert(supabase, 'event_members', {
          event_id: event.id,
          user_id: user.id,
          vibe_badges: ['Event Creator']
        })
        devSuccess('Creator added to event')
      } catch (memberError) {
        devError(memberError, 'Adding creator to event')
        // Don't fail the whole operation for this
      }

      toast.success('Event created successfully! 🎉')
      devSuccess('Event creation completed', { eventId: event.id, slug })
      
      if (onSuccess) {
        onSuccess()
      } else {
        navigate(`/event/${slug}`)
      }
    } catch (error: any) {
      devError(error, 'Event creation')
      
      // Better error messages based on error type
      if (error?.code === '23505') {
        toast.error('An event with these details already exists. Try a different date/city.')
      } else if (error?.message?.includes('network')) {
        toast.error('Network error. Please check your connection and try again.')
      } else {
        toast.error('Failed to create event. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
          <CardDescription className="text-gray-700">
            You must be signed in to create an event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
        <CardDescription className="text-gray-700">
          Set up a new concert event for your crew to join
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="artist">Artist/Band *</Label>
              <Input
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                placeholder="Taylor Swift"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="New York"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              placeholder="MetLife Stadium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time (optional)</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="20:00"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? '🎵 Creating Event...' : '🎉 Create Event'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
})

export default CreateEventForm
