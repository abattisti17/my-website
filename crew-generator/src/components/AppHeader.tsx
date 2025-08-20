import { Link } from 'react-router-dom'
import { Moon, Sun, Laptop, Palette } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { useTheme } from './ThemeProvider'
import UserMenu from './UserMenu'
import { Button } from "@/components/ui/button"
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
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold text-foreground touch-target"
        >
          <span className="text-2xl">🎵</span>
          <span className="hidden sm:inline">Travel Crew Generator</span>
          <span className="sm:hidden font-heading">Crew</span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center gap-4 text-sm mr-4">
              <Link 
                to="/" 
                className="text-muted-foreground hover:text-foreground transition-colors touch-target px-2 py-1 rounded-md"
              >
                Events
              </Link>
              <Link 
                to="/tour" 
                className="text-muted-foreground hover:text-foreground transition-colors touch-target px-2 py-1 rounded-md"
              >
                Tour Book
              </Link>
            </nav>
          )}

          <div className="flex items-center gap-2">
            {/* Style Guide Link */}
            <Button asChild variant="ghost" className="touch-target text-muted-foreground hover:text-foreground">
              <Link to="/style-guide">
                <Palette className="h-4 w-4" />
                <span className="sr-only">Style Guide</span>
              </Link>
            </Button>
            
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="touch-target">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
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
              <Button asChild className="touch-target">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
