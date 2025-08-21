import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase, devAutoLogin } from '../lib/supabase'
import { useAuth } from '../components/AuthProvider'
import { PageLayout } from '../components/design-system/PageLayout'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get return path from navigation state
  const returnTo = location.state?.returnTo || '/'

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(returnTo, { replace: true })
    }
  }, [user, navigate, returnTo])

  const testSupabaseConnection = async () => {
    console.log('🧪 Testing Supabase connection...')
    console.log('📡 Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
    console.log('🔑 API Key (first 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
    
    try {
      // Test basic connection
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      console.log('✅ Connection test result:', { data, error })
    } catch (error) {
      console.error('❌ Connection test failed:', error)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Run connection test first
    await testSupabaseConnection()

    try {
      // Construct the redirect URL with proper environment handling
      const basePath = import.meta.env.VITE_PUBLIC_BASE_PATH || '/'
      const cleanBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`
      const redirectUrl = `${window.location.origin}${cleanBasePath}auth`
      
      // Enhanced logging for debugging staging vs production redirects
      console.log('🔗 Auth redirect URL construction:')
      console.log('  - Origin:', window.location.origin)
      console.log('  - Base path:', basePath)
      console.log('  - Clean base path:', cleanBasePath)
      console.log('  - Final redirect URL:', redirectUrl)
      console.log('  - Current URL:', window.location.href)
      
      // Additional environment debugging
      const isStaging = window.location.hostname.includes('staging')
      const isLocal = window.location.hostname.includes('localhost')
      console.log('🌍 Environment detection:')
      console.log('  - Is staging:', isStaging)
      console.log('  - Is local:', isLocal)
      console.log('  - Hostname:', window.location.hostname)
      
      // Validate the redirect URL before sending
      const url = new URL(redirectUrl)
      console.log('✅ Parsed redirect URL:')
      console.log('  - Protocol:', url.protocol)
      console.log('  - Host:', url.host)
      console.log('  - Pathname:', url.pathname)
      console.log('  - Valid URL:', redirectUrl)

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })

      if (error) throw error

      setMessage('Check your email for the magic link!')
    } catch (error: any) {
      console.error('🚨 Auth error details:', error)
      
      // Better error messages
      let userMessage = error.message || 'An error occurred'
      if (error.message?.includes('Invalid API key')) {
        userMessage = 'Configuration error: Please check Supabase API credentials'
      } else if (error.message?.includes('rate limit') || error.message?.includes('security purposes')) {
        userMessage = 'Rate limit reached. Please wait 60 seconds before trying again.'
      }
      
      setMessage(userMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout className="flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
            <span className="text-3xl">🎵</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Sign in with your email to join the community</p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-card border-2 border-primary/20 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Continue Your Journey</h2>
            <p className="text-muted-foreground text-sm">Enter your email to receive a magic link</p>
          </div>

          <form className="space-y-6" onSubmit={handleSignIn}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors touch-target"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold rounded-xl transition-all duration-200 touch-target-lg shadow-sm disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  Sending...
                </span>
              ) : (
                'Send Magic Link'
              )}
            </button>

            {/* Development Auto-Login Button */}
            {import.meta.env.DEV && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Development Only</span>
                </div>
              </div>
            )}
            
            {import.meta.env.DEV && (
              <button
                type="button"
                onClick={async () => {
                  setLoading(true)
                  const success = await devAutoLogin()
                  if (success) {
                    setMessage('🔧 Development auto-login initiated! Check your email for the magic link.')
                  } else {
                    setMessage('⚠️ Auto-login failed. Add VITE_DEV_TEST_EMAIL to .env.local')
                  }
                  setLoading(false)
                }}
                disabled={loading}
                className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-yellow-900 font-medium text-sm rounded-lg transition-all duration-200 touch-target"
              >
                {loading ? 'Auto-logging...' : '🔧 Dev Auto-Login'}
              </button>
            )}

            {message && (
              <div className={`text-center text-sm p-3 rounded-xl ${
                message.includes('Check your email') 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </form>

          <div className="text-center mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              🔐 We'll send you a secure link to sign in instantly.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              No passwords required. Just pure magic ✨
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
