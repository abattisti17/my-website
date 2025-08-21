import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDebounce } from '../hooks/useDebounce'

export interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  onClear?: () => void
  loading?: boolean
  debounceMs?: number
  showClearButton?: boolean
  className?: string
  autoFocus?: boolean
  suggestions?: string[]
  onSuggestionSelect?: (suggestion: string) => void
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  onClear,
  loading = false,
  debounceMs = 300,
  showClearButton = true,
  className = "",
  autoFocus = false,
  suggestions = [],
  onSuggestionSelect
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Debounce the search query for performance
  const debouncedQuery = useDebounce(query, debounceMs)

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery]) // Remove onSearch from dependencies to prevent focus loss

  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setShowSuggestions(value.length > 0 && suggestions.length > 0)
    setSelectedSuggestionIndex(-1)
  }, [])

  const handleClear = useCallback(() => {
    setQuery('')
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    onClear?.()
    inputRef.current?.focus()
  }, [onClear])

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    onSuggestionSelect?.(suggestion)
    inputRef.current?.focus()
  }, [onSuggestionSelect])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        break
    }
  }, [showSuggestions, suggestions, selectedSuggestionIndex, handleSuggestionClick])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        {/* Search icon - using design system classes */}
        <Search className="search-icon-left h-4 w-4 text-muted-foreground" />
        
        {/* Input field with design system search styling */}
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(query.length > 0 && suggestions.length > 0)}
          className="search-input touch-target w-full"
          disabled={loading}
        />

        {/* Right side icons - using design system positioning */}
        {loading && (
          <Loader2 className="search-icon-right h-4 w-4 animate-spin text-muted-foreground" />
        )}
        
        {showClearButton && query && !loading && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            className="search-icon-right h-6 w-6 p-0 hover:bg-muted/80 rounded-full touch-target-sm"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                index === selectedSuggestionIndex ? 'bg-muted' : ''
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
