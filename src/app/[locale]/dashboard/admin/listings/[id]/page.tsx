'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Home,
  Car,
  Trees,
  Package,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  Calendar,
  MapPin,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/auth'

export default function AdminListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = params.id as string

  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [inquiries, setInquiries] = useState<any[]>([])

  useEffect(() => {
    fetchListingDetails()
  }, [listingId])

  const fetchListingDetails = async () => {
    try {
      setLoading(true)

      // Fetch listing details
      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select(`
          *,
          seller:users!listings_seller_id_fkey(*)
        `)
        .eq('id', listingId)
        .single()

      if (listingError) throw listingError

      setListing(listingData)
      setFormData(listingData)

      // Fetch inquiries for this listing
      const { data: inquiriesData, error: inquiriesError } = await supabase
        .from('inquiries')
        .select(`
          *,
          buyer:users!inquiries_buyer_id_fkey(*)
        `)
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false })

      if (inquiriesError) throw inquiriesError

      setInquiries(inquiriesData || [])
    } catch (error) {
      console.error('Error fetching listing details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'house':
        return <Home className="h-5 w-5" />
      case 'car':
        return <Car className="h-5 w-5" />
      case 'land':
        return <Trees className="h-5 w-5" />
      case 'other':
        return <Package className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'sold':
        return <Badge className="bg-blue-100 text-blue-800">Sold</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const handleUpdateListing = async () => {
    try {
      const { error } = await (supabase as any)
        .from('listings')
        .update(formData)
        .eq('id', listingId)

      if (error) throw error

      setListing(formData)
      setEditing(false)
      alert('Listing updated successfully!')
    } catch (error) {
      console.error('Error updating listing:', error)
      alert('Error updating listing. Please try again.')
    }
  }

  const handleDeleteListing = async () => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)

      if (error) throw error

      router.push('/dashboard/admin/listings')
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert('Error deleting listing. Please try again.')
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await (supabase as any)
        .from('listings')
        .update({ status: newStatus })
        .eq('id', listingId)

      if (error) throw error

      setListing({ ...listing, status: newStatus })
      setFormData({ ...formData, status: newStatus })
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error updating status. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading listing details...</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Listing Not Found</h2>
          <p className="text-gray-600 mb-4">The listing you're looking for doesn't exist.</p>
          <Link href="/dashboard/admin/listings">
            <Button>Back to Listings</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/admin/listings">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Listings
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Listing Details</h1>
              <p className="text-gray-600">Manage listing information and inquiries</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {!editing ? (
              <>
                <Button onClick={() => setEditing(true)} variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={handleDeleteListing} variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleUpdateListing} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={() => {
                  setEditing(false)
                  setFormData(listing)
                }} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Listing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {getCategoryIcon(listing.category)}
                <span className="ml-2">Listing Information</span>
                {getStatusBadge(listing.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <Input
                      value={formData.title || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <Textarea
                      value={formData.description || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <Input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={formData.category || ''}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="house">House</option>
                        <option value="car">Car</option>
                        <option value="land">Land</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <Input
                      value={typeof formData.location === 'string' ? formData.location : JSON.stringify(formData.location) || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>
                    <p className="text-gray-600 mb-4">{listing.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="ml-2 font-medium">${listing.price?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      {getCategoryIcon(listing.category)}
                      <span className="ml-2 text-sm text-gray-600">Category:</span>
                      <span className="ml-2 font-medium capitalize">{listing.category}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="ml-2 font-medium">
                        {typeof listing.location === 'string' 
                          ? listing.location 
                          : listing.location 
                            ? `${listing.location.village || ''}, ${listing.location.district || ''}, ${listing.location.province || ''}`.replace(/^[,\s]+|[,\s]+$/g, '') || 'Not specified'
                          : 'Not specified'
                        }
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Available until:</span>
                      <span className="ml-2 font-medium">
                        {listing.available_until ? new Date(listing.available_until).toLocaleDateString() : 'Not specified'}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Inquiries */}
          <Card>
            <CardHeader>
              <CardTitle>Inquiries ({inquiries.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {inquiries.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No inquiries yet</p>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry: any) => (
                    <div key={inquiry.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium text-gray-900">{inquiry.buyer?.full_name}</span>
                            <span className="ml-2 text-sm text-gray-600">({inquiry.buyer?.email})</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{inquiry.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(inquiry.created_at).toLocaleDateString()}
                            </span>
                            {getStatusBadge(inquiry.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleStatusChange('active')}
                disabled={listing.status === 'active'}
                className="w-full"
                variant={listing.status === 'active' ? 'default' : 'outline'}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Active
              </Button>
              <Button
                onClick={() => handleStatusChange('pending')}
                disabled={listing.status === 'pending'}
                className="w-full"
                variant={listing.status === 'pending' ? 'default' : 'outline'}
              >
                <Clock className="h-4 w-4 mr-2" />
                Mark as Pending
              </Button>
              <Button
                onClick={() => handleStatusChange('sold')}
                disabled={listing.status === 'sold'}
                className="w-full"
                variant={listing.status === 'sold' ? 'default' : 'outline'}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Mark as Sold
              </Button>
              <Button
                onClick={() => handleStatusChange('rejected')}
                disabled={listing.status === 'rejected'}
                className="w-full text-red-600 hover:text-red-700"
                variant={listing.status === 'rejected' ? 'default' : 'outline'}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Listing
              </Button>
            </CardContent>
          </Card>

          {/* Seller Information */}
          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">{listing.seller?.full_name}</p>
                    <p className="text-sm text-gray-600">{listing.seller?.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Joined {new Date(listing.seller?.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/listings/${listing.category}/${listing.id}`}>
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View Public Listing
                </Button>
              </Link>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Export Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
