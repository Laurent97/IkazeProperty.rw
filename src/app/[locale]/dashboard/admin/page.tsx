'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Home, 
  Car, 
  Trees, 
  Package, 
  MessageSquare, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Search,
  Filter,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/auth'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    pendingInquiries: 0,
    completedTransactions: 0,
    totalRevenue: 0
  })
  const [pendingInquiries, setPendingInquiries] = useState([])
  const [recentListings, setRecentListings] = useState([])
  const [visitRequests, setVisitRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [releasingPayout, setReleasingPayout] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [
        usersCount,
        listingsCount,
        inquiriesCount,
        transactionsCount,
        revenueData
      ] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('listings').select('id', { count: 'exact' }),
        supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('transactions').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('transactions').select('commission_amount').eq('status', 'completed')
      ])

      const totalRevenue = (revenueData.data as any[])?.reduce((sum, t) => sum + t.commission_amount, 0) || 0

      setStats({
        totalUsers: usersCount.count || 0,
        totalListings: listingsCount.count || 0,
        pendingInquiries: inquiriesCount.count || 0,
        completedTransactions: transactionsCount.count || 0,
        totalRevenue
      })

      // Fetch pending inquiries
      const { data: inquiries } = await supabase
        .from('inquiries')
        .select(`
          *,
          listings(title, category),
          buyer:users!inquiries_buyer_id_fkey(email, full_name),
          seller:users!inquiries_seller_id_fkey(email, full_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5)

      setPendingInquiries(inquiries || [])

      // Fetch recent listings
      const { data: listings } = await supabase
        .from('listings')
        .select(`
          *,
          seller:users!listings_seller_id_fkey(email, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentListings(listings || [])

      // Fetch visit requests for payout
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        console.log('Fetching visit requests with token:', session.access_token.substring(0, 20) + '...')
        const visitResponse = await fetch('/api/visits/admin', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })
        console.log('Visit response status:', visitResponse.status)
        const visitData = await visitResponse.json()
        console.log('Visit response data:', visitData)
        if (visitResponse.ok) {
          setVisitRequests(visitData.visits || [])
        } else {
          console.error('Visit request error:', visitData.error)
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInquiryAction = async (inquiryId: string, action: 'approved' | 'rejected') => {
    try {
      await (supabase as any)
        .from('inquiries')
        .update({ 
          status: action,
          admin_notes: action === 'approved' ? 'Approved by admin' : 'Rejected by admin'
        })
        .eq('id', inquiryId)

      fetchDashboardData()
    } catch (error) {
      console.error('Error updating inquiry:', error)
    }
  }

  const handleReleaseVisitPayout = async (visitId: string) => {
    try {
      setReleasingPayout(visitId)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch('/api/visits/release', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ visit_request_id: visitId })
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to release payout')
      }

      fetchDashboardData()
    } catch (error) {
      console.error('Error releasing payout:', error)
    } finally {
      setReleasingPayout(null)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage IkazeProperty.rw platform</p>
          </div>
          <div className="flex space-x-3">
            <Link href="/dashboard/admin/users">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Users className="h-4 w-4 mr-2" />
                Users
              </Button>
            </Link>
            <Link href="/dashboard/admin/listings">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Home className="h-4 w-4 mr-2" />
                Listings
              </Button>
            </Link>
            <Link href="/dashboard/admin/inquiries">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <MessageSquare className="h-4 w-4 mr-2" />
                Inquiries
              </Button>
            </Link>
            <Link href="/dashboard/admin/transactions">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <DollarSign className="h-4 w-4 mr-2" />
                Transactions
              </Button>
            </Link>
            <Link href="/dashboard/admin/settings">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Home className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Inquiries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingInquiries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    RWF {stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Inquiries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
                Pending Inquiries ({pendingInquiries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingInquiries.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No pending inquiries</p>
              ) : (
                <div className="space-y-4">
                  {pendingInquiries.map((inquiry: any) => (
                    <div key={inquiry.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            {getCategoryIcon(inquiry.listings.category)}
                            <span className="ml-2 font-medium text-gray-900">
                              {inquiry.listings.title}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Buyer:</strong> {inquiry.buyer.full_name || inquiry.buyer.email}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Seller:</strong> {inquiry.seller.full_name || inquiry.seller.email}
                          </p>
                          <p className="text-sm text-gray-700">{inquiry.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(inquiry.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleInquiryAction(inquiry.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleInquiryAction(inquiry.id, 'rejected')}
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Link href={`/dashboard/admin/inquiries/${inquiry.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Listings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Recent Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentListings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No listings yet</p>
              ) : (
                <div className="space-y-4">
                  {recentListings.map((listing: any) => (
                    <div key={listing.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            {getCategoryIcon(listing.category)}
                            <span className="ml-2 font-medium text-gray-900">
                              {listing.title}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Seller:</strong> {listing.seller.full_name || listing.seller.email}
                          </p>
                          <p className="text-lg font-bold text-red-600 mb-1">
                            RWF {listing.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(listing.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            listing.status === 'available' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {listing.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Link href={`/listings/${listing.category}/${listing.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/dashboard/admin/listings/${listing.id}`}>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Visit Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Visit Fee Requests ({visitRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {visitRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No visit requests</p>
              ) : (
                <div className="space-y-4">
                  {visitRequests.map((visit: any) => (
                    <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            {getCategoryIcon(visit.listings?.category)}
                            <span className="ml-2 font-medium text-gray-900">
                              {visit.listings?.title || 'Listing'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Buyer:</strong> {visit.buyer?.full_name || visit.buyer?.email}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Seller:</strong> {visit.seller?.full_name || visit.seller?.email}
                          </p>
                          {visit.seller?.phone_number && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Seller Phone:</strong> {visit.seller.phone_number}
                            </p>
                          )}
                          {visit.listings?.visit_fee_payment_methods && (
                            <div className="text-sm text-gray-600 mb-1">
                              <strong>Payment Methods:</strong>
                              <div className="ml-2 mt-1 space-y-1">
                                {Object.entries(visit.listings.visit_fee_payment_methods as any).map(([method, details]: [string, any]) => (
                                  <div key={method} className="text-xs">
                                    {method === 'mtn_momo' && details?.phone_number && (
                                      <span>MTN MoMo: {details.phone_number}</span>
                                    )}
                                    {method === 'airtel_money' && details?.phone_number && (
                                      <span>Airtel Money: {details.phone_number}</span>
                                    )}
                                    {method === 'equity_bank' && details?.account_number && (
                                      <span>Equity: {details.account_name || 'Account'} • {details.account_number}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <p className="text-sm text-gray-700">
                            Visit Fee: {Number(visit.visit_fee_amount || 0).toLocaleString()} RWF
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Status: {visit.status} • Payout: {visit.payout_status}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleReleaseVisitPayout(visit.id)}
                          disabled={visit.status !== 'paid' || visit.payout_status === 'released' || releasingPayout === visit.id}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                        >
                          {releasingPayout === visit.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                              Releasing...
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-4 w-4 mr-1" />
                              Release to Seller (70%)
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
    </div>
  )
}
