import React, { memo, useMemo } from 'react'
import type { SearchResult } from '../lib/searchService'
import { Badge } from '@/components/ui/badge'
import { Stack } from './design-system'
import type { HighlightMatch } from '../lib/constants'

export interface SearchResultsProps<T> {
  results: SearchResult<T>[]
  query: string
  renderItem: (item: T, matches?: HighlightMatch[]) => React.ReactNode
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
            {renderItem(result.item)}
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
})

export default SearchResults
