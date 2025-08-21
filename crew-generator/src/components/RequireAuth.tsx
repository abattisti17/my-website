import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { toast } from 'sonner'

interface RequireAuthProps {
  children: React.ReactNode
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      // Store the intended destination
      const intendedPath = location.pathname + location.search
      
      // Show toast and redirect to auth
      toast.error('Please sign in to continue.')
      
      // Navigate to auth page with return path
      navigate('/auth', { 
        state: { returnTo: intendedPath },
        replace: true 
      })
    }
  }, [user, loading, navigate]) // Removed location from dependencies

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-medium">🔐 Checking authentication...</div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!user) {
    return null
  }

  // User is authenticated, render children
  return <>{children}</>
}
