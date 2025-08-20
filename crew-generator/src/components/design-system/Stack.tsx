import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface StackProps {
  /**
   * Vertical spacing between child elements
   * - xs: 8px (--space-2) - Tight spacing for related items
   * - sm: 16px (--space-4) - Default spacing for list items
   * - md: 24px (--space-6) - Standard component spacing
   * - lg: 32px (--space-8) - Section spacing
   * - xl: 48px (--space-12) - Major section spacing
   * - 2xl: 64px (--space-16) - Page section spacing
   */
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  
  /**
   * Custom CSS classes to apply to the stack container
   */
  className?: string
  
  /**
   * Child elements to be stacked with consistent spacing
   */
  children: ReactNode
  
  /**
   * HTML element type for the stack container
   * @default 'div'
   */
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'nav'
}

/**
 * Stack Component - Professional vertical spacing system
 * 
 * ARCHITECTURE DECISION: Uses CSS Flexbox `gap` property with design tokens
 * instead of Tailwind utilities for maximum reliability and future-proofing.
 * 
 * WHY THIS APPROACH:
 * - ✅ Tailwind v4 Compatible: No dependency on utility generation
 * - ✅ Modern CSS Standards: Uses CSS Flexbox gap (industry standard)
 * - ✅ Design Token Driven: Direct integration with --space-* variables
 * - ✅ Framework Agnostic: Works regardless of CSS framework changes
 * - ✅ Performance: No CSS bloat from unused utilities
 * - ✅ Enterprise Grade: Same approach used by GitHub, Shopify, Atlassian
 * 
 * BEST PRACTICE: Use this pattern for all design system spacing components.
 * Continue using Tailwind for layout, colors, and styling utilities.
 * 
 * Provides consistent vertical spacing between child elements using design tokens.
 * Follows industry best practices from Material Design, Human Interface Guidelines,
 * and enterprise design systems like Atlassian, Shopify, and GitHub Primer.
 * 
 * @example
 * ```tsx
 * // Basic usage with default medium spacing
 * <Stack>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Stack>
 * 
 * // Custom spacing for different contexts
 * <Stack spacing="sm">  // Tight spacing for list items
 *   <ListItem />
 *   <ListItem />
 * </Stack>
 * 
 * <Stack spacing="xl" as="section">  // Major section spacing
 *   <Hero />
 *   <Features />
 *   <Testimonials />
 * </Stack>
 * 
 * // Combine with Tailwind utilities for styling
 * <Stack spacing="lg" className="max-w-4xl mx-auto bg-card rounded-lg">
 *   <Card />
 *   <Card />
 * </Stack>
 * ```
 */
export function Stack({ 
  spacing = 'md', 
  className, 
  children, 
  as: Component = 'div' 
}: StackProps) {
  // IMPLEMENTATION NOTE: We use CSS-in-JS with design tokens instead of Tailwind utilities
  // This approach is more reliable across Tailwind versions and provides better performance
  const spacingMap = {
    xs: 'stack-xs',   // 8px  - Tight spacing (--space-2)
    sm: 'stack-sm',   // 16px - List items (--space-4)
    md: 'stack-md',   // 24px - Components (--space-6)
    lg: 'stack-lg',   // 32px - Sections (--space-8)
    xl: 'stack-xl',   // 48px - Major sections (--space-12)
    '2xl': 'stack-2xl' // 64px - Page sections (--space-16)
  }

  return (
    <Component 
      className={cn('stack-container', spacingMap[spacing], className)}
      style={{
        // CRITICAL: Use CSS Flexbox gap with design tokens for reliable spacing
        // This works regardless of Tailwind version and provides consistent results
        display: 'flex',
        flexDirection: 'column',
        gap: spacing === 'xs' ? 'var(--space-2)' :
             spacing === 'sm' ? 'var(--space-4)' :
             spacing === 'md' ? 'var(--space-6)' :
             spacing === 'lg' ? 'var(--space-8)' :
             spacing === 'xl' ? 'var(--space-12)' :
             'var(--space-16)'
      }}
    >
      {children}
    </Component>
  )
}

/**
 * Horizontal Stack Component - For horizontal layouts with consistent spacing
 * 
 * @example
 * ```tsx
 * <HStack spacing="md">
 *   <Button>Cancel</Button>
 *   <Button variant="primary">Save</Button>
 * </HStack>
 * ```
 */
export function HStack({ 
  spacing = 'md', 
  className, 
  children, 
  as: Component = 'div' 
}: StackProps) {
  return (
    <Component 
      className={cn('hstack-container flex items-center', className)}
      style={{
        gap: spacing === 'xs' ? 'var(--space-2)' :
             spacing === 'sm' ? 'var(--space-4)' :
             spacing === 'md' ? 'var(--space-6)' :
             spacing === 'lg' ? 'var(--space-8)' :
             spacing === 'xl' ? 'var(--space-12)' :
             'var(--space-16)'
      }}
    >
      {children}
    </Component>
  )
}
