import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users } from 'lucide-react'

interface PodCardProps {
  pod: {
    id: string
    name?: string | null
    member_count: number
    latest_message_at?: string | null
    events: {
      slug: string
      artist: string
      city: string
    }
  }
  /** Optional function to format relative time */
  formatRelativeTime?: (date: string) => string
}

/**
 * PodCard - Reusable Pod/Chat Card Component
 * 
 * Built on the base Card component with consistent styling.
 * Used across ChatOverviewPage, EventPage, and other pod listings.
 * 
 * @example
 * <PodCard 
 *   pod={podData} 
 *   formatRelativeTime={(date) => formatDistanceToNow(new Date(date))}
 * />
 */
export function PodCard({ pod, formatRelativeTime }: PodCardProps) {
  return (
    <Link
      to={`/event/${pod.events.slug}/pod/${pod.id}`}
      className="block"
    >
      <Card className="hover:bg-muted/50 transition-colors duration-200 touch-target">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-[var(--text-lg)] truncate">
                {pod.name || `${pod.events.artist} Chat`}
              </CardTitle>
              <CardDescription className="flex items-center gap-[var(--space-2)] mt-1">
                <Calendar className="h-4 w-4" />
                {pod.events.artist} • {pod.events.city}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-[var(--space-2)] ml-4">
              <Badge variant="secondary" className="text-[var(--text-xs)]">
                <Users className="h-3 w-3 mr-1" />
                {pod.member_count}
              </Badge>
              {pod.latest_message_at && formatRelativeTime && (
                <span className="text-[var(--text-xs)] text-muted-foreground">
                  {formatRelativeTime(pod.latest_message_at)}
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-[var(--text-sm)] text-muted-foreground">
            Tap to join the conversation
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
