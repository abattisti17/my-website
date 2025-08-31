// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { IonicButton } from '../components/ui/ionic-button'
import { home } from 'ionicons/icons'
// import { Button } from '../components/ui/button' // Commented out - using IonicButton instead
import { PageLayout, PageHeader, EmptyState } from '../components/design-system'
import { Stack } from '../components/design-system'
import { BookOpen } from 'lucide-react'
// import { Link } from 'react-router-dom' // Commented out - using onClick navigation instead

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
            <IonicButton 
              variant="default"
              icon={home}
              onClick={() => window.location.href = '/'}
            >
              Browse Events
            </IonicButton>
          }
        />
      </Stack>
    </PageLayout>
  )
}
