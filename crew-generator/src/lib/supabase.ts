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

// Optimized Supabase client configuration for development productivity
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,       // Enable session persistence 
    autoRefreshToken: true,     // Enable auto refresh 
    detectSessionInUrl: true,   // Enable URL detection for magic links
    // Development: Extend session duration to reduce auth friction
    ...(import.meta.env.DEV && {
      sessionRefreshMargin: 60 * 60 * 24 * 30, // 30 days in development (was 7)
      refreshThreshold: 60 * 60 * 24 * 25,     // Start refreshing 5 days before expiry
    }),
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
  },
  // Add request timeout for all Supabase requests
  ...(import.meta.env.DEV && {
    fetch: (url: RequestInfo | URL, options: RequestInit = {}) => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout in dev
      
      return fetch(url, {
        ...options,
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId))
    }
  })
})

// Development auto-login helper
export const devAutoLogin = async () => {
  if (!import.meta.env.DEV) return false
  
  const DEV_TEST_EMAIL = import.meta.env.VITE_DEV_TEST_EMAIL
  if (!DEV_TEST_EMAIL) return false
  
  try {
    console.log('🔧 Development auto-login attempting...')
    
    // Dynamically determine redirect URL based on environment
    const redirectTo = import.meta.env.VITE_DEV_REDIRECT_URL 
      || (import.meta.env.DEV 
          ? `${window.location.origin}/auth` // Development: current localhost
          : `${window.location.origin}/auth`) // Production: current domain
    
    console.log('🔗 Redirect URL:', redirectTo)
    
    const { error } = await supabase.auth.signInWithOtp({
      email: DEV_TEST_EMAIL,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo
      }
    })
    
    if (error) {
      console.warn('⚠️ Dev auto-login failed:', error.message)
      return false
    }
    
    console.log('📧 Dev magic link sent to:', DEV_TEST_EMAIL)
    console.log('🎯 Magic link will redirect to:', redirectTo)
    return true
  } catch (error) {
    console.warn('⚠️ Dev auto-login error:', error)
    return false
  }
}


