import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(() => {
  const basePath = process.env.VITE_PUBLIC_BASE_PATH || '/'
  
  return {
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Travel Crew Generator',
        short_name: 'CrewGen',
        description: 'Find your concert crew and make memories together',
        theme_color: '#7c3aed',
        background_color: '#f9fafb',
        display: 'standalone',
        orientation: 'portrait',
        scope: basePath,
        start_url: basePath,
        icons: [
          {
            src: `${basePath}icon-192.svg`.replace('//', '/'),
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: `${basePath}icon-512.svg`.replace('//', '/'),
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: `${basePath}icon-512.svg`.replace('//', '/'),
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
    base: basePath,
    server: {
      port: 5173,
      host: true
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets'
    }
  }
})
