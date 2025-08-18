import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthProvider'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  if (user) {
    navigate('/')
    return null
  }

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
      const redirectUrl = `${window.location.origin}${import.meta.env.VITE_PUBLIC_BASE_PATH}auth`
      console.log('🔗 Auth redirect URL:', redirectUrl)
      
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
      } else if (error.message?.includes('rate limit')) {
        userMessage = 'Too many requests. Please wait a moment and try again.'
      }
      
      setMessage(userMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome to Travel Crew</h2>
          <p className="mt-2 text-gray-600">
            Sign in with your email to join the community
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </div>

          {message && (
            <div className={`text-center text-sm ${
              message.includes('Check your email') 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {message}
            </div>
          )}
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            We'll send you a secure link to sign in instantly.
            <br />
            No password required!
          </p>
        </div>
      </div>
    </div>
  )
}
