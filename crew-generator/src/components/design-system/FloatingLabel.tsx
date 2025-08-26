import { cn } from "@/lib/utils"

interface FloatingLabelProps {
  children: React.ReactNode
  required?: boolean
  variant?: "default" | "primary" | "secondary"
  className?: string
}

/**
 * FloatingLabel - Beautiful pill-shaped labels for form fields
 * 
 * @example
 * <FloatingLabel required>Artist Name</FloatingLabel>
 * <FloatingLabel variant="secondary">Optional Field</FloatingLabel>
 */
export function FloatingLabel({ 
  children, 
  required = false, 
  variant = "default",
  className 
}: FloatingLabelProps) {
  const baseStyles = "inline-block px-4 py-2 rounded-full text-sm font-medium leading-none"
  
  const variants = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary", 
    secondary: "bg-secondary text-secondary-foreground"
  }
  
  return (
    <div className={cn(baseStyles, variants[variant], className)}>
      {children}{required && "*"}
    </div>
  )
}
