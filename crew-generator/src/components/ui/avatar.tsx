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
        "relative flex shrink-0 overflow-hidden rounded-full",
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

// Size variants for consistent avatar sizing
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

const avatarSizeClasses: Record<AvatarSize, string> = {
  sm: 'size-6', // 24px
  md: 'size-8', // 32px - default
  lg: 'size-12', // 48px
  xl: 'size-16' // 64px
}

const avatarIconSizeClasses: Record<AvatarSize, string> = {
  sm: 'size-2', // Loading spinner
  md: 'size-3', 
  lg: 'size-4',
  xl: 'size-6'
}

const avatarTextSizeClasses: Record<AvatarSize, string> = {
  sm: 'text-xs',
  md: 'text-xs', 
  lg: 'text-sm',
  xl: 'text-lg'
}

// Enhanced UserAvatar component for our specific use cases
interface UserAvatarProps {
  src?: string | null
  alt: string
  fallback: string
  userId?: string
  size?: AvatarSize
  className?: string
  showLoadingState?: boolean
  onImageError?: () => void
}

function UserAvatar({ 
  src, 
  alt, 
  fallback, 
  userId,
  size = 'md',
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
    <Avatar className={cn(avatarSizeClasses[size], className)} {...props}>
      {shouldShowImage && (
        <AvatarImage
          src={src!}
          alt={alt}
          style={{
            display: imageState === 'error' ? 'none' : 'block'
          }}
        />
      )}
      <AvatarFallback className={avatarTextSizeClasses[size]}>
        {showLoadingState && imageState === 'loading' && shouldShowImage ? (
          <Loader2 className={cn(avatarIconSizeClasses[size], "animate-spin text-primary/60")} />
        ) : (
          <span>{fallbackText}</span>
        )}
      </AvatarFallback>
    </Avatar>
  )
}

export { Avatar, AvatarImage, AvatarFallback, UserAvatar, type AvatarSize }
