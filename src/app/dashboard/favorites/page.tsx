'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Heart, 
  Home, 
  Car, 
  Trees, 
  Package, 
  Eye, 
  Search,
  ArrowRight,
  MapPin,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/auth'
import { getCurrentUser } from '@/lib/auth'

export default function FavoritesPage() {
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      try {
        // First check if user is authenticated
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          console.log('No user authenticated, skipping favorites fetch')
          setFavorites([])
          setLoading(false)
          return
        }
        
        setUser(currentUser)
        
        // Only fetch favorites if user is authenticated
        const response = await fetch('/api/favorites')
        if (response.ok) {
          const data = await response.json()
          setFavorites(data.favorites || [])
        } else {
          console.error('Error fetching favorites:', response.statusText)
          setFavorites([])
        }
      } catch (error) {
        console.error('Error fetching favorites:', error)
        setFavorites([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndFavorites()
  }, [])

  const fetchFavorites = async () => {
    if (!user) {
      console.log('No user available, skipping favorites fetch')
      return
    }
    
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites || [])
      } else {
        console.error('Error fetching favorites:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (listingId: string) => {
    try {
      const response = await fetch(`/api/favorites?listingId=${listingId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setFavorites(favorites.filter((fav: any) => fav.id !== listingId))
      } else {
        console.error('Error removing favorite:', response.statusText)
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'houses': return <Home className="h-4 w-4" />
      case 'cars': return <Car className="h-4 w-4" />
      case 'land': return <Trees className="h-4 w-4" />
      case 'other': return <Package className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'sold': return 'bg-red-100 text-red-800'
      case 'rented': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredFavorites = favorites.filter((listing: any) => {
    return listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              <p className="text-gray-600 mt-1">Properties and items you've saved for later</p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredFavorites.length} items saved
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Favorites Grid */}
        {filteredFavorites.length === 0 ? (
          <Card>
            <CardContent className="p-16 text-center">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No matching favorites' : 'No favorites yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Start browsing and save properties you\'re interested in'
                }
              </p>
              {!searchTerm && (
                <Link href="/listings">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Browse Listings
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((listing: any) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow group">
                <div className="relative">
                  {(() => {
                    const sortedMedia = listing.listing_media 
                      ? [...listing.listing_media].sort((a, b) => {
                          if (a.is_primary && !b.is_primary) return -1;
                          if (!a.is_primary && b.is_primary) return 1;
                          return a.order_index - b.order_index;
                        })
                      : [];
                    const primaryMedia = sortedMedia[0];
                    
                    return primaryMedia ? (
                      <div className="relative">
                        {primaryMedia.media_type === 'video' ? (
                          <div className="relative">
                            <video
                              src={primaryMedia.url}
                              className="w-full h-48 object-cover rounded-t-lg"
                              muted
                              playsInline
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                              <div className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={primaryMedia.url}
                            alt={listing.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `https://via.placeholder.com/400x300/cccccc/969696?text=${listing.category}+Image`
                            }}
                          />
                        )}
                        {primaryMedia.is_primary && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            Primary
                          </div>
                        )}
                        {listing.featured && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            FEATURED
                          </div>
                        )}
                        <span className={`absolute bottom-2 right-2 px-2 py-1 text-xs rounded-full ${getStatusColor(listing.status)}`}>
                          {listing.status}
                        </span>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-gray-400 text-3xl mb-2">📷</div>
                          <p className="text-gray-500 text-sm">No media available</p>
                        </div>
                      </div>
                    );
                  })()}
                  <button
                    onClick={() => removeFavorite(listing.id)}
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    title="Remove from favorites"
                  >
                    <Heart className="h-4 w-4 text-red-600 fill-current" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                      {getCategoryIcon(listing.category)}
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{listing.category}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-red-600">
                      RWF {listing.price.toLocaleString()}
                    </span>
                  </div>
                  {listing.location && (
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {typeof listing.location === 'string' ? listing.location : 'Location not specified'}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {listing.views || 0}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {listing.likes || 0}
                      </span>
                    </div>
                    <span className="text-xs">
                      {new Date(listing.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/listings/${listing.category}/${listing.id}`} className="flex-1">
                      <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => removeFavorite(listing.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Remove from favorites"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
