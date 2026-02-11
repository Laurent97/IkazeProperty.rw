'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/auth'
import { Search, Filter, Users, Calendar, Clock, ArrowLeft, CheckCircle, XCircle, Eye, MessageSquare, Phone } from 'lucide-react'

interface VisitRequest {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  buyer_name?: string
  buyer_email?: string
  buyer_phone?: string
  visit_date?: string
  visit_time?: string
  visit_notes?: string
  visit_fee_amount?: number
  platform_fee?: number
  seller_payout?: number
  payment_reference?: string
  status?: string
  currency?: string
  created_at?: string
  listing?: {
    id: string
    title: string
    price: number
    currency: string
    category: string
    location?: string
  }
  buyer?: {
    full_name: string
    email: string
    phone?: string
    avatar_url?: string
  }
  seller?: {
    full_name: string
    email: string
    phone?: string
    avatar_url?: string
  }
}

export default function VisitRequestsPage() {
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<VisitRequest | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchVisitRequests()
  }, [])

  const fetchVisitRequests = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/visits/management')
      const data = await response.json()

      if (response.ok) {
        setVisitRequests(data.visitRequests || [])
      } else {
        console.error('Error fetching visit requests:', data.error)
        setError(data.error || 'Failed to fetch visit requests')
        setVisitRequests([])
      }
    } catch (error) {
      console.error('Error fetching visit requests:', error)
      setError('Failed to fetch visit requests')
      setVisitRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (request: VisitRequest) => {
    setSelectedRequest(request)
    setShowDetails(true)
  }

  const handleContactBuyer = (request: VisitRequest) => {
    const email = request.buyer_email || request.buyer?.email
    if (email) {
      window.location.href = `mailto:${email}?subject=Regarding your visit request for ${request.listing?.title}`
    }
  }

  const handleCallBuyer = (request: VisitRequest) => {
    const phone = request.buyer_phone || request.buyer?.phone
    if (phone) {
      window.location.href = `tel:${phone}`
    }
  }

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    switch (status) {
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-blue-100 text-blue-800'
      case 'released': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status?: string) => {
    if (!status) return <Clock className="h-4 w-4" />
    switch (status) {
      case 'pending_payment': return <Clock className="h-4 w-4" />
      case 'paid': return <CheckCircle className="h-4 w-4" />
      case 'released': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visit requests...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 h-14 sm:h-16">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Visit Requests Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{visitRequests.length} Total Requests</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        {visitRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No visit requests found</div>
            <p className="text-gray-400">Visit requests will appear here once customers submit them.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {visitRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-2">{(request.status || '').replace('_', ' ').toUpperCase()}</span>
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(request.created_at || '').toLocaleString()}
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{request.listing?.title || 'Untitled Listing'}</h4>
                        <p className="text-lg font-bold text-red-600">
                          {request.listing?.currency} {request.listing?.price?.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">{request.payment_reference}</Badge>
                    </div>

                    {/* Customer Information */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Customer Information
                      </h5>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                            {request.buyer?.avatar_url ? (
                              <img src={request.buyer.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <Users className="h-6 w-6 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-blue-900">{request.buyer_name || 'N/A'}</div>
                            <div className="text-sm text-blue-700">{request.buyer_email || 'N/A'}</div>
                            {request.buyer_phone && (
                              <div className="flex items-center text-xs text-gray-500">
                                <span className="mr-2">📱</span>
                                {request.buyer_phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Visit Details */}
                      {request.visit_date && (
                        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                          <h5 className="font-medium text-purple-900 mb-3 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Visit Details
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-purple-700">Preferred Date:</div>
                              <div className="font-medium text-purple-900">
                                {new Date(request.visit_date).toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              <div className="text-purple-700">Preferred Time:</div>
                              <div className="font-medium text-purple-900">{request.visit_time}</div>
                            </div>
                          </div>
                          {request.visit_notes && (
                            <div className="col-span-full mt-4">
                              <div className="text-purple-700">Notes:</div>
                              <div className="text-purple-900 bg-white p-3 rounded border border-purple-200">
                                {request.visit_notes}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Seller Info */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <h5 className="font-medium text-green-900 mb-3 flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Seller Information
                        </h5>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                            {request.seller?.avatar_url ? (
                              <img src={request.seller.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <Users className="h-6 w-6 text-green-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-green-900">{request.seller?.full_name || 'N/A'}</div>
                            <div className="text-sm text-green-700">{request.seller?.email || 'N/A'}</div>
                            {request.seller?.phone && (
                              <div className="flex items-center text-sm text-green-600">
                                <span className="mr-2">📱</span>
                                {request.seller.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDetails(request)}
                      className="flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleContactBuyer(request)}
                      className="flex items-center"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Email Buyer
                    </Button>
                    {(request.buyer_phone || request.buyer?.phone) && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCallBuyer(request)}
                        className="flex items-center"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Buyer
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => window.location.href = `/listings/${request.listing?.category}/${request.listing_id}`}
                      className="flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Listing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Visit Request Details</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Request Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Request Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500">Request ID</div>
                        <div className="font-medium">{selectedRequest.id}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <Badge className={getStatusColor(selectedRequest.status)}>
                          {getStatusIcon(selectedRequest.status)}
                          <span className="ml-2">{(selectedRequest.status || '').replace('_', ' ').toUpperCase()}</span>
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Payment Reference</div>
                        <div className="font-medium">{selectedRequest.payment_reference}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Created</div>
                        <div className="font-medium">{new Date(selectedRequest.created_at || '').toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Visit Fee</div>
                        <div className="font-medium text-green-600">
                          {selectedRequest.currency || 'RWF'} {selectedRequest.visit_fee_amount?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Buyer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Buyer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500">Name</div>
                        <div className="font-medium">{selectedRequest.buyer_name || selectedRequest.buyer?.full_name || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium">{selectedRequest.buyer_email || selectedRequest.buyer?.email || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-medium">{selectedRequest.buyer_phone || selectedRequest.buyer?.phone || 'N/A'}</div>
                      </div>
                      {selectedRequest.buyer?.avatar_url && (
                        <div>
                          <div className="text-sm text-gray-500">Avatar</div>
                          <img src={selectedRequest.buyer.avatar_url} alt="Buyer" className="w-16 h-16 rounded-full object-cover" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Visit Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Visit Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedRequest.visit_date && (
                        <div>
                          <div className="text-sm text-gray-500">Preferred Date</div>
                          <div className="font-medium">{new Date(selectedRequest.visit_date).toLocaleDateString()}</div>
                        </div>
                      )}
                      {selectedRequest.visit_time && (
                        <div>
                          <div className="text-sm text-gray-500">Preferred Time</div>
                          <div className="font-medium">{selectedRequest.visit_time}</div>
                        </div>
                      )}
                      {selectedRequest.visit_notes && (
                        <div>
                          <div className="text-sm text-gray-500">Notes</div>
                          <div className="font-medium bg-gray-50 p-3 rounded">{selectedRequest.visit_notes}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Listing Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Listing Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500">Title</div>
                        <div className="font-medium">{selectedRequest.listing?.title || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Price</div>
                        <div className="font-medium text-green-600">
                          {selectedRequest.listing?.currency} {selectedRequest.listing?.price?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Category</div>
                        <div className="font-medium">{selectedRequest.listing?.category || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-medium">{selectedRequest.listing?.location || 'N/A'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                <Button onClick={() => handleContactBuyer(selectedRequest)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Email Buyer
                </Button>
                {(selectedRequest.buyer_phone || selectedRequest.buyer?.phone) && (
                  <Button variant="outline" onClick={() => handleCallBuyer(selectedRequest)}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Buyer
                  </Button>
                )}
                <Button variant="outline" onClick={() => window.location.href = `/listings/${selectedRequest.listing?.category}/${selectedRequest.listing_id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Listing
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}