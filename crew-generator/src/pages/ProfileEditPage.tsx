import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'

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
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    display_name: '',
    ig_url: '',
    reveal_ig: false
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      
      setProfile(data)
      setFormData({
        display_name: data.display_name || '',
        ig_url: data.ig_url || '',
        reveal_ig: data.reveal_ig || false
      })
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user || !profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.display_name.trim() || null,
          ig_url: formData.ig_url.trim() || null,
          reveal_ig: formData.reveal_ig
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Profile updated successfully! ✨')
      navigate('/profile')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">Please sign in to edit your profile.</p>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-center py-12">
          <div className="text-xl font-medium">Loading profile...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" asChild>
          <Link to="/profile" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Profile</h1>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your profile details. Changes will be visible to other users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email"
              type="email"
              value={profile?.email || user.email || ''}
              disabled
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-500">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input 
              id="display_name"
              type="text"
              placeholder="Enter your display name"
              value={formData.display_name}
              onChange={(e) => handleInputChange('display_name', e.target.value)}
              maxLength={50}
            />
            <p className="text-sm text-gray-500">
              This is how other users will see your name. Max 50 characters.
            </p>
          </div>

          {/* Instagram URL */}
          <div className="space-y-2">
            <Label htmlFor="ig_url">Instagram Profile (Optional)</Label>
            <Input 
              id="ig_url"
              type="url"
              placeholder="https://instagram.com/yourusername"
              value={formData.ig_url}
              onChange={(e) => handleInputChange('ig_url', e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Share your Instagram to connect with fellow music fans.
            </p>
          </div>

          {/* Reveal Instagram - Enhanced visibility */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Instagram Visibility</Label>
            <div className="flex items-start space-x-3 p-4 border rounded-lg bg-muted/30">
              <Checkbox 
                id="reveal_ig"
                checked={formData.reveal_ig}
                onCheckedChange={(checked) => handleInputChange('reveal_ig', checked as boolean)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label htmlFor="reveal_ig" className="text-sm font-medium cursor-pointer">
                  Show my Instagram profile to other users
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.reveal_ig 
                    ? "✅ Your Instagram will be visible on your profile" 
                    : "❌ Your Instagram will remain private"
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/profile">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Account Created:</span>
              <div className="text-gray-600">
                {new Date(profile?.created_at || user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div>
              <span className="font-medium">User ID:</span>
              <div className="text-gray-600 font-mono text-xs">
                {user.id}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
