import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Lazy load all pages for better performance and smaller initial bundle
const HomePage = lazy(() => import('./pages/HomePage'))
const EventPage = lazy(() => import('./pages/EventPage'))
const PodPage = lazy(() => import('./pages/PodPage'))
const MemorabiliPage = lazy(() => import('./pages/MemorabiliPage'))
const TourPage = lazy(() => import('./pages/TourPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const ProfileEditPage = lazy(() => import('./pages/ProfileEditPage'))
const StyleGuidePage = lazy(() => import('./pages/StyleGuidePage'))
const ChatOverviewPage = lazy(() => import('./pages/ChatOverviewPage'))
const PhotosOverviewPage = lazy(() => import('./pages/PhotosOverviewPage'))

import AuthProvider from './components/AuthProvider'
import RequireAuth from './components/RequireAuth'
import AppHeader from './components/AppHeader'
import BottomNavigation from './components/BottomNavigation'
import { ThemeProvider } from './components/ThemeProvider'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import { Toaster } from "@/components/ui/sonner"


const basePath = import.meta.env.VITE_PUBLIC_BASE_PATH || '/'

function AppContent() {
  // DEV MODE: Simple console log to track unnecessary re-renders
  if (import.meta.env.DEV) {
    console.log('🔄 AppContent render at', new Date().toLocaleTimeString())
  }
  
  return (
    <div className="min-h-screen-dynamic bg-background text-foreground mobile-optimized">
      <AppHeader />
      <main className="pb-20 md:pb-0 px-content-sm md:px-content-md lg:px-content-lg max-w-7xl mx-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }>
              <Routes>
                                             {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/style-guide" element={<StyleGuidePage />} />

            {/* Protected routes - require authentication */}
            <Route path="/pods" element={
              <RequireAuth>
                <ChatOverviewPage />
              </RequireAuth>
            } />
            <Route path="/memorabilia" element={
              <RequireAuth>
                <PhotosOverviewPage />
              </RequireAuth>
            } />
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
        </Suspense>
      </main>
      <BottomNavigation />
      <PWAInstallPrompt />
      <Toaster />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="crew-generator-theme">
      <AuthProvider>
        <Router basename={basePath === '/' ? undefined : basePath}>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App