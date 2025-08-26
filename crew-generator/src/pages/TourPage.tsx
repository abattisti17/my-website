// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { PageLayout, PageHeader, EmptyState } from '../components/design-system'
import { Stack } from '../components/design-system'
import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TourPage() {
  return (
    <PageLayout>
      <Stack spacing="lg">
        <PageHeader
          title="📖 Your Tour Book"
          subtitle="Your personal collection of concert memories and experiences"
        />
        
        <EmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title="Your Tour Book is Empty"
          description="Attend events and capture your experiences to build your personal tour book! Each concert will add memories, photos, and stories to your collection."
          action={
            <Button asChild>
              <Link to="/">Browse Events</Link>
            </Button>
          }
        />
      </Stack>
    </PageLayout>
  )
}
