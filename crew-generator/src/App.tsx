import { IonApp } from '@ionic/react'
import { ThemeProvider } from 'next-themes'
import AuthProvider from './components/AuthProvider'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Import pages
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import CreateEventPage from './pages/CreateEventPage'
import EventPage from './pages/EventPage'
import ProfilePage from './pages/ProfilePage'
import ProfileEditPage from './pages/ProfileEditPage'
import PodPage from './pages/PodPage'
import TourPage from './pages/TourPage'
import ChatOverviewPage from './pages/ChatOverviewPage'
import MessagesExamplePage from './pages/MessagesExamplePage'
import PhotosOverviewPage from './pages/PhotosOverviewPage'
import MemorabiliPage from './pages/MemorabiliPage'
import StyleGuidePage from './pages/StyleGuidePage'

export default function App() {
  return (
    <IonApp>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/create-event" element={<CreateEventPage />} />
              <Route path="/event/:slug" element={<EventPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<ProfileEditPage />} />
              <Route path="/pod/:podId" element={<PodPage />} />
              <Route path="/tour/:tourId" element={<TourPage />} />
              <Route path="/chat" element={<ChatOverviewPage />} />
              <Route path="/messages" element={<MessagesExamplePage />} />
              <Route path="/photos" element={<PhotosOverviewPage />} />
              <Route path="/memorabilia" element={<MemorabiliPage />} />
              <Route path="/style-guide" element={<StyleGuidePage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </IonApp>
  )
}