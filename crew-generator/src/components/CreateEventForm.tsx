import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from './AuthProvider'
import { useForm } from '../hooks/useForm'
import { useSupabaseMutation } from '../hooks/useSupabaseMutation'
import { devLog, devSuccess } from '../lib/devAccelerators'

interface CreateEventFormProps {
  onSuccess?: () => void
}

const CreateEventForm = memo(function CreateEventForm({ onSuccess }: CreateEventFormProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { insert } = useSupabaseMutation()

  const generateSlug = (artist: string, city: string, date: string) => {
    const cleanArtist = artist.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const cleanCity = city.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const dateObj = new Date(date)
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    
    return `${cleanArtist}-${cleanCity}-${year}-${month}-${day}`
  }

  const form = useForm({
    initialValues: {
      artist: '',
      city: '',
      venue: '',
      date: '',
      time: ''
    },
    requiredFields: ['artist', 'city', 'date'],
    onSubmit: async (data) => {
      if (!user) {
        throw new Error('You must be signed in to create an event')
      }

      const dateTime = data.time ? `${data.date}T${data.time}:00` : `${data.date}T20:00:00`
      const dateUtc = new Date(dateTime).toISOString()
      const slug = generateSlug(data.artist, data.city, data.date)

      devLog('Creating event with clean data', { ...data, slug, dateUtc })

      // Create the event
      const event = await insert('events', {
        slug,
        artist: data.artist,
        city: data.city,
        venue: data.venue || null,
        date_utc: dateUtc
      }, {
        successMessage: 'Event created successfully! 🎉'
      })

      // Add creator as event member
      try {
        await insert('event_members', {
          event_id: event.data.id,
          user_id: user.id,
          vibe_badges: ['Event Creator']
        })
        devSuccess('Creator added to event')
      } catch (memberError) {
        console.warn('Could not add creator to event:', memberError)
      }

      if (onSuccess) {
        onSuccess()
      } else {
        navigate(`/event/${slug}`)
      }
    }
  })

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
    <form onSubmit={form.handleSubmit} className="space-y-6">
      {/* Artist/Band Name - Required */}
      <div className="space-y-3">
        <Label htmlFor="artist" className="text-sm font-medium text-primary">Artist / Band Name*</Label>
        <Input
          id="artist"
          name="artist"
          value={form.values.artist}
          onChange={form.handleInputChange}
          placeholder="Taylor Swift"
          required
          className="h-12 text-base"
        />
        {form.errors.artist && (
          <p className="text-sm text-red-600">{form.errors.artist}</p>
        )}
      </div>

      {/* City - Required */}
      <div className="space-y-3">
        <Label htmlFor="city" className="text-sm font-medium text-primary">City*</Label>
        <Input
          id="city"
          name="city"
          value={form.values.city}
          onChange={form.handleInputChange}
          placeholder="New York"
          required
          className="h-12 text-base"
        />
        {form.errors.city && (
          <p className="text-sm text-red-600">{form.errors.city}</p>
        )}
      </div>

      {/* Venue - Optional */}
      <div className="space-y-3">
        <Label htmlFor="venue" className="text-sm font-medium">Venue (Optional)</Label>
        <Input
          id="venue"
          name="venue"
          value={form.values.venue}
          onChange={form.handleInputChange}
          placeholder="Madison Square Garden"
          className="h-12 text-base"
        />
      </div>

      {/* Date - Required */}
      <div className="space-y-3">
        <Label htmlFor="date" className="text-sm font-medium text-primary">Date*</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={form.values.date}
          onChange={form.handleInputChange}
          required
          className="h-12 text-base"
        />
        {form.errors.date && (
          <p className="text-sm text-red-600">{form.errors.date}</p>
        )}
      </div>

      {/* Time - Optional */}
      <div className="space-y-3">
        <Label htmlFor="time" className="text-sm font-medium">Time (Optional)</Label>
        <Input
          id="time"
          name="time"
          type="time"
          value={form.values.time}
          onChange={form.handleInputChange}
          className="h-12 text-base"
        />
        <p className="text-xs text-muted-foreground">
          Leave blank if time is TBD (defaults to 8:00 PM)
        </p>
      </div>

      <Button 
        type="submit" 
        disabled={form.isSubmitting}
        className="w-full mt-8 h-12 text-lg font-semibold rounded-xl"
      >
        {form.isSubmitting ? '🎵 Creating Event...' : '🎉 Create Event'}
      </Button>
    </form>
  )
})

export default CreateEventForm
