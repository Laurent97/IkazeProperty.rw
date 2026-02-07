'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, MapPin, Bed, Bath, Square, Heart, Eye, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import AdminContactInfo from '@/components/listing/admin-contact'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { supabaseClient as supabase } from '@/lib/supabase-client'
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
  house_details?: {
    bedrooms: number
    bathrooms: number
    total_area: number
    furnished: string
  }
}

export default function HousesListingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [transactionType, setTransactionType] = useState('all')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('Starting to fetch house listings...')
      
      // Try a simpler query first - just get listings
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('category', 'houses')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
      
      if (listingsError) {
        console.error('Error fetching basic listings:', listingsError)
        setError(`Failed to load listings: ${listingsError.message}`)
        return
      }
      
      console.log(`Found ${listingsData?.length || 0} listings`)
      
      if (!listingsData || listingsData.length === 0) {
        setListings([])
        setLoading(false)
        return
      }
      
      // Get listing IDs for fetching related data
      const listingIds = (listingsData as any[]).map((listing: any) => listing.id)
      
      // Fetch related data in parallel
      const [
        { data: sellersData, error: sellersError },
        { data: mediaData, error: mediaError },
        { data: houseDetailsData, error: houseDetailsError }
      ] = await Promise.all([
        supabase
          .from('users')
          .select('id, full_name, email, avatar_url, phone_number, verified')
          .in('id', (listingsData as any[]).map((l: any) => l.seller_id)),
        
        supabase
          .from('listing_media')
          .select('id, listing_id, url, public_id, media_type, order_index, is_primary')
          .in('listing_id', listingIds)
          .order('order_index'),
        
        supabase
          .from('house_details')
          .select('*')
          .in('listing_id', listingIds)
      ])
      
      // Log any errors but continue processing
      if (sellersError) console.error('Error fetching sellers:', sellersError)
      if (mediaError) console.error('Error fetching media:', mediaError)
      if (houseDetailsError) console.error('Error fetching house details:', houseDetailsError)
      
      // Fetch active promotions
      const { data: promotionsData } = await supabase
        .from('promoted_listings')
        .select('listing_id, status, end_date')
        .in('listing_id', listingIds)
        .eq('status', 'active')
        .gt('end_date', new Date().toISOString())
      
      // Combine all data
      const combinedListings = (listingsData as any[]).map((listing: any) => {
        // Find seller
        const seller = sellersData?.find((s: any) => s.id === listing.seller_id)
        
        // Find media for this listing
        const media = mediaData?.filter((m: any) => m.listing_id === listing.id) || []
        
        // Find house details for this listing
        const houseDetail = houseDetailsData?.find((d: any) => d.listing_id === listing.id)
        
        // Check if listing has active promotion
        const hasActivePromotion = promotionsData?.some((p: any) => p.listing_id === listing.id)
        
        return {
          ...listing,
          seller: seller ? { full_name: (seller as any).full_name, email: (seller as any).email } : null,
          media: media.map((m: any) => ({
            url: m.url,
            media_type: m.media_type,
            is_primary: m.is_primary,
            order_index: m.order_index
          })),
          house_details: houseDetail ? {
            bedrooms: (houseDetail as any).bedrooms,
            bathrooms: (houseDetail as any).bathrooms,
            total_area: (houseDetail as any).total_area,
            furnished: (houseDetail as any).furnished
          } : undefined,
          promoted: hasActivePromotion || listing.promoted
        }
      }) as Listing[]
      
      console.log('Successfully combined data for', combinedListings.length, 'listings')
      setListings(combinedListings)
      
    } catch (err: any) {
      console.error('Error in fetchListings:', err)
      setError(`Failed to load listings: ${err?.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: currency === 'RWF' ? 'RWF' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatLocation = (location: any) => {
    if (!location) return 'Location not specified'
    
    if (typeof location === 'string') {
      try {
        // If it's a stringified JSON, parse it
        location = JSON.parse(location)
      } catch {
        return location
      }
    }
    
    if (typeof location === 'object') {
      const locationObj = location as Record<string, any>
      return locationObj?.district || 
             locationObj?.sector || 
             locationObj?.cell || 
             locationObj?.village ||
             locationObj?.city || 
             locationObj?.province || 
             locationObj?.address ||
             'Location not specified'
    }
    
    return 'Location not specified'
  }
  
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         formatLocation(listing.location).toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = (!priceRange.min || listing.price >= parseInt(priceRange.min)) &&
                        (!priceRange.max || listing.price <= parseInt(priceRange.max))
    const matchesBedrooms = !bedrooms || (listing.house_details?.bedrooms && listing.house_details.bedrooms >= parseInt(bedrooms))
    const matchesBathrooms = !bathrooms || (listing.house_details?.bathrooms && listing.house_details.bathrooms >= parseInt(bathrooms))
    const matchesType = transactionType === 'all' || listing.transaction_type === transactionType

    return matchesSearch && matchesPrice && matchesBedrooms && matchesBathrooms && matchesType
  })

  return (
    <div className="min-h-screen bg-gray-50 no-overflow-x">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                <Home className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-red-600" />
                Houses & Apartments
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Find your perfect home from {listings.length} listings
              </p>
            </div>
            <Link href="/create-listing?category=houses">
              <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto touch-target">
                List Property
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-600" />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h2>
              </div>

              {/* Search */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by title or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (RWF)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  aria-label="Number of bedrooms"
                  title="Filter by number of bedrooms"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Bathrooms */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  aria-label="Number of bathrooms"
                  title="Filter by number of bathrooms"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Transaction Type */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  aria-label="Transaction type"
                  title="Filter by transaction type"
                >
                  <option value="all">All</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading listings...</p>
              </div>
            )}
            
            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <div className="text-red-600 text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load listings</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Common issues:</p>
                  <ul className="text-sm text-gray-500 list-disc list-inside">
                    <li>Check your Supabase connection</li>
                    <li>Verify you have house listings in your database</li>
                    <li>Ensure RLS policies allow reading listings</li>
                  </ul>
                </div>
                <Button 
                  onClick={fetchListings}
                  className="mt-4 bg-red-600 hover:bg-red-700"
                >
                  Try Again
                </Button>
              </div>
            )}
            
            {/* No Results State */}
            {!loading && !error && filteredListings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏠</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No houses found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search criteria
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-red-600 text-red-600 hover:bg-red-50 touch-target"
                  onClick={() => {
                    setSearchQuery('')
                    setPriceRange({ min: '', max: '' })
                    setBedrooms('')
                    setBathrooms('')
                    setTransactionType('all')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
            
            {/* Listings */}
            {!loading && !error && filteredListings.length > 0 && (
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
                {filteredListings.map((listing) => (
                  <Card key={listing.id} className="hover:shadow-lg transition-shadow group">
                    <CardContent className="p-0">
                      {/* Image */}
                      <div className="relative">
                        {listing.media && listing.media.length > 0 ? (
                          <div className="relative">
                            {listing.media[0].media_type === 'video' ? (
                              <div className="relative">
                                <video
                                  src={listing.media[0].url}
                                  className="w-full h-40 sm:h-48 object-cover"
                                  muted
                                  playsInline
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <img
                                src={listing.media[0].url}
                                alt={listing.title}
                                className="w-full h-40 sm:h-48 object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = `https://via.placeholder.com/400x300/cccccc/969696?text=House+Image`
                                }}
                              />
                            )}
                            {listing.media[0].is_primary && (
                              <Badge className="absolute top-2 left-2 bg-red-600 text-white text-xs">
                                Primary
                              </Badge>
                            )}
                            {listing.featured && (
                              <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                FEATURED
                              </div>
                            )}
                            {listing.promoted && (
                              <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                PROMOTED
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-gray-400 text-3xl sm:text-4xl mb-2">📷</div>
                              <p className="text-gray-500 text-xs sm:text-sm">No media available</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 sm:p-6">
                        {/* Title and Price */}
                        <div className="mb-3 sm:mb-4">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {listing.title}
                          </h3>
                          <div className="text-lg sm:text-2xl font-bold text-red-600">
                            {formatPrice(listing.price, listing.currency)}
                          </div>
                        </div>

                        {/* Property Details */}
                        {listing.house_details && (
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                            {listing.house_details.bedrooms && (
                              <div className="flex items-center gap-1">
                                <Bed className="h-3 w-3 sm:h-4 sm:w-4" />
                                {listing.house_details.bedrooms} beds
                              </div>
                            )}
                            {listing.house_details.bathrooms && (
                              <div className="flex items-center gap-1">
                                <Bath className="h-3 w-3 sm:h-4 sm:w-4" />
                                {listing.house_details.bathrooms} baths
                              </div>
                            )}
                            {listing.house_details.total_area && (
                              <div className="flex items-center gap-1">
                                <Square className="h-3 w-3 sm:h-4 sm:w-4" />
                                {listing.house_details.total_area}m²
                              </div>
                            )}
                          </div>
                        )}

                        {/* Location */}
                        <div className="flex items-center text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {formatLocation(listing.location)}
                        </div>

                        <AdminContactInfo className="mb-3 sm:mb-4" />

                        {/* Stats and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              {listing.views || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                              {listing.likes || 0}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(listing.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <Button asChild size="sm" className="touch-target">
                            <Link href={`/listings/houses/${listing.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
