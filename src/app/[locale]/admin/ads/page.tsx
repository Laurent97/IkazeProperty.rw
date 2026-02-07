'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, TrendingUp, Eye, MousePointer, BarChart3, Filter, Search, Edit, Pause, Play, Trash2, Plus, Upload, X, Image, FileText, Calendar, DollarSign, Target, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabaseAdmin } from '@/lib/supabase'

interface AdCampaign {
  id: string
  user_id: string
  ad_type: 'premium_listing' | 'banner' | 'sponsored'
  status: 'draft' | 'pending' | 'active' | 'paused' | 'completed' | 'rejected'
  title: string
  description: string
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
  target_categories: string[]
  target_locations: any
  target_audience: any
  budget_total: number
  budget_daily: number
  bid_type: string
  bid_amount: number
  spent_amount: number
  schedule: any
  media_urls: string[]
  primary_image_url: string
  video_url: string
  cta_text: string
  cta_link: string
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  admin_notes: string
  approved_by: string
  approved_at: string
  rejection_reason: string
}

export default function AdminAdManagementPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<AdCampaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  
  // Form state for new ad
  const [newAd, setNewAd] = useState({
    title: '',
    ad_type: 'banner' as const,
    budget_total: 0,
    start_date: '',
    end_date: '',
    target_audience: '',
    landing_page: '',
    creative_url: '',
    user_name: 'Admin User',
    user_email: 'admin@ikazeproperty.rw'
  })

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('ad_campaigns')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching campaigns:', error)
        setCampaigns([])
      } else {
        setCampaigns(data || [])
        setFilteredCampaigns(data || [])
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      setCampaigns([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  useEffect(() => {
    let filtered = campaigns

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredCampaigns(filtered)
  }, [campaigns, statusFilter, searchQuery])

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

  const calculateRevenue = () => {
    return campaigns.reduce((sum, campaign) => sum + campaign.spent_amount, 0)
  }

  const calculateTotalImpressions = () => {
    return campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0)
  }

  const calculateTotalClicks = () => {
    return campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0)
  }

  const handleApprove = async (campaignId: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('ad_campaigns')
        .update({ status: 'active' })
        .eq('id', campaignId)
      
      if (error) {
        console.error('Error approving campaign:', error)
        alert('Failed to approve campaign')
      } else {
        fetchCampaigns()
      }
    } catch (error) {
      console.error('Error approving campaign:', error)
      alert('Failed to approve campaign')
    }
  }

  const handleReject = async (campaignId: string, reason: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('ad_campaigns')
        .update({ 
          status: 'rejected',
          rejection_reason: reason 
        })
        .eq('id', campaignId)
      
      if (error) {
        console.error('Error rejecting campaign:', error)
        alert('Failed to reject campaign')
      } else {
        fetchCampaigns()
      }
    } catch (error) {
      console.error('Error rejecting campaign:', error)
      alert('Failed to reject campaign')
    }
  }

  const handlePause = async (campaignId: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('ad_campaigns')
        .update({ status: 'paused' })
        .eq('id', campaignId)
      
      if (error) {
        console.error('Error pausing campaign:', error)
        alert('Failed to pause campaign')
      } else {
        fetchCampaigns()
      }
    } catch (error) {
      console.error('Error pausing campaign:', error)
      alert('Failed to pause campaign')
    }
  }

  const handleCreateAd = async () => {
    if (!newAd.title || !newAd.budget_total || !newAd.start_date || !newAd.end_date) {
      alert('Please fill in all required fields')
      return
    }
    
    try {
      // Save to database (using your existing table structure)
      const { data: campaign, error } = await supabaseAdmin
        .from('ad_campaigns')
        .insert({
          title: newAd.title,
          ad_type: newAd.ad_type,
          status: 'draft',
          budget_total: newAd.budget_total,
          start_date: newAd.start_date,
          end_date: newAd.end_date,
          description: `${newAd.ad_type} campaign created by admin`,
          primary_image_url: newAd.creative_url,
          cta_text: 'Learn More',
          cta_link: newAd.landing_page || '#',
          target_audience: newAd.target_audience ? { description: newAd.target_audience } : null
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error creating campaign:', error)
        alert('Failed to create campaign')
        return
      }
      
      // Refresh campaigns list
      fetchCampaigns()
      
      setShowCreateModal(false)
      setNewAd({
        title: '',
        ad_type: 'banner',
        budget_total: 0,
        start_date: '',
        end_date: '',
        target_audience: '',
        landing_page: '',
        creative_url: '',
        user_name: 'Admin User',
        user_email: 'admin@ikazeproperty.rw'
      })
      
      alert('Campaign created successfully!')
    } catch (error) {
      console.error('Error creating campaign:', error)
      alert('Failed to create campaign')
    }
  }
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setNewAd(prev => ({
            ...prev,
            creative_url: `https://example.com/ads/${file.name}`
          }))
          return 100
        }
        return prev + 10
      })
    }, 200)
  }
  
  const handleDelete = async (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      try {
        const { error } = await supabaseAdmin
          .from('ad_campaigns')
          .delete()
          .eq('id', campaignId)
        
        if (error) {
          console.error('Error deleting campaign:', error)
          alert('Failed to delete campaign')
        } else {
          fetchCampaigns()
        }
      } catch (error) {
        console.error('Error deleting campaign:', error)
        alert('Failed to delete campaign')
      }
    }
  }
  
  const handleViewDetails = (campaign: AdCampaign) => {
    setSelectedCampaign(campaign)
    setShowDetailsModal(true)
  }

  const handlePlay = async (campaignId: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('ad_campaigns')
        .update({ status: 'active' })
        .eq('id', campaignId)
      
      if (error) {
        console.error('Error resuming campaign:', error)
        alert('Failed to resume campaign')
      } else {
        fetchCampaigns()
      }
    } catch (error) {
      console.error('Error resuming campaign:', error)
      alert('Failed to resume campaign')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ad campaigns...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 no-overflow-x">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 h-14 sm:h-16">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Ad Management</h1>
              <p className="text-xs sm:text-sm text-gray-600">Manage all advertising campaigns</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-red-600 hover:bg-red-700 touch-target"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Ad
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Impressions</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{calculateTotalImpressions().toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <MousePointer className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Clicks</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{calculateTotalClicks().toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">RWF {calculateRevenue().toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Campaigns</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {campaigns.filter(c => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center">
                <Filter className="h-4 w-4 text-gray-500 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  aria-label="Filter by status"
                  title="Filter campaigns by status"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Campaigns ({filteredCampaigns.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">Campaign</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">Advertiser</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">Type</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">Status</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">Performance</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">Budget</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">Duration</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div>
                          <div className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">{campaign.title}</div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Created {new Date(campaign.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">Campaign Owner</div>
                          <div className="text-sm text-gray-600">ID: {campaign.user_id}</div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <span className="text-xs sm:text-sm font-medium text-gray-900 capitalize">
                          {campaign.ad_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
                          {campaign.status.toUpperCase()}
                        </span>
                        {campaign.rejection_reason && (
                          <div className="text-xs sm:text-sm text-red-600 mt-1 max-w-[150px] sm:max-w-none">
                            {campaign.rejection_reason}
                          </div>
                        )}
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="text-xs sm:text-sm">
                          <div>{campaign.impressions.toLocaleString()} impressions</div>
                          <div>{campaign.clicks} clicks</div>
                          <div className="font-semibold text-red-600">
                            {calculateCTR(campaign.clicks, campaign.impressions)}% CTR
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="text-xs sm:text-sm">
                          <div>RWF {campaign.spent_amount.toLocaleString()} spent</div>
                          <div className="text-gray-600">
                            of RWF {campaign.budget_total.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="text-xs sm:text-sm">
                          <div>{new Date(campaign.start_date).toLocaleDateString()}</div>
                          <div className="text-gray-600">to {new Date(campaign.end_date).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(campaign)}
                            className="touch-target p-1"
                            aria-label="View details"
                          >
                            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          
                          {campaign.status === 'pending' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleApprove(campaign.id)}
                                className="text-green-600 hover:text-green-700 touch-target p-1"
                                aria-label="Approve campaign"
                              >
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleReject(campaign.id, 'Inappropriate content')}
                                className="text-red-600 hover:text-red-700 touch-target p-1"
                                aria-label="Reject campaign"
                              >
                                <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </>
                          )}
                          
                          {campaign.status === 'active' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handlePause(campaign.id)}
                              className="touch-target p-1"
                              aria-label="Pause campaign"
                            >
                              <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          )}
                          
                          {campaign.status === 'paused' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handlePlay(campaign.id)}
                              className="touch-target p-1"
                              aria-label="Resume campaign"
                            >
                              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(campaign.id)}
                            className="text-red-600 hover:text-red-700 touch-target p-1"
                            aria-label="Delete campaign"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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

      {/* Create Ad Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold">Create New Ad Campaign</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 touch-target p-1"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title *</label>
                    <input
                      type="text"
                      value={newAd.title}
                      onChange={(e) => setNewAd(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter campaign title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ad Type *</label>
                    <select
                      value={newAd.ad_type}
                      onChange={(e) => setNewAd(prev => ({ ...prev, ad_type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      aria-label="Select ad type"
                    >
                      <option value="banner">Banner Ad</option>
                      <option value="sponsored">Sponsored Content</option>
                      <option value="premium_listing">Premium Listing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget (RWF) *</label>
                    <input
                      type="number"
                      value={newAd.budget_total}
                      onChange={(e) => setNewAd(prev => ({ ...prev, budget_total: parseInt(e.target.value) || 0 }))}
                      placeholder="Enter budget amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <input
                      type="text"
                      value={newAd.target_audience}
                      onChange={(e) => setNewAd(prev => ({ ...prev, target_audience: e.target.value }))}
                      placeholder="e.g., Property buyers, 25-45 age"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={newAd.start_date}
                      onChange={(e) => setNewAd(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      aria-label="Campaign start date"
                      title="Select campaign start date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                    <input
                      type="date"
                      value={newAd.end_date}
                      onChange={(e) => setNewAd(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      aria-label="Campaign end date"
                      title="Select campaign end date"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Landing Page URL</label>
                  <input
                    type="url"
                    value={newAd.landing_page}
                    onChange={(e) => setNewAd(prev => ({ ...prev, landing_page: e.target.value }))}
                    placeholder="https://example.com/landing-page"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Creative</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="ad-creative-upload"
                    />
                    <label 
                      htmlFor="ad-creative-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload ad creative</span>
                      <span className="text-xs text-gray-500 mt-1">Images or videos (max 10MB)</span>
                    </label>
                    
                    {isUploading && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                            role="progressbar"
                            aria-valuenow={uploadProgress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            title={`Upload progress: ${uploadProgress}%`}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
                      </div>
                    )}
                    
                    {newAd.creative_url && (
                      <div className="mt-4 text-sm text-green-600">
                        ✓ File uploaded successfully
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateAd}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Create Campaign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Campaign Details Modal */}
      {showDetailsModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-semibold">Campaign Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 touch-target p-1"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Campaign Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Title:</strong> {selectedCampaign.title}</div>
                      <div><strong>Type:</strong> {selectedCampaign.ad_type}</div>
                      <div><strong>Status:</strong> <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(selectedCampaign.status)}`}>{selectedCampaign.status.toUpperCase()}</span></div>
                      <div><strong>Created:</strong> {new Date(selectedCampaign.created_at).toLocaleDateString()}</div>
                      <div><strong>Owner ID:</strong> {selectedCampaign.user_id}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Budget & Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Total Budget:</strong> RWF {selectedCampaign.budget_total.toLocaleString()}</div>
                      <div><strong>Spent:</strong> RWF {selectedCampaign.spent_amount.toLocaleString()}</div>
                      <div><strong>Remaining:</strong> RWF {(selectedCampaign.budget_total - selectedCampaign.spent_amount).toLocaleString()}</div>
                      <div><strong>Start Date:</strong> {new Date(selectedCampaign.start_date).toLocaleDateString()}</div>
                      <div><strong>End Date:</strong> {new Date(selectedCampaign.end_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Performance Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Impressions:</strong> {selectedCampaign.impressions.toLocaleString()}</div>
                      <div><strong>Clicks:</strong> {selectedCampaign.clicks.toLocaleString()}</div>
                      <div><strong>Conversions:</strong> {selectedCampaign.conversions.toLocaleString()}</div>
                      <div><strong>CTR:</strong> {selectedCampaign.ctr}%</div>
                      <div><strong>CPC:</strong> RWF {selectedCampaign.clicks > 0 ? (selectedCampaign.spent_amount / selectedCampaign.clicks).toFixed(2) : '0.00'}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Campaign Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Owner ID:</strong> {selectedCampaign.user_id}</div>
                      <div><strong>CTA Text:</strong> {selectedCampaign.cta_text || 'N/A'}</div>
                      <div><strong>CTA Link:</strong> {selectedCampaign.cta_link || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
