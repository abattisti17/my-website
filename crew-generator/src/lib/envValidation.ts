/**
 * Environment Variable Validation
 * Catches configuration errors early and provides helpful error messages
 */

interface EnvConfig {
  VITE_SUPABASE_URL: string
  VITE_SUPABASE_ANON_KEY: string
  VITE_DEV_TEST_EMAIL?: string
  NODE_ENV: string
  DEV: boolean
  PROD: boolean
}

/**
 * Validates required environment variables
 * Throws descriptive errors if anything is missing or invalid
 */
export function validateEnvironment(): EnvConfig {
  const errors: string[] = []

  // Required variables
  const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
  const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

  // Validate Supabase URL
  if (!VITE_SUPABASE_URL) {
    errors.push('VITE_SUPABASE_URL is required')
  } else if (!VITE_SUPABASE_URL.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must start with https://')
  } else if (!VITE_SUPABASE_URL.includes('.supabase.co')) {
    errors.push('VITE_SUPABASE_URL must be a valid Supabase URL')
  }

  // Validate Supabase Anon Key
  if (!VITE_SUPABASE_ANON_KEY) {
    errors.push('VITE_SUPABASE_ANON_KEY is required')
  } else if (VITE_SUPABASE_ANON_KEY.length < 100) {
    errors.push('VITE_SUPABASE_ANON_KEY appears to be invalid (too short)')
  }

  // Optional dev email validation
  const VITE_DEV_TEST_EMAIL = import.meta.env.VITE_DEV_TEST_EMAIL
  if (VITE_DEV_TEST_EMAIL && !isValidEmail(VITE_DEV_TEST_EMAIL)) {
    errors.push('VITE_DEV_TEST_EMAIL must be a valid email address')
  }

  // Throw helpful error if validation fails
  if (errors.length > 0) {
    const errorMessage = [
      '🚨 Environment Configuration Error!',
      '',
      'Missing or invalid environment variables:',
      ...errors.map(error => `  • ${error}`),
      '',
      '💡 Fix these in your .env file:',
      '  VITE_SUPABASE_URL=https://your-project.supabase.co',
      '  VITE_SUPABASE_ANON_KEY=your-anon-key',
      '  VITE_DEV_TEST_EMAIL=test@example.com (optional)',
      '',
      '📚 See setup.md for detailed instructions'
    ].join('\n')

    throw new Error(errorMessage)
  }

  return {
    VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY,
    VITE_DEV_TEST_EMAIL,
    NODE_ENV: import.meta.env.NODE_ENV || 'development',
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  }
}

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validated environment config - safe to use throughout the app
 */
export const env = validateEnvironment()

/**
 * Development helper - logs environment status
 */
if (import.meta.env.DEV) {
  console.log('🔧 Environment validated successfully:', {
    supabaseUrl: env.VITE_SUPABASE_URL,
    hasDevEmail: !!env.VITE_DEV_TEST_EMAIL,
    nodeEnv: env.NODE_ENV
  })
}
