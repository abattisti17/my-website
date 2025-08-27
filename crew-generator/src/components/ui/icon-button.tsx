import * as React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"
import { buttonVariants } from "./button"

/**
 * IconButton Component - Circular buttons for icons
 * 
 * A specialized button component for displaying icons in a circular format.
 * Extends the base Button component while maintaining design token integration.
 * 
 * Features:
 * - Perfect circular shape (width = height)
 * - Uses existing --button-height-* design tokens
 * - All Button props supported (variant, disabled, etc.)
 * - TypeScript enforced single child (icon)
 * 
 * @example
 * <IconButton size="md" variant="ghost">
 *   <Send className="h-4 w-4" />
 * </IconButton>
 * 
 * @example
 * <IconButton size="lg" onClick={handleSend}>
 *   <PlusIcon />
 * </IconButton>
 */

interface IconButtonProps extends Omit<React.ComponentProps<typeof Button>, 'children'> {
  /** 
   * Icon element to display. Should be a single React element (typically an icon).
   * Use appropriate icon sizing classes (e.g., h-4 w-4 for most icons).
   */
  children: React.ReactElement
  
  /** 
   * Button size - controls both width and height using design tokens.
   * - sm: 36x36px (--button-height-sm)
   * - md: 48x48px (--button-height-md) 
   * - lg: 56x56px (--button-height-lg)
   */
  size?: 'sm' | 'md' | 'lg'
  
  /**
   * Button variant - inherits from base Button component
   */
  variant?: VariantProps<typeof buttonVariants>['variant']
}

export function IconButton({ 
  children, 
  size = 'md', 
  variant = 'ghost',
  className, 
  ...props 
}: IconButtonProps) {
  return (
    <Button
      {...props}
      variant={variant}
      className={cn(
        // Base circular styling
        "rounded-full p-0 shrink-0",
        
        // Size variants using existing design tokens
        // Sets both width and height to button height tokens for perfect circles
        size === 'sm' && "h-[var(--button-height-sm)] w-[var(--button-height-sm)]",
        size === 'md' && "h-[var(--button-height-md)] w-[var(--button-height-md)]", 
        size === 'lg' && "h-[var(--button-height-lg)] w-[var(--button-height-lg)]",
        
        // Remove min-width constraint from base Button
        "min-w-0",
        
        className
      )}
    >
      {children}
    </Button>
  )
}

export type { IconButtonProps }
