import Fuse, { type FuseResult } from 'fuse.js'
import type { IFuseOptions } from 'fuse.js'

/**
 * Enterprise-grade search service with fuzzy matching, typo tolerance, and ranking
 * Supports multiple search strategies and can be used across different data types
 */

export interface SearchableItem {
  id: string | number
  [key: string]: any
}

export interface SearchConfig<T> {
  keys: (keyof T | { name: keyof T; weight?: number })[]
  threshold?: number // 0.0 = perfect match, 1.0 = match anything
  includeScore?: boolean
  includeMatches?: boolean
  minMatchCharLength?: number
  shouldSort?: boolean
  findAllMatches?: boolean
  location?: number // where in the text to start looking
  distance?: number // how far from location to search
}

export interface SearchResult<T> {
  item: T
  score?: number
  matches?: FuseResult<T>['matches']
  refIndex: number
}

// Re-export for better compatibility
export type { SearchResult as SearchResultType }

export class SearchService<T extends SearchableItem> {
  private fuse: Fuse<T>
  private originalData: T[]
  private config: SearchConfig<T>

  constructor(data: T[], config: SearchConfig<T>) {
    this.originalData = data
    this.config = {
      // Enterprise defaults - optimized for user experience
      threshold: 0.4, // Allow some typos but not too fuzzy
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 1,
      shouldSort: true,
      findAllMatches: false,
      location: 0,
      distance: 100,
      ...config
    }

    this.fuse = new Fuse(data, this.config as IFuseOptions<T>)
  }

  /**
   * Perform fuzzy search with enterprise features
   */
  search(query: string, limit?: number): SearchResult<T>[] {
    if (!query.trim()) {
      return this.originalData.slice(0, limit).map((item, index) => ({
        item,
        score: 0,
        refIndex: index
      }))
    }

    const results = this.fuse.search(query, { limit: limit || 10 })
    return results.map(result => ({
      item: result.item,
      score: result.score,
      matches: result.matches,
      refIndex: result.refIndex
    }))
  }

  /**
   * Update the search index with new data
   */
  updateData(newData: T[]): void {
    this.originalData = newData
    this.fuse.setCollection(newData)
  }

  /**
   * Add items to the search index
   */
  addItems(items: T[]): void {
    this.originalData = [...this.originalData, ...items]
    this.fuse.setCollection(this.originalData)
  }

  /**
   * Remove items from the search index
   */
  removeItems(predicate: (item: T) => boolean): void {
    this.originalData = this.originalData.filter(item => !predicate(item))
    this.fuse.setCollection(this.originalData)
  }

  /**
   * Get all original data
   */
  getAllItems(): T[] {
    return this.originalData
  }

  /**
   * Get search suggestions based on partial input
   */
  getSuggestions(query: string, maxSuggestions: number = 5): string[] {
    if (!query.trim()) return []

    const results = this.search(query, maxSuggestions * 2)
    const suggestions = new Set<string>()

    results.forEach(result => {
      if (result.matches) {
        result.matches.forEach(match => {
          if (match.value && suggestions.size < maxSuggestions) {
            suggestions.add(match.value)
          }
        })
      }
    })

    return Array.from(suggestions).slice(0, maxSuggestions)
  }
}



/**
 * Pre-configured search services for common use cases
 */

// Events search configuration
export const createEventsSearchService = (events: any[]) => {
  return new SearchService(events, {
    keys: [
      { name: 'artist', weight: 0.7 },
      { name: 'city', weight: 0.5 },
      { name: 'venue', weight: 0.3 },
      { name: 'slug', weight: 0.2 }
    ],
    threshold: 0.3, // More strict for events
    minMatchCharLength: 2
  })
}

// Chats/Pods search configuration  
export const createChatsSearchService = (chats: any[]) => {
  return new SearchService(chats, {
    keys: [
      { name: 'name', weight: 0.8 },
      { name: 'events.artist', weight: 0.6 },
      { name: 'events.city', weight: 0.4 }
    ],
    threshold: 0.4, // Allow more flexibility for chat names
    minMatchCharLength: 1
  })
}

// Generic search service factory
export const createSearchService = <T extends SearchableItem>(
  data: T[], 
  config: SearchConfig<T>
) => {
  return new SearchService(data, config)
}
