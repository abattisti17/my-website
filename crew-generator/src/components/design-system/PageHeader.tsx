import { ReactNode } from 'react'

interface PageHeaderProps {
  icon?: ReactNode
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export function PageHeader({ 
  icon, 
  title, 
  subtitle, 
  action, 
  className = '' 
}: PageHeaderProps) {
  return (
    <div className={`px-safe pt-safe pb-8 ${className}`}>
      <div className="text-center space-y-6">
        {icon && (
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-4">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="flex justify-center">
            {action}
          </div>
        )}
      </div>
    </div>
  )
}
