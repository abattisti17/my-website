import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthProvider'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'

export default function SupabaseConnectionTest() {
  const { user, session } = useAuth()
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [testResults, setTestResults] = useState<any>(null)

  const testConnection = async () => {
    setConnectionStatus('testing')
    setTestResults(null)

    try {
      // Test 1: Basic connection
      const { error: healthError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)

      if (healthError) throw new Error(`Connection failed: ${healthError.message}`)

      // Test 2: User profile check
      let profileData = null
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          throw new Error(`Profile query failed: ${profileError.message}`)
        }
        profileData = profile
      }

      // Test 3: Check table access
      const { error: eventsError } = await supabase
        .from('events')
        .select('count')
        .limit(1)

      if (eventsError) throw new Error(`Events table access failed: ${eventsError.message}`)

      setTestResults({
        connection: 'SUCCESS',
        userAuthenticated: !!user,
        sessionValid: !!session,
        profileExists: !!profileData,
        profileData: profileData,
        tablesAccessible: true,
        timestamp: new Date().toISOString()
      })

      setConnectionStatus('success')
      toast.success('Supabase connection test passed! ✅')
    } catch (error) {
      console.error('Supabase test failed:', error)
      setTestResults({
        connection: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
      setConnectionStatus('error')
      toast.error('Supabase connection test failed! ❌')
    }
  }

  const createTestProfile = async () => {
    if (!user) {
      toast.error('You must be signed in to create a profile')
      return
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: `Test User ${Math.floor(Math.random() * 1000)}`
        })

      if (error) throw error

      toast.success('Test profile created/updated! 🎉')
      testConnection() // Refresh the test
    } catch (error) {
      console.error('Profile creation failed:', error)
      toast.error('Failed to create profile')
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 <span>Supabase Connection Test</span>
        </CardTitle>
        <CardDescription>
          Test the connection to Supabase and verify data operations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testConnection} 
            disabled={connectionStatus === 'testing'}
            className="flex-1"
          >
            {connectionStatus === 'testing' ? '🔄 Testing...' : '🧪 Test Connection'}
          </Button>
          {user && (
            <Button 
              onClick={createTestProfile}
              variant="outline"
            >
              📝 Create Test Profile
            </Button>
          )}
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          {connectionStatus === 'idle' && <Badge variant="secondary">Ready to test</Badge>}
          {connectionStatus === 'testing' && <Badge variant="secondary">Testing...</Badge>}
          {connectionStatus === 'success' && <Badge variant="default" className="bg-green-600">Connected ✅</Badge>}
          {connectionStatus === 'error' && <Badge variant="destructive">Failed ❌</Badge>}
        </div>

        {/* Current User Info */}
        <div className="space-y-2">
          <h4 className="font-medium">Current User:</h4>
          <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
            <div><strong>Authenticated:</strong> {user ? '✅ Yes' : '❌ No'}</div>
            {user && (
              <>
                <div><strong>User ID:</strong> {user.id}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Session Valid:</strong> {session ? '✅ Yes' : '❌ No'}</div>
              </>
            )}
          </div>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="space-y-2">
            <h4 className="font-medium">Test Results:</h4>
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}

        {/* Environment Check */}
        <div className="space-y-2">
          <h4 className="font-medium">Environment Variables:</h4>
          <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
            <div><strong>VITE_SUPABASE_URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</div>
            <div><strong>VITE_SUPABASE_ANON_KEY:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</div>
            {import.meta.env.VITE_SUPABASE_URL && (
              <div className="text-xs mt-2 break-all">
                <strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
