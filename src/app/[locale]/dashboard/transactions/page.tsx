'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  DollarSign, 
  Home, 
  Car, 
  Trees, 
  Package, 
  Eye, 
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/auth'
import { getCurrentUser } from '@/lib/auth'

export default function TransactionsPage() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        window.location.href = '/auth/login'
        return
      }

      setUser(currentUser)

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          listings(id, title, category),
          buyer:users!transactions_buyer_id_fkey(email, full_name),
          seller:users!transactions_seller_id_fkey(email, full_name)
        `)
        .or(`buyer_id.eq.${currentUser.id},seller_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
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
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'disputed': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      case 'disputed': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredTransactions = transactions.filter((transaction: any) => {
    const matchesSearch = 
      transaction.listings?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.seller?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
    
    const isBuyer = transaction.buyer_id === user?.id
    const isSeller = transaction.seller_id === user?.id
    const matchesType = filterType === 'all' || 
      (filterType === 'buyer' && isBuyer) || 
      (filterType === 'seller' && isSeller)
    
    return matchesSearch && matchesStatus && matchesType
  })

  const calculateTotalStats = () => {
    const completedTransactions = filteredTransactions.filter((t: any) => t.status === 'completed')
    const totalSpent = completedTransactions
      .filter((t: any) => t.buyer_id === user?.id)
      .reduce((sum: number, t: any) => sum + t.amount, 0)
    const totalEarned = completedTransactions
      .filter((t: any) => t.seller_id === user?.id)
      .reduce((sum: number, t: any) => sum + (t.amount - t.commission_amount), 0)
    
    return { totalSpent, totalEarned }
  }

  const { totalSpent, totalEarned } = calculateTotalStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your transactions...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
              <p className="text-gray-600 mt-1">Track your buying and selling activities</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="h-4 w-4 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    RWF {totalSpent.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ArrowDownRight className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earned</p>
                  <p className="text-2xl font-bold text-gray-900">
                    RWF {totalEarned.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
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
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="disputed">Disputed</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Filter by type"
              >
                <option value="all">All Types</option>
                <option value="buyer">As Buyer</option>
                <option value="seller">As Seller</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="p-16 text-center">
              <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all' 
                  ? 'No matching transactions' 
                  : 'No transactions yet'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all' 
                  ? 'Try adjusting your filters or search terms'
                  : 'Your transaction history will appear here once you start buying or selling'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && filterType === 'all' && (
                <Link href="/listings">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Browse Listings
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction: any) => {
              const isBuyer = transaction.buyer_id === user?.id
              const isSeller = transaction.seller_id === user?.id
              
              return (
                <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          {getCategoryIcon(transaction.listings?.category)}
                          <span className="ml-2 font-medium text-gray-900 text-lg">
                            {transaction.listings?.title || 'Transaction'}
                          </span>
                          <span className={`ml-3 px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(transaction.status)}`}>
                            {getStatusIcon(transaction.status)}
                            {transaction.status}
                          </span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            isBuyer ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {isBuyer ? 'Buyer' : 'Seller'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Amount:</strong> RWF {transaction.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Commission:</strong> RWF {transaction.commission_amount.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>{isBuyer ? 'Seller' : 'Buyer'}:</strong> {isBuyer 
                                ? transaction.seller?.full_name || transaction.seller?.email
                                : transaction.buyer?.full_name || transaction.buyer?.email
                              }
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Date:</strong> {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Payment Method:</strong> {transaction.payment_method || 'Not specified'}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Transaction Date:</strong> {transaction.transaction_date 
                                ? new Date(transaction.transaction_date).toLocaleDateString()
                                : 'Not completed'
                              }
                            </p>
                          </div>
                        </div>

                        {isSeller && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-sm font-medium text-green-800">
                              You will receive: RWF {(transaction.amount - transaction.commission_amount).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link href={`/listings/${transaction.listings?.category}/${transaction.listings?.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Listing
                        </Button>
                      </Link>
                      
                      {transaction.status === 'pending' && (
                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                          <Clock className="h-4 w-4 mr-1" />
                          Complete Payment
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
