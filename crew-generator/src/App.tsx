import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EventPage from './pages/EventPage'
import PodPage from './pages/PodPage'
import MemorabiliPage from './pages/MemorabiliPage'
import TourPage from './pages/TourPage'
import AuthPage from './pages/AuthPage'

import AuthProvider from './components/AuthProvider'
import RequireAuth from './components/RequireAuth'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import { Toaster } from "@/components/ui/sonner"


const basePath = import.meta.env.VITE_PUBLIC_BASE_PATH || '/'

function App() {
  return (
    <AuthProvider>
      <Router basename={basePath === '/' ? undefined : basePath}>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Routes>
                             {/* Public routes */}
                 <Route path="/" element={<HomePage />} />
                 <Route path="/auth" element={<AuthPage />} />

            
            {/* Protected routes - require authentication */}
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
          <PWAInstallPrompt />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App