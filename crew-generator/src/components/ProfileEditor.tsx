import { Link } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Edit } from 'lucide-react'

export default function ProfileEditor() {
  const { user } = useAuth()

  if (!user) return null

  // Get display name from user metadata or email
  const displayName = user.user_metadata?.display_name || 
                     user.email?.split('@')[0] || 
                     'User'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Welcome, {displayName}!
        </CardTitle>
        <CardDescription>
          Manage your profile and connect with fellow music fans
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild variant="outline" className="w-full">
          <Link to="/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            View Profile
          </Link>
        </Button>
        <Button asChild className="w-full">
          <Link to="/profile/edit" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}