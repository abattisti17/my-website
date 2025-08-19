import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Edit, ArrowLeft } from 'lucide-react'
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

interface UserStats {
  eventsJoined: number
  podsJoined: number
  messagesCount: number
  mediaCount: number
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchUserStats()
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
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    }
  }

  const fetchUserStats = async () => {
    if (!user) return

    try {
      // Get events joined
      const { count: eventsCount } = await supabase
        .from('event_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Get pods joined
      const { count: podsCount } = await supabase
        .from('pod_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Get messages sent
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Get media uploaded
      const { count: mediaCount } = await supabase
        .from('media')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)

      setStats({
        eventsJoined: eventsCount || 0,
        podsJoined: podsCount || 0,
        messagesCount: messagesCount || 0,
        mediaCount: mediaCount || 0
      })
    } catch (error: any) {
      console.error('Error fetching user stats:', error)
      // Don't show error toast for stats, just log it
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">Please sign in to view your profile.</p>
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
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      {/* Profile Card */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <CardTitle className="text-2xl">
                {profile?.display_name || 'Anonymous User'}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {profile?.email || user.email}
              </CardDescription>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                Joined {new Date(profile?.created_at || user.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
          <Button asChild size="sm">
            <Link to="/profile/edit" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </CardHeader>
        
        {profile?.ig_url && profile?.reveal_ig && (
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">📸 Instagram</Badge>
              <a 
                href={profile.ig_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                {profile.ig_url}
              </a>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.eventsJoined}</div>
              <div className="text-sm text-gray-600">Events Joined</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.podsJoined}</div>
              <div className="text-sm text-gray-600">Pods Joined</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.messagesCount}</div>
              <div className="text-sm text-gray-600">Messages Sent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.mediaCount}</div>
              <div className="text-sm text-gray-600">Photos Shared</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full" variant="outline">
            <Link to="/">🎵 Browse Events</Link>
          </Button>
          <Button asChild className="w-full" variant="outline">
            <Link to="/tour">📚 View Tour Book</Link>
          </Button>
          <Button asChild className="w-full" variant="outline">
            <Link to="/profile/edit">⚙️ Edit Profile Settings</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
