/**
 * Reusable form management hook
 * Eliminates repetitive form state and validation patterns
 */

import { useState, useCallback } from 'react'
import { validateRequired, sanitizeInput } from '../lib/devAccelerators'
import { formSubmissionLimiter } from '../lib/security'

interface UseFormOptions<T> {
  initialValues: T
  requiredFields?: string[]
  onSubmit: (data: T) => Promise<void>
  transform?: (data: T) => T
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  requiredFields = [],
  onSubmit,
  transform
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }))
    }
  }, [errors])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const processedValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : sanitizeInput(value)
    
    handleChange(name as keyof T, processedValue)
  }, [handleChange])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setIsSubmitting(false)
  }, [initialValues])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Rate limiting - prevent spam submissions
    const formId = `form-${Date.now()}`
    if (!formSubmissionLimiter.isAllowed(formId)) {
      setErrors({ _form: 'Too many submissions. Please wait a moment.' })
      return
    }
    
    // Validate required fields
    const validationError = validateRequired(values, requiredFields)
    if (validationError) {
      const field = requiredFields.find(f => !values[f] || String(values[f]).trim() === '')
      if (field) {
        setErrors({ [field]: validationError })
      }
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const finalData = transform ? transform(values) : values
      await onSubmit(finalData)
    } catch (error: any) {
      console.error('Form submission error:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [values, requiredFields, onSubmit, transform])

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleInputChange,
    handleSubmit,
    reset,
    setValues
  }
}
