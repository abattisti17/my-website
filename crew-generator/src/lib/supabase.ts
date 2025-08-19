import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Build-time validation - fails fast with clear errors
if (!supabaseUrl) {
  throw new Error(
    `❌ Missing VITE_SUPABASE_URL environment variable\n` +
    `Add it to your .env.local file or GitHub Actions secrets.\n` +
    `See docs/ENVIRONMENT.md for setup instructions.`
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    `❌ Missing VITE_SUPABASE_ANON_KEY environment variable\n` +
    `Add it to your .env.local file or GitHub Actions secrets.\n` +
    `See docs/ENVIRONMENT.md for setup instructions.`
  )
}

// Optional: Development logging (only in dev, no sensitive data)
if (import.meta.env.DEV) {
  console.log('✅ Supabase client initialized')
  console.log('🔍 URL:', supabaseUrl)
  console.log('🔑 API Key (last 10 chars):', supabaseAnonKey?.slice(-10))
}

// Optimized Supabase client configuration to prevent auth hanging
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,       // Enable session persistence for production
    autoRefreshToken: true,     // Enable auto refresh for production
    detectSessionInUrl: true,   // Enable URL detection for magic links
    storage: {                  // Custom storage implementation to prevent hanging
      getItem: (key: string) => {
        try {
          return localStorage?.getItem(key) || null
        } catch {
          return null
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage?.setItem(key, value)
        } catch {
          // Silently fail if localStorage unavailable
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage?.removeItem(key)
        } catch {
          // Silently fail if localStorage unavailable
        }
      }
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'crew-generator-v1'
    }
  }
})


