import React from 'react'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  /**
   * Whether to include horizontal padding (left/right)
   * @default true
   */
  includePaddingX?: boolean
  /**
   * Whether to include vertical padding (top/bottom)
   * @default true
   */
  includePaddingY?: boolean
  /**
   * Whether to include safe scroll content class for bottom nav clearance
   * @default true
   */
  includeSafeScroll?: boolean
  /**
   * Maximum width container
   * @default true
   */
  includeMaxWidth?: boolean
  /**
   * Custom padding override - use for special cases
   */
  customPadding?: string
}

/**
 * PageLayout - Consistent page spacing component
 * 
 * Provides enterprise-grade consistent spacing across all pages using design tokens.
 * Handles responsive padding, safe areas, and bottom navigation clearance.
 * 
 * @example
 * ```tsx
 * // Standard page layout
 * <PageLayout>
 *   <h1>Page Title</h1>
 *   <p>Page content...</p>
 * </PageLayout>
 * 
 * // Custom layout without vertical padding
 * <PageLayout includePaddingY={false}>
 *   <FullWidthHero />
 *   <div className="page-padding-x">Content with only horizontal padding</div>
 * </PageLayout>
 * ```
 */
export function PageLayout({
  children,
  className,
  includePaddingX = true,
  includePaddingY = true,
  includeSafeScroll = true,
  includeMaxWidth = true,
  customPadding
}: PageLayoutProps) {
  const paddingClasses = customPadding ? customPadding : cn(
    includePaddingX && includePaddingY && 'page-padding',
    includePaddingX && !includePaddingY && 'page-padding-x',
    !includePaddingX && includePaddingY && 'page-padding-y'
  )

  return (
    <div
      className={cn(
        'min-h-screen-dynamic',
        paddingClasses,
        includeSafeScroll && 'safe-scroll-content',
        includeMaxWidth && 'max-w-7xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * PageSection - Consistent section spacing within pages
 * 
 * Use for major sections within a page that need consistent spacing.
 */
interface PageSectionProps {
  children: React.ReactNode
  className?: string
  /**
   * Section spacing size
   * @default 'md'
   */
  spacing?: 'sm' | 'md' | 'lg'
}

export function PageSection({
  children,
  className,
  spacing = 'md'
}: PageSectionProps) {
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8'
  }

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  )
}

/**
 * PageHeader - Consistent page header component
 * 
 * Use at the top of pages for consistent title and subtitle styling.
 */
interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  children,
  className
}: PageHeaderProps) {
  return (
    <header className={cn('space-y-4 mb-8', className)}>
      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </header>
  )
}
