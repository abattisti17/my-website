import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IonPage, IonContent } from '@ionic/react'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card" // Temporarily disabled
// import { Badge } from "@/components/ui/badge" // Temporarily disabled
import { Mail, Calendar, Edit, Camera, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { PageLayout } from '../components/design-system/PageLayout'
import { Stack, HStack } from '../components/design-system/Stack'
// import { PageSection } from '../components/design-system/PageLayout' // Temporarily disabled

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
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      // Run all count queries in parallel for better performance
      const [
        { count: eventsCount },
        { count: podsCount },
        { count: messagesCount },
        { count: mediaCount }
      ] = await Promise.all([
        supabase
          .from('event_members')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('pod_members')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('media')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id)
      ])

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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    console.log('🔄 Starting avatar upload:', { fileName: file.name, fileSize: file.size, fileType: file.type })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 2MB like other media)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB')
      return
    }

    setUploadingAvatar(true)

    try {
      // Create unique filename for avatar using the same path structure as other media
      const timestamp = Date.now()
      const fileName = `avatar-${timestamp}.webp`
      const filePath = `${user.id}/avatars/${fileName}` // Same structure as existing media uploads

      console.log('📁 Uploading avatar to path:', filePath)

      // Resize and convert to WebP for efficiency (using existing utility)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      if (!ctx) {
        throw new Error('Canvas not supported')
      }

      const resizedBlob = await new Promise<Blob>((resolve, reject) => {
        img.onload = () => {
          // Resize to 256x256 for avatars (good quality but reasonable size)
          const size = 256
          canvas.width = size
          canvas.height = size

          // Draw image centered and cropped to square
          const { width, height } = img
          const minDim = Math.min(width, height)
          const offsetX = (width - minDim) / 2
          const offsetY = (height - minDim) / 2

          ctx.drawImage(img, offsetX, offsetY, minDim, minDim, 0, 0, size, size)

          // Convert to WebP
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Failed to convert image'))
              }
            },
            'image/webp',
            0.8 // Good quality for avatars
          )
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = URL.createObjectURL(file)
      })

      console.log(`📊 Avatar: ${(file.size / 1024).toFixed(1)}KB → ${(resizedBlob.size / 1024).toFixed(1)}KB`)

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, resizedBlob, {
          contentType: 'image/webp',
          upsert: true // Allow overwriting previous avatar
        })

      console.log('📤 Upload result:', { uploadData, uploadError })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      console.log('🔗 Public URL:', publicUrl)

      // Update profile with new avatar URL
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          avatar_url: publicUrl,
          email: user.email // Include email in case profile doesn't exist
        })

      console.log('💾 Profile update result:', { updateData, updateError })

      if (updateError) throw updateError

      // Update local state
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null)
      toast.success('Profile photo updated!')

    } catch (error: any) {
      console.error('❌ Error uploading avatar:', error)
      toast.error(`Failed to update profile photo: ${error.message}`)
    } finally {
      setUploadingAvatar(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
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
    <IonPage>
      <IonContent>
        <PageLayout className="max-w-2xl">
      <Stack spacing="md">
        {/* Profile Card */}
        <Card>
          {/* Custom content bypassing CardHeader grid constraints */}
          <div className="p-[var(--space-6)] space-y-[var(--space-4)]">
            {/* Edit Profile Button - Top Right */}
            <div className="flex justify-end">
              <Button asChild>
                <Link to="/profile/edit" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </div>

            {/* Avatar and Profile Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-[var(--space-4)]">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            
            {/* Clickable Avatar - Perfect size */}
            <div 
              className="relative group cursor-pointer flex-shrink-0"
              onClick={handleAvatarClick}
              style={{ width: '64px', height: '64px' }}
            >
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Profile" 
                  className="rounded-full object-cover border-4 border-border hover:border-primary transition-colors"
                  style={{ width: '64px', height: '64px' }}
                />
              ) : (
                <div 
                  className="bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold border-4 border-border hover:border-primary/70 transition-colors"
                  style={{ width: '64px', height: '64px' }}
                >
                  {(profile?.display_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                </div>
              )}
              
              {/* Upload overlay */}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploadingAvatar ? (
                  <Upload className="h-5 w-5 text-white animate-pulse" />
                ) : (
                  <Camera className="h-5 w-5 text-white" />
                )}
              </div>
              
              {/* Upload indicator */}
              {uploadingAvatar && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Upload className="h-3 w-3 text-primary-foreground animate-pulse" />
                </div>
              )}
            </div>

            {/* Profile Information */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h2 className="text-3xl font-semibold leading-none">
                {profile?.display_name || user.email?.split('@')[0] || 'User'}
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4" />
                {profile?.email || user.email}
              </div>
              {profile?.ig_url && profile?.reveal_ig && (
                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground text-sm">
                  <span className="text-sm">📷</span>
                  <a 
                    href={(() => {
                      // Clean up the URL to handle various formats
                      let cleanUrl = profile.ig_url.trim()
                      
                      // If it already starts with http, use as-is
                      if (cleanUrl.startsWith('http')) {
                        return cleanUrl
                      }
                      
                      // Remove instagram.com/ prefix if present
                      cleanUrl = cleanUrl.replace(/^instagram\.com\//, '')
                      
                      // Add the https://instagram.com/ prefix
                      return `https://instagram.com/${cleanUrl}`
                    })()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @{(() => {
                      // Extract just the username for display
                      let username = profile.ig_url.trim()
                      
                      // Remove any URL prefixes to get just the username
                      username = username.replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
                      username = username.replace(/^instagram\.com\//, '')
                      username = username.replace(/\/$/, '') // Remove trailing slash
                      
                      return username
                    })()}
                  </a>
                </div>
              )}
              <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                Joined {new Date(profile?.created_at || user.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        </Card>

        {/* Stats Cards */}
        {stats && (
          <Stack spacing="md">
            {/* Top row */}
            <HStack spacing="md">
              <Card className="flex-1">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.eventsJoined}</div>
                  <div className="text-sm text-gray-600">Events Joined</div>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.podsJoined}</div>
                  <div className="text-sm text-gray-600">Pods Joined</div>
                </CardContent>
              </Card>
            </HStack>
            
            {/* Bottom row */}
            <HStack spacing="md">
              <Card className="flex-1">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.messagesCount}</div>
                  <div className="text-sm text-gray-600">Messages Sent</div>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.mediaCount}</div>
                  <div className="text-sm text-gray-600">Photos Shared</div>
                </CardContent>
              </Card>
            </HStack>
          </Stack>
        )}

        {/* Tour Book CTA - Moved from HomePage */}
        <Card className="border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-[var(--space-6)] text-center">
          <div className="space-y-[var(--space-4)]">
            <div className="mx-auto w-[var(--space-12)] h-[var(--space-12)] bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="text-[var(--text-xl)]">📚</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-[var(--space-2)]">Your Tour Book</h3>
              <p className="text-[var(--text-sm)] text-muted-foreground mb-[var(--space-4)]">Relive your concert memories and experiences</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/tour">View Tour Book</Link>
            </Button>
          </div>
        </CardContent>
        </Card>
      </Stack>
        </PageLayout>
      </IonContent>
    </IonPage>
  )
}
