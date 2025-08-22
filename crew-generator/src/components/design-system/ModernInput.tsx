import * as React from "react"
import { cn } from "@/lib/utils"

interface ModernInputProps extends React.ComponentProps<"input"> {
  error?: boolean
}

/**
 * ModernInput - Design System Input Component
 * 
 * Uses design tokens for consistent sizing across all forms.
 * Bypasses the base Input component which has hardcoded h-9 (36px).
 * 
 * Design Token Integration:
 * - height: --input-height-default (56px)
 * - padding-x: --input-padding-x (16px)
 * - padding-y: --input-padding-y (12px)
 * 
 * Always use this component in forms instead of the base Input.
 * To change input sizes globally, update tokens in design-tokens.css.
 * 
 * @example
 * <ModernInput placeholder="Enter text" />
 * <ModernInput error={true} />
 */
export const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          // Base styling using design tokens
          "h-[var(--input-height-default)] w-full text-base rounded-2xl px-[var(--input-padding-x)] py-[var(--input-padding-y)]",
          // Border and background using design tokens
          "border border-border bg-background",
          // Focus states
          "focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none",
          // Transitions
          "transition-colors duration-200",
          // Placeholder styling
          "placeholder:text-muted-foreground",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Error state
          error && "border-destructive focus:border-destructive focus:ring-destructive",
          className
        )}
        {...props}
      />
    )
  }
)

ModernInput.displayName = "ModernInput"
