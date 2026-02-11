'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MoreVertical,
  Eye,
  Star,
  Zap,
  Video,
  Share2,
  Mail,
  Image,
  Camera
} from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supabase } from '@/lib/auth'
import { Database } from '@/types/database'

type Promotion = Database['public']['Tables']['promoted_listings']['Row'] & {
  listings?: {
    id: string
    title: string
    category: string
    price: number
  }
}

export default function AdminAdsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchPromotions()
  }, [search, typeFilter, statusFilter])

  const fetchPromotions = async () => {
    try {
      let query = supabase
        .from('promoted_listings')
        .select(`
          *,
          listings(id, title, category, price)
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (search) {
        query = query.or(`
          listings.title.ilike.%${search}%,
          promotion_type.ilike.%${search}%
        `)
      }
      
      if (typeFilter !== 'all') {
        query = query.eq('promotion_type', typeFilter)
      }
      
      if (statusFilter !== 'all') {
        query = query.eq('paid', statusFilter === 'paid')
      }

      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching promotions:', error)
        return
      }
      
      setPromotions(data || [])
    } catch (error) {
      console.error('Error fetching promotions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPromotionIcon = (type: string) => {
    switch (type) {
      case 'featured': return <Star className="h-4 w-4" />
      case 'urgent': return <Zap className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'social': return <Share2 className="h-4 w-4" />
      case 'email': return <Mail className="h-4 w-4" />
      case 'higher_images': return <Image className="h-4 w-4" />
      case '360_tour': return <Camera className="h-4 w-4" />
      default: return <Star className="h-4 w-4" />
    }
  }

  const getPromotionBadge = (type: string) => {
    const variants = {
      featured: 'bg-yellow-100 text-yellow-800',
      urgent: 'bg-red-100 text-red-800',
      video: 'bg-purple-100 text-purple-800',
      social: 'bg-blue-100 text-blue-800',
      email: 'bg-green-100 text-green-800',
      higher_images: 'bg-orange-100 text-orange-800',
      '360_tour': 'bg-indigo-100 text-indigo-800'
    }
    return (
      <Badge className={variants[type as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {getPromotionIcon(type)}
        <span className="ml-1">{type?.replace('_', ' ').charAt(0).toUpperCase() + type?.replace('_', ' ').slice(1)}</span>
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isPromotionActive = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    return now >= start && now <= end
  }

  const updatePromotionStatus = async (promotionId: string, paid: boolean) => {
    try {
      const { error } = await supabase
        .from('promoted_listings')
        .update({ 
          paid: paid
        } as Database['public']['Tables']['promoted_listings']['Update'])
        .eq('id', promotionId)
      
      if (error) throw error
      
      // Refresh the data
      fetchPromotions()
    } catch (error) {
      console.error('Error updating promotion status:', error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Promotions & Ads Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search promotions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="higher_images">Higher Images</SelectItem>
              <SelectItem value="360_tour">360 Tour</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Promotions</p>
                <p className="text-2xl font-bold text-gray-900">{promotions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-gray-900">
                  {promotions.filter(p => p.paid).length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {promotions.filter(p => isPromotionActive(p.start_date, p.end_date)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('rw-RW').format(
                    promotions.filter(p => p.paid).reduce((sum, p) => sum + (p.price || 0), 0)
                  )} RWF
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : promotions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No promotions found</h3>
            <p className="text-gray-500 text-center">
              {search || typeFilter !== 'all' || statusFilter !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'Promotions will appear here when users purchase them'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        {promotion.listings?.title || 'Unknown Listing'}
                      </h3>
                      {getPromotionBadge(promotion.promotion_type)}
                      <Badge className={promotion.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {promotion.paid ? 'Paid' : 'Unpaid'}
                      </Badge>
                      {isPromotionActive(promotion.start_date, promotion.end_date) && (
                        <Badge className="bg-blue-100 text-blue-800">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium">
                        {promotion.listings?.category ? promotion.listings.category.charAt(0).toUpperCase() + promotion.listings.category.slice(1) : 'Unknown'}
                      </span>
                      <span>•</span>
                      <span className="text-lg font-bold text-green-600">
                        {new Intl.NumberFormat('rw-RW').format(promotion.price)} RWF
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`\/[locale]\/listings\/${promotion.listing_id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Listing
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Start Date</p>
                    <p className="text-sm text-gray-900">{formatDate(promotion.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">End Date</p>
                    <p className="text-sm text-gray-900">{formatDate(promotion.end_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duration</p>
                    <p className="text-sm text-gray-900">
                      {Math.ceil((new Date(promotion.end_date).getTime() - new Date(promotion.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    Created: {formatDate(promotion.created_at)}
                  </div>
                  
                  <div className="flex gap-2">
                    {!promotion.paid && (
                      <Button
                        size="sm"
                        onClick={() => updatePromotionStatus(promotion.id, true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark as Paid
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>View Receipt</DropdownMenuItem>
                        <DropdownMenuItem>Extend Promotion</DropdownMenuItem>
                        <DropdownMenuItem>Contact Seller</DropdownMenuItem>
                        {promotion.paid && (
                          <DropdownMenuItem className="text-red-600">Refund</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
