import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  actionText: string
  actionHref?: string
  onClick?: () => void
  variant?: 'default' | 'primary' | 'secondary'
  className?: string
}

export function FeatureCard({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onClick,
  variant = 'default',
  className = ''
}: FeatureCardProps) {
  const variants = {
    default: 'border border-border/50 bg-card hover:border-primary/20',
    primary: 'border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30 shadow-lg',
    secondary: 'border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5'
  }

  const ActionComponent = actionHref ? Link : 'button'
  const actionProps = actionHref 
    ? { to: actionHref }
    : { onClick, type: 'button' as const }

  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 ${variants[variant]} ${className}`}>
      <CardHeader className="text-center space-y-4 p-card-md">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>
        <div>
          <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2 leading-relaxed">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-card-md pb-card-md">
        <Button 
          asChild={!!actionHref}
          size="lg" 
          className="w-full touch-target-lg rounded-xl font-semibold"
          {...(!actionHref && { onClick })}
        >
          {actionHref ? (
            <Link to={actionHref}>{actionText}</Link>
          ) : (
            actionText
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
