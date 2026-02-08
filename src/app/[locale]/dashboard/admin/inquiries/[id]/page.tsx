'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  MessageSquare, 
  Home, 
  Car, 
  Trees, 
  Package, 
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Save,
  Ban
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import InquiryChat from '@/components/chat/InquiryChat'

export default function InquiryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [inquiry, setInquiry] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const inquiryId = params.id as string

  useEffect(() => {
    if (user && !authLoading) {
      fetchInquiry()
    }
  }, [user, authLoading, inquiryId])

  const fetchInquiry = async () => {
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

      // Fetch specific inquiry
      const response = await fetch(`/api/inquiries?role=admin`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch inquiry')
      }

      const result = await response.json()
      const inquiries = result.data || []
      const foundInquiry = inquiries.find((inq: any) => inq.id === inquiryId)

      if (!foundInquiry) {
        throw new Error('Inquiry not found')
      }

      setInquiry(foundInquiry)
      setAdminNotes(foundInquiry.admin_notes || '')
    } catch (error) {
      console.error('Error fetching inquiry:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setUpdating(true)

      // Get session token for API call
      const { supabaseClient } = await import('@/lib/supabase-client')
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('No session token')
      }

      const response = await fetch('/api/inquiries', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          inquiry_id: inquiryId,
          status: newStatus,
          admin_notes: adminNotes
        })
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to update inquiry')
      }

      // Refresh inquiry data
      await fetchInquiry()
      setIsEditingNotes(false)
    } catch (error) {
      console.error('Error updating inquiry:', error)
      alert('Error updating inquiry. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const handleSaveNotes = async () => {
    try {
      setUpdating(true)

      // Get session token for API call
      const { supabaseClient } = await import('@/lib/supabase-client')
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('No session token')
      }

      const response = await fetch('/api/inquiries', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          inquiry_id: inquiryId,
          status: inquiry.status,
          admin_notes: adminNotes
        })
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to update admin notes')
      }

      // Refresh inquiry data
      await fetchInquiry()
      setIsEditingNotes(false)
    } catch (error) {
      console.error('Error updating admin notes:', error)
      alert('Error updating admin notes. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'house': return <Home className="h-5 w-5" />
      case 'car': return <Car className="h-5 w-5" />
      case 'land': return <Trees className="h-5 w-5" />
      case 'other': return <Package className="h-5 w-5" />
      default: return <Package className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'accepted': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inquiry details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">You must be logged in to view this page.</p>
          <Link href="/auth/login">
            <Button className="mt-4">Log In</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Inquiry not found.</p>
          <Link href="/dashboard/admin/inquiries">
            <Button className="mt-4">Back to Inquiries</Button>
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
            <div className="flex items-center">
              <Link href="/dashboard/admin/inquiries">
                <Button variant="outline" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Inquiries
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Inquiry Details</h1>
                <p className="text-gray-600">Review and manage this inquiry</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(inquiry.status)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Listing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {getCategoryIcon(inquiry.listings?.category)}
                  <span className="ml-2">Listing Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{inquiry.listings?.title || 'N/A'}</h3>
                    <p className="text-2xl font-bold text-red-600">${inquiry.listings?.price?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium">{inquiry.listings?.category || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Listing ID</p>
                      <p className="font-medium">{inquiry.listings?.id || 'N/A'}</p>
                    </div>
                  </div>
                  <Link href={`/listings/${inquiry.listings?.category}/${inquiry.listings?.id}`}>
                    <Button variant="outline" className="w-full">
                      View Full Listing
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Buyer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Buyer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{inquiry.buyer?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{inquiry.buyer?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">User ID</p>
                    <p className="font-medium text-sm">{inquiry.buyer_id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{inquiry.seller?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{inquiry.seller?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">User ID</p>
                    <p className="font-medium text-sm">{inquiry.seller_id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Buyer Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Buyer's Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message || 'No message provided'}</p>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  Sent on {new Date(inquiry.created_at).toLocaleDateString()} at {new Date(inquiry.created_at).toLocaleTimeString()}
                </div>
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
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Status</span>
                    {getStatusBadge(inquiry.status)}
                  </div>
                  
                  {inquiry.status === 'pending' && (
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleUpdateStatus('accepted')}
                        disabled={updating}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept Inquiry
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus('rejected')}
                        disabled={updating}
                        variant="outline"
                        className="w-full border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Inquiry
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Admin Notes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Admin Notes</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditingNotes(!isEditingNotes)}
                  >
                    {isEditingNotes ? <Ban className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditingNotes ? (
                  <div className="space-y-4">
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add your notes about this inquiry..."
                      rows={6}
                      className="w-full"
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSaveNotes}
                        disabled={updating}
                        className="flex-1"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Notes
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditingNotes(false)
                          setAdminNotes(inquiry.admin_notes || '')
                        }}
                        variant="outline"
                        disabled={updating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {adminNotes ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 whitespace-pre-wrap">{adminNotes}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No admin notes yet. Click the edit button to add notes.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat */}
            <Card>
              <CardHeader>
                <CardTitle>Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setIsChatOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!inquiry?.buyer}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat with Customer
                </Button>
                <p className="text-xs text-gray-600 mt-2">
                  Start a real-time conversation with {inquiry?.buyer?.full_name || 'the customer'}
                </p>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Inquiry Created</p>
                      <p className="text-xs text-gray-600">{new Date(inquiry.created_at).toLocaleDateString()} at {new Date(inquiry.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  
                  {inquiry.updated_at && (
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-xs text-gray-600">{new Date(inquiry.updated_at).toLocaleDateString()} at {new Date(inquiry.updated_at).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chat Component */}
      {inquiry && (
        <InquiryChat
          inquiryId={inquiryId}
          customerId={inquiry.buyer_id}
          customerName={inquiry.buyer?.full_name || 'Customer'}
          customerEmail={inquiry.buyer?.email || ''}
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
        />
      )}
    </div>
  )
}
