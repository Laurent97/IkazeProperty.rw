'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, MapPin, Calendar, Fuel, Settings, Heart, Eye, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import AdminContactInfo from '@/components/listing/admin-contact'

interface CarListing {
  id: string
  title: string
  description: string
  price: number
  currency: string
  price_type: string
  category: string
  transaction_type: string
  status: string
  location: any
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
  visit_fee_payment_methods: any
  seller: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
    phone_number?: string
    verified: boolean
  } | null
  media: {
    id: string
    listing_id: string
    url: string
    public_id: string
    media_type: string
    order_index: number
    is_primary: boolean
  }[]
  car_details: {
    id: string
    listing_id: string
    vehicle_type: string
    make: string
    model: string
    year_manufacture: number
    condition: string
    fuel_type: string
    transmission: string
    engine_capacity: number
    mileage: number
    color: string
    doors: number
    seats: number
    features: string[]
    ownership_papers: boolean
    insurance_status: string
    road_worthiness: boolean
    last_service_date: string
    rental_daily_rate?: number
    rental_weekly_rate?: number
    rental_monthly_rate?: number
    security_deposit?: number
    minimum_rental_period?: string
    delivery_option: boolean
    driver_included: boolean
  } | null
}

export default function CarsListingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [year, setYear] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [transmission, setTransmission] = useState('')
  const [transactionType, setTransactionType] = useState('all')
  const [listings, setListings] = useState<CarListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch listings from database
  const fetchListings = async () => {
    try {
      setLoading(true)
      const { supabaseClient } = await import('@/lib/supabase-client')
      
      console.log('Starting to fetch car listings...')
      
      // Try a simpler query first - just get listings
      const { data: listingsData, error: listingsError } = await supabaseClient
        .from('listings')
        .select('*')
        .eq('category', 'cars')
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
      const listingIds = listingsData.map((listing: any) => listing.id)
      
      // Fetch related data in parallel
      const [
        { data: sellersData, error: sellersError },
        { data: mediaData, error: mediaError },
        { data: carDetailsData, error: carDetailsError }
      ] = await Promise.all([
        supabaseClient
          .from('users')
          .select('id, full_name, email, avatar_url, phone_number, verified')
          .in('id', (listingsData as any[]).map((l: any) => l.seller_id)),
        
        supabaseClient
          .from('listing_media')
          .select('id, listing_id, url, public_id, media_type, order_index, is_primary')
          .in('listing_id', listingIds)
          .order('order_index'),
        
        supabaseClient
          .from('car_details')
          .select('*')
          .in('listing_id', listingIds)
      ])
      
      // Log any errors but continue processing
      if (sellersError) console.error('Error fetching sellers:', sellersError)
      if (mediaError) console.error('Error fetching media:', mediaError)
      if (carDetailsError) console.error('Error fetching car details:', carDetailsError)
      
      // Fetch active promotions
      const { data: promotionsData } = await supabaseClient
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
        
        // Find car details for this listing
        const carDetail = carDetailsData?.find((d: any) => d.listing_id === listing.id)
        
        // Check if listing has active promotion
        const hasActivePromotion = promotionsData?.some((p: any) => p.listing_id === listing.id)
        
        return {
          ...listing,
          seller: seller || null,
          media: media || [],
          car_details: carDetail || undefined,
          promoted: hasActivePromotion || listing.promoted
        }
      }) as CarListing[]
      
      console.log('Successfully combined data for', combinedListings.length, 'listings')
      setListings(combinedListings)
      
    } catch (err: any) {
      console.error('Error in fetchListings:', err)
      setError(`Failed to load listings: ${err?.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchListings()
  }, [])
  
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
      // Try to parse the JSONB location
      try {
        // If it's a stringified JSON, parse it
        if (typeof location === 'string') {
          location = JSON.parse(location)
        }
        
        const locationObj = location as Record<string, any>
        return locationObj?.district || 
               locationObj?.sector || 
               locationObj?.cell || 
               locationObj?.village ||
               locationObj?.city || 
               locationObj?.province || 
               locationObj?.address ||
               'Location not specified'
      } catch (e) {
        console.log('Error parsing location:', e)
        return 'Location not specified'
      }
    }
    
    return 'Location not specified'
  }
  
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (listing.car_details?.make?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                         (listing.car_details?.model?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                         formatLocation(listing.location).toLowerCase().includes(searchQuery.toLowerCase())
    
    const price = listing.price || 0
    const minPrice = parseInt(priceRange.min) || 0
    const maxPrice = parseInt(priceRange.max) || Infinity
    
    const matchesPrice = (!priceRange.min || price >= minPrice) &&
                        (!priceRange.max || price <= maxPrice)
    
    const matchesYear = !year || (listing.car_details?.year_manufacture || 0) >= parseInt(year)
    const matchesFuel = !fuelType || listing.car_details?.fuel_type === fuelType
    const matchesTransmission = !transmission || listing.car_details?.transmission === transmission
    const matchesType = transactionType === 'all' || listing.transaction_type === transactionType
    
    return matchesSearch && matchesPrice && matchesYear && matchesFuel && matchesTransmission && matchesType
  })

  return (
    <div className="min-h-screen bg-gray-50 no-overflow-x">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                <Car className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-red-600" />
                Cars & Vehicles
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Find your perfect vehicle from {listings.length} listings
              </p>
            </div>
            <Link href="/create-listing?category=cars">
              <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto touch-target">
                List Vehicle
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
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by make, model, or location..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>
              </div>

              {/* Transaction Type */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  aria-label="Transaction type"
                >
                  <option value="all">All Types</option>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (RWF)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>
              </div>

              {/* Year */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  aria-label="Minimum year"
                >
                  <option value="">Any Year</option>
                  <option value="2023">2023+</option>
                  <option value="2022">2022+</option>
                  <option value="2021">2021+</option>
                  <option value="2020">2020+</option>
                  <option value="2019">2019+</option>
                  <option value="2018">2018+</option>
                  <option value="2017">2017+</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  aria-label="Fuel type"
                >
                  <option value="">Any Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Transmission */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  aria-label="Transmission type"
                >
                  <option value="">Any Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-red-600 text-red-600 hover:bg-red-50 touch-target"
                onClick={() => {
                  setSearchQuery('')
                  setPriceRange({ min: '', max: '' })
                  setYear('')
                  setFuelType('')
                  setTransmission('')
                  setTransactionType('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredListings.length} of {listings.length} vehicles
              </p>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Sort options"
              >
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
                <option>Most Viewed</option>
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading listings...</h3>
                <p className="text-gray-600">Please wait while we fetch the latest vehicles</p>
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
                    <li>Verify you have car listings in your database</li>
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
            
            {/* Listings */}
            {!loading && !error && (
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
                {filteredListings.map((listing) => (
                  <Card key={listing.id} className="hover:shadow-lg transition-shadow group">
                    <div className="relative">
                      <div className="w-full h-40 sm:h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                        {listing.media && listing.media.length > 0 ? (
                          <img
                            src={listing.media.find(m => m.is_primary)?.url || listing.media[0].url}
                            alt={listing.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `https://via.placeholder.com/400x300/cccccc/969696?text=Car+Image`
                            }}
                          />
                        ) : (
                          <span className="text-gray-500 text-sm sm:text-base">Vehicle Image</span>
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
                      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold capitalize">
                        {listing.car_details?.vehicle_type || 'Vehicle'}
                      </div>
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">
                        {listing.title}
                      </h3>
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <span className="text-lg sm:text-2xl font-bold text-red-600">
                          {listing.currency} {listing.price.toLocaleString()}
                          <span className="text-xs sm:text-sm text-gray-500 font-normal">
                            {listing.transaction_type === 'rent' ? '/month' : ''}
                          </span>
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 flex items-center">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {formatLocation(listing.location)}
                      </p>
                      <AdminContactInfo className="mb-3 sm:mb-4" />
                      
                      {/* Vehicle Features */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {listing.car_details?.year_manufacture || 'N/A'}
                        </div>
                        <div className="flex items-center">
                          <Fuel className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {listing.car_details?.fuel_type || 'N/A'}
                        </div>
                        <div className="flex items-center">
                          <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {listing.car_details?.transmission || 'N/A'}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {listing.views || 0}
                          </span>
                          <span className="flex items-center">
                            <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {listing.likes || 0}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(listing.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <Link href={`/listings/cars/${listing.id}`}>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 touch-target">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && !error && filteredListings.length === 0 && (
              <div className="text-center py-12">
                <Car className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No vehicles found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-red-600 text-red-600 hover:bg-red-50 touch-target"
                  onClick={() => {
                    setSearchQuery('')
                    setPriceRange({ min: '', max: '' })
                    setYear('')
                    setFuelType('')
                    setTransmission('')
                    setTransactionType('all')
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
