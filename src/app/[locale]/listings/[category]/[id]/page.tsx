'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Database } from '@/types/database'
import type { PaymentMethod, CryptoType } from '@/types/payment'
import AdminContactInfo from '@/components/listing/admin-contact'

type Listing = Database['public']['Tables']['listings']['Row'] & {
  seller?: {
    id: string
    full_name: string | null
    email: string | null
    avatar_url: string | null
  }
}

type ListingMedia = Database['public']['Tables']['listing_media']['Row']

export default function ListingDetailPage() {
  const router = useRouter()
  const params = useParams() as { locale: string; category: string; id: string }
  const { category, id } = params

  const [listing, setListing] = useState<Listing | null>(null)
  const [media, setMedia] = useState<ListingMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [similarListings, setSimilarListings] = useState<Listing[]>([])
  const [error, setError] = useState('')
  const [showVisitModal, setShowVisitModal] = useState(false)
  const [visitMethod, setVisitMethod] = useState<PaymentMethod>('mtn_momo')
  const [visitPhone, setVisitPhone] = useState('')
  const [visitCrypto, setVisitCrypto] = useState<CryptoType>('bitcoin')
  const [visitSubmitting, setVisitSubmitting] = useState(false)
  const [visitError, setVisitError] = useState('')
  const [visitSuccess, setVisitSuccess] = useState('')
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>([])

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
      if (!id) return
      setLoading(true)
      setError('')

      try {
        const { supabaseClient } = await import('@/lib/supabase-client')
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
  const visitFeeAmount = listing.visit_fee_amount || 15000
  const visitPaymentInfo = (listing.visit_fee_payment_methods || {}) as {
    mtn_momo?: { phone_number?: string }
    airtel_money?: { phone_number?: string }
    equity_bank?: { account_name?: string; account_number?: string }
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
      // Fallback to all methods if API fails
      const fallbackMethods: PaymentMethod[] = ['mtn_momo', 'airtel_money', 'equity_bank', 'crypto', 'wallet']
      setAvailableMethods(fallbackMethods)
      setVisitMethod('mtn_momo') // Default to MTN Mobile Money
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

      const response = await fetch('/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          listing_id: listing.id,
          payment_method: visitMethod,
          phone_number: visitPhone,
          crypto_type: visitCrypto
        })
      })

      const result = await response.json()
      if (!response.ok) {
        setVisitError(result.error || 'Failed to request visit')
        return
      }

      setVisitSuccess('Visit request submitted. Please complete the payment prompt.')
    } catch (err: any) {
      setVisitError(err.message || 'Failed to request visit')
    } finally {
      setVisitSubmitting(false)
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
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{listing.title}</CardTitle>
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
                <CardTitle>Seller</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {listing.seller?.full_name || 'Unknown Seller'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {listing.seller?.email || 'No email'}
                  </div>
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <AdminContactInfo />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visit Fee</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-700">
                  Visit fee: <strong>{visitFeeAmount.toLocaleString()} RWF</strong>
                </div>
                <div className="text-xs text-gray-600">
                  Seller receives 70%. Platform keeps 30%.
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 space-y-1">
                  {visitPaymentInfo.mtn_momo?.phone_number && (
                    <div>MTN MoMo: {visitPaymentInfo.mtn_momo.phone_number}</div>
                  )}
                  {visitPaymentInfo.airtel_money?.phone_number && (
                    <div>Airtel Money: {visitPaymentInfo.airtel_money.phone_number}</div>
                  )}
                  {visitPaymentInfo.equity_bank?.account_number && (
                    <div>
                      Equity: {visitPaymentInfo.equity_bank.account_name || 'Account'} • {visitPaymentInfo.equity_bank.account_number}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => {
                    loadPaymentMethods()
                    setShowVisitModal(true)
                  }}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Request a Visit
                </Button>
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

              {visitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {visitError}
                </div>
              )}
              {visitSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                  {visitSuccess}
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  value={visitMethod}
                  onChange={(e) => setVisitMethod(e.target.value as PaymentMethod)}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={visitPhone}
                      onChange={(e) => setVisitPhone(e.target.value)}
                      placeholder="078X XXX XXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}

                {visitMethod === 'crypto' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cryptocurrency</label>
                    <select
                      value={visitCrypto}
                      onChange={(e) => setVisitCrypto(e.target.value as CryptoType)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      title="Cryptocurrency Selection"
                    >
                      <option value="bitcoin">Bitcoin</option>
                      <option value="ethereum">Ethereum</option>
                      <option value="usdt">USDT</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowVisitModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitVisitRequest}
                  disabled={visitSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700"
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
