'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Home, Car, Trees, Package, ArrowRight, Heart, Eye, MapPin, Calendar, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminContactInfo from '@/components/listing/admin-contact'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { HomepageLeaderboard, HomepageSidebar } from '@/components/ads/AdServing'
import { getSupabaseClient as supabase } from '@/lib/supabase-client'
import type { Database } from '@/types/database'
import LikesDisplay from '@/components/listing/likes-display'
import ViewsDisplay from '@/components/listing/views-display'
import ListingDetails from '@/components/listing/listing-details'

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
  house_details?: Database['public']['Tables']['house_details']['Row']
  car_details?: Database['public']['Tables']['car_details']['Row']
  land_details?: Database['public']['Tables']['land_details']['Row']
  other_item_details?: Database['public']['Tables']['other_item_details']['Row']
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [totalCount, setTotalCount] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'houses', label: 'Houses & Apartments' },
    { value: 'cars', label: 'Cars & Vehicles' },
    { value: 'land', label: 'Land & Plots' },
    { value: 'other', label: 'Other Items' }
  ]

  const fetchSearchResults = async () => {
    if (!searchQuery.trim() && categoryFilter === 'all') {
      setListings([])
      setTotalCount(0)
      setHasSearched(false)
      return
    }

    try {
      setLoading(true)
      setHasSearched(true)
      
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
          ),
          house_details,
          car_details,
          land_details,
          other_item_details
        `, { count: 'exact' })
        .eq('status', 'available')

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter)
      }

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      query = query.order(sortBy, { ascending: false }).limit(50)

      const { data, error, count } = await query

      if (error) {
        console.error('Error searching listings:', error)
      } else {
        setListings(data || [])
        setTotalCount(count || 0)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery || categoryFilter !== 'all') {
      fetchSearchResults()
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSearchResults()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, categoryFilter, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchSearchResults()
  }

  const clearSearch = () => {
    setSearchQuery('')
    setCategoryFilter('all')
    setListings([])
    setTotalCount(0)
    setHasSearched(false)
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Search Listings
            </h1>
            <p className="text-lg text-gray-600">
              Find exactly what you're looking for
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search properties, cars, land..."
                  className="pl-10 pr-10 h-12 text-lg"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-2 top-2 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button type="submit" className="h-12 px-8 bg-red-600 hover:bg-red-700">
                Search
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Newest First</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
      </section>

      {/* Homepage Leaderboard Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <HomepageLeaderboard />
        </div>
      </div>

      {/* Search Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          ) : hasSearched ? (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600">
                  {totalCount > 0 
                    ? `Found ${totalCount} result${totalCount !== 1 ? 's' : ''}`
                    : 'No results found'
                  }
                  {searchQuery && ` for "${searchQuery}"`}
                  {categoryFilter !== 'all' && ` in ${categories.find(c => c.value === categoryFilter)?.label}`}
                </p>
              </div>

              {/* Results Grid */}
              {listings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search terms or filters
                  </p>
                  <Button onClick={clearSearch} variant="outline">
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <Card key={listing.id} className="hover:shadow-lg transition-shadow group">
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

                        {/* Category-specific details */}
                        <ListingDetails 
                          category={listing.category}
                          listing={listing}
                          className="mb-3"
                        />

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
                            <ViewsDisplay 
                              listingId={listing.id} 
                              viewsCount={listing.views || 0}
                              className="text-xs"
                            />
                            <LikesDisplay 
                              listingId={listing.id} 
                              likesCount={listing.likes || 0}
                              className="text-xs"
                            />
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
            </>
          ) : (
            /* Initial State */
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Search</h3>
              <p className="text-gray-600">
                Enter a search term or select a category to find listings
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Ad */}
        <div className="hidden lg:block">
          <div className="ml-6">
            <HomepageSidebar />
          </div>
        </div>
      </section>
    </div>
  )
}
