"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { useAuth } from "../AuthProvider"

// Core Avatar primitives (unchanged for composability)
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-primary/10 flex size-full items-center justify-center rounded-full text-primary font-medium text-xs",
        className
      )}
      {...props}
    />
  )
}

// Enhanced UserAvatar component for our specific use cases
interface UserAvatarProps {
  src?: string | null
  alt: string
  fallback: string
  userId?: string
  className?: string
  showLoadingState?: boolean
  onImageError?: () => void
}

function UserAvatar({ 
  src, 
  alt, 
  fallback, 
  userId,
  className,
  showLoadingState = true,
  onImageError,
  ...props 
}: UserAvatarProps) {
  const { user } = useAuth()
  const [imageState, setImageState] = React.useState<'loading' | 'loaded' | 'error'>('loading')
  const [shouldShowImage, setShouldShowImage] = React.useState(!!src)

  const isOwnImage = user?.id === userId
  const fallbackText = fallback.charAt(0).toUpperCase()

  React.useEffect(() => {
    if (!src) {
      setImageState('error')
      setShouldShowImage(false)
      return
    }

    setImageState('loading')
    setShouldShowImage(true)

    // Preload image to detect errors
    const img = new Image()
    img.onload = () => setImageState('loaded')
    img.onerror = () => {
      setImageState('error')
      setShouldShowImage(false)
      
      // Show toast notification only for user's own broken images
      if (isOwnImage) {
        toast.error("Profile photo failed to load. Please re-upload a new photo.", {
          duration: 5000,
          action: {
            label: "Go to Profile",
            onClick: () => window.location.href = "/profile"
          }
        })
      }
      
      onImageError?.()
    }
    img.src = src
  }, [src, isOwnImage, onImageError])

  return (
    <Avatar className={className} {...props}>
      {shouldShowImage && (
        <AvatarImage
          src={src!}
          alt={alt}
          style={{
            display: imageState === 'error' ? 'none' : 'block'
          }}
        />
      )}
      <AvatarFallback>
        {showLoadingState && imageState === 'loading' && shouldShowImage ? (
          <Loader2 className="size-3 animate-spin text-primary/60" />
        ) : (
          <span>{fallbackText}</span>
        )}
      </AvatarFallback>
    </Avatar>
  )
}

export { Avatar, AvatarImage, AvatarFallback, UserAvatar }
