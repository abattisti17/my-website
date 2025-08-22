import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { FormField, ModernButton, PageLayout } from '../components/design-system'
import { useAuth } from '../components/AuthProvider'
import { useForm } from '../hooks/useForm'
import { useSupabaseMutation } from '../hooks/useSupabaseMutation'

interface CreateEventFormData {
  artist: string
  city: string
  venue: string
  date: string
  time: string
}

/**
 * Dedicated Create Event page - clean, simple, and focused
 * No modal complexity, just a beautiful form experience
 */
export default function CreateEventPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { insert } = useSupabaseMutation()

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
          // Navigate to the new event page
          navigate(`/event/${slug}`)
        }
      })

      return result
    }
  })

  // Redirect to auth if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              You need to be signed in to create events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/auth')} 
              className="w-full"
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {/* Sticky Header */}
      <div className="bg-background border-b sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="p-2 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content with PageLayout */}
      <PageLayout includeMaxWidth={false} className="max-w-lg mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Create new event</h1>
          <p className="text-muted-foreground">
            Create a new event to gather your crew for concerts, festivals, or any music experience.
          </p>
        </div>

        <form onSubmit={form.handleSubmit} className="space-y-6">
          {/* Artist/Band Name - Required */}
          <FormField
            label="Artist / Band Name"
            required
            error={form.errors.artist}
            inputProps={{
              id: "artist",
              name: "artist",
              value: form.values.artist,
              onChange: form.handleInputChange,
              placeholder: "Taylor Swift",
              disabled: form.isSubmitting,
              "aria-describedby": "artist_description"
            }}
          />

          {/* City - Required */}
          <FormField
            label="City"
            required
            error={form.errors.city}
            inputProps={{
              id: "city",
              name: "city",
              value: form.values.city,
              onChange: form.handleInputChange,
              placeholder: "New York",
              disabled: form.isSubmitting,
              "aria-describedby": "city_description"
            }}
          />

          {/* Venue - Optional */}
          <FormField
            label="Venue (Optional)"
            labelVariant="default"
            inputProps={{
              id: "venue",
              name: "venue",
              value: form.values.venue,
              onChange: form.handleInputChange,
              placeholder: "Madison Square Garden",
              disabled: form.isSubmitting,
              "aria-describedby": "venue_description"
            }}
          />

          {/* Date - Required */}
          <FormField
            label="Date"
            required
            error={form.errors.date}
            inputProps={{
              id: "date",
              name: "date",
              type: "date",
              value: form.values.date,
              onChange: form.handleInputChange,
              disabled: form.isSubmitting,
              min: new Date().toISOString().split('T')[0], // Prevent past dates
              "aria-describedby": "date_description"
            }}
          />

          {/* Time - Optional */}
          <FormField
            label="Time (Optional)"
            labelVariant="default"
            inputProps={{
              id: "time",
              name: "time",
              type: "time",
              value: form.values.time,
              onChange: form.handleInputChange,
              disabled: form.isSubmitting,
              "aria-describedby": "time_description"
            }}
          />
          
          <p className="text-sm text-gray-500 text-center">
            Leave blank if time is TBD (defaults to 8:00 PM)
          </p>

          {/* Submit Button */}
          <div className="pt-4">
            <ModernButton
              type="submit"
              modernSize="large"
              fullWidth
              disabled={form.isSubmitting || !form.values.artist || !form.values.city || !form.values.date}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              {form.isSubmitting ? (
                <>
                  <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating Event...
                </>
              ) : (
                "Add event"
              )}
            </ModernButton>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Once created, you can invite friends and start building your crew for this event.
          </p>
        </div>
      </PageLayout>
    </>
  )
}
