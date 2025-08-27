import { Stack } from './Stack'
import { EmptyState } from './EmptyState'
import { LoadingSpinner } from './LoadingSpinner'
import { cn } from '@/lib/utils'

interface CardListProps<T> {
  /** Array of data items to render as cards */
  items: T[]
  /** Function to render each item as a card component */
  renderCard: (item: T, index: number) => React.ReactNode
  /** Loading state */
  loading?: boolean
  /** Empty state configuration */
  emptyState?: {
    title?: string
    message?: string
    icon?: React.ReactNode
    action?: React.ReactNode
  }
  /** Spacing between cards - uses Stack spacing tokens */
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /** Layout type */
  layout?: 'stack' | 'grid'
  /** Grid configuration (only used when layout="grid") */
  gridConfig?: {
    cols?: 1 | 2 | 3 | 4
    gap?: 'sm' | 'md' | 'lg'
  }
  /** Additional CSS classes */
  className?: string
  /** Test ID for testing */
  testId?: string
}

/**
 * CardList - Generic Card List Component
 * 
 * A reusable component for rendering lists of cards with consistent spacing,
 * loading states, and empty states. Follows SaaS design system patterns.
 * 
 * Design Token Integration:
 * - Uses Stack component for consistent spacing
 * - Supports both vertical (stack) and grid layouts
 * - All spacing controlled by design tokens
 * 
 * @example
 * // Event list
 * <CardList
 *   items={events}
 *   renderCard={(event) => <EventCard event={event} />}
 *   spacing="sm"
 *   emptyState={{
 *     title: "No events yet",
 *     message: "Check back soon for upcoming events!"
 *   }}
 * />
 * 
 * @example
 * // Pod grid
 * <CardList
 *   items={pods}
 *   renderCard={(pod) => <PodCard pod={pod} />}
 *   layout="grid"
 *   gridConfig={{ cols: 2, gap: "md" }}
 *   loading={loading}
 * />
 */
export function CardList<T>({
  items,
  renderCard,
  loading = false,
  emptyState,
  spacing = 'md',
  layout = 'stack',
  gridConfig = { cols: 2, gap: 'md' },
  className,
  testId
}: CardListProps<T>) {
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  // Empty state
  if (items.length === 0) {
    if (emptyState) {
      return (
        <EmptyState
          title={emptyState.title || "No items"}
          description={emptyState.message || "No items to display"}
          icon={emptyState.icon}
          action={emptyState.action}
        />
      )
    }
    return null
  }

  // Grid layout
  if (layout === 'grid') {
    const gridClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }

    const gapClasses = {
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6'
    }

    return (
      <div 
        className={cn(
          'grid',
          gridClasses[gridConfig.cols || 2],
          gapClasses[gridConfig.gap || 'md'],
          className
        )}
        data-testid={testId}
      >
        {items.map((item, index) => renderCard(item, index))}
      </div>
    )
  }

  // Stack layout (default)
  return (
    <Stack spacing={spacing} className={className} data-testid={testId}>
      {items.map((item, index) => renderCard(item, index))}
    </Stack>
  )
}



