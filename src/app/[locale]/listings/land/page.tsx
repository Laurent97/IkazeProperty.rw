'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, MapPin, Trees, Ruler, Heart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import AdminContactInfo from '@/components/listing/admin-contact'
import FavoriteButton from '@/components/listing/favorite-button'

// Type definitions
type MediaType = 'image' | 'video'

interface ListingMedia {
  id: string
  listing_id: string
  url: string
  public_id: string
  media_type: MediaType
  order_index: number
  is_primary: boolean
}

interface LandDetails {
  id: string
  listing_id: string
  plot_type: string
  plot_size: number
  size_unit: string
  shape: string
  topography: string
  soil_type: string | null
  road_access: string
  fenced: boolean
  utilities_available: string[] | null
  land_title_type: string
  title_deed_number: string | null
  surveyed: boolean
  zoning_approval: boolean | null
  development_permits: boolean | null
  tax_clearance: boolean | null
  nearest_main_road_distance: number | null
  nearest_town_distance: number | null
  nearby_amenities: string[] | null
}

interface Seller {
  id: string
  full_name: string
  email: string
  avatar_url: string | null
  phone_number: string | null
  verified: boolean
}

interface Location {
  district?: string
  sector?: string
  cell?: string
  village?: string
  city?: string
  province?: string
  address?: string
  [key: string]: any
}

interface LandListing {
  id: string
  title: string
  description: string
  price: number
  currency: string
  price_type: string
  category: string
  transaction_type: string
  status: string
  location: string | Location | null
  seller_id: string
  commission_rate: number
  commission_agreed: boolean
  featured: boolean
  promoted: boolean
  views: number
  likes: number
  created_at: string
  updated_at: string
  expires_at: string | null
  visit_fee_enabled: boolean
  visit_fee_amount: number
  visit_fee_payment_methods: string[] | null
  media: ListingMedia[]
  seller: Seller | null
  land_details?: LandDetails
}

