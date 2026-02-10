'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, User, Package, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Database } from '@/types/database'
import AdminContactInfo from '@/components/listing/admin-contact'
import FavoriteButton from '@/components/listing/favorite-button'
import InquiryButton from '@/components/listing/inquiry-button'
import LikesDisplay from '@/components/listing/likes-display'
import ViewsDisplay from '@/components/listing/views-display'
import ImageViewer from '@/components/listing/ImageViewer'

type OtherListing = Database['public']['Tables']['listings']['Row'] & {
  seller?: {
    id: string
    full_name: string | null
    email: string | null
    avatar_url: string | null
  }
  other_details?: Database['public']['Tables']['other_details']['Row']
  media: Database['public']['Tables']['listing_media']['Row'][]
}

export default function OtherListingDetailPage() {
  const router = useRouter()
  const params = useParams() as { locale: string; id: string }
  const { id } = params
  
  const [listing, setListing] = useState<OtherListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
          other_details,
          media:listing_media(*)
        `)
        .eq('id', id)
        .eq('category', 'other')
        .single()

      if (listingError) {
        console.error('Error fetching listing:', listingError)
        throw listingError
      }

      if (!listingData) {
        notFound()
        return
      }

      setListing(listingData as OtherListing)
      
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

  const formatLocation = (location: any): string => {
    if (!location) return 'Location not specified'
    
    if (typeof location === 'string') {
      try {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load listing</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={fetchListing}
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!listing) {
    return notFound()
  }

  const primaryImage = listing.media?.find(m => m.is_primary) || listing.media?.[0]
  const allImages = listing.media?.map(m => m.url).filter(Boolean) || []

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
            <div className="flex items-center">
              <Package className="h-6 w-6 mr-2 text-red-600" />
              <h1 className="text-xl font-semibold text-gray-900">Item Listing Details</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  {primaryImage ? (
                    <img
                      src={primaryImage.url}
                      alt={listing.title}
                      className="w-full h-96 object-cover cursor-pointer"
                      onClick={() => openImageViewer(allImages, 0)}
                    />
                  ) : (
                    <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  
                  {listing.featured && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      FEATURED
                    </div>
                  )}
                  
                  {listing.promoted && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold">
                      PROMOTED
                    </div>
                  )}
                </div>
                
                {/* Image Gallery */}
                {allImages.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="grid grid-cols-4 gap-2">
                      {allImages.map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${listing.title} ${index + 1}`}
                          className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                          onClick={() => openImageViewer(allImages, index)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Listing Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{listing.title}</CardTitle>
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl font-bold text-red-600">
                        {listing.currency} {listing.price?.toLocaleString()}
                      </span>
                      {listing.price_type && listing.price_type !== 'fixed' && (
                        <Badge variant="secondary" className="capitalize">
                          {listing.price_type}
                        </Badge>
                      )}
                      <Badge variant="outline" className="capitalize">
                        {listing.transaction_type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FavoriteButton listingId={listing.id} />
                    <LikesDisplay listingId={listing.id} likesCount={listing.likes || 0} />
                    <ViewsDisplay listingId={listing.id} viewsCount={listing.views || 0} />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
                </div>

                {/* Location */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Location</h3>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {formatLocation(listing.location)}
                  </p>
                </div>

                {/* Item Details */}
                {listing.other_details && (
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Item Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{listing.other_details.subcategory}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Brand:</span>
                        <span className="text-sm">{listing.other_details.brand}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Model:</span>
                        <span className="text-sm">{listing.other_details.model}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Condition:</span>
                        <span className="text-sm">{listing.other_details.condition}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Age:</span>
                        <span className="text-sm">{listing.other_details.age_of_item}</span>
                      </div>
                      {listing.other_details.warranty_available && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Warranty:</span>
                          <span className="text-sm">{listing.other_details.warranty_period}</span>
                        </div>
                      )}
                      {listing.other_details.reason_for_selling && (
                        <div className="col-span-full">
                          <span className="text-sm">Reason for selling:</span>
                          <p className="text-sm mt-1">{listing.other_details.reason_for_selling}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            {listing.seller && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seller Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    {listing.seller.avatar_url ? (
                      <img
                        src={listing.seller.avatar_url}
                        alt={listing.seller.full_name || 'Seller'}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{listing.seller.full_name || 'Anonymous'}</p>
                      {(listing.seller as any).verified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <InquiryButton 
                      listingId={listing.id} 
                      sellerId={listing.seller_id} 
                      title={listing.title} 
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Admin Contact */}
            <AdminContactInfo />

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Contact Seller
                </Button>
                <Button variant="outline" className="w-full">
                  Make Offer
                </Button>
              </CardContent>
            </Card>

            {/* Listing Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Listing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed on:</span>
                  <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last updated:</span>
                  <span>{new Date(listing.updated_at).toLocaleDateString()}</span>
                </div>
                {listing.expires_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expires on:</span>
                    <span>{new Date(listing.expires_at).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Listing ID:</span>
                  <span className="font-mono text-xs">{listing.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {isImageViewerOpen && (
        <ImageViewer
          images={selectedImages}
          initialIndex={currentImageIndex}
          isOpen={isImageViewerOpen}
          onClose={() => setIsImageViewerOpen(false)}
        />
      )}
    </div>
  )
}
