// import { Link } from 'react-router-dom' // Commented out - using onClick navigation instead
import { Moon, Sun, Laptop } from 'lucide-react'
// import { Palette } from 'lucide-react' // Commented out - using Ionic colorPalette icon instead
import { useAuth } from './AuthProvider'
import { useTheme } from './ThemeProvider'
import UserMenu from './UserMenu'
import { IonicButton } from "@/components/ui/ionic-button"
import { colorPalette } from 'ionicons/icons'
// import { sunny, moon, laptop } from 'ionicons/icons' // Commented out - not used
// import { Button } from "@/components/ui/button" // Commented out - using IonicButton instead
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AppHeader() {
  const { user } = useAuth()
  const { setTheme } = useTheme()

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 safe-area-inset">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo/Brand - Mobile optimized */}
        <div 
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 text-xl font-bold text-foreground touch-target cursor-pointer"
        >
          <span className="text-2xl">🎵</span>
          <span className="hidden sm:inline">Travel Crew Generator</span>
          <span className="sm:hidden font-heading">Crew</span>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center gap-4 text-sm mr-4">
              <div 
                onClick={() => window.location.href = '/'}
                className="text-muted-foreground hover:text-foreground transition-colors touch-target px-2 py-1 rounded-md cursor-pointer"
              >
                Events
              </div>
              <div 
                onClick={() => window.location.href = '/tour'}
                className="text-muted-foreground hover:text-foreground transition-colors touch-target px-2 py-1 rounded-md cursor-pointer"
              >
                Tour Book
              </div>
            </nav>
          )}

          <div className="flex items-center gap-2">
            {/* Style Guide Link */}
            <IonicButton 
              variant="ghost" 
              icon={colorPalette}
              onClick={() => window.location.href = '/style-guide'}
              className="touch-target text-muted-foreground hover:text-foreground"
            >
              <span className="sr-only">Style Guide</span>
            </IonicButton>
            
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IonicButton variant="ghost" className="touch-target">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </IonicButton>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Laptop className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

            {/* User Menu or Sign In */}
            {user ? (
              <UserMenu />
            ) : (
              <IonicButton 
                variant="default"
                onClick={() => window.location.href = '/auth'}
                className="touch-target"
              >
                Sign In
              </IonicButton>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
