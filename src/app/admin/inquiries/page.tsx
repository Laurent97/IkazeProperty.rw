'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  MessageSquare, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle,
  XCircle,
  MoreVertical,
  Eye,
  Clock,
  Search,
  Filter,
  MessageCircle
} from 'lucide-react'
import { supabase } from '@/lib/auth'
import { Database } from '@/types/database'
import InquiryChat from '@/components/chat/InquiryChat'

type Inquiry = Database['public']['Tables']['inquiries']['Row'] & {
  listings?: {
    id: string
    title: string
    category: string
    price: number
    location: any
  }
  buyer?: {
    email: string
    full_name: string | null
  }
  seller?: {
    email: string
    full_name: string | null
  }
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeChatInquiry, setActiveChatInquiry] = useState<string | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [search, statusFilter])

  const fetchInquiries = async () => {
    try {
      let query = supabase
        .from('inquiries')
        .select(`
          *,
          listings(id, title, category, price, location),
          buyer:users!inquiries_buyer_id_fkey(email, full_name),
          seller:users!inquiries_seller_id_fkey(email, full_name)
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (search) {
        query = query.or(`
          buyer.full_name.ilike.%${search}%,
          seller.full_name.ilike.%${search}%,
          listings.title.ilike.%${search}%,
          message.ilike.%${search}%
        `)
      }
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching inquiries:', error)
        return
      }
      
      setInquiries(data || [])
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      connected: 'bg-blue-100 text-blue-800'
    }
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const updateInquiryStatus = async (inquiryId: string, newStatus: 'pending' | 'approved' | 'rejected' | 'connected') => {
    try {
      const { error } = await (supabase as any)
        .from('inquiries')
        .update({ 
          status: newStatus
        })
        .eq('id', inquiryId)
      
      if (error) throw error
      
      // Refresh the data
      fetchInquiries()
    } catch (error) {
      console.error('Error updating inquiry status:', error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inquiries Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search inquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="connected">Connected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : inquiries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No inquiries found</h3>
            <p className="text-gray-500 text-center">
              {search || statusFilter !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'No inquiries have been submitted yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        {inquiry.listings?.title || 'Unknown Listing'}
                      </h3>
                      {getStatusBadge(inquiry.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium">
                        {inquiry.listings?.category ? inquiry.listings.category.charAt(0).toUpperCase() + inquiry.listings.category.slice(1) : 'Unknown'}
                      </span>
                      <span>•</span>
                      <span>
                        {inquiry.listings?.price 
                          ? `${new Intl.NumberFormat('rw-RW').format(inquiry.listings.price)} RWF`
                          : 'Price not set'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/[locale]/listings/${inquiry.listing_id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Listing
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveChatInquiry(inquiry.id)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-2">{inquiry.message}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Buyer</p>
                      <p className="text-sm text-gray-600">
                        {inquiry.buyer?.full_name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">{inquiry.buyer?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Seller</p>
                      <p className="text-sm text-gray-600">
                        {inquiry.seller?.full_name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">{inquiry.seller?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {formatDate(inquiry.created_at)}
                  </div>
                  
                  {inquiry.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateInquiryStatus(inquiry.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateInquiryStatus(inquiry.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                  
                  {inquiry.status === 'approved' && (
                    <Button
                      size="sm"
                      onClick={() => updateInquiryStatus(inquiry.id, 'connected')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark as Connected
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Chat Modal */}
      {activeChatInquiry && (
        <InquiryChat
          inquiryId={activeChatInquiry}
          customerId={inquiries.find(i => i.id === activeChatInquiry)?.buyer_id || ''}
          customerName={inquiries.find(i => i.id === activeChatInquiry)?.buyer?.full_name || 'Unknown'}
          customerEmail={inquiries.find(i => i.id === activeChatInquiry)?.buyer?.email || 'unknown@example.com'}
          isOpen={!!activeChatInquiry}
          onToggle={() => setActiveChatInquiry(null)}
          userType="admin"
        />
      )}
    </div>
  )
}
