import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button Component - Design Token Integration
 * 
 * This component uses design tokens from design-tokens.css for all sizing.
 * Size variants (sm, md, lg, default) map to CSS custom properties:
 * 
 * - height: --button-height-{size}
 * - padding-x: --button-padding-x-{size}  
 * - padding-y: --button-padding-y-{size}
 * - min-width: --button-min-width-{size}
 * 
 * To change button sizes globally, update the tokens in design-tokens.css.
 * Never hardcode sizes in className - always use the size prop.
 * 
 * @example
 * <Button size="lg">Large Button</Button>
 * <Button size="default" fullWidth>Default Full Width</Button>
 */

const buttonVariants = cva(
  // Base button styles using design tokens
  "flex items-center justify-center gap-3 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-auto max-w-full touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-primary text-primary bg-background shadow-sm hover:bg-primary hover:text-primary-foreground dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-primary-foreground",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
      },
      size: {
        sm: "h-[var(--button-height-sm)] px-[var(--button-padding-x-sm)] py-[var(--button-padding-y-sm)] min-w-[var(--button-min-width-sm)]",
        md: "h-[var(--button-height-md)] px-[var(--button-padding-x-md)] py-[var(--button-padding-y-md)] min-w-[var(--button-min-width-md)]",
        lg: "h-[var(--button-height-lg)] px-[var(--button-padding-x-lg)] py-[var(--button-padding-y-lg)] min-w-[var(--button-min-width-lg)]",
        default: "h-[var(--button-height-default)] px-[var(--button-padding-x-default)] py-[var(--button-padding-y-default)] min-w-[var(--button-min-width-default)]",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  fullWidth,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
