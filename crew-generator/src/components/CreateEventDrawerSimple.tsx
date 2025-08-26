import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Calendar, MapPin, Clock, Music } from "lucide-react"
import { BasicModal } from "./ui/basic-modal"
import { useAuth } from './AuthProvider'
import { useForm } from '../hooks/useForm'
import { useSupabaseMutation } from '../hooks/useSupabaseMutation'
import { useNavigate } from 'react-router-dom'

interface CreateEventFormData {
  artist: string
  city: string
  venue: string
  date: string
  time: string
}

interface CreateEventDrawerSimpleProps {
  onSuccess?: () => void
  trigger?: React.ReactNode
  isLoading?: boolean
}

/**
 * Simplified CreateEventDrawer for debugging - uses BasicModal temporarily
 */
export function CreateEventDrawerSimple({
  onSuccess,
  trigger,
  isLoading: externalLoading = false,
}: CreateEventDrawerSimpleProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { insert } = useSupabaseMutation()

  console.log('🐛 CreateEventDrawerSimple rendered', { user: !!user })

  // Generate URL-friendly slug from event details
  const generateSlug = (artist: string, city: string, date: string) => {
    const cleanArtist = artist.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const cleanCity = city.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const dateObj = new Date(date)
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    
    return `${cleanArtist}-${cleanCity}-${year}-${month}-${day}`
  }

  // Form management with validation
  const form = useForm({
    initialValues: {
      artist: '',
      city: '',
      venue: '',
      date: '',
      time: ''
    },
    requiredFields: ['artist', 'city', 'date'],
    onSubmit: async (data: CreateEventFormData) => {
      console.log('🐛 Form submitted with data:', data)
      
      if (!user) {
        console.error('🐛 No user found')
        throw new Error('User not authenticated')
      }

      const slug = generateSlug(data.artist, data.city, data.date)
      console.log('🐛 Generated slug:', slug)
      
      // Create the event with proper data structure
      const eventData = {
        artist: data.artist.trim(),
        city: data.city.trim(),
        venue: data.venue.trim() || null,
        date: data.date,
        time: data.time || '20:00', // Default to 8:00 PM if not specified
        slug,
        created_by: user.id,
        status: 'active'
      }

      console.log('🐛 Creating event with data:', eventData)

      const result = await insert('events', eventData, {
        successMessage: '🎉 Event created successfully!',
        onSuccess: () => {
          console.log('🐛 Event created successfully, calling callbacks')
          // Reset form
          form.reset()
          // Call success callback
          onSuccess?.()
          // Navigate to the new event page
          navigate(`/event/${slug}`)
        }
      })

      return result
    }
  })

  const isSubmitting = form.isSubmitting || externalLoading

  // Default trigger button
  const defaultTrigger = (
    <Button 
      className="touch-target rounded-xl font-semibold shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
      disabled={!user}
      onClick={() => console.log('🐛 Create button clicked!')}
    >
      <Plus className="w-4 h-4 mr-2" />
      <span className="hidden sm:inline">Create Event</span>
      <span className="sm:hidden">Create</span>
    </Button>
  )

  if (!user) {
    console.log('🐛 No user, showing sign in button')
    return (
      <Button 
        variant="outline"
        onClick={() => {
          console.log('🐛 Sign in button clicked')
          navigate('/auth')
        }}
        className="touch-target rounded-xl font-semibold"
      >
        <Plus className="w-4 h-4 mr-2" />
        Sign In to Create
      </Button>
    )
  }

  console.log('🐛 Rendering BasicModal with user:', user.email)

  return (
    <BasicModal
      title="Create New Event (Debug)"
      trigger={trigger || defaultTrigger}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          🐛 Debug version - Create a new event to gather your crew for concerts, festivals, or any music experience.
        </p>
        
        <form onSubmit={form.handleSubmit} className="space-y-6">
          {/* Artist/Band Name - Required */}
          <div className="space-y-2">
            <Label htmlFor="artist" className="text-sm font-medium flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" />
              Artist / Band Name *
            </Label>
            <Input
              id="artist"
              name="artist"
              value={form.values.artist}
              onChange={form.handleInputChange}
              placeholder="Taylor Swift"
              required
              disabled={isSubmitting}
              className="h-12 text-base"
            />
            {form.errors.artist && (
              <p className="text-sm text-red-600" role="alert">
                {form.errors.artist}
              </p>
            )}
          </div>

          {/* City - Required */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              City *
            </Label>
            <Input
              id="city"
              name="city"
              value={form.values.city}
              onChange={form.handleInputChange}
              placeholder="New York"
              required
              disabled={isSubmitting}
              className="h-12 text-base"
            />
            {form.errors.city && (
              <p className="text-sm text-red-600" role="alert">
                {form.errors.city}
              </p>
            )}
          </div>

          {/* Venue - Optional */}
          <div className="space-y-2">
            <Label htmlFor="venue" className="text-sm font-medium">
              Venue (Optional)
            </Label>
            <Input
              id="venue"
              name="venue"
              value={form.values.venue}
              onChange={form.handleInputChange}
              placeholder="Madison Square Garden"
              disabled={isSubmitting}
              className="h-12 text-base"
            />
          </div>

          {/* Date - Required */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Date *
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={form.values.date}
              onChange={form.handleInputChange}
              required
              disabled={isSubmitting}
              className="h-12 text-base"
              min={new Date().toISOString().split('T')[0]}
            />
            {form.errors.date && (
              <p className="text-sm text-red-600" role="alert">
                {form.errors.date}
              </p>
            )}
          </div>

          {/* Time - Optional */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time (Optional)
            </Label>
            <Input
              id="time"
              name="time"
              type="time"
              value={form.values.time}
              onChange={form.handleInputChange}
              disabled={isSubmitting}
              className="h-12 text-base"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank if time is TBD (defaults to 8:00 PM)
            </p>
          </div>

          <Button 
            type="submit"
            disabled={isSubmitting || !form.values.artist || !form.values.city || !form.values.date}
            className="w-full font-semibold"
            onClick={() => console.log('🐛 Submit button clicked')}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                🎉 Create Event (Debug)
              </>
            )}
          </Button>
        </form>
      </div>
    </BasicModal>
  )
}
