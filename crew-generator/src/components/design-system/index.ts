// Design System Components
// Industry-standard reusable components following Material Design and iOS HIG patterns
//
// ARCHITECTURE PHILOSOPHY:
// - Spacing Components (Stack, HStack): Use CSS Flexbox gap + design tokens (not Tailwind utilities)
// - Styling Components: Use Tailwind utilities for colors, layout, borders, etc.
// - Design Tokens: All spacing values come from CSS variables (--space-*) in design-tokens.css
//
// WHY THIS HYBRID APPROACH:
// ✅ Reliable across framework updates (Tailwind v3 → v4 compatibility)
// ✅ Performance optimized (no unused utility generation)
// ✅ Enterprise-grade (same pattern as GitHub, Shopify, Atlassian)
// ✅ Maintainable (change spacing in one place - design tokens)

export { FeatureCard } from './FeatureCard'
export { PageHeader } from './PageHeader'
export { PageLayout, PageSection } from './PageLayout'
export { Stack, HStack } from './Stack'
export { EmptyState } from './EmptyState'
export { LoadingSpinner } from './LoadingSpinner'
export { StatusBadge } from './StatusBadge'
export { FloatingLabel } from './FloatingLabel'
export { FormField } from './FormField'
export { ModernButton } from './ModernButton'
export { ModernInput } from './ModernInput'
export { CodeBlock } from './CodeBlock'
export { CardList } from './CardList'
export { PodCard } from './PodCard'
export { PhotoCard } from './PhotoCard'
export { ColorTokenCard } from './ColorTokenCard'
export { SpacingTokenCard } from './SpacingTokenCard'
