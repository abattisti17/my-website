import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from './AuthProvider'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

interface CreateEventFormProps {
  onSuccess?: () => void
}

export default function CreateEventForm({ onSuccess }: CreateEventFormProps) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

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

    if (!formData.artist || !formData.city || !formData.date) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    
    try {
      // Combine date and time into a proper UTC timestamp
      const dateTime = formData.time 
        ? `${formData.date}T${formData.time}:00`
        : `${formData.date}T20:00:00` // Default to 8 PM if no time specified
      
      const dateUtc = new Date(dateTime).toISOString()
      const slug = generateSlug(formData.artist, formData.city, formData.date)

      // Create the event
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          slug,
          artist: formData.artist,
          city: formData.city,
          venue: formData.venue || null,
          date_utc: dateUtc
        })
        .select()
        .single()

      if (eventError) {
        if (eventError.code === '23505') { // Unique constraint violation
          toast.error('An event with this details already exists. Try different date/city.')
        } else {
          throw eventError
        }
        return
      }

      // Automatically join the creator to the event
      const { error: memberError } = await supabase
        .from('event_members')
        .insert({
          event_id: event.id,
          user_id: user.id,
          vibe_badges: ['Event Creator']
        })

      if (memberError) {
        console.error('Error adding creator to event:', memberError)
        // Don't fail the whole operation for this
      }

      toast.success('Event created successfully! 🎉')
      
      if (onSuccess) {
        onSuccess()
      } else {
        navigate(`/event/${slug}`)
      }
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error('Failed to create event. Please try again.')
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
}
