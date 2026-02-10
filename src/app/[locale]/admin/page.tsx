'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  LayoutDashboard, 
  Listings, 
  Ads, 
  Inquiries, 
  Transactions,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react'
import AdminNavigation from '@/components/admin/AdminNavigation'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalListings: 0,
    totalUsers: 0,
    totalVisitRequests: 0,
    pendingPayments: 0
    activeAds: 0
  })

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/stats')
        const data = await response.json()
        if (response.ok) {
          setStats(data.stats || stats)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your platform efficiently</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalListings}</div>
              <p className="text-sm text-gray-600">Total Listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
              <p className="text-sm text-gray-600">Total Users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Visit Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalVisitRequests}</div>
              <p className="text-sm text-gray-600">Total Visit Requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Inquiries className="h-5 w-5 mr-2" />
                Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</div>
              <p className="text-sm text-gray-600">Pending Payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ads className="h-5 w-5 mr-2" />
                Ads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.activeAds}</div>
              <p className="text-sm text-gray-600">Active Ads</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="w-full" onClick={() => window.location.href = '/admin/listings'}>
              <Listings className="h-4 w-4 mr-2" />
              Manage Listings
            </Button>
            <Button className="w-full" onClick={() => window.location.href = '/admin/users'}>
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button className="w-full" onClick={() => window.location.href = '/admin/visit-requests'}>
              <Users className="h-4 w-4 mr-2" />
              Visit Requests
            </Button>
            <Button className="w-full" onClick={() => window.location.href = '/admin/ads'}>
              <Ads className="h-4 w-4 mr-2" />
              Manage Ads
            </Button>
            <Button className="w-full" onClick={() => window.location.href = '/admin/inquiries'}>
              <Inquiries className="h-4 w-4 mr-2" />
              Manage Inquiries
            </Button>
            <Button className="w-full" onClick={() => window.location.href = '/admin/transactions'}>
              <Transactions className="h-4 w-4 mr-2" />
              Manage Transactions
            </Button>
            <Button className="w-full" onClick={() => window.location.href = '/admin/site-settings'}>
              <Settings className="h-4 w-4 mr-2" />
              Site Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
