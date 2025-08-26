import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Calendar, MapPin, Clock, Music } from "lucide-react"
import {
  ResponsiveModal,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  useResponsiveModal,
} from "./ui/enhanced-responsive-modal"
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

interface CreateEventDrawerProps {
  /** Called when event is successfully created */
  onSuccess?: () => void
  /** Custom trigger element (optional) */
  trigger?: React.ReactNode
  /** Loading state override */
  isLoading?: boolean
}

/**
 * Production-ready create event drawer with enhanced UX and accessibility
 * Replaces BasicModal with proper Vaul integration
 */
export function CreateEventDrawer({
  onSuccess,
  trigger,
  isLoading: externalLoading = false,
}: CreateEventDrawerProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { insert } = useSupabaseMutation()
  const { open, setOpen, closeModal } = useResponsiveModal()

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
      if (!user) {
        throw new Error('User not authenticated')
      }

      const slug = generateSlug(data.artist, data.city, data.date)
      
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

      const result = await insert('events', eventData, {
        successMessage: '🎉 Event created successfully!',
        onSuccess: () => {
          // Reset form
          form.reset()
          // Close modal
          closeModal()
          // Call success callback
          onSuccess?.()
          // Navigate to the new event page
          navigate(`/event/${slug}`)
        }
      })

      return result
    }
  })

  // Reset form when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
    }
    setOpen(newOpen)
  }

  const isSubmitting = form.isSubmitting || externalLoading

  // Default trigger button
  const defaultTrigger = (
    <Button 
      className="touch-target rounded-xl font-semibold shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
      disabled={!user}
    >
      <Plus className="w-4 h-4 mr-2" />
      <span className="hidden sm:inline">Create Event</span>
      <span className="sm:hidden">Create</span>
    </Button>
  )

  if (!user) {
    return (
      <Button 
        variant="outline"
        onClick={() => navigate('/auth')}
        className="touch-target rounded-xl font-semibold"
      >
        <Plus className="w-4 h-4 mr-2" />
        Sign In to Create
      </Button>
    )
  }

  return (
    <ResponsiveModal
      isOpen={open}
      setIsOpen={handleOpenChange}
      trigger={trigger || defaultTrigger}
    >
      <form onSubmit={form.handleSubmit}>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Create New Event</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Create a new event to gather your crew for concerts, festivals, or any music experience.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>

        <div className="space-y-6">
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
              aria-describedby="artist_description"
            />
            <p id="artist_description" className="text-xs text-muted-foreground">
              The main performer or band for this event
            </p>
            {form.errors.artist && (
              <p className="text-sm text-destructive" role="alert">
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
              aria-describedby="city_description"
            />
            <p id="city_description" className="text-xs text-muted-foreground">
              The city where the event will take place
            </p>
            {form.errors.city && (
              <p className="text-sm text-destructive" role="alert">
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
              aria-describedby="venue_description"
            />
            <p id="venue_description" className="text-xs text-muted-foreground">
              Specific venue name if known
            </p>
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
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              aria-describedby="date_description"
            />
            <p id="date_description" className="text-xs text-muted-foreground">
              When the event will take place
            </p>
            {form.errors.date && (
              <p className="text-sm text-destructive" role="alert">
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
              aria-describedby="time_description"
            />
            <p id="time_description" className="text-xs text-muted-foreground">
              Leave blank if time is TBD (defaults to 8:00 PM)
            </p>
          </div>
        </div>

        <ResponsiveModalFooter sticky className="flex-row gap-3 mt-8">
          <Button 
            type="button"
            variant="outline" 
            onClick={closeModal}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          
          <Button 
            type="submit"
            disabled={isSubmitting || !form.values.artist || !form.values.city || !form.values.date}
            className="flex-1 font-semibold"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                🎉 Create Event
              </>
            )}
          </Button>
        </ResponsiveModalFooter>
      </form>
    </ResponsiveModal>
  )
}


