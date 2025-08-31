import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IonicButton } from "@/components/ui/ionic-button"
import { download } from 'ionicons/icons'
// import { Button } from "@/components/ui/button" // Commented out - using IonicButton instead
import { Calendar, MapPin, ExternalLink } from 'lucide-react'
// import { Download } from 'lucide-react' // Commented out - using Ionic download icon instead

interface PhotoCardProps {
  item: {
    id: string
    url: string
    kind: 'image' | 'video'
    created_at: string
    events: {
      artist: string
      city: string
      date_utc: string
    }
  }
  /** Function to format date */
  formatDate: (dateString: string) => string
  /** Function to format date and time */
  formatDateTime: (dateString: string) => string
  /** Function to download image */
  downloadImage: (url: string, filename: string) => void
  /** Function to open full size image */
  openFullSize: (url: string) => void
}

/**
 * PhotoCard - Reusable Photo Card Component
 * 
 * Built on the base Card component with consistent styling.
 * Used on PhotosOverviewPage for displaying user photos.
 * 
 * @example
 * <PhotoCard 
 *   item={photoData} 
 *   formatDate={formatDate}
 *   formatDateTime={formatDateTime}
 *   downloadImage={downloadImage}
 *   openFullSize={openFullSize}
 * />
 */
export function PhotoCard({ 
  item, 
  formatDate, 
  formatDateTime, 
  downloadImage, 
  openFullSize 
}: PhotoCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg flex items-center gap-[var(--space-2)]">
              <Calendar className="h-4 w-4" />
              {item.events.artist}
            </CardTitle>
            <CardDescription className="flex items-center gap-[var(--space-2)] mt-1">
              <MapPin className="h-4 w-4" />
              {item.events.city} • {formatDate(item.events.date_utc)}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-[var(--text-xs)]">
            {item.kind}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Image */}
        <div 
          className="relative group cursor-pointer rounded-lg overflow-hidden bg-muted"
          onClick={() => openFullSize(item.url)}
        >
          <img
            src={item.url}
            alt={`Photo from ${item.events.artist} in ${item.events.city}`}
            className="w-full h-[12rem] object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
            <ExternalLink className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>

        {/* Actions and Info */}
        <div className="flex items-center justify-between text-[var(--text-sm)]">
          <span className="text-muted-foreground">
            Uploaded {formatDateTime(item.created_at)}
          </span>
          <IonicButton
            variant="outline"
            size="sm"
            onClick={() => {
              const timestamp = new Date(item.created_at).getTime()
              const filename = `${item.events.artist}-${item.events.city}-${timestamp}.webp`
              downloadImage(item.url, filename)
            }}
            icon={download}
            className="touch-target-sm"
          >
            Download
          </IonicButton>
        </div>
      </CardContent>
    </Card>
  )
}
