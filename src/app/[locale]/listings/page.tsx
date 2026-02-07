'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Home, Car, Trees, Package, Filter, MapPin, Calendar, Eye, Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { fetchListingsWithDetails } from '@/lib/supabase-client'
import Image from 'next/image'

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'houses', name: 'Houses & Apartments', icon: Home, count: 0, color: 'bg-blue-500' },
    { id: 'cars', name: 'Cars & Vehicles', icon: Car, count: 0, color: 'bg-green-500' },
    { id: 'land', name: 'Land & Plots', icon: Trees, count: 0, color: 'bg-yellow-500' },
    { id: 'other', name: 'Other Items', icon: Package, count: 0, color: 'bg-purple-500' }
  ]

  useEffect(() => {
    fetchAllListings()
  }, [])

  const fetchAllListings = async () => {
    try {
      setLoading(true)
      const allListings = []
      
      // Fetch listings from all categories
      for (const category of categories) {
        const { listings: categoryListings } = await fetchListingsWithDetails({
          category: category.id,
          limit: 10 // Get recent listings from each category
        })
        allListings.push(...categoryListings)
      }
      
      setListings(allListings)
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatLocation = (location: any) => {
    if (!location) return 'Rwanda'
    
    if (typeof location === 'string') {
      return location
    }
    
    if (typeof location === 'object' && location !== null) {
      // Handle location object with nested properties
      const parts = [
        location.village,
        location.sector,
        location.address,
        location.district,
        location.province
      ].filter(Boolean)
      
      return parts.length > 0 ? parts.join(', ') : 'Rwanda'
    }
    
    return 'Rwanda'
  }

  const formatPrice = (price: number, currency: string = 'RWF') => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Listings</h1>
              <p className="text-gray-600 mt-1">Discover properties, vehicles, and more across Rwanda</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link key={category.id} href={`/listings/${category.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Explore {category.name.toLowerCase()} in Rwanda
                      </p>
                      <div className="flex items-center text-red-600 text-sm font-medium group-hover:text-red-700">
                        Browse {category.name}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Listings */}
        {filteredListings.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.slice(0, 6).map((listing) => (
                <Link key={listing.id} href={`/listings/${listing.category}/${listing.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="relative">
                      {listing.media && listing.media.length > 0 ? (
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          <Image
                            src={listing.media[0].url}
                            alt={listing.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                          <Package className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-red-600 text-white">
                          {listing.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{listing.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-lg font-bold text-red-600">
                          {formatPrice(listing.price, listing.currency)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Eye className="h-4 w-4" />
                          <span>{listing.views || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{formatLocation(listing.location)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            {/* View More Button */}
            <div className="text-center mt-8">
              <Link href="/listings/houses">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  View All Houses
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* No Listings Found */}
        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new listings'}
            </p>
            <Link href="/listings/houses">
              <Button variant="outline">
                Browse Houses
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
