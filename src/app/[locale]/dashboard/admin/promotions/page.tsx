'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Star, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar,
  User,
  Home,
  Car,
  Trees,
  Package,
  Clock,
  AlertCircle,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/auth'

interface PromotionPayment {
  id: string
  listing_id: string
  package_id: string
  status: 'pending' | 'active' | 'expired' | 'cancelled'
  admin_notes?: string
  created_at: string
  updated_at: string
  starts_at: string
  expires_at: string
  listing: {
    id: string
    title: string
    category: string
    price: number
    currency: string
    seller: {
      email: string
      full_name: string
      phone_number?: string
    }
  }
  package: {
    id: string
    name: string
    description: string
    price: number
    duration_days: number
  }
  payment_transaction?: {
    id: string
    amount: number
    currency: string
    payment_method: string
    status: string
    payment_proof_url?: string
    created_at: string
  }
}

export default function PromotionPaymentsPage() {
  const [promotions, setPromotions] = useState<PromotionPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active' | 'cancelled'>('pending')
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch('/api/promotions/admin', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch promotions')
      }

      const result = await response.json()
      setPromotions(result.data || [])
    } catch (error) {
      console.error('Error fetching promotions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePromotionAction = async (promotionId: string, action: 'approve' | 'reject', adminNotes?: string) => {
    try {
      setProcessingAction(promotionId)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch('/api/promotions/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          promotion_id: promotionId,
          action,
          admin_notes: adminNotes
        })
      })

      if (!response.ok) {
        throw new Error('Failed to process action')
      }

      await fetchPromotions()
    } catch (error) {
      console.error('Error processing promotion action:', error)
    } finally {
      setProcessingAction(null)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'houses': return <Home className="h-4 w-4" />
      case 'cars': return <Car className="h-4 w-4" />
      case 'land': return <Trees className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      expired: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return (
      <Badge className={styles[status as keyof typeof styles] || styles.pending}>
        {status}
      </Badge>
    )
  }

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = !searchTerm || 
      promotion.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.listing.seller.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.package.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === 'all' || promotion.status === filterStatus

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading promotion payments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 -mx-6 px-6 py-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Promotion Payments</h1>
            <p className="text-gray-600 mt-1">Review and confirm promotion payment requests</p>
          </div>
          <Link href="/dashboard/admin">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by listing title, seller name, or package..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
            >
              All ({promotions.length})
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('pending')}
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Pending ({promotions.filter(p => p.status === 'pending').length})
            </Button>
            <Button
              variant={filterStatus === 'active' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('active')}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Active ({promotions.filter(p => p.status === 'active').length})
            </Button>
            <Button
              variant={filterStatus === 'cancelled' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('cancelled')}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Cancelled ({promotions.filter(p => p.status === 'cancelled').length})
            </Button>
          </div>
        </div>
      </div>

      {/* Promotions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-600" />
            Promotion Payment Requests ({filteredPromotions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPromotions.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No promotion payments found matching your criteria'
                  : 'No promotion payments found'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPromotions.map((promotion) => (
                <div key={promotion.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {getCategoryIcon(promotion.listing.category)}
                        <span className="ml-2 font-medium text-gray-900">
                          {promotion.listing.title}
                        </span>
                        {getStatusBadge(promotion.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Seller:</span>
                          <p className="font-medium">
                            {promotion.listing.seller.full_name || promotion.listing.seller.email}
                          </p>
                          {promotion.listing.seller.phone_number && (
                            <p className="text-gray-500">{promotion.listing.seller.phone_number}</p>
                          )}
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Package:</span>
                          <p className="font-medium">{promotion.package.name}</p>
                          <p className="text-gray-500">{promotion.package.description}</p>
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <p className="font-bold text-red-600">
                            {promotion.package.price.toLocaleString()} RWF
                          </p>
                          <p className="text-gray-500">
                            {promotion.package.duration_days} days
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Payment Method:</span>
                          <p className="font-medium">
                            {promotion.payment_transaction?.payment_method || 'N/A'}
                          </p>
                          {promotion.payment_transaction?.status && (
                            <p className="text-sm">
                              Status: <span className={
                                promotion.payment_transaction.status === 'completed' 
                                  ? 'text-green-600' 
                                  : 'text-yellow-600'
                              }>
                                {promotion.payment_transaction.status}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <Link href={`/listings/${promotion.listing.category}/${promotion.listing.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Payment Proof */}
                  {promotion.payment_transaction?.payment_proof_url && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Payment Proof</h4>
                      <a 
                        href={promotion.payment_transaction.payment_proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View Payment Proof
                      </a>
                    </div>
                  )}

                  {/* Admin Notes */}
                  {promotion.admin_notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <h4 className="font-medium text-blue-900 mb-1">Admin Notes</h4>
                      <p className="text-blue-700">{promotion.admin_notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {promotion.status === 'pending' && (
                    <div className="flex space-x-3">
                      <Button
                        size="sm"
                        onClick={() => handlePromotionAction(promotion.id, 'approve', 'Payment confirmed and promotion activated')}
                        disabled={processingAction === promotion.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processingAction === promotion.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve & Activate
                          </>
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePromotionAction(promotion.id, 'reject', 'Payment verification failed or invalid')}
                        disabled={processingAction === promotion.id}
                        className="border-red-600 text-red-600 hover:bg-red-50"
                      >
                        {processingAction === promotion.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="flex items-center text-xs text-gray-500 mt-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created: {new Date(promotion.created_at).toLocaleDateString()} • 
                    Expires: {new Date(promotion.expires_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
