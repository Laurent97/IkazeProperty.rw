'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserProfile } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const redirectUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/auth/login')
          return
        }

        try {
          const profile = await getUserProfile(currentUser.id)
          const isAdmin = (profile as any)?.role === 'admin'

          // Redirect to appropriate dashboard based on user role
          if (isAdmin) {
            router.push('/dashboard/admin')
          } else {
            router.push('/dashboard/user')
          }
        } catch (profileError) {
          // If profile doesn't exist or any error occurs, treat as regular user
          router.push('/dashboard/user')
        }
      } catch (error) {
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    redirectUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return null
}
