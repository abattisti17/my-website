import React, { ReactNode } from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  badge?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  badge,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <Card className={`text-center border-2 border-dashed border-border bg-muted/20 ${className}`}>
      <CardContent className="py-12">
        <div className="mx-auto w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 max-w-sm mx-auto">{description}</p>
        {badge && (
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-6">
            {badge}
          </Badge>
        )}
        {action && (
          <div className="flex justify-center">
            {action}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
