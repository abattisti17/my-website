import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'

interface EventListItemProps {
  event: {
    id: string
    slug: string
    artist: string
    venue: string
    city: string
    date: string
  }
}

export const EventListItem = memo(function EventListItem({ event }: EventListItemProps) {
  // Memoize expensive date formatting
  const formattedDate = useMemo(() => {
    const date = new Date(event.date)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }, [event.date])

  return (
    <Card className="border border-border hover:bg-accent/50 transition-colors cursor-pointer">
      <Link to={`/event/${event.slug}`} className="block">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex-1">
            {/* Artist name - bold and prominent */}
            <h3 className="text-lg font-bold text-foreground mb-1">
              {event.artist}
            </h3>
            
            {/* Venue and city - lighter text */}
            <p className="text-sm text-muted-foreground mb-2">
              {event.city} • {event.venue}
            </p>
            
            {/* Date - clean formatting */}
            <p className="text-sm text-muted-foreground">
              {formattedDate}
            </p>
          </div>
          
          {/* Right chevron indicator */}
          <ChevronRight className="h-5 w-5 text-muted-foreground ml-4 flex-shrink-0" />
        </CardContent>
      </Link>
    </Card>
  )
})
