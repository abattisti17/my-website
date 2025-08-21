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
import { SimpleErrorBoundary } from './components/SimpleErrorBoundary'
import { Toaster } from "@/components/ui/sonner"


const basePath = import.meta.env.VITE_PUBLIC_BASE_PATH || '/'

function AppContent() {
  // DEV MODE: Simple console log to track unnecessary re-renders
  if (import.meta.env.DEV) {
    console.log('🔄 AppContent render at', new Date().toLocaleTimeString())
  }
  
  return (
    <div className="min-h-screen-dynamic bg-background text-foreground mobile-optimized">
      <SimpleErrorBoundary>
        <AppHeader />
      </SimpleErrorBoundary>
      <main className="pb-20 md:pb-0 px-content-sm md:px-content-md lg:px-content-lg max-w-7xl mx-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }>
          <SimpleErrorBoundary>
              <Routes>
                                             {/* Public routes */}
                <Route path="/" element={
                  <SimpleErrorBoundary>
                    <HomePage />
                  </SimpleErrorBoundary>
                } />
                <Route path="/auth" element={
                  <SimpleErrorBoundary>
                    <AuthPage />
                  </SimpleErrorBoundary>
                } />
                <Route path="/style-guide" element={
                  <SimpleErrorBoundary>
                    <StyleGuidePage />
                  </SimpleErrorBoundary>
                } />

            {/* Protected routes - require authentication */}
            <Route path="/pods" element={
              <SimpleErrorBoundary>
                <RequireAuth>
                  <ChatOverviewPage />
                </RequireAuth>
              </SimpleErrorBoundary>
            } />
            <Route path="/memorabilia" element={
              <SimpleErrorBoundary>
                <RequireAuth>
                  <PhotosOverviewPage />
                </RequireAuth>
              </SimpleErrorBoundary>
            } />
            <Route path="/profile" element={
              <SimpleErrorBoundary>
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              </SimpleErrorBoundary>
            } />
            <Route path="/profile/edit" element={
              <SimpleErrorBoundary>
                <RequireAuth>
                  <ProfileEditPage />
                </RequireAuth>
              </SimpleErrorBoundary>
            } />
            <Route path="/event/:slug" element={
              <SimpleErrorBoundary>
                <RequireAuth>
                  <EventPage />
                </RequireAuth>
              </SimpleErrorBoundary>
            } />
            <Route path="/event/:slug/pod/:podId" element={
              <SimpleErrorBoundary>
                <RequireAuth>
                  <PodPage />
                </RequireAuth>
              </SimpleErrorBoundary>
            } />
            <Route path="/event/:slug/memorabilia" element={
              <SimpleErrorBoundary>
                <RequireAuth>
                  <MemorabiliPage />
                </RequireAuth>
              </SimpleErrorBoundary>
            } />
            <Route path="/tour" element={
              <SimpleErrorBoundary>
                <RequireAuth>
                  <TourPage />
                </RequireAuth>
              </SimpleErrorBoundary>
            } />
              </Routes>
          </SimpleErrorBoundary>
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