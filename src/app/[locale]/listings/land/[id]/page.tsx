'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, User, Trees, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Database } from '@/types/database'
import type { PaymentMethod } from '@/types/payment'
import AdminContactInfo from '@/components/listing/admin-contact'
import FavoriteButton from '@/components/listing/favorite-button'
import InquiryButton from '@/components/listing/inquiry-button'
import LikesDisplay from '@/components/listing/likes-display'
import ViewsDisplay from '@/components/listing/views-display'
import ImageViewer from '@/components/listing/ImageViewer'
import { usePaymentContext } from '@/contexts/PaymentContext'

type LandListing = Database['public']['Tables']['listings']['Row'] & {
  seller?: {
    id: string
    full_name: string | null
    email: string | null
    avatar_url: string | null
  }
  land_details?: Database['public']['Tables']['land_details']['Row']
  media: Database['public']['Tables']['listing_media']['Row'][]
}

export default function LandListingDetailPage() {
  const router = useRouter()
  const params = useParams() as { locale: string; id: string }
  const { id } = params
  const { getPlatformInfo } = usePaymentContext()
  const platformInfo = getPlatformInfo()
  
  const [listing, setListing] = useState<LandListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Visit fee states
  const [showVisitPayment, setShowVisitPayment] = useState(false)
  const [visitMethod, setVisitMethod] = useState('')
  const [visitSubmitting, setVisitSubmitting] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [paymentStep, setPaymentStep] = useState<'details' | 'proof' | 'confirmation'>('details')
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>([])
  const [visitFeeAmount] = useState(15000)
  
  // New states for buyer contact info and visit details
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [visitTime, setVisitTime] = useState('')
  const [visitNotes, setVisitNotes] = useState('')

  useEffect(() => {
    if (!id || id === 'undefined' || id === 'null') {
      notFound()
      return
    }
    
    fetchListing()
  }, [id])

  const fetchListing = async () => {
    try {
      setLoading(true)
      setError('')
      
      const { getSupabaseClient } = await import('@/lib/supabase-client')
      const supabaseClient = getSupabaseClient()
      
      // Fetch listing with related data
      const { data: listingData, error: listingError } = await supabaseClient
        .from('listings')
        .select(`
          *,
          seller:users!listings_seller_id_fkey(
            id,
            full_name,
            email,
            avatar_url
          ),
          land_details:land_details(*),
          media:listing_media(*)
        `)
        .eq('id', id)
        .eq('category', 'land')
        .single()

      if (listingError) {
        console.error('Error fetching listing:', listingError)
        throw listingError
      }

      if (!listingData) {
        notFound()
        return
      }

      setListing(listingData as LandListing)
      
    } catch (err: any) {
      console.error('Error in fetchListing:', err)
      setError(err.message || 'Failed to load listing')
    } finally {
      setLoading(false)
    }
  }

  const openImageViewer = (images: string[], startIndex: number) => {
    setSelectedImages(images)
    setCurrentImageIndex(startIndex)
    setIsImageViewerOpen(true)
  }

  const closeImageViewer = () => {
    setIsImageViewerOpen(false)
    setSelectedImages([])
    setCurrentImageIndex(0)
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: currency === 'RWF' ? 'RWF' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatSize = (size?: number, unit?: string) => {
    if (!size) return 'Size not specified'
    
    if (unit === 'm²' && size >= 10000) {
      return `${(size / 10000).toFixed(1)} hectares`
    }
    
    return `${size.toLocaleString()} ${unit || 'm²'}`
  }

  const formatLocation = (location: any): string => {
    if (!location) return 'Location not specified'
    
    if (typeof location === 'string') {
      return location
    }
    
    return location.district || 
           location.sector || 
           location.cell || 
           location.village ||
           location.city || 
           location.province || 
           location.address ||
           'Location not specified'
  }

  const getPrimaryImage = (media: any[]) => {
    if (!media || media.length === 0) return null
    const primary = media.find(m => m.is_primary)
    return primary || media[0]
  }

  // Visit fee functions
  const defaultPaymentMethods = {
    airtel_money: {
      phone_number: '250738123456' // Default Airtel number - replace with actual
    },
    mtn_momo: {
      phone_number: '250788123456' // Default MTN number - replace with actual
    },
    equity_bank: {
      account_name: 'IkazeProperty Ltd',
      account_number: '1234567890' // Default account - replace with actual
    }
  }

  const visitPaymentInfo = {
    ...defaultPaymentMethods,
    ...(listing?.visit_fee_payment_methods as any || {})
  } as {
    mtn_momo?: { phone_number?: string }
    airtel_money?: { phone_number?: string }
    equity_bank?: { account_name?: string; account_number?: string }
    bank_of_kigali?: { account_name?: string; account_number?: string }
  }

  const handleVisitRequest = async () => {
    if (!listing) return

    try {
      setVisitSubmitting(true)
      
      // Get auth token
      const { data: { session } } = await (await import('@/lib/supabase-client')).getSupabaseClient().auth.getSession()
      const token = session?.access_token

      if (!token) {
        throw new Error('You must be logged in to request a visit')
      }

      // Validate required fields
      if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim() || !visitDate.trim() || !visitTime.trim()) {
        throw new Error('Please fill in all required contact information and visit details')
      }

      const requestBody: any = {
        listing_id: listing.id,
        payment_method: visitMethod,
        visit_fee: visitFeeAmount,
        // Add buyer contact information
        buyer_name: buyerName.trim(),
        buyer_email: buyerEmail.trim(),
        buyer_phone: buyerPhone.trim(),
        visit_date: visitDate,
        visit_time: visitTime,
        visit_notes: visitNotes.trim()
      }

      // Add method-specific details from admin settings
      if (visitMethod === 'mtn_momo' && visitPaymentInfo.mtn_momo?.phone_number) {
        requestBody.phone_number = visitPaymentInfo.mtn_momo.phone_number
      } else if (visitMethod === 'airtel_money' && visitPaymentInfo.airtel_money?.phone_number) {
        requestBody.phone_number = visitPaymentInfo.airtel_money.phone_number
      } else if (visitMethod === 'bank_transfer') {
        if (visitPaymentInfo.equity_bank) {
          requestBody.bank_name = 'Equity Bank'
          requestBody.account_name = visitPaymentInfo.equity_bank.account_name
          requestBody.account_number = visitPaymentInfo.equity_bank.account_number
        } else if (visitPaymentInfo.bank_of_kigali) {
          requestBody.bank_name = 'Bank of Kigali'
          requestBody.account_name = visitPaymentInfo.bank_of_kigali.account_name
          requestBody.account_number = visitPaymentInfo.bank_of_kigali.account_number
        }
      }

      const response = await fetch('/api/visits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit visit request')
      }

      const result = await response.json()
      console.log('Visit request submitted:', result)

      setShowVisitPayment(false)
      setPaymentStep('details')
      setVisitMethod('')
      setPhoneNumber('')
      setPaymentProof(null)
      
      // Clear form fields
      setBuyerName('')
      setBuyerEmail('')
      setBuyerPhone('')
      setVisitDate('')
      setVisitTime('')
      setVisitNotes('')
      
      // Show success message with payment reference
      alert(`Visit request submitted successfully! Payment reference: ${result.payment?.reference}. Please complete the payment and seller will be notified.`)
    } catch (error) {
      console.error('Error submitting visit request:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit visit request')
    } finally {
      setVisitSubmitting(false)
    }
  }

  const maskPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber || phoneNumber.length < 4) return phoneNumber
    return phoneNumber.slice(0, 3) + '*'.repeat(phoneNumber.length - 4) + phoneNumber.slice(-2)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading land listing...</p>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load listing</h3>
          <p className="text-gray-600 mb-4">{error || 'Listing not found'}</p>
          <Button 
            onClick={() => router.back()}
            className="bg-red-600 hover:bg-red-700"
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const primaryImage = getPrimaryImage(listing.media || [])
  const allImages = (listing.media || []).filter(m => m.media_type === 'image').map(m => m.url as string) || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-red-600">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/listings" className="hover:text-red-600">Listings</Link>
              <span className="mx-2">/</span>
              <Link href="/listings/land" className="hover:text-red-600">Land</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{listing.title}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <Card className="mb-6">
              <CardContent className="p-0">
                {primaryImage ? (
                  <div className="relative">
                    <img
                      src={primaryImage.url}
                      alt={listing.title}
                      className="w-full h-96 object-cover cursor-pointer"
                      onClick={() => openImageViewer(allImages, 0)}
                    />
                    {listing.featured && (
                      <Badge className="absolute top-4 left-4 bg-red-600">
                        Featured
                      </Badge>
                    )}
                    {listing.promoted && (
                      <Badge className="absolute top-4 right-4 bg-yellow-500">
                        Promoted
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                    <Trees className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                {/* Image Gallery */}
                {allImages.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="grid grid-cols-4 gap-2">
                      {allImages.slice(0, 8).map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Image ${index + 1}`}
                          className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() => openImageViewer(allImages, index)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Listing Details */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {listing.title}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {formatLocation(listing.location)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-600">
                      {formatPrice(listing.price, listing.currency)}
                    </div>
                    {listing.price_type && listing.price_type !== 'fixed' && (
                      <div className="text-sm text-gray-600 capitalize">
                        {listing.price_type}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Land Details */}
            {listing.land_details && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trees className="h-5 w-5 mr-2 text-red-600" />
                    Land Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Plot Size</label>
                      <p className="text-lg font-semibold">
                        {formatSize(listing.land_details.plot_size, listing.land_details.size_unit)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Plot Type</label>
                      <p className="text-lg font-semibold capitalize">
                        {listing.land_details.plot_type}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Shape</label>
                      <p className="text-lg font-semibold capitalize">
                        {listing.land_details.shape}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Topography</label>
                      <p className="text-lg font-semibold capitalize">
                        {listing.land_details.topography}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Road Access</label>
                      <p className="text-lg font-semibold capitalize">
                        {listing.land_details.road_access}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Land Title Type</label>
                      <p className="text-lg font-semibold capitalize">
                        {listing.land_details.land_title_type}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {listing.land_details.fenced && (
                        <Badge variant="secondary">Fenced</Badge>
                      )}
                      {listing.land_details.surveyed && (
                        <Badge variant="secondary">Surveyed</Badge>
                      )}
                      {listing.land_details.zoning_approval && (
                        <Badge variant="secondary">Zoning Approved</Badge>
                      )}
                      {listing.land_details.development_permits && (
                        <Badge variant="secondary">Development Permits</Badge>
                      )}
                      {listing.land_details.tax_clearance && (
                        <Badge variant="secondary">Tax Cleared</Badge>
                      )}
                    </div>
                  </div>

                  {/* Utilities */}
                  {listing.land_details.utilities_available && Array.isArray(listing.land_details.utilities_available) && listing.land_details.utilities_available.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Available Utilities</h4>
                      <div className="flex flex-wrap gap-2">
                        {(listing.land_details.utilities_available as string[]).map((utility: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {utility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Admin Contact */}
            <AdminContactInfo />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Seller Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {listing.seller ? (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-lg">
                      {listing.seller.full_name || 'Anonymous'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {listing.seller.email}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center">Seller information not available</p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <InquiryButton 
                    listingId={listing.id}
                    sellerId={listing.seller_id}
                    title={listing.title}
                    className="w-full bg-red-600 hover:bg-red-700"
                  />
                  
                  {/* Visit Fee Button */}
                  {listing.visit_fee_enabled && (
                    <Button
                      onClick={() => setShowVisitPayment(true)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Pay Visit Fee
                    </Button>
                  )}
                  
                  <FavoriteButton 
                    listingId={listing.id}
                    className="w-full"
                  />
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <ViewsDisplay 
                        listingId={listing.id}
                        viewsCount={listing.views || 0}
                      />
                    </div>
                    <div className="flex items-center">
                      <LikesDisplay 
                        listingId={listing.id}
                        likesCount={listing.likes || 0}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card>
              <CardContent className="p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">🔒 Safety Notice</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Never pay outside the platform</li>
                    <li>• Meet in safe, public locations</li>
                    <li>• Verify documents before payment</li>
                    <li>• Use our mediation service</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Viewer */}
      {isImageViewerOpen && (
        <ImageViewer
          images={selectedImages}
          initialIndex={currentImageIndex}
          isOpen={isImageViewerOpen}
          onClose={closeImageViewer}
        />
      )}

      {/* Visit Fee Payment Modal */}
      {showVisitPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Request Property Visit</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowVisitPayment(false)
                    setVisitMethod('')
                    // Clear form fields
                    setBuyerName('')
                    setBuyerEmail('')
                    setBuyerPhone('')
                    setVisitDate('')
                    setVisitTime('')
                    setVisitNotes('')
                  }}
                >
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Contact & Visit Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Your Contact Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email Address *</label>
                        <input
                          type="email"
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Visit Details</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Preferred Visit Date *</label>
                        <input
                          type="date"
                          value={visitDate}
                          onChange={(e) => setVisitDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]} // Today as minimum
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Preferred Visit Time *</label>
                        <select
                          value={visitTime}
                          onChange={(e) => setVisitTime(e.target.value)}
                          className="w-full p-2 border rounded-md"
                          required
                        >
                          <option value="">Select time</option>
                          <option value="09:00">9:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="14:00">2:00 PM</option>
                          <option value="15:00">3:00 PM</option>
                          <option value="16:00">4:00 PM</option>
                          <option value="17:00">5:00 PM</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Additional Notes</label>
                        <textarea
                          value={visitNotes}
                          onChange={(e) => setVisitNotes(e.target.value)}
                          placeholder="Any special requirements or questions for the seller..."
                          rows={3}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Payment Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Payment Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-700 mb-3">
                        Visit fee: <strong>{listing.visit_fee_amount?.toLocaleString() || visitFeeAmount.toLocaleString()} RWF</strong>
                      </div>
                      <div className="text-xs text-gray-600 mb-4">
                        Seller receives 70%. Platform keeps 30%.
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Payment Method *</label>
                        <select
                          value={visitMethod}
                          onChange={(e) => setVisitMethod(e.target.value)}
                          className="w-full p-2 border rounded-md"
                          aria-label="Select payment method"
                          required
                        >
                          <option value="">Select payment method</option>
                          {visitPaymentInfo.mtn_momo?.phone_number && (
                            <option value="mtn_momo">MTN Mobile Money</option>
                          )}
                          {visitPaymentInfo.airtel_money?.phone_number && (
                            <option value="airtel_money">Airtel Money</option>
                          )}
                          {(visitPaymentInfo.equity_bank || visitPaymentInfo.bank_of_kigali) && (
                            <option value="bank_transfer">Bank Transfer</option>
                          )}
                        </select>
                      </div>

                      {visitMethod === 'mtn_momo' && visitPaymentInfo.mtn_momo?.phone_number && (
                        <div className="mt-3 p-3 bg-blue-50 rounded">
                          <div className="text-sm font-medium text-blue-900 mb-1">Pay to:</div>
                          <div className="text-lg font-bold text-blue-900">{visitPaymentInfo.mtn_momo.phone_number}</div>
                          <div className="text-xs text-blue-700">(MTN MoMo)</div>
                        </div>
                      )}

                      {visitMethod === 'airtel_money' && visitPaymentInfo.airtel_money?.phone_number && (
                        <div className="mt-3 p-3 bg-blue-50 rounded">
                          <div className="text-sm font-medium text-blue-900 mb-1">Pay to:</div>
                          <div className="text-lg font-bold text-blue-900">{visitPaymentInfo.airtel_money.phone_number}</div>
                          <div className="text-xs text-blue-700">(Airtel Money)</div>
                        </div>
                      )}

                      {visitMethod === 'bank_transfer' && (
                        <div className="mt-3 p-3 bg-blue-50 rounded">
                          <div className="text-sm font-medium text-blue-900 mb-1">Transfer to:</div>
                          {visitPaymentInfo.equity_bank && (
                            <div>
                              <div className="font-bold text-blue-900">Equity Bank</div>
                              <div className="text-sm">{visitPaymentInfo.equity_bank.account_name}</div>
                              <div className="text-sm">{visitPaymentInfo.equity_bank.account_number}</div>
                            </div>
                          )}
                          {visitPaymentInfo.bank_of_kigali && (
                            <div>
                              <div className="font-bold text-blue-900">Bank of Kigali</div>
                              <div className="text-sm">{visitPaymentInfo.bank_of_kigali.account_name}</div>
                              <div className="text-sm">{visitPaymentInfo.bank_of_kigali.account_number}</div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-4 text-xs text-gray-600 bg-yellow-50 p-3 rounded">
                        After completing payment, click "Submit Visit Request" to notify the seller.
                      </div>

                      <Button
                        onClick={handleVisitRequest}
                        disabled={!visitMethod || !buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim() || !visitDate.trim() || !visitTime.trim() || visitSubmitting}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        {visitSubmitting ? 'Submitting...' : 'Submit Visit Request'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
