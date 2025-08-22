import { cn } from "@/lib/utils"
import { FloatingLabel } from "./FloatingLabel"
import { ModernInput } from "./ModernInput"

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  labelVariant?: "default" | "primary" | "secondary"
  className?: string
  inputProps?: React.ComponentProps<typeof ModernInput>
}

/**
 * FormField - Complete form field with floating label and modern styling
 * 
 * @example
 * <FormField 
 *   label="Artist Name" 
 *   required 
 *   inputProps={{
 *     placeholder: "Taylor Swift",
 *     value: artistName,
 *     onChange: handleChange
 *   }}
 * />
 */
export function FormField({
  label,
  required = false,
  error,
  labelVariant = "primary",
  className,
  inputProps = {}
}: FormFieldProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <FloatingLabel required={required} variant={labelVariant}>
        {label}
      </FloatingLabel>
      
      <ModernInput
        {...inputProps}
        error={!!error}
        className={inputProps?.className}
      />
      
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
