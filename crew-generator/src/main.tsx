import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Register service worker for PWA functionality (only in production or HTTPS)
if ('serviceWorker' in navigator && (import.meta.env.PROD || location.protocol === 'https:')) {
  window.addEventListener('load', () => {
    const basePath = import.meta.env.VITE_PUBLIC_BASE_PATH || '/'
    const swPath = `${basePath}sw.js`.replace('//', '/')
    
    navigator.serviceWorker.register(swPath)
      .then(() => {
        console.log('✅ Service Worker registered successfully');
      })
      .catch((registrationError) => {
        console.log('❌ Service Worker registration failed:', registrationError);
      });
  });
} else if (import.meta.env.DEV) {
  console.log('🔧 Service Worker disabled in development (HTTP)');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
