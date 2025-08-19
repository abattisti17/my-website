import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface Profile {
  id: string
  display_name: string | null
  email: string | null
}

export default function ProfileEditor() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
        .select('id, display_name, email')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(data)
      setDisplayName(data.display_name || '')
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName.trim() || null
        })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating profile:', error)
        toast.error('Failed to update profile')
        return
      }

      setProfile(prev => prev ? { ...prev, display_name: displayName.trim() } : null)
      toast.success('Profile updated! 🎉')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Loading profile...</p>
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Profile not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>👤 Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <p className="text-gray-600 bg-gray-50 px-3 py-2 rounded border">
            {profile.email || user?.email || 'No email'}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="display_name" className="block text-sm font-medium mb-1">
              Display Name
            </label>
            <Input
              id="display_name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              maxLength={50}
              disabled={saving}
            />
            <p className="text-xs text-gray-500 mt-1">
              This is how others will see your name in the app
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={saving || displayName.trim() === (profile.display_name || '')}
            className="w-full"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
