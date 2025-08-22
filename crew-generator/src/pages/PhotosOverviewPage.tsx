import { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from '../components/design-system/PageHeader'
import { PageLayout, PageSection } from '../components/design-system/PageLayout'
import { EmptyState } from '../components/design-system/EmptyState'
import { LoadingSpinner } from '../components/design-system/LoadingSpinner'
import { CardList, PhotoCard } from '../components/design-system'
import { Camera, Download, Calendar, MapPin, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface MediaItemWithEvent {
  id: string
  url: string
  kind: 'image' | 'video'
  owner_id: string
  created_at: string
  event_id: string
  events: {
    slug: string
    artist: string
    city: string
    date_utc: string
  }
}

export default function PhotosOverviewPage() {
  const { user } = useAuth()
  const [media, setMedia] = useState<MediaItemWithEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUserMedia()
    }
  }, [user])

  const fetchUserMedia = async () => {
    try {
      setLoading(true)

      // Get all media uploaded by the user across all events
      const { data, error } = await supabase
        .from('media')
        .select(`
          id,
          url,
          kind,
          owner_id,
          created_at,
          event_id,
          events!inner (
            slug,
            artist,
            city,
            date_utc
          )
        `)
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user media:', error)
        toast.error('Failed to load your photos')
        return
      }

      setMedia((data as any) || [])

    } catch (error) {
      console.error('Error fetching media:', error)
      toast.error('Failed to load your photos')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      toast.success('Photo downloaded!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download photo')
    }
  }

  const downloadAllPhotos = async () => {
    if (media.length === 0) return

    try {
      setDownloading(true)
      toast.info(`Downloading ${media.length} photos...`)

      for (let i = 0; i < media.length; i++) {
        const item = media[i]
        const timestamp = new Date(item.created_at).getTime()
        const filename = `${item.events.artist}-${item.events.city}-${timestamp}.webp`
        
        await downloadImage(item.url, filename)
        
        // Small delay between downloads to avoid overwhelming the browser
        if (i < media.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }

      toast.success('All photos downloaded!')
    } catch (error) {
      console.error('Bulk download error:', error)
      toast.error('Failed to download all photos')
    } finally {
      setDownloading(false)
    }
  }

  const openFullSize = (url: string) => {
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="safe-scroll-content">
        <PageHeader
          title="Your Photos"
          subtitle="All photos you've uploaded"
          icon={<Camera className="h-8 w-8 text-primary" />}
        />
        <LoadingSpinner />
      </div>
    )
  }

  if (media.length === 0) {
    return (
      <div className="safe-scroll-content">
        <PageHeader
          title="Your Photos"
          subtitle="All photos you've uploaded"
          icon={<Camera className="h-8 w-8 text-primary" />}
        />
        <EmptyState
          icon={<Camera className="h-8 w-8 text-primary" />}
          title="No photos yet"
          description="Start uploading photos at events to build your collection!"
        />
      </div>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title="Your Photos"
        subtitle={`${media.length} photo${media.length === 1 ? '' : 's'} uploaded`}
        icon={<Camera className="h-8 w-8 text-primary" />}
      />

      {/* Download All Button */}
      <PageSection spacing="sm">
        <Button 
          onClick={downloadAllPhotos}
          disabled={downloading}
          className="w-full touch-target"
        >
          <Download className="h-4 w-4 mr-2" />
          {downloading ? 'Downloading...' : `Download All ${media.length} Photos`}
        </Button>
      </PageSection>

      {/* Photos Grid */}
      <PageSection>
        <CardList
          items={media}
          renderCard={(item) => (
            <PhotoCard
              key={item.id}
              item={item}
              formatDate={formatDate}
              formatDateTime={formatDateTime}
              downloadImage={downloadImage}
              openFullSize={openFullSize}
            />
          )}
          spacing="sm"
          emptyState={{
            title: "No photos yet",
            message: "Start uploading photos at events to build your collection!",
            icon: <Camera className="h-12 w-12 text-muted-foreground" />
          }}
          testId="photos-list"
        />
      </PageSection>
    </PageLayout>
  )
}
