import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Card Component - Design Token Integration
 * 
 * Uses design tokens for consistent interior padding and spacing.
 * Interior padding ensures content never touches card borders.
 * 
 * Design Token Usage:
 * - padding: --space-6 (24px) - Interior padding on all sides
 * - gap: --space-6 (24px) - Internal spacing between elements
 * - border-radius: --radius-xl (12px) - Rounded corners
 * 
 * To change card padding globally, update --space-6 in design-tokens.css.
 * 
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *   </CardHeader>
 *   <CardContent>Content</CardContent>
 * </Card>
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        // Base styling with design tokens
        "bg-card text-card-foreground flex flex-col border shadow-sm",
        // Interior padding using design tokens - ensures content never touches borders
        "p-[var(--space-6)]",
        // Internal spacing between card elements
        "gap-[var(--space-6)]", 
        // Border radius using design tokens
        "rounded-[var(--radius-xl)]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        // Layout and spacing - no padding needed (handled by base Card)
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        // No padding needed - handled by base Card component
        // This allows CardContent to be purely semantic
        "",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        // Layout only - no padding needed (handled by base Card)
        "flex items-center [.border-t]:pt-6",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
