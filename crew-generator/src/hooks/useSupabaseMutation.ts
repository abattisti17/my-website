/**
 * Reusable Supabase mutation hook
 * Handles create, update, delete operations with consistent loading states
 */

import { useState, useCallback } from 'react'
import { supabaseWithRetry, devLog, devError, devSuccess } from '../lib/devAccelerators'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

interface MutationOptions {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  successMessage?: string
  errorMessage?: string
}

export function useSupabaseMutation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const mutate = useCallback(async (
    operation: () => Promise<any>,
    options: MutationOptions = {}
  ) => {
    const {
      onSuccess,
      onError,
      successMessage,
      errorMessage = 'Operation failed. Please try again.'
    } = options

    setLoading(true)
    setError(null)

    try {
      const result = await operation()
      
      if (result.error) {
        throw result.error
      }

      onSuccess?.(result.data)
      
      if (successMessage) {
        toast.success(successMessage)
        devSuccess(successMessage, result.data)
      }

      return result
    } catch (err) {
      setError(err)
      onError?.(err)
      toast.error(errorMessage)
      devError(err, 'mutation')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Convenience methods for common operations
  const insert = useCallback((table: string, data: any, options?: MutationOptions) => {
    return mutate(
      () => supabaseWithRetry.insert(supabase, table, data),
      {
        successMessage: `${table.slice(0, -1)} created successfully!`,
        ...options
      }
    )
  }, [mutate])

  const update = useCallback((table: string, id: string, data: any, options?: MutationOptions) => {
    return mutate(
      async () => {
        const result = await supabase
          .from(table)
          .update(data)
          .eq('id', id)
          .select()
          .single()
        return result
      },
      {
        successMessage: `${table.slice(0, -1)} updated successfully!`,
        ...options
      }
    )
  }, [mutate])

  const remove = useCallback((table: string, id: string, options?: MutationOptions) => {
    return mutate(
      async () => {
        const result = await supabase
          .from(table)
          .delete()
          .eq('id', id)
        return result
      },
      {
        successMessage: `${table.slice(0, -1)} deleted successfully!`,
        ...options
      }
    )
  }, [mutate])

  return {
    loading,
    error,
    mutate,
    insert,
    update,
    remove
  }
}
