'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Home,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  DollarSign,
  Users,
  ArrowLeft,
  ArrowRight,
  Download,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface VisitRequest {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  visit_fee_amount: number
  platform_fee: number
  seller_payout: number
  payment_reference: string
  status: 'pending_payment' | 'paid' | 'released' | 'cancelled' | 'refunded'
  payout_status: string
  admin_notes?: string
  created_at: string
  updated_at: string
  listing: {
    id: string
    title: string
    price: number
    currency: string
    location: any
    category: string
    listing_media: Array<{
      url: string
      media_type: string
      is_primary: boolean
    }>
  }
  buyer: {
    id: string
    full_name: string
    email: string
    phone?: string
    avatar_url?: string
  }
  seller: {
    id: string
    full_name: string
    email: string
    phone?: string
    avatar_url?: string
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function VisitRequestsManagementPage() {
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<VisitRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<VisitRequest | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const fetchVisitRequests = async (page: number = 1, status: string = statusFilter) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(status !== 'all' && { status })
      })

      const response = await fetch(`/api/visits/management?${params}`)
      const data = await response.json()

      if (response.ok) {
        setVisitRequests(data.visitRequests || [])
        setPagination(data.pagination)
      } else {
        console.error('Error fetching visit requests:', data.error)
        setVisitRequests([])
      }
    } catch (error) {
      console.error('Error fetching visit requests:', error)
      setVisitRequests([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVisitRequests()
  }, [])

  useEffect(() => {
    let filtered = visitRequests

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(request =>
        request.listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.buyer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.seller.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.payment_reference.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredRequests(filtered)
  }, [visitRequests, statusFilter, searchQuery])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-blue-100 text-blue-800'
      case 'released': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_payment': return <Clock className="h-4 w-4" />
      case 'paid': return <DollarSign className="h-4 w-4" />
      case 'released': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      case 'refunded': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const updateRequestStatus = async (requestId: string, newStatus: string, notes?: string) => {
    try {
      const response = await fetch('/api/visits/management', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: requestId,
          status: newStatus,
          admin_notes: notes
        })
      })

      if (response.ok) {
        fetchVisitRequests(pagination.page, statusFilter)
        alert('Visit request updated successfully!')
      } else {
        const data = await response.json()
        alert(`Failed to update request: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating visit request:', error)
      alert('Failed to update visit request')
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchVisitRequests(newPage, statusFilter)
    }
  }

  const getTotalRevenue = () => {
    return visitRequests
      .filter(req => req.status === 'released')
      .reduce((sum, req) => sum + req.platform_fee, 0)
  }

  const getPendingPayments = () => {
    return visitRequests.filter(req => req.status === 'pending_payment').length
  }

  const getCompletedVisits = () => {
    return visitRequests.filter(req => req.status === 'released').length
  }

  const formatLocation = (location: any) => {
    if (!location) return 'Location not specified'
    if (typeof location === 'string') return location
    return Object.values(location).filter(Boolean).join(', ')
  }

  const maskPhoneNumber = (phone: string) => {
    if (!phone || phone.length < 6) return phone
    return `${phone.slice(0, 3)}*******${phone.slice(-2)}`
  }

  const getPrimaryImage = (media: any[]) => {
    const primary = media.find(m => m.is_primary)
    return primary?.url || media[0]?.url
  }

  if (isLoading && visitRequests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visit requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 no-overflow-x">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 h-14 sm:h-16">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Visit Requests Management</h1>
              <p className="text-xs sm:text-sm text-gray-600">Manage property visit requests and connect customers with sellers</p>
            </div>
            <Button
              onClick={() => fetchVisitRequests(pagination.page, statusFilter)}
              className="bg-red-600 hover:bg-red-700 touch-target"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Payment</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{getPendingPayments()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Completed Visits</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{getCompletedVisits()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Platform Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">RWF {getTotalRevenue().toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center">
                <Filter className="h-4 w-4 text-gray-500 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    fetchVisitRequests(1, e.target.value)
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  aria-label="Filter by status"
                  title="Filter requests by status"
                >
                  <option value="all">All Status</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="paid">Paid</option>
                  <option value="released">Released</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by property, customer, seller, or reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visit Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Visit Requests ({filteredRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">Property</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">Customer</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">Seller/Agent</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">Visit Fee</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">Status</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">Date</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {getPrimaryImage(request.listing.listing_media) ? (
                              <img
                                src={getPrimaryImage(request.listing.listing_media)}
                                alt={request.listing.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Home className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
                              {request.listing.title}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              {request.listing.currency} {request.listing.price?.toLocaleString()}
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="line-clamp-1">{formatLocation(request.listing.location)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            {request.buyer.avatar_url ? (
                              <img src={request.buyer.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <User className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 text-sm line-clamp-1">
                              {request.buyer.full_name}
                            </div>
                            <div className="text-xs text-gray-600 line-clamp-1">
                              {request.buyer.email}
                            </div>
                            {request.buyer.phone && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Phone className="h-3 w-3 mr-1" />
                                {request.buyer.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            {request.seller.avatar_url ? (
                              <img src={request.seller.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <User className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 text-sm line-clamp-1">
                              {request.seller.full_name}
                            </div>
                            <div className="text-xs text-gray-600 line-clamp-1">
                              {request.seller.email}
                            </div>
                            {request.seller.phone && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Phone className="h-3 w-3 mr-1" />
                                {request.seller.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="text-xs sm:text-sm">
                          <div className="font-semibold text-gray-900">
                            RWF {request.visit_fee_amount.toLocaleString()}
                          </div>
                          <div className="text-gray-600">
                            Platform: RWF {request.platform_fee.toLocaleString()}
                          </div>
                          <div className="text-green-600">
                            Seller: RWF {request.seller_payout.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{request.status.replace('_', ' ').toUpperCase()}</span>
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Ref: {request.payment_reference}
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="text-xs sm:text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(request.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-gray-500">
                            {new Date(request.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request)
                              setShowDetailsModal(true)
                            }}
                            className="touch-target p-1"
                            aria-label="View details"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          
                          {/* Always show action buttons for better management */}
                          <div className="flex items-center space-x-1">
                            {request.status === 'pending_payment' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => updateRequestStatus(request.id, 'paid')}
                                className="text-blue-600 hover:text-blue-700 touch-target p-1"
                                aria-label="Mark as paid"
                                title="Confirm payment received and mark as paid"
                              >
                                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            )}
                            
                            {request.status === 'paid' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => updateRequestStatus(request.id, 'cancelled', 'Refunded by admin')}
                                className="text-orange-600 hover:text-orange-700 touch-target p-1"
                                aria-label="Refund request"
                                title="Refund this request"
                              >
                                <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            )}
                            
                            {request.status !== 'cancelled' && request.status !== 'released' && request.status !== 'refunded' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  if (confirm('Are you sure you want to cancel this visit request?')) {
                                    updateRequestStatus(request.id, 'cancelled', 'Cancelled by admin')
                                  }
                                }}
                                className="text-red-600 hover:text-red-700 touch-target p-1"
                                aria-label="Cancel request"
                                title="Cancel this visit request"
                              >
                                <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredRequests.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Users className="h-12 w-12 mx-auto" />
                  </div>
                  <p className="text-gray-600">No visit requests found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Visit requests will appear here when customers request property visits'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} requests
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="touch-target"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600 px-3">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="touch-target"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-semibold">Visit Request Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 touch-target p-1"
                  aria-label="Close modal"
                >
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Property Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    Property Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {getPrimaryImage(selectedRequest.listing.listing_media) ? (
                          <img
                            src={getPrimaryImage(selectedRequest.listing.listing_media)}
                            alt={selectedRequest.listing.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{selectedRequest.listing.title}</h5>
                        <p className="text-lg font-bold text-red-600">
                          {selectedRequest.listing.currency} {selectedRequest.listing.price?.toLocaleString()}
                        </p>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {formatLocation(selectedRequest.listing.location)}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Category: {selectedRequest.listing.category}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* People Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    People Information
                  </h4>
                  
                  {/* Customer */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-3">Customer (Buyer)</h5>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                        {selectedRequest.buyer.avatar_url ? (
                          <img src={selectedRequest.buyer.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-blue-900">{selectedRequest.buyer.full_name}</div>
                        <div className="text-sm text-blue-700">{selectedRequest.buyer.email}</div>
                        {selectedRequest.buyer.phone && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Phone className="h-3 w-3 mr-1" />
                            {maskPhoneNumber(selectedRequest.buyer.phone)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Seller/Agent */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-medium text-green-900 mb-3">Seller/Agent Information</h5>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                        {selectedRequest.seller.avatar_url ? (
                          <img src={selectedRequest.seller.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-green-900">{selectedRequest.seller.full_name}</div>
                        <div className="text-sm text-green-700">{selectedRequest.seller.email}</div>
                        <div className="flex items-center text-sm text-green-600">
                          <Phone className="h-4 w-4 mr-1" />
                          {maskPhoneNumber(selectedRequest.seller.phone || '')}
                        </div>
                        <div className="text-xs text-green-600 mt-1 font-medium">
                          💰 Admin will send payment to this number
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Payment Information
                </h4>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-yellow-700">Total Visit Fee</div>
                      <div className="text-lg font-bold text-yellow-900">
                        RWF {selectedRequest.visit_fee_amount.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-yellow-700">Platform Fee (30%)</div>
                      <div className="text-lg font-bold text-yellow-900">
                        RWF {selectedRequest.platform_fee.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-yellow-700">Seller Payout (70%)</div>
                      <div className="text-lg font-bold text-green-900">
                        RWF {selectedRequest.seller_payout.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-yellow-700">Payment Reference</div>
                        <div className="font-mono text-sm text-yellow-900">
                          {selectedRequest.payment_reference}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-yellow-700">Current Status</div>
                        <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(selectedRequest.status)}`}>
                          {getStatusIcon(selectedRequest.status)}
                          <span className="ml-1">{selectedRequest.status.replace('_', ' ').toUpperCase()}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Timeline
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Request Created</div>
                        <div className="text-xs text-gray-600">
                          {new Date(selectedRequest.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {selectedRequest.updated_at !== selectedRequest.created_at && (
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Last Updated</div>
                          <div className="text-xs text-gray-600">
                            {new Date(selectedRequest.updated_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {/* Mark as Paid - always available for pending requests */}
                {selectedRequest.status === 'pending_payment' && (
                  <Button
                    onClick={() => {
                      if (confirm('Mark this request as paid? Admin will manually send money to seller.')) {
                        updateRequestStatus(selectedRequest.id, 'paid', 'Marked as paid by admin - money sent manually')
                        setShowDetailsModal(false)
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Mark as Paid
                  </Button>
                )}
                
                {/* Refund - available for paid requests */}
                {selectedRequest.status === 'paid' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (confirm('Refund this request? This will cancel the payment.')) {
                        updateRequestStatus(selectedRequest.id, 'cancelled', 'Refunded by admin')
                        setShowDetailsModal(false)
                      }
                    }}
                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Refund
                  </Button>
                )}
                
                {/* Cancel - available for any active request */}
                {selectedRequest.status !== 'cancelled' && selectedRequest.status !== 'released' && selectedRequest.status !== 'refunded' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this visit request?')) {
                        updateRequestStatus(selectedRequest.id, 'cancelled', 'Cancelled by admin')
                        setShowDetailsModal(false)
                      }
                    }}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Request
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
