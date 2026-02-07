'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusCircle, Eye, MousePointer, TrendingUp, Clock, Pause, Play, Edit, Trash2, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Campaign {
  id: string
  title: string
  status: 'draft' | 'pending' | 'active' | 'paused' | 'completed' | 'rejected'
  ad_type: 'premium_listing' | 'banner' | 'sponsored'
  impressions: number
  clicks: number
  conversions: number
  spent_amount: number
  budget_total: number
  start_date: string
  end_date: string
  created_at: string
}

export default function AdManagementPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [activeTab, setActiveTab] = useState<'campaigns' | 'analytics' | 'billing'>('campaigns')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        title: 'Featured Apartment Listing',
        status: 'active',
        ad_type: 'premium_listing',
        impressions: 15420,
        clicks: 342,
        conversions: 12,
        spent_amount: 8500,
        budget_total: 15000,
        start_date: '2024-01-15',
        end_date: '2024-01-22',
        created_at: '2024-01-14'
      },
      {
        id: '2',
        title: 'Homepage Banner Ad',
        status: 'active',
        ad_type: 'banner',
        impressions: 28950,
        clicks: 523,
        conversions: 8,
        spent_amount: 12000,
        budget_total: 25000,
        start_date: '2024-01-10',
        end_date: '2024-01-20',
        created_at: '2024-01-09'
      },
      {
        id: '3',
        title: 'Social Media Boost',
        status: 'completed',
        ad_type: 'sponsored',
        impressions: 45000,
        clicks: 892,
        conversions: 23,
        spent_amount: 10000,
        budget_total: 10000,
        start_date: '2024-01-01',
        end_date: '2024-01-08',
        created_at: '2023-12-31'
      }
    ]
    
    setTimeout(() => {
      setCampaigns(mockCampaigns)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-orange-100 text-orange-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateCTR = (clicks: number, impressions: number) => {
    return impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00'
  }

  const calculateBudgetUsed = (spent: number, total: number) => {
    return total > 0 ? ((spent / total) * 100).toFixed(1) : '0.0'
  }

  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent_amount, 0)
  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget_total, 0)
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0)
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your ad campaigns...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ad Management</h1>
              <p className="text-sm text-gray-600">Manage your advertising campaigns</p>
            </div>
            <Link href="/premium-features">
              <Button className="bg-red-600 hover:bg-red-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Ad
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'campaigns'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Campaigns
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'billing'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Billing
            </button>
          </nav>
        </div>
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                    <p className="text-2xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <MousePointer className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                    <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. CTR</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {calculateCTR(totalClicks, totalImpressions)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <BarChart3 className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">RWF {totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Campaign</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Performance</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Budget</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Duration</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-semibold text-gray-900">{campaign.title}</div>
                            <div className="text-sm text-gray-600">
                              Created {new Date(campaign.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {campaign.ad_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
                            {campaign.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div>{campaign.impressions.toLocaleString()} impressions</div>
                            <div>{campaign.clicks} clicks</div>
                            <div className="font-semibold text-red-600">
                              {calculateCTR(campaign.clicks, campaign.impressions)}% CTR
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div>RWF {campaign.spent_amount.toLocaleString()} spent</div>
                            <div className="text-gray-600">
                              of RWF {campaign.budget_total.toLocaleString()}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-red-600 h-2 rounded-full"
                                style={{ width: `${calculateBudgetUsed(campaign.spent_amount, campaign.budget_total)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div>{new Date(campaign.start_date).toLocaleDateString()}</div>
                            <div className="text-gray-600">to {new Date(campaign.end_date).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              {campaign.status === 'active' ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Analytics Dashboard
            </h3>
            <p className="text-gray-600">
              Detailed analytics and reporting features coming soon
            </p>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-gray-600">RWF</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Billing & Payments
            </h3>
            <p className="text-gray-600 mb-6">
              Manage your payment methods and view transaction history
            </p>
            <div className="space-y-4 max-w-md mx-auto">
              <Card>
                <CardContent className="p-6 text-left">
                  <h4 className="font-semibold mb-4">Current Balance</h4>
                  <div className="text-3xl font-bold text-red-600">RWF 45,000</div>
                  <Button className="w-full mt-4">Top Up Balance</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-left">
                  <h4 className="font-semibold mb-4">Payment Methods</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>MTN Mobile Money</span>
                      <span className="text-green-600">Connected</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Airtel Money</span>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Bank Transfer</span>
                      <Button variant="outline" size="sm">Setup</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
