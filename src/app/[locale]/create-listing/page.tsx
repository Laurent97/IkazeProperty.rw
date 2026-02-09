'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Upload, MapPin, Home, Car, Trees, Package, Star, CreditCard, Zap, Shield, Crown, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { supabaseClient } from '@/lib/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import type { Database } from '@/types/database'
import type { PaymentMethod } from '@/types/payment'
import PromotionPaymentModal from '@/components/payment/promotion-payment-modal'

export default function CreateListingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  
  // Initialize form data first
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'RWF',
    priceType: 'fixed' as const,
    category: searchParams.get('category') || '',
    transactionType: 'sale' as const,
    status: 'available' as const,
    location: {
      province: '',
      district: '',
      sector: '',
      cell: '',
      village: '',
      address: ''
    },
    images: [] as Array<{ url: string; public_id: string; type: 'image' | 'video'; duration?: number; format?: string }>,
    commissionAgreed: false,
    commissionType: 'owner' as 'owner' | 'agent',
    visitFeeEnabled: true,
    visitFeeAmount: '15000',
    visitFeePaymentMethods: {
      mtn_momo: { phone_number: '' },
      airtel_money: { phone_number: '' },
      equity_bank: { account_name: '', account_number: '' }
    },
    promotionType: '' as '' | 'featured' | 'urgent' | 'video' | 'social' | 'higher_images' | '360_tour',
    selectedPromotion: null as any,
    // Category-specific details
    houseDetails: {
      property_type: '',
      bedrooms: '',
      bathrooms: '',
      total_area: '',
      year_built: '',
      condition: '',
      furnished: '',
      parking: '',
      features: [] as string[],
      utilities_included: [] as string[],
      rent_duration: '',
      security_deposit: '',
      advance_payment: '',
      minimum_lease_period: '',
      available_from: ''
    },
    carDetails: {
      vehicle_type: '',
      make: '',
      model: '',
      year_manufacture: '',
      condition: '',
      fuel_type: '',
      transmission: '',
      engine_capacity: '',
      mileage: '',
      color: '',
      doors: '',
      seats: '',
      features: [] as string[],
      ownership_papers: false,
      insurance_status: '',
      road_worthiness: false,
      last_service_date: '',
      rental_daily_rate: '',
      rental_weekly_rate: '',
      rental_monthly_rate: '',
      security_deposit: '',
      minimum_rental_period: '',
      delivery_option: false,
      driver_included: false
    },
    landDetails: {
      plot_type: '',
      plot_size: '',
      size_unit: 'm²',
      shape: '',
      topography: '',
      soil_type: '',
      road_access: '',
      fenced: false,
      utilities_available: [] as string[],
      land_title_type: '',
      title_deed_number: '',
      surveyed: false,
      zoning_approval: false,
      development_permits: false,
      tax_clearance: false,
      nearest_main_road_distance: '',
      nearest_town_distance: '',
      nearby_amenities: [] as string[]
    },
    otherDetails: {
      subcategory: '',
      brand: '',
      model: '',
      condition: '',
      warranty_available: false,
      warranty_period: '',
      reason_for_selling: '',
      original_purchase_date: '',
      age_of_item: ''
    }
  })

  // Other state hooks
  const [currentStep, setCurrentStep] = useState(1)
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Promotion payment modal state
  const [showPromotionPaymentModal, setShowPromotionPaymentModal] = useState(false)
  const [promotionPaymentLoading, setPromotionPaymentLoading] = useState(false)

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/register?redirect=/create-listing')
      return
    }
  }, [user, router])

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">You need to be logged in to create a listing. Redirecting to sign up...</p>
        </div>
      </div>
    )
  }

  const categories = [
    { id: 'houses', name: 'Houses & Apartments', icon: Home },
    { id: 'cars', name: 'Cars & Vehicles', icon: Car },
    { id: 'land', name: 'Land & Plots', icon: Trees },
    { id: 'other', name: 'Other Items', icon: Package }
  ]

  const getStepNames = (category: string) => {
    switch (category) {
      case 'houses':
        return ['Category', 'Basic Info', 'Location', 'Photos', 'Property Details', 'Commission', 'Visit Fee', 'Promotion', 'Review']
      case 'cars':
        return ['Category', 'Basic Info', 'Location', 'Photos', 'Vehicle Details', 'Commission', 'Visit Fee', 'Promotion', 'Review']
      case 'land':
        return ['Category', 'Basic Info', 'Location', 'Photos', 'Land Details', 'Commission', 'Visit Fee', 'Promotion', 'Review']
      case 'other':
        return ['Category', 'Basic Info', 'Location', 'Photos', 'Item Details', 'Commission', 'Visit Fee', 'Promotion', 'Review']
      default:
        return ['Category', 'Basic Info', 'Location', 'Photos', 'Details', 'Commission', 'Visit Fee', 'Promotion', 'Review']
    }
  }

  const getCategorySteps = (category: string) => {
    switch (category) {
      case 'houses':
        return 9 // Category, Basic Info, Location, Photos, House Details, Commission, Visit Fee, Promotions, Review
      case 'cars':
        return 9 // Category, Basic Info, Location, Photos, Car Details, Commission, Visit Fee, Promotions, Review
      case 'land':
        return 9 // Category, Basic Info, Location, Photos, Land Details, Commission, Visit Fee, Promotions, Review
      case 'other':
        return 9 // Category, Basic Info, Location, Photos, Other Details, Commission, Visit Fee, Promotions, Review
      default:
        return 8
    }
  }

  const totalSteps = category ? getCategorySteps(category) : 1

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory)
    setFormData({...formData, category: selectedCategory})
    setCurrentStep(2)
  }

  const handleImageUpload = async (files: Array<File>) => {
    if (!files || files.length === 0) {
      setError('')
      return
    }

    setError('')
    
    try {
      // Upload all files in parallel for better performance
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        console.log(`Upload response status for ${file.name}:`, response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error(`Upload failed for ${file.name}:`, errorText)
          throw new Error(`Upload failed for ${file.name}: ${errorText}`)
        }
        
        const result = await response.json()
        console.log(`Upload result for ${file.name}:`, result)
        
        if (!result.success || !result.data) {
          console.error(`Invalid upload response for ${file.name}:`, result)
          throw new Error(`Upload failed for ${file.name}: ${result.error || 'Invalid response format'}`)
        }
        
        if (!result.data.url || !result.data.public_id) {
          console.error(`Missing required fields in upload response for ${file.name}:`, result.data)
          throw new Error(`Upload response missing required fields for ${file.name}`)
        }
        
        return {
          url: result.data.url,
          public_id: result.data.public_id,
          fileType: file.type.startsWith('video/') ? ('video' as const) : ('image' as const)
        }
      })

      const results = await Promise.all(uploadPromises)
      
      // Update form data with all results
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...results.map(r => ({
          url: r.url,
          public_id: r.public_id,
          type: r.fileType
        }))]
      }))
      
    } catch (error) {
      setError('Failed to upload images. Please try again.')
    }
  }

  const handlePromotionPayment = async (paymentData: {
    method: PaymentMethod
    proof: File | null
    phoneNumber?: string
  }) => {
    setPromotionPaymentLoading(true)
    setError('')

    try {
      // Create listing first without promotion
      const originalPromotionType = formData.promotionType
      const originalSelectedPromotion = formData.selectedPromotion
      
      // Temporarily remove promotion data to create listing first
      setFormData(prev => ({
        ...prev,
        promotionType: '',
        selectedPromotion: null
      }))

      // Create the listing
      await handleSubmit()
      
      // After listing is created, we would handle promotion payment here
      // For now, we'll close the modal and continue to review step
      setShowPromotionPaymentModal(false)
      
      // Restore promotion data for display purposes
      setFormData(prev => ({
        ...prev,
        promotionType: originalPromotionType,
        selectedPromotion: originalSelectedPromotion
      }))
      
      // Move to review step
      setCurrentStep(9)
      
      // TODO: In a real implementation, you would:
      // 1. Upload payment proof to storage
      // 2. Create promotion record with payment status
      // 3. Handle payment verification
      console.log('Promotion payment data:', paymentData)
      
    } catch (error: any) {
      console.error('Promotion payment error:', error)
      setError(error.message || 'Failed to process promotion payment')
    } finally {
      setPromotionPaymentLoading(false)
    }
  }

  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (loading) {
      console.log('🚫 Submission already in progress')
      return
    }

    const missingFields: string[] = []
    
    if (!formData.title?.trim()) missingFields.push('title')
    if (!formData.description?.trim()) missingFields.push('description')
    if (!formData.price || parseFloat(formData.price) <= 0) missingFields.push('price')
    if (!formData.category) missingFields.push('category')
    if (!user?.id) missingFields.push('seller_id')
    if (!formData.commissionAgreed) missingFields.push('commission agreement')
    
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`)
      return
    }

    setLoading(true)
    setError('')

    console.log('📤 Submitting listing with data:', {
      title: formData.title,
      category: formData.category,
      price: formData.price,
      imagesCount: formData.images.length,
      images: formData.images.map((img, i) => ({
        index: i,
        url: img.url,
        public_id: img.public_id,
        type: img.type
      })),
      carDetails: formData.carDetails,
      houseDetails: formData.houseDetails,
      landDetails: formData.landDetails,
      otherDetails: formData.otherDetails
    })

    try {
      // Get the user's session token
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('Authentication token not found')
      }

      console.log('🔑 Using session token for user:', session.user.email)

      // Prepare data with proper formatting
      const requestData: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price), // Convert string to number
        currency: formData.currency,
        price_type: formData.priceType,
        category: formData.category,
        transaction_type: formData.transactionType,
        location: formData.location,
        seller_id: user?.id || '', // Make sure this is correct
        commission_rate: formData.commissionType === 'owner' ? 0.02 : 0.30, // 2% for owners, 30% for agents
        commission_type: formData.commissionType,
        commission_agreed: formData.commissionAgreed,
        featured: formData.promotionType === 'featured',
        promoted: formData.promotionType !== '',
        views: 0,
        likes: 0,
        visit_fee_enabled: formData.visitFeeEnabled,
        visit_fee_amount: parseFloat(formData.visitFeeAmount || '15000'),
        visit_fee_payment_methods: formData.visitFeePaymentMethods
      }

      // Add car details if category is cars
      if (formData.category === 'cars' && formData.carDetails) {
        requestData.car_details = formData.carDetails
      }

      // Add house details if category is houses
      if (formData.category === 'houses' && formData.houseDetails) {
        requestData.house_details = formData.houseDetails
      }

      // Add land details if category is land
      if (formData.category === 'land' && formData.landDetails) {
        requestData.land_details = formData.landDetails
      }

      // Add other details if category is other
      if (formData.category === 'other' && formData.otherDetails) {
        requestData.other_details = formData.otherDetails
      }

      console.log('📤 Sending request body:', requestData)
      console.log('🚗 Car details in request:', requestData.car_details)
      console.log('🏠 House details in request:', requestData.house_details)
      console.log('🌳 Land details in request:', requestData.land_details)
      console.log('📦 Other details in request:', requestData.other_details)

      // Create main listing
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestData)
      })

      console.log('📥 Response status:', response.status)
      const responseText = await response.text()
      console.log('📥 Response body:', responseText)

      if (response.status === 400) {
        const errorData = JSON.parse(responseText)
        throw new Error(`Bad Request: ${errorData.error || 'Missing required fields'}`)
      }

      if (response.status === 401) {
        throw new Error('Your session has expired. Please login again.')
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = JSON.parse(responseText)

      const listing = result.data

      // Upload images to listing_media table
      if (formData.images.length > 0) {
        const mediaPromises = formData.images.map(async (img, index) => {
          // Validate required fields
          if (!img.url || !img.public_id) {
            console.error(`Missing required fields for image ${index}:`, {
              url: img.url,
              public_id: img.public_id,
              type: img.type
            })
            throw new Error(`Image ${index} is missing required fields (url or public_id)`)
          }

          console.log(`Uploading image ${index}:`, {
            listing_id: listing.id,
            media_type: img.type,
            url: img.url,
            public_id: img.public_id,
            order_index: index,
            is_primary: index === 0
          })

          const mediaResponse = await fetch('/api/media', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              listing_id: listing.id,
              media_type: img.type,
              url: img.url,
              public_id: img.public_id,
              order_index: index,
              is_primary: index === 0
            })
          })
          
          if (!mediaResponse.ok) {
            const errorText = await mediaResponse.text()
            console.error(`Media upload failed for image ${index}:`, errorText)
            throw new Error(`Failed to upload media: ${errorText}`)
          }
          
          return mediaResponse.json()
        })

        const mediaResults = await Promise.all(mediaPromises)
        console.log('Media upload results:', mediaResults)
      }

      // Create promotion if selected
      if (formData.promotionType && formData.selectedPromotion) {
        const promoResponse = await fetch('/api/promotions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            listing_id: listing.id,
            promotion_type: formData.promotionType,
            price: formData.selectedPromotion.price,
            duration_days: formData.selectedPromotion.duration_days || 30
          })
        })

        const promoResult = await promoResponse.json()
        if (promoResult.success) {
          router.push(`/payment?listing_id=${listing.id}&promotion=${formData.promotionType}`)
          return
        }
      }

      router.push('/dashboard/my-listings?success=true')

    } catch (error: any) {
      console.error('Error creating listing:', error)
      setError(error.message || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  const renderCategoryDetails = () => {
    switch (category) {
      case 'houses':
        return (
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">Property Details</h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Property Type:</span>
                <p className="font-medium capitalize">{formData.houseDetails.property_type || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Condition:</span>
                <p className="font-medium capitalize">{formData.houseDetails.condition || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Bedrooms:</span>
                <p className="font-medium">{formData.houseDetails.bedrooms || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Bathrooms:</span>
                <p className="font-medium">{formData.houseDetails.bathrooms || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Total Area:</span>
                <p className="font-medium">{formData.houseDetails.total_area || 'Not specified'} m²</p>
              </div>
              <div>
                <span className="text-gray-600">Year Built:</span>
                <p className="font-medium">{formData.houseDetails.year_built || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Furnished:</span>
                <p className="font-medium capitalize">{formData.houseDetails.furnished || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Parking:</span>
                <p className="font-medium capitalize">{formData.houseDetails.parking || 'Not specified'}</p>
              </div>
            </div>
          </div>
        )

      case 'cars':
        return (
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">Vehicle Details</h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Vehicle Type:</span>
                <p className="font-medium capitalize">{formData.carDetails.vehicle_type || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Condition:</span>
                <p className="font-medium capitalize">{formData.carDetails.condition || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Make:</span>
                <p className="font-medium">{formData.carDetails.make || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Model:</span>
                <p className="font-medium">{formData.carDetails.model || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Year:</span>
                <p className="font-medium">{formData.carDetails.year_manufacture || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Mileage:</span>
                <p className="font-medium">{formData.carDetails.mileage || 'Not specified'} km</p>
              </div>
              <div>
                <span className="text-gray-600">Fuel Type:</span>
                <p className="font-medium capitalize">{formData.carDetails.fuel_type || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Transmission:</span>
                <p className="font-medium capitalize">{formData.carDetails.transmission || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Color:</span>
                <p className="font-medium capitalize">{formData.carDetails.color || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Doors:</span>
                <p className="font-medium">{formData.carDetails.doors || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Seats:</span>
                <p className="font-medium">{formData.carDetails.seats || 'Not specified'}</p>
              </div>
            </div>
          </div>
        )

      case 'land':
        return (
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">Land Details</h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Plot Type:</span>
                <p className="font-medium capitalize">{formData.landDetails.plot_type || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Shape:</span>
                <p className="font-medium capitalize">{formData.landDetails.shape || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Plot Size:</span>
                <p className="font-medium">{formData.landDetails.plot_size || 'Not specified'} {formData.landDetails.size_unit}</p>
              </div>
              <div>
                <span className="text-gray-600">Topography:</span>
                <p className="font-medium capitalize">{formData.landDetails.topography || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Road Access:</span>
                <p className="font-medium capitalize">{formData.landDetails.road_access || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Land Title:</span>
                <p className="font-medium capitalize">{formData.landDetails.land_title_type || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Fenced:</span>
                <p className="font-medium">{formData.landDetails.fenced ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <span className="text-gray-600">Surveyed:</span>
                <p className="font-medium">{formData.landDetails.surveyed ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        )

      case 'other':
        return (
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">Item Details</h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Subcategory:</span>
                <p className="font-medium">{formData.otherDetails.subcategory || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Condition:</span>
                <p className="font-medium capitalize">{formData.otherDetails.condition || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Brand:</span>
                <p className="font-medium">{formData.otherDetails.brand || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-600">Model:</span>
                <p className="font-medium">{formData.otherDetails.model || 'Not specified'}</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Select Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <Card 
                  key={cat.id}
                  className={`cursor-pointer transition-all hover:shadow-lg touch-target ${
                    category === cat.id ? 'ring-2 ring-red-500 bg-red-50' : ''
                  }`}
                  onClick={() => handleCategorySelect(cat.id)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
                        category === cat.id ? 'bg-red-600' : 'bg-gray-200'
                      }`}>
                        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${
                          category === cat.id ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{cat.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {cat.id === 'houses' && 'List residential and commercial properties'}
                          {cat.id === 'cars' && 'Sell or rent vehicles'}
                          {cat.id === 'land' && 'Offer plots for development'}
                          {cat.id === 'other' && 'Everything else'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )
    }

    if (currentStep === 2) {
      return (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Basic Information</h2>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Listing Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter a descriptive title"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Provide detailed information about your listing"
                rows={6}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  aria-label="Currency"
                >
                  <option value="RWF">RWF</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Type
                </label>
                <select
                  value={formData.priceType}
                  onChange={(e) => setFormData({...formData, priceType: e.target.value as 'fixed'})}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  aria-label="Price type"
                >
                  <option value="fixed">Fixed</option>
                  <option value="negotiable">Negotiable</option>
                  <option value="auction">Auction</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <select
                  value={formData.transactionType}
                  onChange={(e) => setFormData({...formData, transactionType: e.target.value as 'sale'})}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  aria-label="Transaction type"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  {category === 'land' && <option value="lease">For Lease</option>}
                </select>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (currentStep === 3) {
      return (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Location Details</h2>
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province *
                </label>
                <select
                  value={formData.location.province}
                  onChange={(e) => setFormData({...formData, location: {...formData.location, province: e.target.value}})}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  aria-label="Province"
                >
                  <option value="">Select Province</option>
                  <option value="Kigali">Kigali</option>
                  <option value="Northern">Northern</option>
                  <option value="Southern">Southern</option>
                  <option value="Eastern">Eastern</option>
                  <option value="Western">Western</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <input
                  type="text"
                  value={formData.location.district}
                  onChange={(e) => setFormData({...formData, location: {...formData.location, district: e.target.value}})}
                  placeholder="Enter district"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sector
                </label>
                <input
                  type="text"
                  value={formData.location.sector}
                  onChange={(e) => setFormData({...formData, location: {...formData.location, sector: e.target.value}})}
                  placeholder="Enter sector"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cell
                </label>
                <input
                  type="text"
                  value={formData.location.cell}
                  onChange={(e) => setFormData({...formData, location: {...formData.location, cell: e.target.value}})}
                  placeholder="Enter cell"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Village
                </label>
                <input
                  type="text"
                  value={formData.location.village}
                  onChange={(e) => setFormData({...formData, location: {...formData.location, village: e.target.value}})}
                  placeholder="Enter village"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exact Address / Landmarks
              </label>
              <textarea
                value={formData.location.address}
                onChange={(e) => setFormData({...formData, location: {...formData.location, address: e.target.value}})}
                placeholder="Provide exact address or nearby landmarks"
                rows={3}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start sm:items-center">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 mt-0.5 sm:mt-0" />
                <p className="text-xs sm:text-sm text-blue-800">
                  Providing accurate location information helps buyers find your property easily and increases trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (currentStep === 4) {
      return (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Upload Photos</h2>
          <div className="space-y-4 sm:space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
              <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Upload Photos & Videos</h3>
              <p className="text-gray-600 mb-4 text-xs sm:text-sm">
                Add up to 20 high-quality images and videos to showcase your listing
              </p>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  handleImageUpload(files)
                }}
                className="hidden"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload"
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 cursor-pointer touch-target"
              >
                <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Choose Files (Images & Videos)
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {formData.images.map((img, index) => {
                  console.log(`🖼️ Displaying image ${index}:`, {
                    url: img.url,
                    public_id: img.public_id,
                    type: img.type
                  })
                  
                  return (
                    <div key={index} className="relative group">
                      <img
                        src={img.url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-lg"
                        onError={(e) => {
                          console.error(`❌ Failed to load image ${index}:`, img.url)
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJDNi40NzcgMjIgMTIgMjJDMTcuNTIzIDIyIDIyIDE3LjUyMyAyMiAxMkMyNy41MjMgMiAyMiA2LjQ3NyAyMiAxMkMyNi40NzcgMiAyIDYuNDc3IDIgMTJaIiBmaWxsPSIjRUVGIi8+CjxwYXRoIGQ9Ik0xMiA2QzEwLjIwNiA2IDguMjA2IDggOCAxMEM4IDEzLjc5NCAxMC4yMDYgMTYgMTIgMTZDMTMuNzk0IDE2IDE2IDEzLjc5NCAxNiAxMkMxNiA4LjIwNiAxMy43OTQgNiAxMiA2WiIgZmlsbD0iI0VFRiIvPgo8L3N2Zz4K'
                        }}
                      />
                      <button
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }))
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity touch-target"
                    >
                      ×
                    </button>
                    {(img.type === 'video' || img.type?.includes('video')) && (
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        📹 {img.duration ? `${Math.round(img.duration)}s` : 'Video'}
                        {img.format && `• ${img.format.toUpperCase()}`}
                      </div>
                    )}
                  </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )
    }

    if (currentStep === 6) {
      return (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Commission Agreement</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commission Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-4">Commission Structure</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="owner"
                        name="commissionType"
                        value="owner"
                        checked={formData.commissionType === 'owner'}
                        onChange={(e) => setFormData({...formData, commissionType: e.target.value as 'owner' | 'agent'})}
                        className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <label htmlFor="owner" className="text-sm font-medium text-red-800">
                        Property Owner (2% commission)
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="agent"
                        name="commissionType"
                        value="agent"
                        checked={formData.commissionType === 'agent'}
                        onChange={(e) => setFormData({...formData, commissionType: e.target.value as 'owner' | 'agent'})}
                        className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <label htmlFor="agent" className="text-sm font-medium text-red-800">
                        Agent Listing (30% commission)
                      </label>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-red-100 rounded border border-red-300">
                    <p className="text-xs text-red-700">
                      <strong>Owner:</strong> 2% commission when your property sells (for owner-listed properties)<br/>
                      <strong>Agent:</strong> 30% commission on successful transactions (for agent-listed properties)
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">How It Works</h4>
                  <ol className="text-gray-700 text-sm space-y-1">
                    <li>1. Your listing is published on the platform</li>
                    <li>2. Interested buyers click "Express Interest"</li>
                    <li>3. Admin team verifies and facilitates connections</li>
                    <li>4. Transaction is completed successfully</li>
                    <li>5. Commission is collected based on your listing type:</li>
                    <ul className="ml-4 mt-2 space-y-1">
                      <li className="font-medium">• Owner listings: 2% of final sale amount</li>
                      <li className="font-medium">• Agent listings: 30% of final sale amount</li>
                      {formData.transactionType === 'rent' && (
                        <li className="font-medium">• Rentals: 5% of first month payment</li>
                      )}
                    </ul>
                  </ol>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="commission"
                    checked={formData.commissionAgreed}
                    onChange={(e) => setFormData({...formData, commissionAgreed: e.target.checked})}
                    className="mt-1 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="commission" className="text-sm text-gray-700">
                    I agree to the 30% commission terms and understand that this fee will be charged upon successful completion of the transaction. I acknowledge that this is required to list on IkazeProperty.rw.
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    if (currentStep === 5) {
      // Category-specific details step
      switch (category) {
        case 'houses':
          return (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type *
                    </label>
                    <select
                      value={formData.houseDetails.property_type}
                      onChange={(e) => setFormData({...formData, houseDetails: {...formData.houseDetails, property_type: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select Property Type</option>
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="duplex">Duplex</option>
                      <option value="villa">Villa</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition *
                    </label>
                    <select
                      value={formData.houseDetails.condition}
                      onChange={(e) => setFormData({...formData, houseDetails: {...formData.houseDetails, condition: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select Condition</option>
                      <option value="new">New</option>
                      <option value="renovated">Renovated</option>
                      <option value="good">Good</option>
                      <option value="needs_repair">Needs Repair</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms *
                    </label>
                    <input
                      type="number"
                      value={formData.houseDetails.bedrooms}
                      onChange={(e) => setFormData({...formData, houseDetails: {...formData.houseDetails, bedrooms: e.target.value}})}
                      placeholder="Number of bedrooms"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms *
                    </label>
                    <input
                      type="number"
                      value={formData.houseDetails.bathrooms}
                      onChange={(e) => setFormData({...formData, houseDetails: {...formData.houseDetails, bathrooms: e.target.value}})}
                      placeholder="Number of bathrooms"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Area (m²) *
                    </label>
                    <input
                      type="number"
                      value={formData.houseDetails.total_area}
                      onChange={(e) => setFormData({...formData, houseDetails: {...formData.houseDetails, total_area: e.target.value}})}
                      placeholder="Area in square meters"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year Built
                    </label>
                    <input
                      type="number"
                      value={formData.houseDetails.year_built}
                      onChange={(e) => setFormData({...formData, houseDetails: {...formData.houseDetails, year_built: e.target.value}})}
                      placeholder="Year built"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Furnished *
                    </label>
                    <select
                      value={formData.houseDetails.furnished}
                      onChange={(e) => setFormData({...formData, houseDetails: {...formData.houseDetails, furnished: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select Furnishing</option>
                      <option value="furnished">Furnished</option>
                      <option value="semi_furnished">Semi Furnished</option>
                      <option value="unfurnished">Unfurnished</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking
                  </label>
                  <select
                    value={formData.houseDetails.parking}
                    onChange={(e) => setFormData({...formData, houseDetails: {...formData.houseDetails, parking: e.target.value}})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select Parking</option>
                    <option value="garage">Garage</option>
                    <option value="open">Open</option>
                    <option value="security">Security</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>
          )

        case 'cars':
          return (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Details</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type *
                    </label>
                    <select
                      value={formData.carDetails.vehicle_type}
                      onChange={(e) => setFormData({...formData, carDetails: {...formData.carDetails, vehicle_type: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="car">Car</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="truck">Truck</option>
                      <option value="bus">Bus</option>
                      <option value="suv">SUV</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition *
                    </label>
                    <select
                      value={formData.carDetails.condition}
                      onChange={(e) => setFormData({...formData, carDetails: {...formData.carDetails, condition: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select Condition</option>
                      <option value="new">New</option>
                      <option value="used">Used</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Make *
                    </label>
                    <input
                      type="text"
                      value={formData.carDetails.make}
                      onChange={(e) => setFormData({...formData, carDetails: {...formData.carDetails, make: e.target.value}})}
                      placeholder="e.g., Toyota, Honda, BMW"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model *
                    </label>
                    <input
                      type="text"
                      value={formData.carDetails.model}
                      onChange={(e) => setFormData({...formData, carDetails: {...formData.carDetails, model: e.target.value}})}
                      placeholder="e.g., Camry, Civic, X5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year Manufacture *
                    </label>
                    <input
                      type="number"
                      value={formData.carDetails.year_manufacture}
                      onChange={(e) => setFormData({...formData, carDetails: {...formData.carDetails, year_manufacture: e.target.value}})}
                      placeholder="Year manufactured"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mileage (km) *
                    </label>
                    <input
                      type="number"
                      value={formData.carDetails.mileage}
                      onChange={(e) => setFormData({...formData, carDetails: {...formData.carDetails, mileage: e.target.value}})}
                      placeholder="Mileage in kilometers"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuel Type *
                    </label>
                    <select
                      value={formData.carDetails.fuel_type}
                      onChange={(e) => setFormData({...formData, carDetails: {...formData.carDetails, fuel_type: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select Fuel Type</option>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transmission *
                    </label>
                    <select
                      value={formData.carDetails.transmission}
                      onChange={(e) => setFormData({...formData, carDetails: {...formData.carDetails, transmission: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select Transmission</option>
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <input
                      type="text"
                      value={formData.carDetails.color}
                      onChange={(e) => setFormData({...formData, carDetails: {...formData.carDetails, color: e.target.value}})}
                      placeholder="Vehicle color"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doors
                    </label>
                    <input
                      type="number"
                      value={formData.carDetails.doors}
                      onChange={(e) => setFormData({...formData, carDetails: {...formData.carDetails, doors: e.target.value}})}
                      placeholder="Number of doors"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seats
                    </label>
                    <input
                      type="number"
                      value={formData.carDetails.seats}
                      onChange={(e) => setFormData({...formData, carDetails: {...formData.carDetails, seats: e.target.value}})}
                      placeholder="Number of seats"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )

        case 'land':
          return (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Land Details</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plot Type *
                    </label>
                    <select
                      value={formData.landDetails.plot_type}
                      onChange={(e) => setFormData({...formData, landDetails: {...formData.landDetails, plot_type: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select Plot Type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="agricultural">Agricultural</option>
                      <option value="industrial">Industrial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shape *
                    </label>
                    <select
                      value={formData.landDetails.shape}
                      onChange={(e) => setFormData({...formData, landDetails: {...formData.landDetails, shape: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select Shape</option>
                      <option value="regular">Regular</option>
                      <option value="irregular">Irregular</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plot Size *
                    </label>
                    <input
                      type="number"
                      value={formData.landDetails.plot_size}
                      onChange={(e) => setFormData({...formData, landDetails: {...formData.landDetails, plot_size: e.target.value}})}
                      placeholder="Plot size"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size Unit *
                    </label>
                    <select
                      value={formData.landDetails.size_unit}
                      onChange={(e) => setFormData({...formData, landDetails: {...formData.landDetails, size_unit: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="m²">Square Meters (m²)</option>
                      <option value="hectares">Hectares</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topography *
                    </label>
                    <select
                      value={formData.landDetails.topography}
                      onChange={(e) => setFormData({...formData, landDetails: {...formData.landDetails, topography: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select Topography</option>
                      <option value="flat">Flat</option>
                      <option value="sloping">Sloping</option>
                      <option value="hilly">Hilly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Road Access *
                    </label>
                    <select
                      value={formData.landDetails.road_access}
                      onChange={(e) => setFormData({...formData, landDetails: {...formData.landDetails, road_access: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select Road Access</option>
                      <option value="tarmac">Tarmac</option>
                      <option value="gravel">Gravel</option>
                      <option value="footpath">Footpath</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land Title Type *
                  </label>
                  <select
                    value={formData.landDetails.land_title_type}
                    onChange={(e) => setFormData({...formData, landDetails: {...formData.landDetails, land_title_type: e.target.value}})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select Title Type</option>
                    <option value="freehold">Freehold</option>
                    <option value="leasehold">Leasehold</option>
                    <option value="customary">Customary</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="fenced"
                      checked={formData.landDetails.fenced}
                      onChange={(e) => setFormData({...formData, landDetails: {...formData.landDetails, fenced: e.target.checked}})}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="fenced" className="text-sm text-gray-700">
                      Fenced
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="surveyed"
                      checked={formData.landDetails.surveyed}
                      onChange={(e) => setFormData({...formData, landDetails: {...formData.landDetails, surveyed: e.target.checked}})}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="surveyed" className="text-sm text-gray-700">
                      Surveyed
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )

        case 'other':
          return (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Item Details</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory *
                    </label>
                    <input
                      type="text"
                      value={formData.otherDetails.subcategory}
                      onChange={(e) => setFormData({...formData, otherDetails: {...formData.otherDetails, subcategory: e.target.value}})}
                      placeholder="e.g., Electronics, Furniture, Clothing"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition *
                    </label>
                    <select
                      value={formData.otherDetails.condition}
                      onChange={(e) => setFormData({...formData, otherDetails: {...formData.otherDetails, condition: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500"
                    >
                      <option value="">Select Condition</option>
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="like_new">Like New</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={formData.otherDetails.brand}
                      onChange={(e) => setFormData({...formData, otherDetails: {...formData.otherDetails, brand: e.target.value}})}
                      placeholder="Brand name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      value={formData.otherDetails.model}
                      onChange={(e) => setFormData({...formData, otherDetails: {...formData.otherDetails, model: e.target.value}})}
                      placeholder="Model number/name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Selling
                  </label>
                  <textarea
                    value={formData.otherDetails.reason_for_selling}
                    onChange={(e) => setFormData({...formData, otherDetails: {...formData.otherDetails, reason_for_selling: e.target.value}})}
                    placeholder="Why are you selling this item?"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Purchase Date
                    </label>
                    <input
                      type="date"
                      value={formData.otherDetails.original_purchase_date}
                      onChange={(e) => setFormData({...formData, otherDetails: {...formData.otherDetails, original_purchase_date: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age of Item
                    </label>
                    <input
                      type="text"
                      value={formData.otherDetails.age_of_item}
                      onChange={(e) => setFormData({...formData, otherDetails: {...formData.otherDetails, age_of_item: e.target.value}})}
                      placeholder="e.g., 2 years old"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="warranty_available"
                    checked={formData.otherDetails.warranty_available}
                    onChange={(e) => setFormData({...formData, otherDetails: {...formData.otherDetails, warranty_available: e.target.checked}})}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="warranty_available" className="text-sm text-gray-700">
                    Warranty Available
                  </label>
                </div>

                {formData.otherDetails.warranty_available && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Warranty Period
                    </label>
                    <input
                      type="text"
                      value={formData.otherDetails.warranty_period}
                      onChange={(e) => setFormData({...formData, otherDetails: {...formData.otherDetails, warranty_period: e.target.value}})}
                      placeholder="e.g., 1 year manufacturer warranty"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )

        default:
          return (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Details</h2>
              <p>Please select a category first.</p>
            </div>
          )
      }
    }

    if (currentStep === 7) {
      return (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit Fee Settings</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Enable Visit Fee
                  <input
                    type="checkbox"
                    checked={formData.visitFeeEnabled}
                    onChange={(e) => setFormData({ ...formData, visitFeeEnabled: e.target.checked })}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visit Fee Amount (RWF)
                  </label>
                  <input
                    type="number"
                    value={formData.visitFeeAmount}
                    onChange={(e) => setFormData({ ...formData, visitFeeAmount: e.target.value })}
                    placeholder="15000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Default visit fee is 15,000 RWF. Buyer pays before requesting a visit.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Visit Fee Payment Information</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        MTN Mobile Money Number
                      </label>
                      <input
                        type="tel"
                        value={formData.visitFeePaymentMethods.mtn_momo.phone_number}
                        onChange={(e) => setFormData({
                          ...formData,
                          visitFeePaymentMethods: {
                            ...formData.visitFeePaymentMethods,
                            mtn_momo: { phone_number: e.target.value }
                          }
                        })}
                        placeholder="078X XXX XXX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Airtel Money Number
                      </label>
                      <input
                        type="tel"
                        value={formData.visitFeePaymentMethods.airtel_money.phone_number}
                        onChange={(e) => setFormData({
                          ...formData,
                          visitFeePaymentMethods: {
                            ...formData.visitFeePaymentMethods,
                            airtel_money: { phone_number: e.target.value }
                          }
                        })}
                        placeholder="073X XXX XXX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Equity Account Name
                        </label>
                        <input
                          type="text"
                          value={formData.visitFeePaymentMethods.equity_bank.account_name}
                          onChange={(e) => setFormData({
                            ...formData,
                            visitFeePaymentMethods: {
                              ...formData.visitFeePaymentMethods,
                              equity_bank: {
                                ...formData.visitFeePaymentMethods.equity_bank,
                                account_name: e.target.value
                              }
                            }
                          })}
                          placeholder="IkazeProperty Ltd"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Equity Account Number
                        </label>
                        <input
                          type="text"
                          value={formData.visitFeePaymentMethods.equity_bank.account_number}
                          onChange={(e) => setFormData({
                            ...formData,
                            visitFeePaymentMethods: {
                              ...formData.visitFeePaymentMethods,
                              equity_bank: {
                                ...formData.visitFeePaymentMethods.equity_bank,
                                account_number: e.target.value
                              }
                            }
                          })}
                          placeholder="1234567890"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    These details are shown to buyers and used for visit fee communication.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    if (currentStep === 8) {
      return (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Promotion Options (Optional)</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Boost Your Listing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'featured', label: 'Featured', desc: 'Top placement and featured badge', price: 5000, duration: '30 days', duration_days: 30 },
                    { id: 'urgent', label: 'Urgent', desc: 'Urgent badge and higher ranking', price: 3000, duration: '14 days', duration_days: 14 },
                    { id: 'video', label: 'Video', desc: 'Video showcase for your listing', price: 4000, duration: '7 days', duration_days: 7 },
                    { id: 'social', label: 'Social', desc: 'Social media promotion', price: 1000, duration: '3 days', duration_days: 3 }
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, promotionType: option.id as any, selectedPromotion: option })}
                      className={`text-left p-4 border rounded-lg transition-all ${
                        formData.promotionType === option.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-lg font-bold text-red-600">{option.price.toLocaleString()} RWF</div>
                      </div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                      <div className="text-xs text-gray-500 mt-1">Valid for {option.duration}</div>
                    </button>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Promotion Benefits:</strong> Increase your listing visibility by up to 10x and get faster responses from potential buyers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    if (currentStep === 9) {
      return (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Listing Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{formData.title || 'Untitled Listing'}</h4>
                  <p className="text-2xl font-bold text-red-600 mt-2">
                    {formData.currency} {formData.price || '0'}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {formData.transactionType} • {formData.priceType}
                  </p>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Description</h5>
                  <p className="text-gray-600 text-sm">
                    {formData.description || 'No description provided'}
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Location</h5>
                  <p className="text-gray-600 text-sm">
                    {formData.location.address || 'No location provided'}
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Category</h5>
                  <p className="text-gray-600 text-sm capitalize">
                    {categories.find(c => c.id === category)?.name || category}
                  </p>
                </div>

                {category && renderCategoryDetails()}

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm">
                    ✓ Commission agreement accepted (30%)
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    ✓ Visit fee {formData.visitFeeEnabled ? 'enabled' : 'disabled'} ({formData.visitFeeAmount || '15000'} RWF)
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Before You Submit</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Double-check all information for accuracy</li>
                <li>• Ensure photos are clear and comprehensive</li>
                <li>• Verify contact preferences are correct</li>
                <li>• Confirm commission terms are understood</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Listing</h1>
                <p className="text-gray-600">
                  Step {currentStep} of {totalSteps}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {category && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {getStepNames(category).map((stepName, index) => {
                const stepNumber = index + 1
                return (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stepNumber <= currentStep 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {stepNumber}
                    </div>
                    {stepNumber < totalSteps && (
                      <div className={`w-16 h-1 mx-2 ${
                        stepNumber < currentStep ? 'bg-red-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              {getStepNames(category).map((stepName, index) => (
                <span key={index} className={index + 1 === currentStep ? 'font-semibold text-red-600' : ''}>
                  {stepName}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      {category && (
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {currentStep === 9 ? (
                <Button 
                  onClick={() => {
                    console.log('🔍 Promotion button clicked!', {
                      promotionType: formData.promotionType,
                      selectedPromotion: formData.selectedPromotion
                    })
                    // Create listing first, then redirect to payment
                    handleSubmit()
                  }}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Listing...
                    </>
                  ) : (
                    <>
                      Submit Listing
                    </>
                  )}
                </Button>
              ) : currentStep === 8 ? (
                // Promotion Options step - show custom buttons
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                        console.log('🔍 Continue without promotion button clicked!', {
                          promotionType: '',
                          selectedPromotion: null
                        })
                        handleNext()
                      }}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Continue without promotion
                  </Button>
                  {formData.promotionType && formData.selectedPromotion ? (
                    <Button
                      onClick={() => {
                        console.log('🔍 Promotion button clicked!', {
                          promotionType: formData.promotionType,
                          selectedPromotion: formData.selectedPromotion
                        })
                        // Open promotion payment modal
                        setShowPromotionPaymentModal(true)
                      }}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay {formData.selectedPromotion.price.toLocaleString()} RWF
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={!formData.promotionType}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Select Promotion
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              ) : (
                <Button 
                  onClick={handleNext}
                  disabled={currentStep === 1 && !category}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Promotion Payment Modal */}
      <PromotionPaymentModal
        isOpen={showPromotionPaymentModal}
        onClose={() => setShowPromotionPaymentModal(false)}
        promotionType={formData.promotionType}
        promotionPrice={formData.selectedPromotion?.price || 0}
        onSubmit={handlePromotionPayment}
        loading={promotionPaymentLoading}
      />
    </div>
  )
}
