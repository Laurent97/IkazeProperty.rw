'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, MapPin, Package, Heart, Eye, Smartphone, Laptop, Sofa } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import AdminContactInfo from '@/components/listing/admin-contact'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { fetchListingsWithDetails } from '@/lib/supabase-client'
import type { Database } from '@/types/database'

type Listing = Database['public']['Tables']['listings']['Row'] & {
  seller: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
  media: {
    url: string;
    public_id: string;
    media_type: 'image' | 'video';
    is_primary: boolean;
    order_index: number;
  }[];
  other_details?: {
    subcategory: string;
    brand: string | null;
    model: string | null;
    condition: string;
    warranty_available: boolean;
    warranty_period: string | null;
    reason_for_selling: string | null;
    original_purchase_date: string | null;
    age_of_item: string | null;
  };
}

export default function OtherItemsListingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [subcategory, setSubcategory] = useState('')
  const [condition, setCondition] = useState('')
  const [sortBy, setSortBy] = useState('created_at')

  const mockListings: Listing[] = [
    {
      id: 'mock-other-1',
      title: 'iPhone 14 Pro Max - Excellent Condition',
      description: 'Barely used iPhone 14 Pro Max with all accessories and original box.',
      price: 850000,
      currency: 'RWF',
      price_type: 'negotiable',
      category: 'other',
      transaction_type: 'sale',
      status: 'available',
      location: { district: 'Kacyiru' } as any,
      seller_id: 'mock-seller',
      commission_rate: 0.3,
      commission_agreed: true,
      featured: true,
      promoted: false,
      views: 234,
      likes: 45,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expires_at: null,
      visit_fee_enabled: true,
      visit_fee_amount: 2000,
      visit_fee_payment_methods: {},
      media: [
        { url: '/api/placeholder/600/400', media_type: 'image', is_primary: true, order_index: 0 }
      ],
      seller: { full_name: 'Admin Agent', email: 'support@ikazeproperty.rw' },
      other_details: {
        subcategory: 'electronics',
        brand: 'Apple',
        model: 'iPhone 14 Pro Max',
        condition: 'excellent',
        warranty_available: true,
        warranty_period: '6 months',
        reason_for_selling: 'Upgrading to newer model',
        original_purchase_date: '2023-03-15',
        age_of_item: '8 months'
      }
    },
    {
      id: 'mock-other-2',
      title: 'MacBook Pro M2 - Like New',
      description: 'Powerful MacBook Pro with M2 chip, perfect for professionals.',
      price: 1800000,
      currency: 'RWF',
      price_type: 'fixed',
      category: 'other',
      transaction_type: 'sale',
      status: 'available',
      location: { district: 'Nyarugenge' } as any,
      seller_id: 'mock-seller',
      commission_rate: 0.3,
      commission_agreed: true,
      featured: true,
      promoted: true,
      views: 345,
      likes: 67,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expires_at: null,
      visit_fee_enabled: true,
      visit_fee_amount: 2000,
      visit_fee_payment_methods: {},
      media: [
        { url: '/api/placeholder/600/400', media_type: 'image', is_primary: true, order_index: 0 }
      ],
      seller: { full_name: 'Admin Agent', email: 'support@ikazeproperty.rw' },
      other_details: {
        subcategory: 'electronics',
        brand: 'Apple',
        model: 'MacBook Pro M2',
        condition: 'like_new',
        warranty_available: true,
        warranty_period: '1 year',
        reason_for_selling: 'Work upgrade',
        original_purchase_date: '2023-01-20',
        age_of_item: '10 months'
      }
    },
    {
      id: 'mock-other-3',
      title: 'Modern Sofa Set - 3 Pieces',
      description: 'Comfortable 3-piece sofa set in excellent condition, perfect for living room.',
      price: 450000,
      currency: 'RWF',
      price_type: 'negotiable',
      category: 'other',
      transaction_type: 'sale',
      status: 'available',
      location: { district: 'Remera' } as any,
      seller_id: 'mock-seller',
      commission_rate: 0.3,
      commission_agreed: true,
      featured: false,
      promoted: false,
      views: 156,
      likes: 28,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expires_at: null,
      visit_fee_enabled: true,
      visit_fee_amount: 2000,
      visit_fee_payment_methods: {},
      media: [
        { url: '/api/placeholder/600/400', media_type: 'image', is_primary: true, order_index: 0 }
      ],
      seller: { full_name: 'Admin Agent', email: 'support@ikazeproperty.rw' },
      other_details: {
        subcategory: 'furniture',
        brand: 'Modern Living',
        model: 'Comfort Plus 3-Piece',
        condition: 'good',
        warranty_available: false,
        warranty_period: null,
        reason_for_selling: 'Redecorating',
        original_purchase_date: '2022-08-10',
        age_of_item: '1 year 5 months'
      }
    },
    {
      id: 'mock-other-4',
      title: 'Samsung 55" Smart TV 4K',
      description: 'Large smart TV with excellent picture quality and smart features.',
      price: 650000,
      currency: 'RWF',
      price_type: 'fixed',
      category: 'other',
      transaction_type: 'sale',
      status: 'available',
      location: { district: 'Kicukiro' } as any,
      seller_id: 'mock-seller',
      commission_rate: 0.3,
      commission_agreed: true,
      featured: false,
      promoted: true,
      views: 289,
      likes: 52,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expires_at: null,
      visit_fee_enabled: true,
      visit_fee_amount: 2000,
      visit_fee_payment_methods: {},
      media: [
        { url: '/api/placeholder/600/400', media_type: 'image', is_primary: true, order_index: 0 }
      ],
      seller: { full_name: 'Admin Agent', email: 'support@ikazeproperty.rw' },
      other_details: {
        subcategory: 'electronics',
        brand: 'Samsung',
        model: '55" Smart TV 4K',
        condition: 'excellent',
        warranty_available: true,
        warranty_period: '3 months',
        reason_for_selling: 'Upgrading to larger size',
        original_purchase_date: '2023-02-28',
        age_of_item: '9 months'
      }
    },
    {
      id: 'mock-other-5',
      title: 'Dining Table Set - 6 Chairs',
      description: 'Elegant dining table with 6 matching chairs, perfect for family dinners.',
      price: 380000,
      currency: 'RWF',
      price_type: 'negotiable',
      category: 'other',
      transaction_type: 'sale',
      status: 'available',
      location: { district: 'Gacuriro' } as any,
      seller_id: 'mock-seller',
      commission_rate: 0.3,
      commission_agreed: true,
      featured: true,
      promoted: false,
      views: 198,
      likes: 34,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expires_at: null,
      visit_fee_enabled: true,
      visit_fee_amount: 2000,
      visit_fee_payment_methods: {},
      media: [
        { url: '/api/placeholder/600/400', media_type: 'image', is_primary: true, order_index: 0 }
      ],
      seller: { full_name: 'Admin Agent', email: 'support@ikazeproperty.rw' },
      other_details: {
        subcategory: 'furniture',
        brand: 'Classic Wood',
        model: 'Family Dining Set',
        condition: 'good',
        warranty_available: false,
        warranty_period: null,
        reason_for_selling: 'Moving to smaller apartment',
        original_purchase_date: '2022-11-15',
        age_of_item: '1 year 2 months'
      }
    },
    {
      id: 'mock-other-6',
      title: 'PlayStation 5 with Games',
      description: 'PS5 console with 2 controllers and 5 popular games included.',
      price: 750000,
      currency: 'RWF',
      price_type: 'fixed',
      category: 'other',
      transaction_type: 'sale',
      status: 'available',
      location: { district: 'Kimironko' } as any,
      seller_id: 'mock-seller',
      commission_rate: 0.3,
      commission_agreed: true,
      featured: false,
      promoted: true,
      views: 267,
      likes: 48,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expires_at: null,
      visit_fee_enabled: true,
      visit_fee_amount: 2000,
      visit_fee_payment_methods: {},
      media: [
        { url: '/api/placeholder/600/400', media_type: 'image', is_primary: true, order_index: 0 }
      ],
      seller: { full_name: 'Admin Agent', email: 'support@ikazeproperty.rw' },
      other_details: {
        subcategory: 'electronics',
        brand: 'Sony',
        model: 'PlayStation 5',
        condition: 'excellent',
        warranty_available: true,
        warranty_period: '6 months',
        reason_for_selling: 'Not enough time to play',
        original_purchase_date: '2023-04-10',
        age_of_item: '7 months'
      }
    },
    {
      id: 'mock-other-7',
      title: 'Office Chair - Ergonomic',
      description: 'High-quality ergonomic office chair with lumbar support.',
      price: 120000,
      currency: 'RWF',
      price_type: 'fixed',
      category: 'other',
      transaction_type: 'sale',
      status: 'available',
      location: { district: 'Nyarutarama' } as any,
      seller_id: 'mock-seller',
      commission_rate: 0.3,
      commission_agreed: true,
      featured: false,
      promoted: false,
      views: 134,
      likes: 21,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expires_at: null,
      visit_fee_enabled: true,
      visit_fee_amount: 2000,
      visit_fee_payment_methods: {},
      media: [
        { url: '/api/placeholder/600/400', media_type: 'image', is_primary: true, order_index: 0 }
      ],
      seller: { full_name: 'Admin Agent', email: 'support@ikazeproperty.rw' },
      other_details: {
        subcategory: 'furniture',
        brand: 'ComfortSeating',
        model: 'ErgoPro 5000',
        condition: 'good',
        warranty_available: false,
        warranty_period: null,
        reason_for_selling: 'Office closure',
        original_purchase_date: '2022-09-20',
        age_of_item: '1 year 4 months'
      }
    },
    {
      id: 'mock-other-8',
      title: 'iPad Air 5th Generation',
      description: 'Latest iPad Air with Apple Pencil and keyboard case included.',
      price: 550000,
      currency: 'RWF',
      price_type: 'negotiable',
      category: 'other',
      transaction_type: 'sale',
      status: 'available',
      location: { district: 'Kiyovu' } as any,
      seller_id: 'mock-seller',
      commission_rate: 0.3,
      commission_agreed: true,
      featured: true,
      promoted: true,
      views: 312,
      likes: 58,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expires_at: null,
      visit_fee_enabled: true,
      visit_fee_amount: 2000,
      visit_fee_payment_methods: {},
      media: [
        { url: '/api/placeholder/600/400', media_type: 'image', is_primary: true, order_index: 0 }
      ],
      seller: { full_name: 'Admin Agent', email: 'support@ikazeproperty.rw' },
      other_details: {
        subcategory: 'electronics',
        brand: 'Apple',
        model: 'iPad Air 5th Gen',
        condition: 'like_new',
        warranty_available: true,
        warranty_period: '8 months',
        reason_for_selling: 'Got iPad Pro instead',
        original_purchase_date: '2023-05-15',
        age_of_item: '6 months'
      }
    },
    {
      id: 'mock-other-9',
      title: 'King Size Bed with Mattress',
      description: 'Luxurious king size bed frame with high-quality mattress included.',
      price: 420000,
      currency: 'RWF',
      price_type: 'fixed',
      category: 'other',
      transaction_type: 'sale',
      status: 'available',
      location: { district: 'Remera' } as any,
      seller_id: 'mock-seller',
      commission_rate: 0.3,
      commission_agreed: true,
      featured: false,
      promoted: false,
      views: 178,
      likes: 31,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expires_at: null,
      visit_fee_enabled: true,
      visit_fee_amount: 2000,
      visit_fee_payment_methods: {},
      media: [
        { url: '/api/placeholder/600/400', media_type: 'image', is_primary: true, order_index: 0 }
      ],
      seller: { full_name: 'Admin Agent', email: 'support@ikazeproperty.rw' },
      other_details: {
        subcategory: 'furniture',
        brand: 'SleepWell',
        model: 'Luxury King Bed',
        condition: 'excellent',
        warranty_available: false,
        warranty_period: null,
        reason_for_selling: 'Moving abroad',
        original_purchase_date: '2023-01-05',
        age_of_item: '10 months'
      }
    },
    {
      id: 'mock-other-10',
      title: 'Canon DSLR Camera with Lenses',
      description: 'Professional DSLR camera with multiple lenses and accessories.',
      price: 1200000,
      currency: 'RWF',
      price_type: 'negotiable',
      category: 'other',
      transaction_type: 'sale',
      status: 'available',
      location: { district: 'Kacyiru' } as any,
      seller_id: 'mock-seller',
      commission_rate: 0.3,
      commission_agreed: true,
      featured: true,
      promoted: false,
      views: 245,
      likes: 43,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expires_at: null,
      visit_fee_enabled: true,
      visit_fee_amount: 2000,
      visit_fee_payment_methods: {},
      media: [
        { url: '/api/placeholder/600/400', media_type: 'image', is_primary: true, order_index: 0 }
      ],
      seller: { full_name: 'Admin Agent', email: 'support@ikazeproperty.rw' },
      other_details: {
        subcategory: 'electronics',
        brand: 'Canon',
        model: 'EOS Rebel T8i',
        condition: 'excellent',
        warranty_available: true,
        warranty_period: '4 months',
        reason_for_selling: 'Switching to mirrorless',
        original_purchase_date: '2022-12-10',
        age_of_item: '1 year'
      }
    }
  ]

  const subcategories = [
    { value: '', label: 'All Subcategories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'appliances', label: 'Appliances' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'sports', label: 'Sports Equipment' },
    { value: 'other', label: 'Other' }
  ]

  const conditions = [
    { value: '', label: 'All Conditions' },
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' }
  ]

  const fetchListings = async () => {
    try {
      setLoading(true)
      const result = await fetchListingsWithDetails({
        category: 'other',
        searchQuery,
        priceRange,
        subcategory,
        condition,
        sortBy,
        limit: 50
      })
      
      if (result.listings) {
        setListings(result.listings)
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Simulate API call with mock data
    setListings(mockListings)
    setLoading(false)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, priceRange, subcategory, condition, sortBy])

  useEffect(() => {
    fetchListings()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchListings()
  }

  const clearFilters = () => {
    setSearchQuery('')
    setPriceRange({ min: '', max: '' })
    setSubcategory('')
    setCondition('')
    setSortBy('created_at')
    fetchListings()
  }

  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: currency === 'RWF' ? 'RWF' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    
    return formatter.format(price)
  }

  const getSubcategoryIcon = (subcategory: string) => {
    switch (subcategory) {
      case 'electronics': return <Smartphone className="h-5 w-5" />
      case 'furniture': return <Sofa className="h-5 w-5" />
      default: return <Package className="h-5 w-5" />
    }
  }

  const formatCondition = (condition: string) => {
    return condition.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading listings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Other Items
          </h1>
          <p className="text-lg text-gray-600">
            Electronics, furniture, appliances, and more
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search other items..."
                  className="pl-10 h-12"
                />
              </div>
              <Button type="submit" className="h-12 px-8 bg-red-600 hover:bg-red-700">
                Search
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Select value={subcategory} onValueChange={setSubcategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="h-10"
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="h-10"
              />
            </div>

            <div>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((cond) => (
                    <SelectItem key={cond.value} value={cond.value}>
                      {cond.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Newest First</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters
            </p>
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {listings.length} item{listings.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow group">
                  <CardContent className="p-4">
                    {/* Image */}
                    {listing.media && listing.media.length > 0 ? (
                      <div className="mb-4 relative">
                        <img
                          src={listing.media.find(m => m.is_primary)?.url || listing.media[0].url}
                          alt={listing.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {listing.promoted && (
                          <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                            PROMOTED
                          </Badge>
                        )}
                        {listing.featured && (
                          <Badge className="absolute top-2 right-2 bg-blue-600 text-white">
                            FEATURED
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}

                    {/* Title and Price */}
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {listing.title}
                      </h3>
                      <div className="text-2xl font-bold text-red-600">
                        {formatPrice(listing.price, listing.currency)}
                        {listing.price_type === 'negotiable' && (
                          <span className="text-sm text-gray-500 ml-2">(Negotiable)</span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {listing.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      {listing.other_details?.subcategory && (
                        <div className="flex items-center text-sm text-gray-600">
                          {getSubcategoryIcon(listing.other_details.subcategory)}
                          <span className="ml-2 capitalize">{listing.other_details.subcategory}</span>
                        </div>
                      )}
                      
                      {listing.other_details?.brand && (
                        <div className="text-sm text-gray-600">
                          Brand: <span className="font-medium">{listing.other_details.brand}</span>
                        </div>
                      )}
                      
                      {listing.other_details?.model && (
                        <div className="text-sm text-gray-600">
                          Model: <span className="font-medium">{listing.other_details.model}</span>
                        </div>
                      )}
                      
                      {listing.other_details?.condition && (
                        <div className="text-sm text-gray-600">
                          Condition: <span className="font-medium capitalize">{formatCondition(listing.other_details.condition)}</span>
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    {listing.location && typeof listing.location === 'object' && (
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        {(() => {
                          const locationData = listing.location as any
                          return locationData?.district || 
                                 locationData?.sector || 
                                 locationData?.province || 
                                 'Location not specified'
                        })()}
                      </div>
                    )}

                    <AdminContactInfo className="mb-4" />

                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {listing.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {listing.likes}
                        </span>
                      </div>
                      <Link href={`/listings/${listing.category}/${listing.id}`}>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          View Details
                        </Button>
                      </Link>
                    </div>

                    {/* Seller Info */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Listed by</p>
                          <p className="font-medium text-gray-900">
                            {listing.seller?.full_name || 'Anonymous'}
                          </p>
                        </div>
                        {listing.other_details?.warranty_available && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Warranty
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
