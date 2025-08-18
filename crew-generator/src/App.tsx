import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EventPage from './pages/EventPage'
import PodPage from './pages/PodPage'
import MemorabiliPage from './pages/MemorabiliPage'
import TourPage from './pages/TourPage'
import AuthPage from './pages/AuthPage'
import AuthProvider from './components/AuthProvider'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import { Toaster } from "@/components/ui/sonner"


const basePath = import.meta.env.VITE_PUBLIC_BASE_PATH || '/'

function App() {
  return (
    <AuthProvider>
      <Router basename={basePath === '/' ? undefined : basePath}>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/event/:slug" element={<EventPage />} />
            <Route path="/event/:slug/pod/:podId" element={<PodPage />} />
            <Route path="/event/:slug/memorabilia" element={<MemorabiliPage />} />
            <Route path="/tour" element={<TourPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
          <PWAInstallPrompt />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App