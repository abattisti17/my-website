import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModernButtonProps extends React.ComponentProps<typeof Button> {
  modernSize?: "default" | "large"
}

/**
 * ModernButton - Enhanced button with modern styling for forms
 * 
 * @example
 * <ModernButton modernSize="large" fullWidth>
 *   Create Event
 * </ModernButton>
 */
export function ModernButton({
  children,
  modernSize = "default",
  size,
  className,
  ...props
}: ModernButtonProps) {
  // Map modernSize to the Button's size prop, defaulting to design token sizes
  const buttonSize = modernSize === "large" ? "lg" : size || "default"
  
  return (
    <Button
      {...props}
      size={buttonSize}
      className={cn(
        // Base modern styling
        "rounded-2xl font-semibold transition-all duration-200",
        // Enhanced hover/focus states
        "hover:scale-[1.02] active:scale-[0.98]",
        "focus:ring-2 focus:ring-offset-2 focus:ring-primary",
        className
      )}
    >
      {children}
    </Button>
  )
}
