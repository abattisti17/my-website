import React, { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save } from 'lucide-react'
import { useSupabaseRecord } from '../hooks/useSupabaseQuery'
import { useSupabaseMutation } from '../hooks/useSupabaseMutation'
import { useForm } from '../hooks/useForm'

interface Profile {
  id: string
  display_name: string | null
  email: string | null
  avatar_url: string | null
  ig_url: string | null
  reveal_ig: boolean
  created_at: string
}

export default function ProfileEditPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { update } = useSupabaseMutation()

  // Memoize options to prevent infinite re-renders
  const queryOptions = useMemo(() => ({ 
    select: '*',
    enabled: !!user?.id 
  }), [user?.id])

  // Fetch profile data with automatic loading state
  const { data: profile, loading } = useSupabaseRecord<Profile>('profiles', user?.id || null, queryOptions)

  // Form management with automatic validation
  const form = useForm({
    initialValues: {
      display_name: profile?.display_name || '',
      ig_url: profile?.ig_url || '',
      reveal_ig: profile?.reveal_ig || false
    },
    onSubmit: async (data) => {
      if (!user || !profile) {
        throw new Error('User not found')
      }

      await update('profiles', user.id, {
        display_name: data.display_name.trim() || null,
        ig_url: data.ig_url.trim() || null,
        reveal_ig: data.reveal_ig
      }, {
        successMessage: 'Profile updated successfully! ✨',
        onSuccess: () => navigate('/profile')
      })
    }
  })

  // Update form when profile loads
  React.useEffect(() => {
    if (profile) {
      form.setValues({
        display_name: profile.display_name || '',
        ig_url: profile.ig_url || '',
        reveal_ig: profile.reveal_ig || false
      })
    }
  }, [profile])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to edit your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/profile">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">Update your personal information</p>
          </div>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              This information will be visible to other crew members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit} className="space-y-6">
              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  name="display_name"
                  value={form.values.display_name}
                  onChange={form.handleInputChange}
                  placeholder="Enter your display name"
                />
                <p className="text-sm text-muted-foreground">
                  This is how your name will appear to other users
                </p>
              </div>

              {/* Instagram URL */}
              <div className="space-y-2">
                <Label htmlFor="ig_url">Instagram Profile (Optional)</Label>
                <Input
                  id="ig_url"
                  name="ig_url"
                  value={form.values.ig_url}
                  onChange={form.handleInputChange}
                  placeholder="https://instagram.com/yourusername"
                />
                <p className="text-sm text-muted-foreground">
                  Link to your Instagram profile for crew members to connect
                </p>
              </div>

              {/* Reveal Instagram */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reveal_ig"
                  checked={form.values.reveal_ig}
                  onCheckedChange={(checked) => form.handleChange('reveal_ig', checked)}
                />
                <Label htmlFor="reveal_ig" className="text-sm font-normal">
                  Make my Instagram visible to other crew members
                </Label>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={form.isSubmitting}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {form.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/profile')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details from authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Member Since</Label>
              <p className="text-sm text-muted-foreground">
                {profile?.created_at 
                  ? new Date(profile.created_at).toLocaleDateString()
                  : 'Unknown'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
