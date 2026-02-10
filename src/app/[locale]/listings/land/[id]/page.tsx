'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, User, Trees, Ruler } from 'lucide-react'
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
  
  const [listing, setListing] = useState<LandListing | null>(null)
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
          land_details,
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
    </div>
  )
}
