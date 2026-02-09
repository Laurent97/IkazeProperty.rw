'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/auth'

interface FavoriteButtonProps {
  listingId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function FavoriteButton({ 
  listingId, 
  className = '',
  size = 'md',
  showText = false 
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [listing, setListing] = useState<any>(null)

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          setLoading(false)
          return
        }

        setUser(currentUser)

        // Also fetch listing data for likes count
        const { data: listingData } = await supabase
          .from('listings')
          .select('likes')
          .eq('id', listingId)
          .single()
        
        setListing(listingData)

        // Check favorite status via API
        const response = await fetch(`/api/favorites?listingId=${listingId}`)
        if (response.ok) {
          const data = await response.json()
          setIsFavorited(data.isFavorited || false)
        } else {
          console.error('Error checking favorite status:', response.statusText)
          setIsFavorited(false) // Default to not favorited on error
        }
      } catch (error) {
        console.error('Error checking favorite status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkFavoriteStatus()
  }, [listingId])

  const toggleFavorite = async () => {
    if (!user) {
      // Redirect to login or show login modal
      alert('Please login to favorite listings')
      return
    }

    try {
      if (isFavorited) {
        // Remove from favorites via API
        const response = await fetch(`/api/favorites?listingId=${listingId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setIsFavorited(false)
        } else {
          const errorData = await response.json()
          if (errorData.error === 'Not authenticated') {
            alert('Please login to manage favorites')
          } else {
            throw new Error('Failed to remove favorite')
          }
        }
      } else {
        // Add to favorites via API
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ listingId })
        })
        
        if (response.ok) {
          setIsFavorited(true)
        } else {
          const errorData = await response.json()
          if (errorData.error === 'Not authenticated') {
            alert('Please login to add favorites')
          } else {
            throw new Error('Failed to add favorite')
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Error updating favorites. Please try again.')
    }
  }

  if (loading) {
    return (
      <Button
        variant="outline"
        className={`${className} ${sizeClasses[size]}`}
        disabled
      >
        <Heart className={`${iconSizes[size]} animate-pulse`} />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className={`${className} ${sizeClasses[size]} ${
        isFavorited 
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
          : 'hover:bg-red-50 hover:border-red-200 hover:text-red-600'
      }`}
      onClick={toggleFavorite}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={`${iconSizes[size]} ${isFavorited ? 'fill-current' : ''}`} 
      />
      {showText && (
        <span className="ml-2">
          {isFavorited ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </Button>
  )
}
