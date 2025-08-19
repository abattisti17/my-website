import { supabase } from './supabase'
import { handleError, showSuccess } from './errorHandling'

export type ReportTargetType = 'post' | 'message' | 'media' | 'profile'

interface SubmitReportParams {
  targetType: ReportTargetType
  targetId: string
  reason?: string
}

/**
 * Submit a report for content moderation
 */
export async function submitReport({ targetType, targetId, reason }: SubmitReportParams): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      handleError(new Error('Not authenticated'), 'submitting report')
      return false
    }

    const { error } = await supabase
      .from('reports')
      .insert({
        reporter: user.id,
        target_type: targetType,
        target_id: targetId,
        reason: reason?.trim() || null
      })

    if (error) {
      handleError(error, 'submitting report')
      return false
    }

    showSuccess('Thanks for the report. We\'ll review it shortly.')
    return true
    
  } catch (error) {
    handleError(error, 'submitting report')
    return false
  }
}

/**
 * Check if current user has already reported this content
 */
export async function hasUserReported(targetType: ReportTargetType, targetId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false

    const { data, error } = await supabase
      .from('reports')
      .select('id')
      .eq('reporter', user.id)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking report status:', error)
      return false
    }

    return !!data
    
  } catch (error) {
    console.error('Error checking report status:', error)
    return false
  }
}
