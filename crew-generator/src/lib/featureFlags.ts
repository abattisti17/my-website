/**
 * Feature Flag Management
 * Environment-based feature toggles for safe rollout
 */

export type FeatureFlag = 
  | 'MESSAGES_UI' 
  | 'VIRTUALIZED_CHAT'
  | 'DRAFT_PERSISTENCE'
  | 'TYPING_INDICATORS'

type FeatureFlagConfig = {
  [K in FeatureFlag]: {
    defaultValue: boolean
    description: string
  }
}

const FEATURE_FLAGS: FeatureFlagConfig = {
  MESSAGES_UI: {
    defaultValue: true,
    description: 'New message UI components (v2)'
  },
  VIRTUALIZED_CHAT: {
    defaultValue: false,
    description: 'Virtualized message list for performance'
  },
  DRAFT_PERSISTENCE: {
    defaultValue: true,
    description: 'Save draft messages to localStorage'
  },
  TYPING_INDICATORS: {
    defaultValue: false,
    description: 'Show typing indicators in chat'
  }
}

/**
 * Check if a feature flag is enabled
 * Priority: Environment Variable > Local Storage > Default Value
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  // 1. Check environment variables (highest priority)
  const envKey = `VITE_${flag}`
  const envValue = import.meta.env[envKey]
  if (envValue !== undefined) {
    return envValue === 'true' || envValue === '1' || envValue === 'v2'
  }

  // 2. Check localStorage for dev overrides
  if (import.meta.env.DEV) {
    try {
      const localValue = localStorage.getItem(`feature_flag_${flag}`)
      if (localValue !== null) {
        return localValue === 'true'
      }
    } catch {
      // Silent fail if localStorage unavailable
    }
  }

  // 3. Use default value
  return FEATURE_FLAGS[flag].defaultValue
}

/**
 * Toggle a feature flag (dev mode only)
 * Useful for testing and development
 */
export function toggleFeatureFlag(flag: FeatureFlag): boolean {
  if (!import.meta.env.DEV) {
    console.warn('Feature flag toggling only available in development')
    return isFeatureEnabled(flag)
  }

  try {
    const currentValue = isFeatureEnabled(flag)
    const newValue = !currentValue
    localStorage.setItem(`feature_flag_${flag}`, newValue.toString())
    console.log(`🚩 Feature flag ${flag} toggled to:`, newValue)
    return newValue
  } catch (error) {
    console.warn('Failed to toggle feature flag:', error)
    return isFeatureEnabled(flag)
  }
}

/**
 * Get all feature flag states (dev mode only)
 */
export function getAllFeatureFlags(): Record<FeatureFlag, boolean> {
  const flags = {} as Record<FeatureFlag, boolean>
  
  for (const flag of Object.keys(FEATURE_FLAGS) as FeatureFlag[]) {
    flags[flag] = isFeatureEnabled(flag)
  }
  
  return flags
}

/**
 * Reset all feature flags to defaults (dev mode only)
 */
export function resetFeatureFlags(): void {
  if (!import.meta.env.DEV) {
    console.warn('Feature flag reset only available in development')
    return
  }

  try {
    for (const flag of Object.keys(FEATURE_FLAGS) as FeatureFlag[]) {
      localStorage.removeItem(`feature_flag_${flag}`)
    }
    console.log('🚩 All feature flags reset to defaults')
  } catch (error) {
    console.warn('Failed to reset feature flags:', error)
  }
}

// Export feature flag configuration for documentation
export { FEATURE_FLAGS }
