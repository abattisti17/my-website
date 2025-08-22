import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { cn } from "@/lib/utils"

// SSR-safe check for document availability
const isClient = typeof window !== "undefined"

/**
 * Enhanced Drawer Root with SSR safety and better defaults
 * Handles portal mounting and body scroll lock properly
 */
const Drawer = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Root> & {
    /** Whether to scale background when drawer opens (default: true) */
    shouldScaleBackground?: boolean
    /** Custom portal container selector (default: document.body) */
    portalContainer?: string
  }
>(({ shouldScaleBackground = true, portalContainer, ...props }, _ref) => {
  // Ensure we only render on client to avoid SSR hydration mismatches
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted || !isClient) {
    return null
  }
  
  return (
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  )
})
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

/**
 * Enhanced Drawer Overlay with proper z-index and backdrop behavior
 */
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      // High z-index for proper stacking, backdrop blur for modern feel
      "fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm",
      // Smooth transitions
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

/**
 * Enhanced Drawer Content with responsive sizing and proper accessibility
 */
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
    /** Show drag handle (default: true) */
    showHandle?: boolean
    /** Maximum height as percentage of viewport (default: 96) */
    maxHeightPercent?: number
  }
>(({ className, children, showHandle = true, maxHeightPercent = 96, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        // Positioning and z-index
        "fixed inset-x-0 bottom-0 z-[101]",
        // Responsive sizing with safe maximums
        "mt-24 flex h-auto flex-col",
        `max-h-[${maxHeightPercent}%]`,
        // Styling
        "rounded-t-xl border bg-background shadow-lg",
        // Smooth animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        "data-[state=closed]:duration-300 data-[state=open]:duration-500",
        className
      )}
      // Accessibility attributes
      role="dialog"
      aria-modal="true"
      {...props}
    >
      {/* Drag Handle - only show if requested */}
      {showHandle && (
        <div 
          className="mx-auto mt-4 h-2 w-16 rounded-full bg-muted/60 hover:bg-muted transition-colors"
          aria-hidden="true"
        />
      )}
      
      {/* Content Container with proper overflow handling */}
      <div className="flex-1 overflow-auto overscroll-contain p-6 pb-8">
        {children}
      </div>
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

/**
 * Drawer Header with consistent spacing and typography
 */
const DrawerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid gap-2 text-center sm:text-left mb-6",
      // Ensure proper spacing from handle
      "pt-2",
      className
    )}
    {...props}
  />
))
DrawerHeader.displayName = "DrawerHeader"

/**
 * Drawer Footer with sticky positioning option
 */
const DrawerFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    /** Make footer sticky to bottom (default: false) */
    sticky?: boolean
  }
>(({ className, sticky = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-3 pt-6",
      // Conditional sticky positioning
      sticky && "sticky bottom-0 bg-background border-t mt-auto",
      !sticky && "mt-auto",
      className
    )}
    {...props}
  />
))
DrawerFooter.displayName = "DrawerFooter"

/**
 * Drawer Title with proper heading semantics
 */
const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-tight tracking-tight",
      "text-center sm:text-left",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

/**
 * Drawer Description with proper text styling
 */
const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground",
      "text-center sm:text-left",
      className
    )}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

/**
 * Convenience hook for drawer state management with keyboard support
 */
export function useDrawer(defaultOpen = false) {
  const [open, setOpen] = React.useState(defaultOpen)
  
  // Handle escape key
  React.useEffect(() => {
    if (!isClient) return
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false)
      }
    }
    
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open])
  
  const openDrawer = React.useCallback(() => setOpen(true), [])
  const closeDrawer = React.useCallback(() => setOpen(false), [])
  const toggleDrawer = React.useCallback(() => setOpen(prev => !prev), [])
  
  return {
    open,
    setOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  }
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
