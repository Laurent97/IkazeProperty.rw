'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import PaymentSelection from '@/components/payment/payment-selection'
import { supabaseClient } from '@/lib/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import type { PromotionPackage } from '@/types/payment'

const PROMOTION_PACKAGES: Record<string, PromotionPackage> = {
  featured: {
    id: 'featured',
    name: 'Featured Listing',
    description: 'Top placement and featured badge for 30 days',
    price: 5000,
    duration_days: 30,
    features: ['Top placement in search results', 'Featured badge', 'Increased visibility'],
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  urgent: {
    id: 'urgent',
    name: 'Urgent Listing',
    description: 'Urgent badge and higher ranking for 14 days',
    price: 3000,
    duration_days: 14,
    features: ['Urgent badge', 'Higher ranking', 'Priority support'],
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  video: {
    id: 'video',
    name: 'Video Showcase',
    description: 'Video showcase for your listing for 7 days',
    price: 4000,
    duration_days: 7,
    features: ['Video showcase', 'Enhanced gallery', 'Social media sharing'],
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  social: {
    id: 'social',
    name: 'Social Media Promotion',
    description: 'Social media promotion for 3 days',
    price: 1000,
    duration_days: 3,
    features: ['Social media posts', 'Targeted advertising', 'Performance tracking'],
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  
  const [listingId, setListingId] = useState<string>('')
  const [promotionType, setPromotionType] = useState<string>('')
  const [listingTitle, setListingTitle] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  useEffect(() => {
    const listing = searchParams.get('listing_id')
    const promotion = searchParams.get('promotion')
    
    if (!listing || !promotion) {
      router.push('/dashboard/my-listings')
      return
    }
    
    setListingId(listing)
    setPromotionType(promotion)
    
    // Fetch listing details
    fetchListingDetails(listing)
  }, [searchParams, router])

  const fetchListingDetails = async (id: string) => {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession()
      if (!session?.access_token) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`/api/listings/${id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch listing')
      }

      const result = await response.json()
      if (result.success && result.data) {
        setListingTitle(result.data.title)
      }
    } catch (error) {
      console.error('Error fetching listing:', error)
      setError('Failed to load listing details')
    }
  }

  const handlePaymentComplete = async (result: any) => {
    setLoading(true)
    try {
      // Create promotion record
      const { data: { session } } = await supabaseClient.auth.getSession()
      if (!session?.access_token) {
        throw new Error('Not authenticated')
      }

      const promotionPackage = PROMOTION_PACKAGES[promotionType]
      
      const promoResponse = await fetch('/api/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          listing_id: listingId,
          promotion_type: promotionType,
          price: promotionPackage.price,
          duration_days: promotionPackage.duration_days,
          payment_transaction_id: result.transaction?.id
        })
      })

      const promoResult = await promoResponse.json()
      
      if (promoResult.success) {
        setPaymentCompleted(true)
        // Redirect to my listings after a delay
        setTimeout(() => {
          router.push('/dashboard/my-listings?promotion_success=true')
        }, 3000)
      } else {
        throw new Error(promoResult.error || 'Failed to create promotion')
      }
    } catch (error: any) {
      console.error('Error creating promotion:', error)
      setError(error.message || 'Failed to create promotion after payment')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const promotionPackage = PROMOTION_PACKAGES[promotionType]

  if (!listingId || !promotionType || !promotionPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Payment Request</h2>
          <p className="text-gray-600 mb-4">Missing required payment information</p>
          <Link href="/dashboard/my-listings">
            <Button className="bg-red-600 hover:bg-red-700">
              Back to My Listings
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your listing has been successfully promoted. You will be redirected to your listings shortly.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Promotion Details</h3>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>Promotion:</strong> {promotionPackage.name}</p>
              <p><strong>Duration:</strong> {promotionPackage.duration_days} days</p>
              <p><strong>Amount Paid:</strong> {promotionPackage.price.toLocaleString()} RWF</p>
            </div>
          </div>
          <Link href="/dashboard/my-listings">
            <Button className="bg-red-600 hover:bg-red-700">
              Go to My Listings
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/my-listings" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Listings
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Promotion Payment</h1>
            <p className="text-gray-600">Pay for your listing promotion to increase visibility</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Payment Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Promotion Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Promotion Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Listing</h4>
                  <p className="text-sm text-gray-600 truncate">{listingTitle || 'Loading...'}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Promotion Package</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-red-800">{promotionPackage.name}</span>
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        {promotionPackage.duration_days} days
                      </Badge>
                    </div>
                    <p className="text-sm text-red-700 mb-2">{promotionPackage.description}</p>
                    <div className="text-2xl font-bold text-red-600">
                      {promotionPackage.price.toLocaleString()} RWF
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Features Included</h4>
                  <ul className="space-y-1">
                    {promotionPackage.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Processing payment...</p>
                  </div>
                ) : (
                  <PaymentSelection
                    amount={promotionPackage.price}
                    currency="RWF"
                    transactionType="promotion"
                    listingId={listingId}
                    description={`Promotion payment for ${promotionPackage.name}`}
                    promotionPackage={promotionPackage}
                    listingTitle={listingTitle}
                    onPaymentComplete={handlePaymentComplete}
                    onPaymentError={handlePaymentError}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
