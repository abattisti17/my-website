/**
 * Development Accelerators - Simple utilities to eliminate refresh pain points
 * 
 * These utilities make development faster without complex TypeScript.
 * Focus: Eliminate the "lots of refreshing" issue you mentioned.
 */

import { toast } from 'sonner'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

// Types for better type safety
type SupabaseRecord = Record<string, unknown>
type QueryOptions = { column: string; value: unknown }

// Simple development logger
export const devLog = (label: string, data?: unknown) => {
  if (import.meta.env.DEV) {
    console.log(`🔧 ${label}:`, data)
  }
}

// Simple error logger with better messages
export const devError = (error: unknown, context?: string) => {
  if (import.meta.env.DEV) {
    console.error(`❌ ${context || 'Error'}:`, error)
  }
}

// Simple success logger
export const devSuccess = (message: string, data?: unknown) => {
  if (import.meta.env.DEV) {
    console.log(`✅ ${message}`, data)
  }
}

/**
 * Simple retry wrapper for Supabase operations
 * Eliminates most "need to refresh" scenarios
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  operationName = 'operation'
): Promise<T> {
  const maxRetries = 3
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation()
      
      if (attempt > 1) {
        devSuccess(`${operationName} succeeded on retry ${attempt}`)
        toast.dismiss('retry-toast')
      }
      
      return result
    } catch (error: any) {
      devError(error, `${operationName} attempt ${attempt}`)
      
      // Don't retry on certain errors
      if (error?.message?.includes('Invalid API key')) {
        throw error
      }
      
      // Last attempt - throw the error
      if (attempt === maxRetries) {
        toast.error(`${operationName} failed after ${maxRetries} attempts`)
        throw error
      }
      
      // Show retry toast on first failure
      if (attempt === 1) {
        toast.loading(`Connection issue, retrying ${operationName}...`, { 
          id: 'retry-toast' 
        })
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw new Error('Unexpected retry loop exit')
}

/**
 * Simple form validation helper
 * Prevents crashes from bad form data
 */
export function validateRequired(data: Record<string, unknown>, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    const value = data[field]
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${field} is required`
    }
  }
  return null
}

/**
 * Simple input sanitizer
 * Prevents basic XSS and data issues
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .slice(0, 500) // Limit length
}

/**
 * Enhanced Supabase helpers with retry
 * Drop-in replacements for common Supabase operations
 */
export const supabaseWithRetry = {
  async insert(supabase: SupabaseClient<Database>, table: string, data: SupabaseRecord) {
    devLog(`Inserting into ${table}`, data)
    
    return withRetry(async () => {
      const result = await supabase.from(table).insert(data).select().single()
      
      if (result.error) {
        devError(result.error, `insert into ${table}`)
        throw result.error
      }
      
      devSuccess(`Inserted into ${table}`, result.data)
      return result
    }, `insert into ${table}`)
  },

  async select(supabase: SupabaseClient<Database>, table: string, columns = '*', query?: QueryOptions) {
    devLog(`Selecting from ${table}`)
    
    return withRetry(async () => {
      let queryBuilder = supabase.from(table).select(columns)
      
      if (query) {
        queryBuilder = queryBuilder.eq(query.column, query.value)
      }
      
      // Add order and limit for events specifically
      if (table === 'events') {
        queryBuilder = queryBuilder
          .select('id, slug, artist, city, venue, date_utc')
          .order('date_utc', { ascending: true })
          .limit(10)
      }
      
      const result = await queryBuilder
      
      if (result.error) {
        devError(result.error, `select from ${table}`)
        throw result.error
      }
      
      devSuccess(`Selected from ${table}`, { count: result.data?.length })
      return result
    }, `select from ${table}`)
  },

  async signInWithOtp(supabase: SupabaseClient<Database>, email: string) {
    devLog('Signing in with OTP', { email })
    
    return withRetry(async () => {
      const result = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true }
      })
      
      if (result.error) {
        throw result.error
      }
      
      devSuccess('OTP sent successfully')
      return result
    }, 'sign in with OTP')
  }
}

/**
 * Simple form submission wrapper
 * Handles loading states and basic validation
 */
export function createFormHandler(onSubmit: (data: Record<string, string>) => Promise<void>) {
  return async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Get form data
    const formData = new FormData(e.currentTarget)
    const data: Record<string, string> = {}
    
    formData.forEach((value, key) => {
      data[key] = sanitizeInput(value.toString())
    })
    
    devLog('Form submission', data)
    
    try {
      await onSubmit(data)
      devSuccess('Form submitted successfully')
    } catch (error) {
      devError(error, 'Form submission')
      throw error
    }
  }
}

/**
 * Global error boundary helper
 * Shows user-friendly errors instead of white screens
 */
export function handleComponentError(error: Error, componentName: string) {
  devError(error, `${componentName} component error`)
  
  toast.error(`Something went wrong in ${componentName}. Please try refreshing.`, {
    action: {
      label: 'Refresh',
      onClick: () => window.location.reload()
    }
  })
}

// Make dev helpers available in console for debugging
if (import.meta.env.DEV && typeof window !== 'undefined') {
  Object.assign(window, { devLog, devError, devSuccess, withRetry })
  
  console.log('🛠️ Dev accelerators loaded. Available: devLog, devError, devSuccess, withRetry')
}
