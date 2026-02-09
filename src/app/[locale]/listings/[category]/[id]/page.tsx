'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Database } from '@/types/database'
import type { PaymentMethod, CryptoType } from '@/types/payment'
import AdminContactInfo from '@/components/listing/admin-contact'
import FavoriteButton from '@/components/listing/favorite-button'
import InquiryButton from '@/components/listing/inquiry-button'
import LikesDisplay from '@/components/listing/likes-display'
import ViewsDisplay from '@/components/listing/views-display'
import { usePaymentContext } from '@/contexts/PaymentContext'

type Listing = Database['public']['Tables']['listings']['Row'] & {
  seller?: {
    id: string
    full_name: string | null
    email: string | null
    avatar_url: string | null
  }
  house_details?: Database['public']['Tables']['house_details']['Row']
  car_details?: Database['public']['Tables']['car_details']['Row']
  land_details?: Database['public']['Tables']['land_details']['Row']
}

type ListingMedia = Database['public']['Tables']['listing_media']['Row']

export default function ListingDetailPage() {
  const router = useRouter()
  const params = useParams() as { locale: string; category: string; id: string }
  const { category, id } = params
  
  // Debug: Log the actual ID value
  console.log('🔍 Route params:', params)
  console.log('Raw ID:', id, 'Type:', typeof id, 'Is string "undefined":', id === 'undefined')
  
  // Check for invalid ID (including string "undefined")
  if (!id || id === 'undefined' || id === 'null') {
    console.error('❌ Invalid ID provided:', id)
    notFound() // Shows Next.js 404 page
  }
  
  const { paymentSettings } = usePaymentContext()
  
  const [listing, setListing] = useState<Listing | null>(null)
  const [media, setMedia] = useState<ListingMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [similarListings, setSimilarListings] = useState<Listing[]>([])
  const [error, setError] = useState('')
  const [showVisitModal, setShowVisitModal] = useState(false)
  const [visitMethod, setVisitMethod] = useState<PaymentMethod>('mtn_momo')
  const [visitSubmitting, setVisitSubmitting] = useState(false)
  const [visitError, setVisitError] = useState('')
  const [visitSuccess, setVisitSuccess] = useState('')
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [paymentStep, setPaymentStep] = useState<'details' | 'proof' | 'confirmation'>('details')
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>([])
  const [visitFeeAmount] = useState(15000)

  const trackView = async (listingId: string) => {
  try {
    await fetch('/api/track-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listingId }),
    })
  } catch (error) {
    console.error('Error tracking view:', error)
  }
}

