import { Link, useLocation } from 'react-router-dom'
import { Music, MessageCircle, Camera, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from './AuthProvider'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  authRequired?: boolean
}

const navItems: NavItem[] = [
  {
    label: 'Events',
    href: '/',
    icon: Music,
    authRequired: false,
  },
  {
    label: 'Chat',
    href: '/pods',
    icon: MessageCircle,
    authRequired: true,
  },
  {
    label: 'Photos',
    href: '/memorabilia',
    icon: Camera,
    authRequired: true,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
    authRequired: true,
  },
]

export default function BottomNavigation() {
  const location = useLocation()
  const { user } = useAuth()

  // Hide bottom nav on auth page and pod chat pages
  if (location.pathname === '/auth') {
    return null
  }

  // Hide bottom nav on pod chat pages (pattern: /event/*/pod/*)
  if (location.pathname.match(/^\/event\/[^/]+\/pod\/[^/]+/)) {
    return null
  }

  return (
    <>
      {/* Note: Safe scroll content handles spacing, no spacer needed */}
      
      {/* Bottom Navigation - Mobile Only */}
      <nav className="bottom-nav-container bg-background/95 backdrop-blur-sm border-t border-border md:hidden z-50 safe-area-bottom allow-overflow">
        {/* Safe area padding and full-width container */}
        <div className="w-full px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-around w-full max-w-sm mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href || 
                             (item.href !== '/' && location.pathname.startsWith(item.href))
              
              // Hide auth-required items if not logged in
              if (item.authRequired && !user) {
                return null
              }

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-4 py-3 touch-target-lg rounded-xl transition-all duration-200 relative min-w-[64px]",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                  )}
                  
                  {/* Icon with enhanced active state */}
                  <div className={cn(
                    "p-2 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-primary/15 scale-110" 
                      : "hover:bg-muted/50"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  {/* Label */}
                  <span className={cn(
                    "text-xs font-medium transition-all duration-200",
                    isActive ? "text-primary scale-105" : ""
                  )}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
