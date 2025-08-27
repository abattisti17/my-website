import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
/// <reference types="vitest" />

// https://vite.dev/config/
export default defineConfig(() => {
  const basePath = process.env.VITE_PUBLIC_BASE_PATH || '/'
  
  return {
  plugins: [
    react(),
    // Security headers plugin for development
    {
      name: 'security-headers',
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          // Add security headers in development
          res.setHeader('X-Content-Type-Options', 'nosniff')
          res.setHeader('X-Frame-Options', 'DENY')
          res.setHeader('X-XSS-Protection', '1; mode=block')
          res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
          next()
        })
      }
    },
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
      assetsDir: 'assets',
      // Safer build settings to prevent variable conflicts
      minify: 'terser' as const,
      sourcemap: false,
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: {
            // Simpler chunking to avoid variable conflicts
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'supabase-vendor': ['@supabase/supabase-js'],
            'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-avatar', 'lucide-react']
          },
          // Ensure proper variable naming to avoid conflicts
          format: 'es' as const,
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js'
        }
      },
      // Increase chunk size warning limit since we're optimizing chunks
      chunkSizeWarningLimit: 1000
    },
    // Vitest configuration
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/tests/setupTests.ts'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'dist/',
          '**/*.d.ts',
          '**/*.config.*',
          'src/vite-env.d.ts'
        ]
      }
    }
  }
})
