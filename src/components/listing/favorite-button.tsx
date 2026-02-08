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

        const { data, error } = await supabase
          .from('favorite_listings')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('listing_id', listingId)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking favorite status:', error)
        } else {
          setIsFavorited(!!data)
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
        // Remove from favorites
        const { error } = await supabase
          .from('favorite_listings')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId)

        if (error) throw error
        setIsFavorited(false)
        
        // Update the likes count on the listing using SQL
        await (supabase as any).rpc('sql', { sql: `SELECT decrement_likes('${listingId}')` })
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorite_listings')
          .insert({
            user_id: user.id,
            listing_id: listingId
          } as any)

        if (error) throw error
        setIsFavorited(true)

        // Update the likes count on the listing using SQL
        await (supabase as any).rpc('sql', { sql: `SELECT increment_likes('${listingId}')` })
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
