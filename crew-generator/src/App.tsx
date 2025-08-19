import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EventPage from './pages/EventPage'
import PodPage from './pages/PodPage'
import MemorabiliPage from './pages/MemorabiliPage'
import TourPage from './pages/TourPage'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import ProfileEditPage from './pages/ProfileEditPage'
import StyleGuidePage from './pages/StyleGuidePage'

import AuthProvider from './components/AuthProvider'
import RequireAuth from './components/RequireAuth'
import AppHeader from './components/AppHeader'
import BottomNavigation from './components/BottomNavigation'
import { ThemeProvider } from './components/ThemeProvider'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import { Toaster } from "@/components/ui/sonner"


const basePath = import.meta.env.VITE_PUBLIC_BASE_PATH || '/'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="crew-generator-theme">
      <AuthProvider>
        <Router basename={basePath === '/' ? undefined : basePath}>
          <div className="min-h-screen-dynamic bg-background text-foreground mobile-optimized">
            <AppHeader />
            <main className="pb-20 md:pb-0 px-content-sm md:px-content-md lg:px-content-lg max-w-7xl mx-auto">
              <Routes>
                                             {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/style-guide" element={<StyleGuidePage />} />

            {/* Protected routes - require authentication */}
            <Route path="/profile" element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            } />
            <Route path="/profile/edit" element={
              <RequireAuth>
                <ProfileEditPage />
              </RequireAuth>
            } />
            <Route path="/event/:slug" element={
              <RequireAuth>
                <EventPage />
              </RequireAuth>
            } />
            <Route path="/event/:slug/pod/:podId" element={
              <RequireAuth>
                <PodPage />
              </RequireAuth>
            } />
            <Route path="/event/:slug/memorabilia" element={
              <RequireAuth>
                <MemorabiliPage />
              </RequireAuth>
            } />
            <Route path="/tour" element={
              <RequireAuth>
                <TourPage />
              </RequireAuth>
            } />
              </Routes>
            </main>
            <BottomNavigation />
            <PWAInstallPrompt />
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App