"use client"

import * as React from "react"
import { useState } from "react"
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
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./drawer"

interface ResponsiveModalProps {
  children: React.ReactNode
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function ResponsiveModal({
  children,
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  trigger,
}: ResponsiveModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = controlledSetIsOpen || setInternalIsOpen
  
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg fixed bottom-0 left-0 right-0 top-auto translate-x-0 translate-y-0 rounded-t-xl rounded-b-none border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom">
        {children}
      </DialogContent>
    </Dialog>
  )
}

// Convenience components that work with both Dialog and Drawer
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

export function ResponsiveModalFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return <div className={className} {...props}>{children}</div>
  }

  return (
    <DrawerFooter className={className} {...props}>
      {children}
    </DrawerFooter>
  )
}
