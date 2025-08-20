/**
 * Simplified Supabase data fetching hook
 * Eliminates repetitive loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { devError } from '../lib/devAccelerators'

interface UseSupabaseQueryOptions {
  enabled?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export function useSupabaseQuery<T = any>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  dependencies: any[] = [],
  options: UseSupabaseQueryOptions = {}
) {
  const { enabled = true, onSuccess, onError } = options
  
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const execute = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const result = await queryFn()
      
      if (result.error) {
        throw result.error
      }

      setData(result.data)
      onSuccess?.(result.data)
    } catch (err) {
      setError(err)
      onError?.(err)
      devError(err, 'useSupabaseQuery')
    } finally {
      setLoading(false)
    }
  }, [queryFn, enabled, onSuccess, onError])

  useEffect(() => {
    execute()
  }, [execute, ...dependencies])

  const refetch = useCallback(() => {
    execute()
  }, [execute])

  return {
    data,
    loading,
    error,
    refetch
  }
}

/**
 * Hook for Supabase single record queries
 */
export function useSupabaseRecord<T = any>(
  table: string,
  id: string | null,
  options: {
    select?: string
    enabled?: boolean
  } = {}
) {
  const { select = '*', enabled = true } = options

  return useSupabaseQuery<T>(
    async () => {
      if (!id) return { data: null, error: null }
      
      return await supabase
        .from(table)
        .select(select)
        .eq('id', id)
        .single()
    },
    [table, id, select],
    { enabled: enabled && !!id }
  )
}
