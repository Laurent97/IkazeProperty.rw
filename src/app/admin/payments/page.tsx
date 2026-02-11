'use client'

import { useState } from 'react'
import { Search, Filter, DollarSign, Calendar, User, CheckCircle, XCircle, Clock, MoreVertical, Download, TrendingUp, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const payments = [
  {
    id: 'PAY001',
    amount: 15000,
    currency: 'RWF',
    type: 'visit_fee',
    status: 'completed',
    method: 'mobile_money',
    reference: 'VISIT2024001',
    user: 'John Doe',
    userEmail: 'john@example.com',
    description: 'Property visit fee - Modern 3 Bedroom Apartment',
    date: '2024-01-15',
    time: '14:30',
    platformFee: 1500,
    sellerPayout: 13500,
  },
  {
    id: 'PAY002',
    amount: 25000,
    currency: 'RWF',
    type: 'visit_fee',
    status: 'pending',
    method: 'bank_transfer',
    reference: 'VISIT2024002',
    user: 'Jane Smith',
    userEmail: 'jane@example.com',
    description: 'Property visit fee - Luxury Villa with Pool',
    date: '2024-01-15',
    time: '10:15',
    platformFee: 2500,
    sellerPayout: 22500,
  },
  {
    id: 'PAY003',
    amount: 100000,
    currency: 'RWF',
    type: 'featured_listing',
    status: 'completed',
    method: 'mobile_money',
    reference: 'FEAT2024001',
    user: 'Mike Johnson',
    userEmail: 'mike@example.com',
    description: 'Featured listing promotion - Commercial Space',
    date: '2024-01-14',
    time: '16:45',
    platformFee: 10000,
    sellerPayout: 0,
  },
  {
    id: 'PAY004',
    amount: 20000,
    currency: 'RWF',
    type: 'visit_fee',
    status: 'failed',
    method: 'mobile_money',
    reference: 'VISIT2024003',
    user: 'Sarah Williams',
    userEmail: 'sarah@example.com',
    description: 'Property visit fee - Cozy Studio Apartment',
    date: '2024-01-14',
    time: '09:20',
    platformFee: 2000,
    sellerPayout: 18000,
  },
  {
    id: 'PAY005',
    amount: 30000,
    currency: 'RWF',
    type: 'visit_fee',
    status: 'refunded',
    method: 'mobile_money',
    reference: 'VISIT2024004',
    user: 'Robert Brown',
    userEmail: 'robert@example.com',
    description: 'Property visit fee - Modern Townhouse',
    date: '2024-01-13',
    time: '13:10',
    platformFee: 3000,
    sellerPayout: 27000,
  },
]

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.reference.toLowerCase().includes(search.toLowerCase()) ||
                         payment.user.toLowerCase().includes(search.toLowerCase()) ||
                         payment.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesType = typeFilter === 'all' || payment.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'visit_fee': return 'bg-blue-100 text-blue-800'
      case 'featured_listing': return 'bg-purple-100 text-purple-800'
      case 'subscription': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTotalRevenue = () => {
    return payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.platformFee, 0)
  }

  const getPendingAmount = () => {
    return payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0)
  }

  const getCompletedCount = () => {
    return payments.filter(p => p.status === 'completed').length
  }

  const getFailedCount = () => {
    return payments.filter(p => p.status === 'failed').length
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments Management</h1>
          <p className="text-gray-600">Monitor and manage all platform payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <CreditCard className="h-4 w-4 mr-2" />
            Process Payouts
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">RWF {getTotalRevenue().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">RWF {getPendingAmount().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{getCompletedCount()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{getFailedCount()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-500 mr-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="flex items-center">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                aria-label="Filter by type"
              >
                <option value="all">All Types</option>
                <option value="visit_fee">Visit Fees</option>
                <option value="featured_listing">Featured Listings</option>
                <option value="subscription">Subscriptions</option>
              </select>
            </div>
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by reference, user, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payments ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Payment ID</th>
                  <th className="text-left py-3 px-4 font-semibold">User</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{payment.id}</div>
                        <div className="text-sm text-gray-600">{payment.reference}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{payment.user}</div>
                        <div className="text-sm text-gray-600">{payment.userEmail}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="max-w-xs">
                        <div className="text-sm text-gray-900 line-clamp-2">{payment.description}</div>
                        <div className="text-xs text-gray-500 mt-1">{payment.method.replace('_', ' ')}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {payment.currency} {payment.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">
                          Platform: {payment.currency} {payment.platformFee.toLocaleString()}
                        </div>
                        {payment.sellerPayout > 0 && (
                          <div className="text-xs text-green-600">
                            Seller: {payment.currency} {payment.sellerPayout.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getTypeColor(payment.type)}>
                        {payment.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {payment.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {payment.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                        {payment.status === 'refunded' && <XCircle className="h-3 w-3 mr-1" />}
                        {payment.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(payment.date).toLocaleDateString()}
                        </div>
                        <div>{payment.time}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>View Receipt</DropdownMenuItem>
                          <DropdownMenuItem>Contact User</DropdownMenuItem>
                          {payment.status === 'pending' && (
                            <>
                              <DropdownMenuItem className="text-green-600">Confirm Payment</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Cancel Payment</DropdownMenuItem>
                            </>
                          )}
                          {payment.status === 'completed' && payment.type === 'visit_fee' && (
                            <DropdownMenuItem className="text-blue-600">Process Payout</DropdownMenuItem>
                          )}
                          {payment.status === 'failed' && (
                            <DropdownMenuItem className="text-orange-600">Retry Payment</DropdownMenuItem>
                          )}
                          {payment.status === 'completed' && (
                            <DropdownMenuItem className="text-orange-600">Issue Refund</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <DollarSign className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-600">No payments found</p>
              <p className="text-sm text-gray-500 mt-1">
                {search || statusFilter !== 'all' || typeFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Payments will appear here when users make transactions'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
