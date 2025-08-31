/**
 * Reusable error state components
 * Consolidates error UI patterns across the app
 */

import { IonicButton } from "@/components/ui/ionic-button"
import { refresh } from 'ionicons/icons'
// import { Button } from "@/components/ui/button" // Commented out - using IonicButton instead
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from 'lucide-react'
// import { RefreshCw } from 'lucide-react' // Commented out - using Ionic refresh icon instead

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorState({ 
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  className = ''
}: ErrorStateProps) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        {onRetry && (
          <CardContent className="text-center">
            <IonicButton 
              onClick={onRetry} 
              variant="outline"
              icon={refresh}
            >
              {retryLabel}
            </IonicButton>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

/**
 * Full page error state
 */
export function FullPageError({ 
  title = 'Page Error',
  message = 'Failed to load this page.',
  onRetry,
  retryLabel = 'Reload Page'
}: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorState 
        title={title}
        message={message}
        onRetry={onRetry || (() => window.location.reload())}
        retryLabel={retryLabel}
      />
    </div>
  )
}

/**
 * Inline error state for smaller components
 */
export function InlineError({ 
  message = 'Something went wrong',
  onRetry,
  className = ''
}: Pick<ErrorStateProps, 'message' | 'onRetry' | 'className'>) {
  return (
    <div className={`flex items-center justify-center p-4 text-center ${className}`}>
      <div className="space-y-2">
        <p className="text-sm text-red-600">{message}</p>
        {onRetry && (
          <IonicButton 
            onClick={onRetry} 
            variant="outline"
            size="sm"
            icon={refresh}
          >
            Retry
          </IonicButton>
        )}
      </div>
    </div>
  )
}
