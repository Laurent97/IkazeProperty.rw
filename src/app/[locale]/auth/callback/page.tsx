'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/auth'

export default function AuthCallback() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setError('Authentication failed. Please try again.')
          setTimeout(() => {
            router.push('/login')
          }, 3000)
          return
        }

        if (data.session) {
          // User successfully signed in
          console.log('User authenticated:', data.session.user)
          
          // Check if user profile exists, create if not
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single()

          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create one
            const { error: insertError } = await (supabase
              .from('users') as any)
              .insert({
                email: data.session.user.email || '',
                full_name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || null,
                avatar_url: data.session.user.user_metadata?.avatar_url || null,
                role: 'user',
                verified: true
              })

            if (insertError) {
              console.error('Error creating profile:', insertError)
            }
          }

          // Redirect to dashboard or home
          router.push('/dashboard')
        } else {
          // No session found, redirect to login
          router.push('/login')
        }
      } catch (err) {
        console.error('Callback error:', err)
        setError('An error occurred during authentication.')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Completing sign in...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  return null
}
