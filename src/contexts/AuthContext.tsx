'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/auth'

interface User {
  id: string
  email: string
  full_name: string
  role: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
  sessionError: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)

  useEffect(() => {
    let retryCount = 0
    const maxRetries = 3

    // Get initial session with retry logic
    const getInitialSession = async () => {
      try {
        console.log('🔍 Checking authentication state...')
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Session error:', error)
          
          // Retry logic for transient errors
          if (retryCount < maxRetries && (error.message?.includes('fetch') || error.message?.includes('network'))) {
            retryCount++
            console.log(`🔄 Retrying session check (${retryCount}/${maxRetries})...`)
            setTimeout(getInitialSession, 1000 * retryCount)
            return
          }
          
          setSessionError(error.message)
          setUser(null)
        } else if (session?.user) {
          console.log('✅ User session found:', session.user.email)
          setSessionError(null)
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || '',
            role: session.user.user_metadata?.role || 'user'
          })
        } else {
          console.log('🔴 No session found')
          setSessionError(null)
          setUser(null)
        }
      } catch (error) {
        console.error('❌ Auth check error:', error)
        setSessionError(error instanceof Error ? error.message : 'Unknown auth error')
        setUser(null)
        
        // Retry on network errors
        if (retryCount < maxRetries) {
          retryCount++
          console.log(`🔄 Retrying auth check (${retryCount}/${maxRetries})...`)
          setTimeout(getInitialSession, 1000 * retryCount)
          return
        }
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email)
        
        setSessionError(null)
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || '',
            role: session.user.user_metadata?.role || 'user'
          })
        } else {
          setUser(null)
        }
        setIsLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, sessionError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
