/**
 * Application constants and utilities
 * Separated from component files to avoid Fast Refresh issues
 */

import React from 'react'

// Theme utilities
export const THEME_CONFIG = {
  STORAGE_KEY: 'vite-ui-theme',
  DEFAULT_THEME: 'system' as const,
  THEMES: ['dark', 'light', 'system'] as const
} as const

export type Theme = (typeof THEME_CONFIG.THEMES)[number]

// Badge variants  
export const BADGE_VARIANTS = {
  default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
  outline: "text-foreground"
} as const

// Button variants
export const BUTTON_VARIANTS = {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline"
} as const

// Form field utilities
export const FORM_FIELD_PROPS = {
  formItemClassName: "space-y-2",
  formLabelClassName: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  formControlClassName: "",
  formDescriptionClassName: "text-sm text-muted-foreground",
  formMessageClassName: "text-sm font-medium text-destructive"
} as const

// Search highlighting utility
export interface HighlightMatch {
  value: string
  indices: [number, number][]
}

export function isHighlightMatch(match: unknown): match is HighlightMatch {
  return typeof match === 'object' && 
         match !== null && 
         'value' in match && 
         'indices' in match &&
         typeof (match as HighlightMatch).value === 'string' &&
         Array.isArray((match as HighlightMatch).indices)
}

/**
 * Utility function to highlight search matches in text
 */
export function highlightMatches(
  text: string, 
  matches?: HighlightMatch[], 
  className = "bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
): React.ReactNode {
  if (!matches || matches.length === 0) {
    return text
  }

  // Find the match for this specific text
  const match = matches.find(m => isHighlightMatch(m) && m.value === text)
  if (!match || !match.indices.length) {
    return text
  }

  const result: React.ReactNode[] = []
  let lastIndex = 0

  // Sort indices by start position
  const sortedIndices = [...match.indices].sort((a, b) => a[0] - b[0])

  sortedIndices.forEach(([start, end], index) => {
    // Add text before the match
    if (start > lastIndex) {
      result.push(text.slice(lastIndex, start))
    }
    
    // Add highlighted match
    result.push(
      <span key={index} className={className}>
        {text.slice(start, end + 1)}
      </span>
    )
    
    lastIndex = end + 1
  })

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex))
  }

  return result.length > 0 ? result : text
}
