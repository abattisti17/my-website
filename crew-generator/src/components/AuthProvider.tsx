import { createContext, useContext, useEffect, useState } from 'react'
import { type User, type Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session with generous timeout for development
    const getSessionWithTimeout = async () => {
      try {
        const sessionPromise = supabase.auth.getSession()
        // Much more generous timeout for development (30 seconds)
        const timeoutMs = import.meta.env.DEV ? 30000 : 10000
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth timeout')), timeoutMs)
        )
        
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any
        
        if (session) {
          console.log('✅ Session restored successfully')
          setSession(session)
          setUser(session.user)
        } else {
          console.log('ℹ️ No existing session found')
          setSession(null)
          setUser(null)
        }
      } catch (error: any) {
        console.warn('⚠️ Auth session check failed:', error.message)
        console.warn('Continuing without authentication...')
        setSession(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    
    getSessionWithTimeout()

    // Listen for auth changes (stable connection, no visibility management)
    let subscription: any
    try {
      const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Auth state change:', event)
        setSession(session)
        setUser(session?.user ?? null)
        
        // Create or update profile when user signs in
        if (event === 'SIGNED_IN' && session?.user) {
          await upsertProfile(session.user)
        }
      })
      subscription = authListener.data.subscription
    } catch (error) {
      console.warn('⚠️ Failed to set up auth listener:', error)
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const upsertProfile = async (user: User) => {
    try {
      const email = user.email
      if (!email) return

      // Generate display name from email prefix
      const emailPrefix = email.split('@')[0]
      const displayName = emailPrefix.replace(/[^a-zA-Z0-9]/g, '') // Clean up special chars
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: email,
          display_name: displayName,
        }, {
          onConflict: 'id'
        })

      if (error) {
        console.error('Error upserting profile:', error)
      } else {
        console.log('✅ Profile created/updated successfully')
      }
    } catch (error) {
      console.error('Error in upsertProfile:', error)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
