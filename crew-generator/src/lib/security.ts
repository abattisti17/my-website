/**
 * Security Configuration
 * Content Security Policy and other security headers
 */

/**
 * Content Security Policy configuration
 * Prevents XSS attacks and other security vulnerabilities
 */
export const CSP_CONFIG = {
  // Allow scripts from self and Supabase
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Vite in development
    "'unsafe-eval'", // Required for Vite in development
    "https://*.supabase.co",
    "https://cdn.jsdelivr.net" // For any CDN dependencies
  ],

  // Allow styles from self and inline styles
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for CSS-in-JS and Tailwind
    "https://fonts.googleapis.com"
  ],

  // Allow images from self, data URLs, and Supabase storage
  'img-src': [
    "'self'",
    "data:",
    "blob:",
    "https://*.supabase.co",
    "https://images.unsplash.com" // If using Unsplash for placeholders
  ],

  // Allow fonts from self and Google Fonts
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com"
  ],

  // Allow connections to self and Supabase
  'connect-src': [
    "'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co", // WebSocket connections for realtime
    "https://api.github.com" // If using GitHub API
  ],

  // Restrict object and embed sources
  'object-src': ["'none'"],
  'embed-src': ["'none'"],

  // Base URI restrictions
  'base-uri': ["'self'"],

  // Form action restrictions
  'form-action': ["'self'"],

  // Frame restrictions
  'frame-ancestors': ["'none'"],

  // Upgrade insecure requests in production
  'upgrade-insecure-requests': []
}

/**
 * Generate CSP header string
 */
export function generateCSPHeader(): string {
  const directives = Object.entries(CSP_CONFIG)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive
      }
      return `${directive} ${sources.join(' ')}`
    })
    .join('; ')

  return directives
}

/**
 * Security headers for production
 */
export const SECURITY_HEADERS = {
  // Content Security Policy
  'Content-Security-Policy': generateCSPHeader(),

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // XSS Protection (legacy browsers)
  'X-XSS-Protection': '1; mode=block',

  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=(self)',
    'payment=()'
  ].join(', ')
}

/**
 * Apply security headers to HTML
 * For use in index.html or server configuration
 */
export function getSecurityMetaTags(): string {
  return Object.entries(SECURITY_HEADERS)
    .map(([name, content]) => `<meta http-equiv="${name}" content="${content}">`)
    .join('\n')
}

/**
 * Sanitize user input to prevent XSS
 * Enhanced version of our existing sanitization
 */
export function sanitizeUserInput(input: string | null | undefined): string {
  if (input === null || input === undefined) return ''
  
  return input
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove data: URLs (except images)
    .replace(/data:(?!image\/)/gi, '')
    // Trim whitespace
    .trim()
}

/**
 * Validate URLs to prevent open redirect attacks
 */
export function isValidRedirectURL(url: string, baseOrigin?: string): boolean {
  try {
    const origin = baseOrigin || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173')
    const parsed = new URL(url, origin)
    
    // Only allow same-origin redirects
    return parsed.origin === origin
  } catch {
    // Invalid URL
    return false
  }
}

/**
 * Rate limiting helper (client-side)
 * Prevents spam submissions
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map()
  private maxAttempts: number
  private windowMs: number
  
  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
  }

  isAllowed(key: string): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(key) || []
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs)
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false
    }

    // Record this attempt
    recentAttempts.push(now)
    this.attempts.set(key, recentAttempts)
    
    return true
  }

  reset(key: string): void {
    this.attempts.delete(key)
  }
}

/**
 * Global rate limiter instances
 */
export const formSubmissionLimiter = new RateLimiter(3, 60000) // 3 submissions per minute
export const authLimiter = new RateLimiter(5, 300000) // 5 auth attempts per 5 minutes
