'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  User,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import AdminNavigation from '@/components/admin/AdminNavigation'

interface Transaction {
  id: string
  type: string
  amount: number
  currency: string
  status: string
  from_user?: {
    full_name: string
    email: string
  }
  to_user?: {
    full_name: string
    email: string
  }
  listing?: {
    title: string
    id: string
  }
  created_at: string
  completed_at?: string
  description?: string
}

export default function TransactionsManagementPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/admin/transactions')
      const data = await response.json()
      if (response.ok) {
        setTransactions(data.transactions || [])
      } else {
        console.error('Error fetching transactions:', data.error)
        setTransactions([])
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.listing?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.from_user?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.to_user?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'failed': return <XCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-blue-100 text-blue-800'
      case 'refund': return 'bg-red-100 text-red-800'
      case 'payout': return 'bg-green-100 text-green-800'
      case 'fee': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalRevenue = transactions
    .filter(t => t.type === 'payment' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalRefunds = transactions
    .filter(t => t.type === 'refund' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transactions Management</h1>
          <p className="text-gray-600">Manage all financial transactions and payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalRevenue.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Completed payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
                Total Refunds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${totalRefunds.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Completed refunds</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                Net Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${(totalRevenue - totalRefunds).toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">After refunds</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="payment">Payments</option>
                <option value="refund">Refunds</option>
                <option value="payout">Payouts</option>
                <option value="fee">Fees</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge className={getTypeColor(transaction.type)}>
                        {transaction.type.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(transaction.status)}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-2">{transaction.status.toUpperCase()}</span>
                      </Badge>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        <span className="text-lg font-bold text-green-600">
                          {transaction.currency} {transaction.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {transaction.description && (
                      <p className="text-sm text-gray-700 mb-3">{transaction.description}</p>
                    )}

                    {/* Parties */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {transaction.from_user && (
                        <div>
                          <div className="text-gray-500">From:</div>
                          <div className="font-medium text-gray-900">
                            {transaction.from_user.full_name} ({transaction.from_user.email})
                          </div>
                        </div>
                      )}
                      {transaction.to_user && (
                        <div>
                          <div className="text-gray-500">To:</div>
                          <div className="font-medium text-gray-900">
                            {transaction.to_user.full_name} ({transaction.to_user.email})
                          </div>
                        </div>
                      )}
                      {transaction.listing && (
                        <div className="sm:col-span-2">
                          <div className="text-gray-500">Listing:</div>
                          <div className="font-medium text-gray-900">
                            {transaction.listing.title}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timestamps */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Created: {new Date(transaction.created_at).toLocaleDateString()}
                      </div>
                      {transaction.completed_at && (
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed: {new Date(transaction.completed_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-4">
                    {transaction.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <DollarSign className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-600">No transactions found</p>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
