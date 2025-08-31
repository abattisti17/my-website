// import { Link } from 'react-router-dom' // Commented out - using onClick navigation instead
import { useAuth } from './AuthProvider'
import { IonicButton } from '@/components/ui/ionic-button'
import { person, create } from 'ionicons/icons'
// import { Button } from '@/components/ui/button' // Commented out - using IonicButton instead
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from 'lucide-react'
// import { Edit } from 'lucide-react' // Commented out - using Ionic create icon instead

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
        <IonicButton 
          variant="outline" 
          fullWidth
          icon={person}
          onClick={() => window.location.href = '/profile'}
        >
          View Profile
        </IonicButton>
        <IonicButton 
          variant="default"
          fullWidth
          icon={create}
          onClick={() => window.location.href = '/profile/edit'}
        >
          Edit Profile
        </IonicButton>
      </CardContent>
    </Card>
  )
}