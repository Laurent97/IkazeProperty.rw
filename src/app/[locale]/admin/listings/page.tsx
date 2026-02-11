'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Plus,
  Image,
  MapPin,
  DollarSign,
  Calendar,
  Home
} from 'lucide-react'
import AdminNavigation from '@/components/admin/AdminNavigation'

interface Listing {
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
  }
  media?: Array<{
    url: string
    media_type: string
    is_primary: boolean
  }>
}

export default function ListingsManagementPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/admin/listings')
      const data = await response.json()
      if (response.ok) {
        setListings(data.listings || [])
      } else {
        console.error('Error fetching listings:', data.error)
        setListings([])
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || listing.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-blue-100 text-blue-800'
      case 'removed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'house': return <Home className="h-4 w-4" />
      case 'land': return <MapPin className="h-4 w-4" />
      case 'car': return <Image className="h-4 w-4" />
      default: return <Image className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Listings Management</h1>
            <p className="text-gray-600">Manage all property and item listings</p>
          </div>
          <Button onClick={() => window.location.href = '/admin/listings/new'}>
            <Plus className="h-4 w-4 mr-2" />
            Add Listing
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search listings by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="removed">Removed</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="house">Houses</option>
                <option value="land">Land</option>
                <option value="car">Cars</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(listing.category)}
                    <Badge className={getStatusColor(listing.status)}>
                      {listing.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `/admin/listings/${listing.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `/admin/listings/${listing.id}/edit`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{listing.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{listing.description}</p>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                      <span className="text-lg font-bold text-green-600">
                        {listing.currency} {listing.price.toLocaleString()}
                      </span>
                    </div>
                    <Badge variant="outline">
                      {listing.category.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Location */}
                  {listing.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {listing.location}
                    </div>
                  )}

                  {/* Seller */}
                  {listing.seller && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">Seller:</span>
                      {listing.seller.full_name} ({listing.seller.email})
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    Listed: {new Date(listing.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Home className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-600">No listings found</p>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
