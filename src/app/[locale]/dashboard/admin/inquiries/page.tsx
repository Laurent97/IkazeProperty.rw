'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MessageSquare, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Home,
  Car,
  Trees,
  Package,
  User,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminInquiriesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (user && !authLoading) {
      fetchInquiries()
    }
  }, [currentPage, statusFilter, searchTerm, user, authLoading])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      
      if (!user) {
        console.error('User not authenticated')
        return
      }

      // Get session token for API call
      const { supabaseClient } = await import('@/lib/supabase-client')
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      if (!session?.access_token) {
        console.error('No session token')
        return
      }

      // Build API URL with query parameters
      const params = new URLSearchParams({
        role: 'admin' // This will trigger admin access in the API
      })
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
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
          inquiry.buyer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.buyer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.seller?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.seller?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Apply pagination
      const itemsPerPage = 10
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedData = data.slice(startIndex, endIndex)

      setInquiries(paginatedData)
      setTotalPages(Math.ceil(data.length / itemsPerPage))
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'house':
        return <Home className="h-4 w-4" />
      case 'car':
        return <Car className="h-4 w-4" />
      case 'land':
        return <Trees className="h-4 w-4" />
      case 'other':
        return <Package className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
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

  const handleUpdateStatus = async (inquiryId: string, newStatus: string) => {
    try {
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
          status: newStatus
        })
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to update inquiry status')
      }

      // Refresh inquiries
      fetchInquiries()
    } catch (error) {
      console.error('Error updating inquiry status:', error)
      alert('Error updating inquiry status. Please try again.')
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Inquiries</h1>
        <p className="text-gray-600">View and manage all property inquiries on the platform</p>
      </div>

      {authLoading ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Checking authentication...</p>
            </div>
          </CardContent>
        </Card>
      ) : !user ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-gray-600">You must be logged in to view this page.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Filter by inquiry status"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setCurrentPage(1)
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Inquiries ({inquiries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading inquiries...</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No inquiries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Listing</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Buyer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Seller</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Message</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry: any) => (
                    <tr key={inquiry.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {getCategoryIcon(inquiry.listings?.category)}
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{inquiry.listings?.title || 'N/A'}</p>
                            <p className="text-sm text-gray-600">${inquiry.listings?.price?.toLocaleString() || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-900">{inquiry.buyer?.full_name || 'Unknown'}</p>
                            <p className="text-sm text-gray-600">{inquiry.buyer?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-900">{inquiry.seller?.full_name || 'Unknown'}</p>
                            <p className="text-sm text-gray-600">{inquiry.seller?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900 max-w-xs truncate">
                          {inquiry.message || 'No message'}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(inquiry.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link href={`/dashboard/admin/inquiries/${inquiry.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {inquiry.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(inquiry.id, 'accepted')}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(inquiry.id, 'rejected')}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
        </>
      )}
    </div>
  )
}