const fetchSimilarListings = async (currentListing: Listing) => {
    try {
      const { supabaseClient } = await import('@/lib/supabase-client')
      const { data, error } = await supabaseClient
        .from('listings')
        .select(`
          id,
          title,
          price,
          currency,
          location,
          transaction_type,
          price_type,
          media:listing_media(
            url,
            media_type
          ).order('is_primary', { ascending: false }).limit(1)
        `)
        .eq('category', currentListing.category)
        .eq('status', 'available')
        .neq('id', currentListing.id)
        .limit(6)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching similar listings:', error)
      } else {
        setSimilarListings(data || [])
      }
    } catch (err) {
      console.error('Error fetching similar listings:', err)
    }
  }

  useEffect(() => {
    let isActive = true

    const fetchListing = async () => {
      console.log('🔍 fetchListing called with id:', id, typeof id)
      
      // Check for invalid ID (including string "undefined")
      if (!id || id === 'undefined' || id === 'null') {
        console.log('⚠️ Invalid ID provided, returning early')
        if (isActive) {
          setLoading(false)
          setError('Invalid listing ID')
        }
        return
      }
      
      setLoading(true)
      setError('')

      try {
        const { supabaseClient } = await import('@/lib/supabase-client')
        console.log('📋 Fetching listing with ID:', id)
        
        const { data, error: listingError } = await supabaseClient
          .from('listings')
          .select(`
            *,
            seller:users!listings_seller_id_fkey(
              id,
              full_name,
              email,
              avatar_url
            ),
            listing_media(
              id,
              url,
              public_id,
              media_type,
              order_index,
              is_primary
            ),
            house_details(
              id,
              listing_id,
              property_type,
              bedrooms,
              bathrooms,
              total_area,
              year_built,
              condition,
              furnished,
              parking,
              features,
              utilities_included,
              rent_duration,
              security_deposit,
              advance_payment,
              minimum_lease_period,
              available_from
            ),
            car_details(
              id,
              listing_id,
              vehicle_type,
              make,
              model,
              year_manufacture,
              condition,
              fuel_type,
              transmission,
              engine_capacity,
              mileage,
              color,
              doors,
              seats,
              features,
              ownership_papers,
              insurance_status,
              road_worthiness,
              last_service_date,
              rental_daily_rate,
              rental_weekly_rate,
              rental_monthly_rate,
              security_deposit,
              minimum_rental_period,
              delivery_option,
              driver_included
            ),
            land_details(
              id,
              listing_id,
              plot_type,
              plot_size,
              size_unit,
              shape,
              topography,
              soil_type,
              road_access,
              fenced,
              utilities_available,
              land_title_type,
              title_deed_number,
              surveyed,
              zoning_approval,
              development_permits,
              tax_clearance,
              nearest_main_road_distance,
              nearest_town_distance,
              nearby_amenities
            ),
            other_item_details(
              id,
              listing_id,
              subcategory,
              brand,
              model,
              condition,
              warranty_available,
              warranty_period,
              reason_for_selling,
              original_purchase_date,
              age_of_item
            )
          `)
          .eq('id', id)
          .single()

        if (listingError || !data) {
          if (isActive) {
            setError('Listing not found')
            setLoading(false)
          }
          return
        }

        console.log('📋 Full listing data:', data)
        console.log('🚗 Car details in listing:', (data as any).car_details)
        console.log('🏠 House details in listing:', (data as any).house_details)
        console.log('🌳 Land details in listing:', (data as any).land_details)

        if ((data as any).category !== category) {
          if (isActive) {
            setError('Listing not found')
            setLoading(false)
          }
          return
        }

        const { data: mediaData, error: mediaError } = await supabaseClient
          .from('listing_media')
          .select('*')
          .eq('listing_id', id)
          .order('order_index', { ascending: true })

        console.log('📸 Media query result:', {
          listingId: id,
          mediaData,
          mediaError,
          mediaCount: mediaData?.length || 0
        })

        if (isActive) {
          setListing(data as Listing)
          setMedia(mediaData || [])
          setSelectedImageIndex(0)
          setLoading(false)
        }

        if (data) {
          fetchSimilarListings(data as Listing)
          // Track the view
          trackView(id)
        }
      } catch (err) {
        console.error('Error fetching listing:', err)
        if (isActive) {
          setError('Listing not found')
          setLoading(false)
        }
      }
    }

    fetchListing()

    return () => {
      isActive = false
    }
  }, [category, id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 no-overflow-x">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 lg:px-8 py-4 sm:py-8">
          <p className="text-gray-600 text-sm sm:text-base">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 no-overflow-x">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 lg:px-8 py-4 sm:py-8">
          <Button variant="outline" onClick={() => router.back()} className="touch-target">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="mt-4 sm:mt-6 text-gray-700 text-sm sm:text-base">{error || 'Listing not found'}</div>
        </div>

        {/* Similar Items Section */}
        {similarListings.length > 0 && (
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Similar Items You Might Like</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {similarListings.map((similarListing) => (
                    <Card key={similarListing.id} className="hover:shadow-lg transition-shadow cursor-pointer touch-target">
                      <CardContent className="p-3 sm:p-4">
                        <div className="relative">
                          {(similarListing as any).media && (similarListing as any).media.length > 0 ? (
                            <img
                              src={(similarListing as any).media[0].url}
                              alt={(similarListing as any).title}
                              className="w-full h-24 sm:h-28 md:h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-24 sm:h-28 md:h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                              <div className="text-gray-400 text-2xl sm:text-3xl mb-1 sm:mb-2">📷</div>
                              <p className="text-gray-500 text-xs sm:text-sm">No media available</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 sm:mt-3">
                          <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                            {similarListing.title}
                          </h4>
                          <div className="text-base sm:text-lg lg:text-xl font-bold text-red-600 mb-1 sm:mb-2">
                            {similarListing.currency} {similarListing.price?.toLocaleString()}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 capitalize">
                            {similarListing.transaction_type} • {similarListing.price_type}
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {(() => {
                              const similarLocation = similarListing.location as any
                              console.log('📍 Similar listing location:', similarLocation)
                              
                              if (!similarLocation) return 'Location not specified'
                              
                              if (typeof similarLocation === 'string') {
                                return similarLocation
                              }
                              
                              if (typeof similarLocation === 'object' && similarLocation !== null) {
                                return similarLocation.district || 
                                       similarLocation.sector || 
                                       similarLocation.province || 
                                       'Location not specified'
                              }
                              
                              return 'Location not specified'
                            })()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  const primaryImage = media.find((m) => m.is_primary) || media[0]
  const price = listing.price?.toLocaleString() || '0'
  const location = listing.location as {
    province?: string
    district?: string
    sector?: string
    cell?: string
    village?: string
    address?: string
  }

  // Helper function to safely extract location string
  const getLocationString = (locationField: any) => {
    if (typeof locationField === 'string') return locationField
    if (typeof locationField === 'object' && locationField !== null) {
      return Object.values(locationField).filter(Boolean).join(', ')
    }
    return ''
  }

  // Helper function to mask phone numbers
  const maskPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber || phoneNumber.length < 4) return phoneNumber
    return phoneNumber.slice(0, 3) + '*'.repeat(phoneNumber.length - 4) + phoneNumber.slice(-2)
  }
  const visitPaymentInfo = (listing.visit_fee_payment_methods || {}) as {
    mtn_momo?: { phone_number?: string }
    airtel_money?: { phone_number?: string }
    equity_bank?: { account_name?: string; account_number?: string }
    crypto?: { wallet_address?: string }
  }

  const loadPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payments/methods')
      const data = await response.json()
      if (response.ok && data?.methods) {
        const methods = data.methods.filter((m: any) => m.isActive).map((m: any) => m.id) as PaymentMethod[]
        setAvailableMethods(methods)
        if (methods.length > 0) {
          setVisitMethod(methods[0])
        }
      }
    } catch (err) {
      console.error('Error loading payment methods:', err)
    }
  }

  const submitVisitRequest = async () => {
    setVisitSubmitting(true)
    setVisitError('')
    setVisitSuccess('')
    
    try {
      const { supabaseClient } = await import('@/lib/supabase-client')
      const { data: { session } } = await supabaseClient.auth.getSession()
      if (!session?.access_token) {
        setVisitError('Please login to request a visit')
        return
      }

      // Prepare request body with admin-configured payment details
      const requestBody: any = {
        listing_id: listing.id,
        payment_method: visitMethod,
        visit_fee: visitFeeAmount
      }

      // Add method-specific details from admin settings
      if (visitMethod === 'mtn_momo') {
        requestBody.phone_number = paymentSettings?.mobile_money_details?.mtn?.phone_number || ''
        requestBody.account_name = paymentSettings?.mobile_money_details?.mtn?.account_name || ''
        requestBody.merchant_id = paymentSettings?.mobile_money_details?.mtn?.merchant_id || ''
      } else if (visitMethod === 'airtel_money') {
        requestBody.phone_number = paymentSettings?.mobile_money_details?.airtel?.phone_number || ''
        requestBody.account_name = paymentSettings?.mobile_money_details?.airtel?.account_name || ''
        requestBody.merchant_id = paymentSettings?.mobile_money_details?.airtel?.merchant_id || ''
      } else if (visitMethod === 'equity_bank') {
        requestBody.bank_name = paymentSettings?.bank_details?.bank_name || ''
        requestBody.account_name = paymentSettings?.bank_details?.account_name || ''
        requestBody.account_number = paymentSettings?.bank_details?.account_number || ''
        requestBody.branch_code = paymentSettings?.bank_details?.branch_code || ''
      } else if (visitMethod === 'crypto') {
        requestBody.crypto_type = 'bitcoin' // Default crypto type
        requestBody.wallet_address = '' // Will be configured by admin
      }

      // Add payment screenshot if uploaded
      if (paymentScreenshot) {
        const formData = new FormData()
        formData.append('screenshot', paymentScreenshot)
        requestBody.screenshot = formData
      }

      // Add payment proof if uploaded
      if (paymentProof) {
        const formData = new FormData()
        formData.append('proof', paymentProof)
        requestBody.proof = formData
      }

      const response = await fetch('/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()
      if (!response.ok) {
        setVisitError(result.error || 'Failed to request visit')
        return
      }

      // Move to proof upload step after successful request
      setPaymentStep('proof')
      setVisitSuccess('Thank you for your payment. Please allow 10-20 minutes for payment confirmation. Once verified, you will receive a call to schedule your visit dates and provide you with the details of the assigned agent who will conduct the property tour.')
      setShowVisitModal(false) // Close the modal after successful submission
      
    } catch (err: any) {
      setVisitError(err.message || 'Failed to request visit')
    } finally {
      setVisitSubmitting(false)
    }
  }

  const renderCategoryDetails = () => {
    if (!listing) return null

    switch (listing.category) {
      case 'houses':
        console.log('🏠 House details data:', (listing as any).house_details)
        console.log('🏠 House details keys:', (listing as any).house_details ? Object.keys((listing as any).house_details) : 'null')
        
        // Handle case where house_details comes back as array
        const houseDetails = (listing as any).house_details
        const houseDetailsObj = Array.isArray(houseDetails) ? houseDetails[0] : houseDetails
        
        console.log('🏠 Processed house details:', houseDetailsObj)
        
        if (!houseDetailsObj) return null
        return (
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Property Type</span>
                  <p className="font-medium capitalize">{houseDetailsObj?.property_type || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Condition</span>
                  <p className="font-medium capitalize">{houseDetailsObj?.condition || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Bedrooms</span>
                  <p className="font-medium">{houseDetailsObj?.bedrooms || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Bathrooms</span>
                  <p className="font-medium">{houseDetailsObj?.bathrooms || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Total Area</span>
                  <p className="font-medium">{houseDetailsObj?.total_area || 'Not specified'} m²</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Year Built</span>
                  <p className="font-medium">{houseDetailsObj?.year_built || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Furnished</span>
                  <p className="font-medium capitalize">{houseDetailsObj?.furnished || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Parking</span>
                  <p className="font-medium capitalize">{houseDetailsObj?.parking || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'cars':
        console.log('🚗 Car details data:', (listing as any).car_details)
        console.log('🚗 Car details keys:', (listing as any).car_details ? Object.keys((listing as any).car_details) : 'null')
        
        // Handle case where car_details comes back as array
        const carDetails = (listing as any).car_details
        const carDetailsObj = Array.isArray(carDetails) ? carDetails[0] : carDetails
        
        console.log('🚗 Processed car details:', carDetailsObj)
        
        if (!carDetailsObj) return null
        return (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Vehicle Type</span>
                  <p className="font-medium capitalize">{carDetailsObj?.vehicle_type || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Condition</span>
                  <p className="font-medium capitalize">{carDetailsObj?.condition || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Make</span>
                  <p className="font-medium">{carDetailsObj?.make || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Model</span>
                  <p className="font-medium">{carDetailsObj?.model || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Year Manufacture</span>
                  <p className="font-medium">{carDetailsObj?.year_manufacture || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Mileage</span>
                  <p className="font-medium">{carDetailsObj?.mileage || 'Not specified'} km</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Fuel Type</span>
                  <p className="font-medium capitalize">{carDetailsObj?.fuel_type || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Transmission</span>
                  <p className="font-medium capitalize">{carDetailsObj?.transmission || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Color</span>
                  <p className="font-medium capitalize">{carDetailsObj?.color || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Doors</span>
                  <p className="font-medium">{carDetailsObj?.doors || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Seats</span>
                  <p className="font-medium">{carDetailsObj?.seats || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Engine Capacity</span>
                  <p className="font-medium">{carDetailsObj?.engine_capacity || 'Not specified'} cc</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'land':
        console.log('🌳 Land details data:', (listing as any).land_details)
        console.log('🌳 Land details keys:', (listing as any).land_details ? Object.keys((listing as any).land_details) : 'null')
        
        // Handle case where land_details comes back as array
        const landDetails = (listing as any).land_details
        const landDetailsObj = Array.isArray(landDetails) ? landDetails[0] : landDetails
        
        console.log('🌳 Processed land details:', landDetailsObj)
        
        if (!landDetailsObj) return null
        return (
          <Card>
            <CardHeader>
              <CardTitle>Land Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Plot Type</span>
                  <p className="font-medium capitalize">{landDetailsObj?.plot_type || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Shape</span>
                  <p className="font-medium capitalize">{landDetailsObj?.shape || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Plot Size</span>
                  <p className="font-medium">{landDetailsObj?.plot_size || 'Not specified'} {landDetailsObj?.size_unit}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Topography</span>
                  <p className="font-medium capitalize">{landDetailsObj?.topography || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Road Access</span>
                  <p className="font-medium capitalize">{landDetailsObj?.road_access || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Land Title Type</span>
                  <p className="font-medium capitalize">{landDetailsObj?.land_title_type || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Fenced</span>
                  <p className="font-medium">{landDetailsObj?.fenced ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Surveyed</span>
                  <p className="font-medium">{landDetailsObj?.surveyed ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Soil Type</span>
                  <p className="font-medium capitalize">{landDetailsObj?.soil_type || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Zoning Approval</span>
                  <p className="font-medium">{landDetailsObj?.zoning_approval ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'other':
        console.log('📦 Other item details data:', (listing as any).other_item_details)
        console.log('📦 Other item details keys:', (listing as any).other_item_details ? Object.keys((listing as any).other_item_details) : 'null')
        
        // Handle case where other_item_details comes back as array
        const otherDetails = (listing as any).other_item_details
        const otherDetailsObj = Array.isArray(otherDetails) ? otherDetails[0] : otherDetails
        
        console.log('📦 Processed other item details:', otherDetailsObj)
        
        if (!otherDetailsObj) return null
        return (
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Subcategory</span>
                  <p className="font-medium capitalize">{otherDetailsObj?.subcategory || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Brand</span>
                  <p className="font-medium">{otherDetailsObj?.brand || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Model</span>
                  <p className="font-medium">{otherDetailsObj?.model || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Condition</span>
                  <p className="font-medium capitalize">{otherDetailsObj?.condition || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Warranty Available</span>
                  <p className="font-medium">{otherDetailsObj?.warranty_available ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Warranty Period</span>
                  <p className="font-medium">{otherDetailsObj?.warranty_period || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Reason for Selling</span>
                  <p className="font-medium">{otherDetailsObj?.reason_for_selling || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Original Purchase Date</span>
                  <p className="font-medium">{otherDetailsObj?.original_purchase_date || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Age of Item</span>
                  <p className="font-medium">{otherDetailsObj?.age_of_item || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 lg:px-8 py-4 sm:py-8">
        <Button variant="outline" onClick={() => router.back()} className="touch-target">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card>
              <CardContent className="p-0">
                {/* Image Gallery */}
                <div className="relative">
                  {media.length > 0 ? (
                    <div className="space-y-4">
                      {/* Main Image Display with Navigation */}
                      <div className="relative group">
                        {media[selectedImageIndex]?.media_type === 'video' ? (
                          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <video
                              src={media[selectedImageIndex].url}
                              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                              controls
                              autoPlay={false}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={media[selectedImageIndex]?.url}
                            alt={listing.title}
                            className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg"
                          />
                        )}
                        
                        {/* Navigation Arrows */}
                        {media.length > 1 && (
                          <>
                            {/* Left Arrow */}
                            <button
                              onClick={() => setSelectedImageIndex((prev) => prev === 0 ? media.length - 1 : prev - 1)}
                              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg touch-target"
                              aria-label="Previous image"
                            >
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            
                            {/* Right Arrow */}
                            <button
                              onClick={() => setSelectedImageIndex((prev) => (prev + 1) % media.length)}
                              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg touch-target"
                              aria-label="Next image"
                            >
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </>
                        )}
                        
                        {/* Primary Badge */}
                        {media[selectedImageIndex]?.is_primary && (
                          <Badge className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-600 text-white text-xs">
                            Primary
                          </Badge>
                        )}
                        
                        {/* Media Type Badge */}
                        {media[selectedImageIndex]?.media_type === 'video' && (
                          <Badge className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-blue-600 text-white text-xs">
                            Video
                          </Badge>
                        )}
                      </div>

                      {/* Thumbnail Gallery */}
                      {media.length > 1 && (
                        <>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                            {media.map((item, index) => (
                              <div
                                key={item.id}
                                className={`relative group cursor-pointer ${
                                  selectedImageIndex === index ? 'ring-2 ring-blue-500 rounded-lg' : ''
                                }`}
                                onClick={() => setSelectedImageIndex(index)}
                              >
                                {item.media_type === 'video' ? (
                                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                    <video
                                      src={item.url}
                                      className="w-full h-full object-cover"
                                      muted
                                      onMouseEnter={(e) => {
                                        const video = e.target as HTMLVideoElement
                                        if (video) video.play()
                                      }}
                                      onMouseLeave={(e) => {
                                        const video = e.target as HTMLVideoElement
                                        if (video) video.pause()
                                      }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                      </svg>
                                    </div>
                                  </div>
                                ) : (
                                  <img
                                    src={item.url}
                                    alt={`${listing.title} - ${index + 1}`}
                                    className="w-full h-14 sm:h-16 md:h-20 object-cover rounded-lg"
                                  />
                                )}
                                {item.is_primary && (
                                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {/* Dot Indicators */}
                          <div className="flex justify-center space-x-1.5 sm:space-x-2 mt-3 sm:mt-4">
                            {media.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedImageIndex(index)}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors touch-target ${
                                  selectedImageIndex === index
                                    ? 'bg-blue-600'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                                aria-label={`Go to image ${index + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-gray-400 text-4xl sm:text-5xl md:text-6xl mb-2">📷</div>
                        <p className="text-gray-500 text-xs sm:text-sm">No media available</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
              </CardContent>
            </Card>

            {renderCategoryDetails()}
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <CardTitle>{listing.title}</CardTitle>
                  <div className="flex items-center gap-4">
                    <LikesDisplay 
                      listingId={listing.id} 
                      likesCount={listing.likes || 0}
                      className="text-sm"
                    />
                    <ViewsDisplay 
                      listingId={listing.id} 
                      viewsCount={listing.views || 0}
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold text-red-600">
                  {listing.currency} {price}
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {listing.transaction_type} • {listing.price_type}
                </div>
                <div className="flex items-start text-sm text-gray-700">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <div>
                    {[
                      getLocationString(location?.address),
                      getLocationString(location?.sector),
                      getLocationString(location?.district),
                      getLocationString(location?.province)
                    ]
                      .filter(Boolean)
                      .join(', ') || 'Location not provided'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For any questions, ideas, or inquiries, reach out to us on this number</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {listing.seller?.full_name || 'Unknown Seller'}
                    </div>
                  </div>
                </div>
                
                <AdminContactInfo />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visit Fee</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-700">
                  Visit fee: <strong>{listing.visit_fee_amount?.toLocaleString() || visitFeeAmount.toLocaleString()} RWF</strong>
                </div>
                <div className="text-xs text-gray-600">
                  Seller receives 70%. Platform keeps 30%.
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 space-y-1">
                  {visitPaymentInfo.mtn_momo?.phone_number && (
                    <div>MTN MoMo: {maskPhoneNumber(visitPaymentInfo.mtn_momo.phone_number)}</div>
                  )}
                  {visitPaymentInfo.airtel_money?.phone_number && (
                    <div>Airtel Money: {maskPhoneNumber(visitPaymentInfo.airtel_money.phone_number)}</div>
                  )}
                  {visitPaymentInfo.equity_bank?.account_number && (
                    <div>
                      Equity: {visitPaymentInfo.equity_bank.account_name || 'Account'} • {visitPaymentInfo.equity_bank.account_number}
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-3">
                  <InquiryButton 
                    listingId={listing.id} 
                    sellerId={listing.seller_id || ''} 
                    title={listing.title}
                    className="w-full"
                  />
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => {
                        loadPaymentMethods()
                        setShowVisitModal(true)
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      Request a Visit
                    </Button>
                    <FavoriteButton 
                      listingId={listing.id} 
                      size="md"
                      className="flex-shrink-0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showVisitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold">Request a Visit</h3>
                <button
                  onClick={() => setShowVisitModal(false)}
                  className="text-gray-400 hover:text-gray-600 touch-target p-1"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              <div className="text-sm text-gray-700">
                Visit fee: <strong>{visitFeeAmount.toLocaleString()} RWF</strong>
              </div>
              <div className="text-xs text-gray-600">
                Seller receives 70%. Platform keeps 30%.
              </div>
              
              {/* Payment proof upload */}
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                  <h4 className="font-medium mb-2">Upload payment proof</h4>
                  <input
                      id="payment-proof-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e: any) => setPaymentProof(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      aria-label="Upload payment confirmation"
                      title="Upload screenshot or photo of payment confirmation"
                    />
                    {paymentProof && (
                      <div className="mt-2 text-xs text-gray-500">
                        Proof: {paymentProof.name}
                        <button
                          type="button"
                          onClick={() => setPaymentProof(null)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  id="payment-method"
                  value={visitMethod}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVisitMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  title="Payment Method Selection"
                >
                  {availableMethods.map((method) => {
                    const methodNames: Record<PaymentMethod, string> = {
                      mtn_momo: 'MTN Mobile Money',
                      airtel_money: 'Airtel Money',
                      equity_bank: 'Equity Bank',
                      crypto: 'Cryptocurrency',
                      wallet: 'Wallet Balance'
                    }
                    return (
                      <option key={method} value={method}>
                        {methodNames[method] || method}
                      </option>
                    )
                  })}
                </select>

                {(visitMethod === 'mtn_momo' || visitMethod === 'airtel_money') && (
                  <div className="space-y-3">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        {visitMethod === 'mtn_momo' ? 'MTN Mobile Money' : 'Airtel Money'} Payment Details
                      </h4>
                      <p className="text-xs text-gray-600 mb-3">Send payment to the number below:</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Phone Number:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {visitMethod === 'mtn_momo' 
                              ? paymentSettings?.mobile_money_details?.mtn?.phone_number || 'Not configured'
                              : paymentSettings?.mobile_money_details?.airtel?.phone_number || 'Not configured'
                            }
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Account Name:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {visitMethod === 'mtn_momo' 
                              ? paymentSettings?.mobile_money_details?.mtn?.account_name || 'Not configured'
                              : paymentSettings?.mobile_money_details?.airtel?.account_name || 'Not configured'
                            }
                          </span>
                        </div>
                        
                        {(visitMethod === 'mtn_momo' 
                          ? paymentSettings?.mobile_money_details?.mtn?.merchant_id
                          : paymentSettings?.mobile_money_details?.airtel?.merchant_id) && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Merchant ID:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {visitMethod === 'mtn_momo' 
                                ? paymentSettings?.mobile_money_details?.mtn?.merchant_id
                                : paymentSettings?.mobile_money_details?.airtel?.merchant_id
                              }
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {(visitMethod === 'mtn_momo' 
                        ? paymentSettings?.mobile_money_details?.mtn?.payment_instructions
                        : paymentSettings?.mobile_money_details?.airtel?.payment_instructions) && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm font-medium text-blue-800 mb-1">Payment Instructions:</p>
                          <p className="text-sm text-blue-700">
                            {visitMethod === 'mtn_momo' 
                              ? paymentSettings?.mobile_money_details?.mtn?.payment_instructions
                              : paymentSettings?.mobile_money_details?.airtel?.payment_instructions
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {visitMethod === 'equity_bank' && (
                  <div className="space-y-3">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Bank Transfer Details</h4>
                      <p className="text-xs text-gray-600 mb-3">Send payment to the account below:</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Bank Name:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {paymentSettings?.bank_details?.bank_name || 'Not configured'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Account Name:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {paymentSettings?.bank_details?.account_name || 'Not configured'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Account Number:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {paymentSettings?.bank_details?.account_number || 'Not configured'}
                          </span>
                        </div>
                        
                        {paymentSettings?.bank_details?.branch_code && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Branch Code:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {paymentSettings?.bank_details?.branch_code}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {visitMethod === 'crypto' && (
                  <div className="space-y-3">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Cryptocurrency Payment</h4>
                      <p className="text-sm text-gray-600">
                        Cryptocurrency payment details will be displayed here once configured by administrator.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowVisitModal(false)}
                  className="flex-1"
                  aria-label="Cancel visit request"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitVisitRequest}
                  disabled={visitSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  aria-label="Submit visit request"
                >
                  {visitSubmitting ? 'Submitting...' : 'Pay Visit Fee'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
