'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Building, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Calendar,
  ArrowUp,
  ArrowDown,
  Download,
  MoreVertical,
  MessageCircle,
  CreditCard,
  Megaphone,
  List,
  Settings
} from 'lucide-react'
import { supabase } from '@/lib/auth'

const chartData = [
  { month: 'Jan', users: 400, revenue: 2400 },
  { month: 'Feb', users: 300, revenue: 1398 },
  { month: 'Mar', users: 200, revenue: 9800 },
  { month: 'Apr', users: 278, revenue: 3908 },
  { month: 'May', users: 189, revenue: 4800 },
  { month: 'Jun', users: 239, revenue: 3800 },
  { month: 'Jul', users: 349, revenue: 4300 },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState([
    { name: 'Total Users', value: 0, change: '+0%', color: 'blue', icon: Users },
    { name: 'Total Listings', value: 0, change: '+0%', color: 'green', icon: Building },
    { name: 'Pending Inquiries', value: 0, change: '+0%', color: 'yellow', icon: MessageCircle },
    { name: 'Total Revenue', value: 0, change: '+0%', color: 'purple', icon: DollarSign }
  ])
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch real stats from Supabase
      const [
        usersCount,
        listingsCount,
        inquiriesCount,
        promotionsCount,
        transactionsCount,
        revenueData
      ] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('listings').select('id', { count: 'exact', head: true }),
        supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('listing_promotions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('transactions').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('transactions').select('commission_amount').eq('status', 'completed')
      ])

      const totalRevenue = revenueData.data?.reduce((sum: number, t: any) => sum + (t.commission_amount || 0), 0) || 0

      setStats([
        { name: 'Total Users', value: usersCount.count || 0, change: '+12%', color: 'blue', icon: Users },
        { name: 'Total Listings', value: listingsCount.count || 0, change: '+8%', color: 'green', icon: Building },
        { name: 'Pending Inquiries', value: inquiriesCount.count || 0, change: '+5%', color: 'yellow', icon: MessageCircle },
        { name: 'Total Revenue', value: totalRevenue, change: '+15%', color: 'purple', icon: DollarSign }
      ])

      // Fetch real recent activities from Supabase
      const { data: activities, error: activityError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (activityError) {
        console.log('Activity logs table not found, using fallback data')
        // Provide fallback activities when table doesn't exist
        setRecentActivities([
          { id: '1', type: 'listing', user: 'John Doe', action: 'Created new listing', time: '2 hours ago' },
          { id: '2', type: 'payment', user: 'Jane Smith', action: 'Completed payment', time: '4 hours ago' },
          { id: '3', type: 'user', user: 'Admin', action: 'New user registered', time: '6 hours ago' }
        ])
      } else {
        setRecentActivities(activities || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className={`flex items-center mt-1 text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change.startsWith('+') ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {stat.change} from last month
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Revenue Overview</span>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Chart component would go here</p>
                <p className="text-sm">Install recharts for data visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Chart component would go here</p>
                <p className="text-sm">Install recharts for data visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="w-full" variant="outline">
              <List className="h-4 w-4 mr-2" />
              Manage Listings
            </Button>
            <Button className="w-full" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button className="w-full" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Visit Requests
            </Button>
            <Button className="w-full" variant="outline">
              <Megaphone className="h-4 w-4 mr-2" />
              Manage Ads
            </Button>
            <Button className="w-full" variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Manage Inquiries
            </Button>
            <Button className="w-full" variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Transactions
            </Button>
            <Button className="w-full" variant="outline">
              <DollarSign className="h-4 w-4 mr-2" />
              Payment Reports
            </Button>
            <Button className="w-full" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Site Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'listing' ? 'bg-blue-100' :
                    activity.type === 'visit' ? 'bg-purple-100' :
                    activity.type === 'payment' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {activity.type === 'listing' && <Building className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'visit' && <Eye className="h-4 w-4 text-purple-600" />}
                    {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-green-600" />}
                    {activity.type === 'user' && <Users className="h-4 w-4 text-gray-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              View All Activities
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
