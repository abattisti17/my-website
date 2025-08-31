import { Component, type ReactNode } from 'react'
import { IonicButton } from '@/components/ui/ionic-button'
import { refresh } from 'ionicons/icons'
// import { Button } from '@/components/ui/button' // Commented out - using IonicButton instead
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
// import { RefreshCw } from 'lucide-react' // Commented out - using Ionic refresh icon instead

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Simple Error Boundary - Prevents white screens when components crash
 * 
 * No complex features, just prevents the app from completely breaking.
 */
export class SimpleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('🚨 Component crashed:', error)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-4 flex items-center justify-center min-h-[200px]">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-red-600">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {import.meta.env.DEV && this.state.error && (
                <div className="text-sm bg-gray-50 p-3 rounded border">
                  <strong>Error:</strong> {this.state.error.message}
                </div>
              )}
              
              <div className="flex gap-2">
                <IonicButton 
                  onClick={this.handleReset}
                  variant="outline"
                  icon={refresh}
                  className="flex-1"
                >
                  Try Again
                </IonicButton>
                <IonicButton 
                  onClick={() => window.location.reload()}
                  variant="default"
                  icon={refresh}
                  className="flex-1"
                >
                  Refresh Page
                </IonicButton>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
