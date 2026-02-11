'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  MessageCircle, 
  Reply,
  Archive,
  Trash2,
  Calendar,
  Mail,
  Phone,
  User
} from 'lucide-react'
import AdminNavigation from '@/components/admin/AdminNavigation'

interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  listing_id?: string
  listing_title?: string
  status: string
  created_at: string
  replied_at?: string
}

export default function InquiriesManagementPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/admin/inquiries')
      const data = await response.json()
      if (response.ok) {
        setInquiries(data.inquiries || [])
      } else {
        console.error('Error fetching inquiries:', data.error)
        setInquiries([])
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error)
      setInquiries([])
    } finally {
      setLoading(false)
    }
  }

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inquiry.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'replied': return 'bg-blue-100 text-blue-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <MessageCircle className="h-4 w-4" />
      case 'replied': return <Reply className="h-4 w-4" />
      case 'archived': return <Archive className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inquiries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inquiries Management</h1>
          <p className="text-gray-600">Manage customer inquiries and messages</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search inquiries by name, email, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Inquiries Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInquiries.map((inquiry) => (
            <Card key={inquiry.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(inquiry.status)}>
                      {getStatusIcon(inquiry.status)}
                      <span className="ml-2">{inquiry.status.toUpperCase()}</span>
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  {/* Contact Info */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900">{inquiry.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-blue-700">
                          <Mail className="h-3 w-3" />
                          <span>{inquiry.email}</span>
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center space-x-2 text-sm text-blue-700">
                            <Phone className="h-3 w-3" />
                            <span>{inquiry.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-2">Message</h5>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
                  </div>

                  {/* Listing Reference */}
                  {inquiry.listing_title && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <h5 className="font-medium text-green-900 mb-1">Regarding Listing</h5>
                      <p className="text-sm text-green-700">{inquiry.listing_title}</p>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Received: {new Date(inquiry.created_at).toLocaleDateString()}
                    </div>
                    {inquiry.replied_at && (
                      <div className="flex items-center">
                        <Reply className="h-3 w-3 mr-1" />
                        Replied: {new Date(inquiry.replied_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInquiries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <MessageCircle className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-600">No inquiries found</p>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
