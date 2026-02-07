'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FavoritesPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/favorites')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
