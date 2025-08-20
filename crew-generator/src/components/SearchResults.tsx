import React, { memo, useMemo } from 'react'
import type { SearchResult } from '../lib/searchService'
import { Badge } from '@/components/ui/badge'
import { Stack } from './design-system'

export interface SearchResultsProps<T> {
  results: SearchResult<T>[]
  query: string
  renderItem: (item: T, matches?: any[]) => React.ReactNode
  emptyMessage?: string
  showScores?: boolean
  className?: string
  maxResults?: number
}

const SearchResults = memo(function SearchResults<T>({
  results,
  query,
  renderItem,
  emptyMessage = "No results found",
  showScores = false,
  className = "",
  maxResults
}: SearchResultsProps<T>) {
  // Memoize processed results for performance
  const displayResults = useMemo(() => {
    return maxResults ? results.slice(0, maxResults) : results
  }, [results, maxResults])

  if (!query.trim()) {
    return null
  }

  if (results.length === 0) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${className}`}>
        <div className="text-lg mb-2">🔍</div>
        <div>{emptyMessage}</div>
        <div className="text-sm mt-1">
          Try adjusting your search terms or check for typos
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Results header */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>
          {results.length} result{results.length !== 1 ? 's' : ''} 
          {query && ` for "${query}"`}
        </span>
        {maxResults && results.length > maxResults && (
          <Badge variant="secondary" className="text-xs">
            Showing {maxResults} of {results.length}
          </Badge>
        )}
      </div>

      {/* Results list */}
      <Stack spacing="md">
        {displayResults.map((result, index) => (
          <div
            key={`${result.refIndex}-${index}`}
            className="relative group"
          >
            {/* Score badge for debugging/admin */}
            {showScores && result.score !== undefined && (
              <Badge 
                variant="outline" 
                className="absolute top-2 right-2 text-xs opacity-50 group-hover:opacity-100 transition-opacity"
              >
                {Math.round((1 - result.score) * 100)}%
              </Badge>
            )}
            
            {/* Render the actual item */}
            {renderItem(result.item, result.matches ? [...result.matches] : undefined)}
          </div>
        ))}
      </Stack>

      {/* Load more indicator */}
      {maxResults && results.length > maxResults && (
        <div className="text-center pt-4">
          <Badge variant="secondary" className="text-xs">
            {results.length - maxResults} more results available
          </Badge>
        </div>
      )}
    </div>
  )
}

/**
 * Utility function to highlight search matches in text
 */
export function highlightMatches(
  text: string, 
  matches?: any[], 
  className = "bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
): React.ReactNode {
  if (!matches || matches.length === 0) {
    return text
  }

  // Find the match for this specific text
  const match = matches.find(m => m.value === text)
  if (!match || !match.indices) {
    return text
  }

  const indices = match.indices
  const result: React.ReactNode[] = []
  let lastIndex = 0

  indices.forEach(([start, end]: [number, number], i: number) => {
    // Add text before the match
    if (start > lastIndex) {
      result.push(text.slice(lastIndex, start))
    }
    
    // Add highlighted match
    result.push(
      <span key={i} className={className}>
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
})

export default SearchResults