export default function LandListingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sizeRange, setSizeRange] = useState({ min: '', max: '' })
  const [plotType, setPlotType] = useState('')
  const [roadAccess, setRoadAccess] = useState('')
  const [listings, setListings] = useState<LandListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchListings = async () => {
    try {
      setLoading(true)
      setError('')
      
      const { getSupabaseClient } = await import('@/lib/supabase-client')
      const supabaseClient = getSupabaseClient()
      
      // Fetch listings
      const { data: listingsData, error: listingsError } = await supabaseClient
        .from('listings')
        .select('*')
        .eq('category', 'land')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(50)

      if (listingsError) {
        console.error('Error fetching listings:', listingsError)
        throw new Error(`Failed to load listings: ${listingsError.message}`)
      }

      if (!listingsData || listingsData.length === 0) {
        setListings([])
        setLoading(false)
        return
      }

      // Cast to proper type
      const typedListings = listingsData as LandListing[]
      
      // Get listing IDs for related data
      const listingIds = typedListings.map(listing => listing.id)
      
      // Fetch related data in parallel
      const [sellersData, mediaData, landDetailsData, promotionsData] = await Promise.all([
        supabaseClient
          .from('users')
          .select('id, full_name, email, avatar_url, phone_number, verified')
          .in('id', typedListings.map(l => l.seller_id)),
        
        supabaseClient
          .from('listing_media')
          .select('id, listing_id, url, public_id, media_type, order_index, is_primary')
          .in('listing_id', listingIds)
          .order('order_index'),
        
        supabaseClient
          .from('land_details')
          .select('*')
          .in('listing_id', listingIds),
        
        supabaseClient
          .from('listing_promotions')
          .select('listing_id, status, expires_at')
          .in('listing_id', listingIds)
          .eq('status', 'active')
          .gt('expires_at', new Date().toISOString())
      ])

      // Log errors but continue
      if (sellersData.error) console.error('Error fetching sellers:', sellersData.error)
      if (mediaData.error) console.error('Error fetching media:', mediaData.error)
      if (landDetailsData.error) console.error('Error fetching land details:', landDetailsData.error)
      if (promotionsData.error) console.error('Error fetching promotions:', promotionsData.error)

      // Combine all data
      const combinedListings = typedListings.map(listing => {
        const seller = sellersData.data?.find(s => s.id === listing.seller_id) || null
        const media = mediaData.data?.filter(m => m.listing_id === listing.id) || []
        const landDetail = landDetailsData.data?.find(d => d.listing_id === listing.id)
        
        // Check for active promotion
        const hasActivePromotion = promotionsData.data?.some(p => 
          p.listing_id === listing.id
        ) || false

        return {
          ...listing,
          seller,
          media,
          land_details: landDetail,
          promoted: hasActivePromotion || listing.promoted
        }
      })

      setListings(combinedListings)
      
    } catch (err: any) {
      console.error('Error in fetchListings:', err)
      setError(err.message || 'Failed to load land listings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [])

  const formatSize = (size?: number, unit?: string) => {
    if (!size) return 'Size not specified'
    
    if (unit === 'm²' && size >= 10000) {
      return `${(size / 10000).toFixed(1)} hectares`
    }
    
    return `${size.toLocaleString()} ${unit || 'm²'}`
  }

  const formatLocation = (location: string | Location | null): string => {
    if (!location) return 'Location not specified'
    
    if (typeof location === 'string') {
      return location
    }
    
    // Handle Location object
    const locationObj = location as Location
    
    return locationObj.district || 
           locationObj.sector || 
           locationObj.cell || 
           locationObj.village ||
           locationObj.city || 
           locationObj.province || 
           locationObj.address ||
           'Location not specified'
  }

  const getPrimaryImage = (media: ListingMedia[]) => {
    if (!media || media.length === 0) return null
    const primary = media.find(m => m.is_primary)
    return primary || media[0]
  }

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         formatLocation(listing.location).toLowerCase().includes(searchQuery.toLowerCase())
    
    const price = listing.price || 0
    const minPrice = parseInt(priceRange.min) || 0
    const maxPrice = parseInt(priceRange.max) || Infinity
    
    const matchesPrice = (!priceRange.min || price >= minPrice) &&
                        (!priceRange.max || price <= maxPrice)
    
    const landSize = listing.land_details?.plot_size || 0
    const minSize = parseInt(sizeRange.min) || 0
    const maxSize = parseInt(sizeRange.max) || Infinity
    
    const matchesSize = (!sizeRange.min || landSize >= minSize) &&
                       (!sizeRange.max || landSize <= maxSize)
    
    const matchesPlotType = !plotType || listing.land_details?.plot_type === plotType
    const matchesRoadAccess = !roadAccess || listing.land_details?.road_access === roadAccess
    
    return matchesSearch && matchesPrice && matchesSize && matchesPlotType && matchesRoadAccess
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading land listings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load listings</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Common issues:</p>
            <ul className="text-sm text-gray-500 list-disc list-inside">
              <li>Check your Supabase connection</li>
              <li>Verify you have land listings in your database</li>
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
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Trees className="h-8 w-8 mr-3 text-red-600" />
                Land & Plots
              </h1>
              <p className="text-gray-600 mt-2">
                Find the perfect plot from {listings.length} available listings
              </p>
            </div>
            <Link href="/create-listing?category=land">
              <Button className="bg-red-600 hover:bg-red-700">
                List Your Land
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 mr-2 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or location..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Plot Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plot Type
                </label>
                <select
                  value={plotType}
                  onChange={(e) => setPlotType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Types</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="agricultural">Agricultural</option>
                  <option value="industrial">Industrial</option>
                  <option value="mixed_use">Mixed Use</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (RWF)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                    placeholder="Min"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                    placeholder="Max"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Size Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Range (m²)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={sizeRange.min}
                    onChange={(e) => setSizeRange({...sizeRange, min: e.target.value})}
                    placeholder="Min"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="number"
                    value={sizeRange.max}
                    onChange={(e) => setSizeRange({...sizeRange, max: e.target.value})}
                    placeholder="Max"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Road Access */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Road Access
                </label>
                <select
                  value={roadAccess}
                  onChange={(e) => setRoadAccess(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Any Access</option>
                  <option value="tarmac">Tarmac</option>
                  <option value="murram">Murram</option>
                  <option value="gravel">Gravel</option>
                  <option value="footpath">Footpath</option>
                  <option value="none">None</option>
                </select>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-red-600 text-red-600 hover:bg-red-50"
                onClick={() => {
                  setSearchQuery('')
                  setPriceRange({ min: '', max: '' })
                  setSizeRange({ min: '', max: '' })
                  setPlotType('')
                  setRoadAccess('')
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredListings.length} of {listings.length} plots
              </p>
              <div className="text-sm text-gray-500">
                {filteredListings.length === 0 ? 'No results found' : 'Sorted by: Newest'}
              </div>
            </div>

            {/* Listings */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map((listing) => {
                  const primaryImage = getPrimaryImage(listing.media)
                  
                  return (
                    <Card key={listing.id} className="hover:shadow-lg transition-shadow group">
                      <div className="relative">
                        <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                          {primaryImage ? (
                            <img
                              src={primaryImage.url}
                              alt={listing.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = `https://via.placeholder.com/400x300/cccccc/969696?text=Land+Plot`
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <Trees className="h-16 w-16 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
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
                        
                        {listing.land_details?.plot_type && (
                          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold capitalize">
                            {listing.land_details.plot_type}
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {listing.title}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl font-bold text-red-600">
                            {listing.currency} {listing.price?.toLocaleString() || 'Price on request'}
                          </span>
                          {listing.price_type && listing.price_type !== 'fixed' && (
                            <span className="text-sm text-gray-600 capitalize">
                              {listing.price_type}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{formatLocation(listing.location)}</span>
                        </p>
                        
                        <AdminContactInfo className="mb-4" />
                        
                        {/* Land Features */}
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Ruler className="h-4 w-4 mr-1" />
                            {formatSize(listing.land_details?.plot_size, listing.land_details?.size_unit)}
                          </div>
                          {listing.land_details?.road_access && (
                            <div className="flex items-center">
                              <span className={`w-2 h-2 rounded-full mr-1 ${
                                listing.land_details.road_access === 'tarmac' ? 'bg-green-500' :
                                listing.land_details.road_access === 'murram' ? 'bg-yellow-500' :
                                listing.land_details.road_access === 'gravel' ? 'bg-amber-500' : 'bg-gray-500'
                              }`}></span>
                              <span className="capitalize">{listing.land_details.road_access}</span>
                            </div>
                          )}
                        </div>

                        {/* Status badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {listing.land_details?.shape && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded capitalize">
                              {listing.land_details.shape}
                            </span>
                          )}
                          {listing.land_details?.fenced && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Fenced
                            </span>
                          )}
                          {listing.land_details?.surveyed && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              Surveyed
                            </span>
                          )}
                          {listing.transaction_type && (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded capitalize">
                              For {listing.transaction_type}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {listing.views || 0}
                            </span>
                            <span className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              {listing.likes || 0}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(listing.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FavoriteButton 
                              listingId={listing.id} 
                              size="sm"
                              className="flex-shrink-0"
                            />
                            <Link href={`/listings/land/${listing.id}`}>
                              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              /* No Results */
              <div className="text-center py-12">
                <Trees className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {listings.length === 0 ? 'No land listings yet' : 'No plots found matching your criteria'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {listings.length === 0 
                    ? 'Be the first to list your land property!'
                    : 'Try adjusting your filters or search criteria'}
                </p>
                {listings.length === 0 ? (
                  <Link href="/create-listing?category=land">
                    <Button className="bg-red-600 hover:bg-red-700">
                      List Your Land
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    variant="outline" 
                    className="border-red-600 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setSearchQuery('')
                      setPriceRange({ min: '', max: '' })
                      setSizeRange({ min: '', max: '' })
                      setPlotType('')
                      setRoadAccess('')
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}