'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, User, Trees, Ruler, Calendar, Eye, Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AdminNavigation from '@/components/admin/AdminNavigation'

interface LandListing {
  id: string
  title: string
  description: string
  price: number
  currency: string
  category: string
  status: string
  location?: string
  created_at: string
  seller?: {
    full_name: string
    email: string
    avatar_url?: string
  }
  land_details?: {
    size: string
    land_type: string
    terrain: string
    utilities: string
    access_road: string
    zoning: string
  }
  media?: Array<{
    url: string
    media_type: string
    is_primary: boolean
    order_index: number
  }>
}

export default function AdminLandListingDetailPage() {
  const router = useRouter()
  const params = useParams() as { locale: string; id: string }
  const { id } = params
  const [listing, setListing] = useState<LandListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchListing()
  }, [id])

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/admin/listings/${id}`)
      const data = await response.json()
      if (response.ok) {
        setListing(data.listing)
      } else {
        setError(data.error || 'Failed to load listing')
        setListing(null)
      }
    } catch (error) {
      console.error('Error fetching listing:', error)
      setError('Failed to load listing')
      setListing(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => {
            // Try to go back, if no history then navigate to admin listings page
            if (window.history.length > 1) {
              router.back()
            } else {
              router.push(`/${params.locale}/admin/listings`)
            }
          }} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">⚠️ Not Found</div>
          <p className="text-gray-600">Listing not found</p>
          <Button onClick={() => {
            // Try to go back, if no history then navigate to admin listings page
            if (window.history.length > 1) {
              router.back()
            } else {
              router.push(`/${params.locale}/admin/listings`)
            }
          }} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 h-14 sm:h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => {
                  // Try to go back, if no history then navigate to admin listings page
                  if (window.history.length > 1) {
                    router.back()
                  } else {
                    router.push(`/${params.locale}/admin/listings`)
                  }
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Listings
              </Button>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Listing Details</h1>
              <p className="text-gray-600">Admin view of listing information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Listing Info */}
          <Card>
            <CardHeader>
              <CardTitle>Listing Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                  <p className="text-gray-600 mt-1">{listing.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="text-lg font-bold text-green-600">
                      {listing.currency} {listing.price.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <Badge className={
                      listing.status === 'available' ? 'bg-green-100 text-green-800' :
                      listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      listing.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {listing.status.toUpperCase()}
                    </Badge>
                  </div>
                  {listing.location && (
                    <div className="sm:col-span-2">
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2" />
                        {listing.location}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Land Details */}
          {listing.land_details && (
            <Card>
              <CardHeader>
                <CardTitle>Land Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Size</div>
                    <div className="font-medium text-gray-900">{listing.land_details.size}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Land Type</div>
                    <div className="font-medium text-gray-900">{listing.land_details.land_type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Terrain</div>
                    <div className="font-medium text-gray-900">{listing.land_details.terrain}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Utilities</div>
                    <div className="font-medium text-gray-900">{listing.land_details.utilities}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Access Road</div>
                    <div className="font-medium text-gray-900">{listing.land_details.access_road}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Zoning</div>
                    <div className="font-medium text-gray-900">{listing.land_details.zoning}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seller Information */}
          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  {listing.seller?.avatar_url ? (
                    <img src={listing.seller.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{listing.seller?.full_name || 'N/A'}</div>
                  <div className="text-sm text-gray-700">{listing.seller?.email || 'N/A'}</div>
                  <div className="text-sm text-gray-500">
                    Listed: {new Date(listing.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Listing
                </Button>
                <Button variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Edit Listing
                </Button>
                <Button variant="destructive">
                  <Heart className="h-4 w-4 mr-2" />
                  View Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media Gallery */}
        {listing.media && listing.media.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Media Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {listing.media.map((media, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <img 
                        src={media.url} 
                        alt={`${media.media_type} ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {media.is_primary && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                          Primary
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
