'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  MessageSquare, 
  Home, 
  Car, 
  Trees, 
  Package, 
  Eye, 
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

export default function MyInquiriesPage() {
  const params = useParams()
  const { user, isLoading: authLoading } = useAuth()
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    if (user && !authLoading) {
      fetchInquiries()
    }
  }, [user, authLoading, filterStatus, searchTerm])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      
      if (!user) {
        return
      }

      // Get session token for API call
      const { supabaseClient } = await import('@/lib/supabase-client')
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      if (!session?.access_token) {
        return
      }

      // Build API URL with query parameters
      const params = new URLSearchParams({
        role: 'buyer' // This will filter for buyer's inquiries
      })
      
      if (filterStatus !== 'all') {
        params.append('status', filterStatus)
      }

      const response = await fetch(`/api/inquiries?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch inquiries')
      }

      const result = await response.json()
      let data = result.data || []

      // Apply client-side search if needed
      if (searchTerm) {
        data = data.filter((inquiry: any) => 
          inquiry.listings?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.seller?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.seller?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      setInquiries(data)
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'houses': return <Home className="h-4 w-4" />
      case 'cars': return <Car className="h-4 w-4" />
      case 'land': return <Trees className="h-4 w-4" />
      case 'other': return <Package className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'connected': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'connected': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredInquiries = inquiries

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your inquiries...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">You must be logged in to view your inquiries.</p>
          <Link href="/auth/login">
            <Button className="mt-4">Log In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Inquiries</h1>
              <p className="text-gray-600 mt-1">Track your property and item inquiries</p>
            </div>
            <Link href="/listings">
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                Browse Listings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search inquiries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="connected">Connected</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Inquiries List */}
        {filteredInquiries.length === 0 ? (
          <Card>
            <CardContent className="p-16 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No matching inquiries' : 'No inquiries yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your filters or search terms'
                  : 'Start browsing and make inquiries about properties you\'re interested in'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Link href="/listings">
                  <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                    Browse Listings
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry: any) => (
              <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        {getCategoryIcon(inquiry.listings?.category)}
                        <span className="ml-2 font-medium text-gray-900 text-lg">
                          {inquiry.listings?.title || 'Listing not available'}
                        </span>
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(inquiry.status)}`}>
                          {getStatusIcon(inquiry.status)}
                          {inquiry.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Seller:</strong> {inquiry.seller?.full_name || inquiry.seller?.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Price:</strong> RWF {inquiry.listings?.price?.toLocaleString() || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Category:</strong> {inquiry.listings?.category || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Inquired:</strong> {new Date(inquiry.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Your Message:</p>
                        <p className="text-gray-600">{inquiry.message}</p>
                      </div>

                      {inquiry.admin_notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <p className="text-sm font-medium text-blue-800 mb-1">Admin Notes:</p>
                          <p className="text-blue-700 text-sm">{inquiry.admin_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link href={`/${params.locale || 'en'}/listings/${inquiry.listings?.category}/${inquiry.listings?.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Listing
                      </Button>
                    </Link>
                    
                    {inquiry.status === 'approved' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          if (inquiry.seller?.email) {
                            window.location.href = `mailto:${inquiry.seller.email}?subject=Inquiry about: ${inquiry.listings?.title}&body=Hi ${inquiry.seller?.full_name},\n\nI'm interested in your listing: ${inquiry.listings?.title}.\n\n${inquiry.message}\n\nPlease let me know if it's still available.\n\nThank you!`
                          } else {
                            alert('Seller contact information not available')
                          }
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contact Seller
                      </Button>
                    )}
                    
                    {inquiry.status === 'connected' && (
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          if (inquiry.seller?.email) {
                            window.location.href = `mailto:${inquiry.seller.email}?subject=Follow-up about: ${inquiry.listings?.title}&body=Hi ${inquiry.seller?.full_name},\n\nFollowing up on my inquiry about: ${inquiry.listings?.title}.\n\n${inquiry.message}\n\nIs this listing still available?\n\nThank you!`
                          } else {
                            alert('Seller contact information not available')
                          }
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Continue Conversation
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
