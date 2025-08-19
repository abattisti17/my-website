import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ReportMenu from './ReportMenu'
import { useAuth } from './AuthProvider'

interface MediaItem {
  id: string
  url: string
  kind: string
  owner_id: string
  created_at: string
  profiles?: {
    display_name: string | null
  }
}

interface MediaGalleryProps {
  eventId: string
}

export default function MediaGallery({ eventId }: MediaGalleryProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hiddenMedia, setHiddenMedia] = useState<Set<string>>(new Set())
  const { user } = useAuth()

  useEffect(() => {
    fetchMedia()
  }, [eventId])

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select(`
          id,
          url,
          kind,
          owner_id,
          created_at,
          profiles:owner_id (
            display_name
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching media:', error)
        return
      }

      setMedia((data as any) || [])
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleHideMedia = (mediaId: string) => {
    setHiddenMedia(prev => new Set(prev).add(mediaId))
  }

  const visibleMedia = media.filter(item => !hiddenMedia.has(item.id))

  if (loading) {
    return <div className="text-center py-4">📷 Loading photos...</div>
  }

  if (visibleMedia.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>🖼️ No photos shared yet</p>
        <p className="text-sm mt-2">Be the first to capture the moment!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">📸 Event Photos</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleMedia.map((item) => (
          <div key={item.id} className="relative group">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={item.url}
                alt="Event photo"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Photo info */}
            <div className="mt-2 text-xs text-gray-600">
              <p>📷 {item.profiles?.display_name || 'Anonymous'}</p>
              <p>{new Date(item.created_at).toLocaleDateString()}</p>
            </div>

            {/* Report menu for other users' photos */}
            {item.owner_id !== user?.id && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ReportMenu
                  targetType="media"
                  targetId={item.id}
                  onItemHidden={() => handleHideMedia(item.id)}
                  className="bg-white/80 hover:bg-white/90 backdrop-blur-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
