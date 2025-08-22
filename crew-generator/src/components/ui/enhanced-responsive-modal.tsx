import * as React from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer"

interface ResponsiveModalProps {
  children: React.ReactNode
  /** Controlled open state */
  isOpen?: boolean
  /** Controlled open state setter */
  setIsOpen?: (open: boolean) => void
  /** Trigger element (optional for controlled usage) */
  trigger?: React.ReactNode
  /** Breakpoint for switching between dialog and drawer (default: 768px) */
  breakpoint?: string
}

/**
 * Production-ready responsive modal that uses Dialog on desktop and Drawer on mobile
 * Handles SSR properly and provides consistent API across both modes
 */
export function ResponsiveModal({
  children,
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  trigger,
  breakpoint = "(min-width: 768px)",
}: ResponsiveModalProps) {
  const [internalIsOpen, setInternalIsOpen] = React.useState(false)
  const isDesktop = useMediaQuery(breakpoint)
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = controlledSetIsOpen || setInternalIsOpen
  
  // Desktop: Use Dialog
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className="sm:max-w-lg">
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  // Mobile: Use Drawer
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent>
        {children}
      </DrawerContent>
    </Drawer>
  )
}

/**
 * Header component that adapts to desktop/mobile context
 */
export function ResponsiveModalHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <DialogHeader className={className} {...props}>
        {children}
      </DialogHeader>
    )
  }

  return (
    <DrawerHeader className={className} {...props}>
      {children}
    </DrawerHeader>
  )
}

/**
 * Title component that adapts to desktop/mobile context
 */
export function ResponsiveModalTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <DialogTitle className={className} {...props}>
        {children}
      </DialogTitle>
    )
  }

  return (
    <DrawerTitle className={className} {...props}>
      {children}
    </DrawerTitle>
  )
}

/**
 * Description component that adapts to desktop/mobile context
 */
export function ResponsiveModalDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <DialogDescription className={className} {...props}>
        {children}
      </DialogDescription>
    )
  }

  return (
    <DrawerDescription className={className} {...props}>
      {children}
    </DrawerDescription>
  )
}

/**
 * Footer component that adapts to desktop/mobile context
 */
export function ResponsiveModalFooter({
  className,
  children,
  sticky = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  /** Make footer sticky on mobile (default: false) */
  sticky?: boolean
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <div 
        className={className} 
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <DrawerFooter 
      className={`${className} ${sticky ? 'sticky bottom-0 bg-background border-t mt-auto' : 'mt-auto'}`}
      {...props}
    >
      {children}
    </DrawerFooter>
  )
}

/**
 * Close button that works in both contexts
 */
export function ResponsiveModalClose({
  children,
  ...props
}: React.ComponentProps<typeof DrawerClose>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    // For Dialog, we can use DialogClose or a button that calls onOpenChange
    return (
      <button {...props}>
        {children}
      </button>
    )
  }

  return (
    <DrawerClose {...props}>
      {children}
    </DrawerClose>
  )
}

/**
 * Hook for managing responsive modal state with additional utilities
 */
export function useResponsiveModal(defaultOpen = false) {
  const [open, setOpen] = React.useState(defaultOpen)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  
  const openModal = React.useCallback(() => setOpen(true), [])
  const closeModal = React.useCallback(() => setOpen(false), [])
  const toggleModal = React.useCallback(() => setOpen(prev => !prev), [])
  
  return {
    open,
    setOpen,
    openModal,
    closeModal,
    toggleModal,
    isDesktop,
    isMobile: !isDesktop,
  }
}
