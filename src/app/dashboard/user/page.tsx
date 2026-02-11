'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Home, 
  Car, 
  Trees, 
  Package, 
  MessageSquare, 
  DollarSign, 
  Heart,
  Eye,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/auth'
import { getCurrentUser, getUserProfile } from '@/lib/auth'
import InquiryChat from '@/components/chat/InquiryChat'
import EmailSettings from '@/components/auth/EmailSettings'

export default function DashboardUserPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    myListings: 0,
    myInquiries: 0,
    myFavorites: 0,
    completedTransactions: 0,
    totalSpent: 0,
    totalEarned: 0
  })
  const [myListings, setMyListings] = useState([])
  const [myInquiries, setMyInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [chatStates, setChatStates] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Get current user
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        console.log('No user authenticated, redirecting to login')
        window.location.href = '/auth/login'
        return
      }

      // Get user profile with error handling
      try {
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single()
        
        setUser(userProfile)
      } catch (profileError) {
        console.log('User profile not found, using current user data')
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.user_metadata?.full_name || 'User'
        })
      }

      // Fetch user's listings with error handling
      try {
        const { data: listings } = await supabase
          .from('listings')
          .select('*')
          .eq('seller_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(5)

        setMyListings(listings || [])
      } catch (listingsError) {
        console.log('Error fetching listings:', listingsError)
        setMyListings([])
      }

      // Fetch user's inquiries with error handling
      try {
        const { data: inquiries } = await supabase
          .from('inquiries')
          .select(`
            *,
            listings(id, title, category, price),
            seller:users!inquiries_seller_id_fkey(email, full_name)
          `)
          .eq('buyer_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(5)

        setMyInquiries(inquiries || [])
      } catch (inquiriesError) {
        console.log('Error fetching inquiries:', inquiriesError)
        setMyInquiries([])
      }

      // Calculate stats
      const [
        listingsCount,
        inquiriesCount,
        transactionsAsBuyer,
        transactionsAsSeller
      ] = await Promise.all([
        supabase.from('listings').select('id', { count: 'exact', head: true }).eq('seller_id', currentUser.id),
        supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('buyer_id', currentUser.id),
        supabase.from('transactions').select('amount').eq('buyer_id', currentUser.id).eq('status', 'completed'),
        supabase.from('transactions').select('amount, commission_amount').eq('seller_id', currentUser.id).eq('status', 'completed')
      ])

      // Get favorites count via API
      const favoritesResponse = await fetch('/api/favorites')
      const favoritesData = favoritesResponse.ok ? await favoritesResponse.json() : { favorites: [] }
      const favoritesCountValue = favoritesData.favorites?.length || 0

      const totalSpent = transactionsAsBuyer.data?.reduce((sum: number, t: any) => sum + t.amount, 0) || 0
      const totalEarned = transactionsAsSeller.data?.reduce((sum: number, t: any) => sum + (t.amount - t.commission_amount), 0) || 0

      setStats({
        myListings: listingsCount.count || 0,
        myInquiries: inquiriesCount.count || 0,
        myFavorites: favoritesCountValue,
        completedTransactions: (transactionsAsBuyer.count || 0) + (transactionsAsSeller.count || 0),
        totalSpent,
        totalEarned
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
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

  const toggleChat = (inquiryId: string) => {
    setChatStates(prev => ({
      ...prev,
      [inquiryId]: !prev[inquiryId]
    }))
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
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.full_name || 'User'}!
            </h1>
            <p className="text-gray-600 mt-1">Manage your listings and inquiries</p>
          </div>
          <Link href="/create-listing">
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Home className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">My Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.myListings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">My Inquiries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.myInquiries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Favorites</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.myFavorites}</p>
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
                  <p className="text-sm font-medium text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    RWF {stats.totalSpent.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earned</p>
                  <p className="text-2xl font-bold text-gray-900">
                    RWF {stats.totalEarned.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Settings */}
          <div className="mb-8">
            <EmailSettings user={user} />
          </div>
          {/* My Listings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Home className="h-5 w-5 mr-2 text-blue-600" />
                  My Listings
                </div>
                <Link href="/dashboard/my-listings">
                  <Button size="sm" variant="outline">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myListings.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                  <p className="text-gray-600 mb-4">Start by creating your first listing</p>
                  <Link href="/create-listing">
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Listing
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myListings.map((listing: any) => (
                    <div key={listing.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            {getCategoryIcon(listing.category)}
                            <span className="ml-2 font-medium text-gray-900">
                              {listing.title}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-red-600 mb-1">
                            RWF {listing.price.toLocaleString()}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {listing.views || 0}
                            </span>
                            <span className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              {listing.likes || 0}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
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
                        <Link href={`/dashboard/my-listings/${listing.id}/edit`}>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Inquiries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                  My Inquiries
                </div>
                <Link href="/dashboard/my-inquiries">
                  <Button size="sm" variant="outline">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myInquiries.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
                  <p className="text-gray-600 mb-4">Browse listings and make inquiries</p>
                  <Link href="/listings">
                    <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                      Browse Listings
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myInquiries.map((inquiry: any) => (
                    <div key={inquiry.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            {getCategoryIcon(inquiry.listings.category)}
                            <span className="ml-2 font-medium text-gray-900">
                              {inquiry.listings.title}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Seller:</strong> {inquiry.seller.full_name || inquiry.seller.email}
                          </p>
                          <p className="text-sm text-gray-700 mb-2">{inquiry.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(inquiry.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        {inquiry.listings && inquiry.listings.id ? (
                          <Link href={`/listings/${inquiry.listings.category}/${inquiry.listings.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View Listing
                            </Button>
                          </Link>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            <Eye className="h-4 w-4 mr-1" />
                            View Listing
                          </Button>
                        )}
                        {inquiry.status === 'approved' && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => toggleChat(inquiry.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Contact Seller
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Chat Components */}
        {myInquiries.map((inquiry: any) => (
          <InquiryChat
            key={inquiry.id}
            inquiryId={inquiry.id}
            customerId={inquiry.buyer_id}
            customerName={user?.full_name || 'User'}
            customerEmail={user?.email || ''}
            isOpen={chatStates[inquiry.id] || false}
            onToggle={() => toggleChat(inquiry.id)}
            userType="customer"
          />
        ))}
    </div>
  )
}
