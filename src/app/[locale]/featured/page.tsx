'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminContactInfo from '@/components/listing/admin-contact'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Heart, Eye, MapPin, Star, Calendar } from 'lucide-react'
import { getSupabaseClient as supabase } from '@/lib/supabase-client'
import type { Database } from '@/types/database'

type Listing = Database['public']['Tables']['listings']['Row'] & {
  seller: {
    full_name: string | null
    email: string
  } | null
  media: {
    url: string
    public_id: string
    media_type: 'image' | 'video'
    is_primary: boolean
    order_index: number
  }[]
}

export default function FeaturedPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_at')

  useEffect(() => {
    fetchFeaturedListings()
  }, [categoryFilter, sortBy])

  const fetchFeaturedListings = async () => {
    try {
      setLoading(true)
      
      let query = supabase()
        .from('listings')
        .select(`
          *,
          seller:users!listings_seller_id_fkey(
            full_name,
            email
          ),
          media:listing_media(
            url,
            public_id,
            media_type,
            is_primary,
            order_index
          )
        `)
        .eq('status', 'available')
        .or('featured.eq.true,promoted.eq.true')

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter)
      }

      query = query.order(sortBy, { ascending: false }).limit(50)

      const { data, error } = await query

      if (error) {
        console.error('Error fetching featured listings:', error)
      } else {
        setListings(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: currency === 'RWF' ? 'RWF' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'houses': return '🏠'
      case 'cars': return '🚗'
      case 'land': return '🌳'
      default: return '📦'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'houses': return 'bg-blue-100 text-blue-800'
      case 'cars': return 'bg-green-100 text-green-800'
      case 'land': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-purple-100 text-purple-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading featured listings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Listings
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Handpicked properties and items from trusted sellers. These listings are featured for their quality, value, and popularity.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="houses">Houses & Apartments</SelectItem>
                <SelectItem value="cars">Cars & Vehicles</SelectItem>
                <SelectItem value="land">Land & Plots</SelectItem>
                <SelectItem value="other">Other Items</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Newest First</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="likes">Most Liked</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchFeaturedListings} variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredListings.length} featured listing{filteredListings.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No featured listings found</h3>
            <p className="text-gray-600">
              {searchQuery || categoryFilter !== 'all' 
                ? 'Try adjusting your filters or search query'
                : 'Check back later for new featured listings'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge className={`${getCategoryColor(listing.category)} border-0`}>
                      {getCategoryIcon(listing.category)} {listing.category}
                    </Badge>
                    <div className="flex gap-1">
                      {listing.featured && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          ⭐ Featured
                        </Badge>
                      )}
                      {listing.promoted && (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          🚀 Promoted
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  {/* Image */}
                  {listing.media && listing.media.length > 0 && (
                    <div className="mb-4">
                      <img
                        src={listing.media[0].url}
                        alt={listing.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Price */}
                  <div className="text-2xl font-bold text-red-600 mb-3">
                    {formatPrice(listing.price, listing.currency)}
                    {listing.price_type === 'negotiable' && (
                      <span className="text-sm text-gray-500 ml-2">(Negotiable)</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {listing.description}
                  </p>

                  {/* Location */}
                  {listing.location && typeof listing.location === 'object' && (
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {(listing.location as any)?.district || 'Location not specified'}
                    </div>
                  )}

                  <AdminContactInfo className="mb-4" />

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {listing.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {listing.likes}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(listing.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Listed by</p>
                      <p className="font-medium text-gray-900">
                        {listing.seller?.full_name || 'Anonymous'}
                      </p>
                    </div>
                    <Button asChild>
                      <a href={`/listings/${listing.category}/${listing.id}`}>
                        View Details
                      </a>
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
