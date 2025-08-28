import { createRoot } from 'react-dom/client'

/* Ionic Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables and design token mappings */
import './theme/ionic-overrides.css'

/* Our existing styles (Tailwind + design tokens) */
import './index.css'

/* Ionic React setup */
import { setupIonicReact } from '@ionic/react'

import App from './App'

/* Initialize Ionic React */
setupIonicReact({
  rippleEffect: false,
  mode: 'ios' // Use iOS mode for consistent design across platforms
})

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
  <App />
)
