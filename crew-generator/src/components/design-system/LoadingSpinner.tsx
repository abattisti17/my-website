interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'muted'
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary',
  className = '' 
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const variants = {
    primary: 'border-primary/30 border-t-primary',
    muted: 'border-muted-foreground/30 border-t-muted-foreground'
  }

  return (
    <div className={`
      ${sizes[size]} 
      ${variants[variant]} 
      border-2 rounded-full animate-spin
      ${className}
    `} />
  )
}
