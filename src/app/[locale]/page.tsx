'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Search, Home, Car, Trees, Package, Star, Shield, Users, TrendingUp, ArrowRight, Heart, Eye, MapPin, Calendar, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminContactInfo from '@/components/listing/admin-contact'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { HomepageLeaderboard, HomepageSidebar, FeaturedCarousel } from '@/components/ads/AdServing'
import LikesDisplay from '@/components/listing/likes-display'
import ViewsDisplay from '@/components/listing/views-display'
import ListingDetails from '@/components/listing/listing-details'
import { supabaseClient as supabase } from '@/lib/supabase-client'
import type { Database } from '@/types/database'

type Listing = Database['public']['Tables']['listings']['Row'] & {
  seller: {
    full_name: string | null
    email: string
  } | null
  media: {
    url: string
    media_type: 'image' | 'video'
    is_primary: boolean
    order_index: number
  }[]
  house_details?: Database['public']['Tables']['house_details']['Row']
  car_details?: Database['public']['Tables']['car_details']['Row']
  land_details?: Database['public']['Tables']['land_details']['Row']
  other_item_details?: Database['public']['Tables']['other_item_details']['Row']
}

export default function HomePage() {
  const t = useTranslations()
  const [searchQuery, setSearchQuery] = useState('')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [totalCount, setTotalCount] = useState(0)
  
  const observer = useRef<IntersectionObserver | null>(null)
  const lastListingRef = useCallback((node: HTMLDivElement) => {
    if (loadingMore) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreListings()
      }
    }, {
      threshold: 0.1
    })
    if (node) observer.current.observe(node)
  }, [loadingMore, hasMore])

  const fetchListings = async (pageNum: number, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      
      const pageSize = 20
      let query = supabase
        .from('listings')
        .select(`
          *,
          seller:users!listings_seller_id_fkey(
            full_name,
            email
          ),
          media:listing_media(
            url,
            media_type,
            is_primary,
            order_index
          ).order('is_primary', { ascending: false }).order('order_index', { ascending: true }),
          house_details,
          car_details,
          land_details,
          other_item_details
        `, { count: 'exact' })
        .eq('status', 'available')

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter)
      }

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      query = query
        .order(sortBy, { ascending: false })
        .range(pageNum * pageSize, (pageNum + 1) * pageSize - 1)

      const { data, error, count } = await query

      if (error) {
        console.error('Error fetching listings:', error)
      } else {
        if (append) {
          setListings(prev => [...prev, ...(data || [])])
        } else {
          setListings(data || [])
          setTotalCount(count || 0)
        }
        
        // Check if there are more items to load
        const hasMoreItems = (data?.length || 0) === pageSize && ((pageNum + 1) * pageSize) < (count || 0)
        setHasMore(hasMoreItems)
        
        if (!append) {
          setPage(0)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMoreListings = () => {
    if (hasMore && !loadingMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchListings(nextPage, true)
    }
  }

  useEffect(() => {
    fetchListings(0, false)
  }, [categoryFilter, sortBy])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 0) {
        fetchListings(0, false)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(0)
    fetchListings(0, false)
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: currency === 'RWF' ? 'RWF' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'houses': return '🏠'
      case 'cars': return '🚗'
      case 'land': return '🌳'
      default: return '📦'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'houses': return 'bg-blue-100 text-blue-800'
      case 'cars': return 'bg-green-100 text-green-800'
      case 'land': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-purple-100 text-purple-800'
    }
  }

  const categories = [
    {
      name: t('listing.houses'),
      href: '/listings/houses',
      icon: Home,
      description: t('homepage.categories.housesDescription'),
      color: 'bg-blue-500',
      count: '1,234'
    },
    {
      name: t('listing.cars'),
      href: '/listings/cars',
      icon: Car,
      description: t('homepage.categories.carsDescription'),
      color: 'bg-green-500',
      count: '856'
    },
    {
      name: t('listing.land'),
      href: '/listings/land',
      icon: Trees,
      description: t('homepage.categories.landDescription'),
      color: 'bg-yellow-500',
      count: '432'
    },
    {
      name: t('listing.other'),
      href: '/listings/other',
      icon: Package,
      description: t('homepage.categories.otherDescription'),
      color: 'bg-purple-500',
      count: '2,156'
    }
  ]

  const stats = [
    { label: t('homepage.stats.activeListings'), value: '4,678', icon: Package },
    { label: t('homepage.stats.verifiedUsers'), value: '12,456', icon: Users },
    { label: t('homepage.stats.successfulTransactions'), value: '3,234', icon: TrendingUp },
    { label: t('homepage.stats.trustScore'), value: '98.5%', icon: Shield }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-20 overflow-hidden">
        {/* Background Logo */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src="/images/ikazeproperty-logo.svg" 
            alt="Ikaze Property Background" 
            className="absolute top-10 right-10 w-64 h-64 object-contain transform rotate-12"
          />
          <img 
            src="/images/ikazeproperty-logo.svg" 
            alt="Ikaze Property Background" 
            className="absolute bottom-10 left-10 w-48 h-48 object-contain transform -rotate-12"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('homepage.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              {t('homepage.hero.subtitle')}
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('homepage.hero.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <Button type="submit" className="bg-white text-red-600 hover:bg-gray-100 px-8">
                  {t('common.search')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Homepage Leaderboard Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <HomepageLeaderboard />
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('homepage.categories.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('homepage.categories.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link key={category.name} href={category.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-6">
                      <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-red-600">
                          {category.count}
                        </span>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* All Listings with Infinite Scroll */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('homepage.listings.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {totalCount > 0 ? t('homepage.listings.showing', { count: listings.length, total: totalCount }) : t('homepage.listings.browseAll')}
              </p>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value)
                  setPage(0)
                }}
                className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
                aria-label={t('homepage.filters.filterByCategory')}
                title={t('homepage.filters.filterByCategory')}
              >
                <option value="all">{t('homepage.filters.allCategories')}</option>
                <option value="houses">{t('listing.houses')}</option>
                <option value="cars">{t('listing.cars')}</option>
                <option value="land">{t('listing.land')}</option>
                <option value="other">{t('listing.other')}</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setPage(0)
                }}
                className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
                aria-label={t('homepage.filters.sortListings')}
                title={t('homepage.filters.sortListings')}
              >
                <option value="created_at">{t('homepage.filters.newestFirst')}</option>
                <option value="price">{t('homepage.filters.priceLowToHigh')}</option>
                <option value="views">{t('homepage.filters.mostViewed')}</option>
                <option value="likes">{t('homepage.filters.mostLiked')}</option>
              </select>
            </div>
          </div>

          {/* Listings Grid */}
          {loading && listings.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('homepage.listings.loading')}</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('homepage.listings.noListings')}</h3>
              <p className="text-gray-600">
                {searchQuery || categoryFilter !== 'all' 
                  ? t('homepage.listings.tryAdjustingFilters')
                  : t('homepage.listings.checkBackLater')
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing, index) => (
                <Card 
                  key={listing.id} 
                  ref={index === listings.length - 3 ? lastListingRef : undefined}
                  className="hover:shadow-lg transition-shadow group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge className={`${getCategoryColor(listing.category)} border-0`}>
                        {getCategoryIcon(listing.category)} {listing.category}
                      </Badge>
                      <div className="flex gap-1">
                        {listing.featured && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            ⭐ {t('homepage.listings.featured')}
                          </Badge>
                        )}
                        {listing.promoted && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            🚀 {t('homepage.listings.promoted')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Image */}
                    <div className="mb-4">
                      {listing.media && listing.media.length > 0 ? (
                        <div className="relative">
                          {listing.media[0].media_type === 'video' ? (
                            <div className="relative">
                              <video
                                src={listing.media[0].url}
                                className="w-full h-48 object-cover rounded-lg"
                                muted
                                playsInline
                                poster={listing.media[0].url}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                                <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                  <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={listing.media[0].url}
                              alt={listing.title}
                              className="w-auto h-auto max-w-full object-cover rounded-lg"
                            />
                          )}
                          {listing.media[0].is_primary && (
                            <Badge className="absolute top-2 left-2 bg-red-600 text-white text-xs">
                              {t('homepage.listings.primary')}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-gray-400 text-4xl mb-2">📷</div>
                            <p className="text-gray-500 text-sm">{t('homepage.listings.noMedia')}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-2xl font-bold text-red-600 mb-3">
                      {formatPrice(listing.price, listing.currency)}
                      {listing.price_type === 'negotiable' && (
                        <span className="text-sm text-gray-500 ml-2">({t('listing.negotiable')})</span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {listing.description}
                    </p>

                    {/* Category-specific details */}
                    <ListingDetails 
                      category={listing.category}
                      listing={listing}
                      className="mb-3"
                    />

                      {/* Location */}
                      {listing.location && typeof listing.location === 'object' && (
                        <div className="flex items-center text-gray-500 text-sm mb-3">
                          <MapPin className="h-4 w-4 mr-1" />
                          {(listing.location as any)?.district || t('homepage.listings.locationNotSpecified')}
                        </div>
                      )}

                      <AdminContactInfo className="mb-4" />

                      {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-3">
                        <ViewsDisplay 
                          listingId={listing.id} 
                          viewsCount={listing.views || 0}
                          className="text-xs"
                        />
                        <LikesDisplay 
                          listingId={listing.id} 
                          likesCount={listing.likes || 0}
                          className="text-xs"
                        />
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(listing.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{t('homepage.listings.listedBy')}</p>
                        <p className="font-medium text-gray-900">
                          {listing.seller?.full_name || t('homepage.listings.anonymous')}
                        </p>
                      </div>
                      <Link href={`/listings/${listing.category}/${listing.id}`}>
                        <Button>
                          {t('homepage.listings.viewDetails')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Loading More Indicator */}
          {loadingMore && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">{t('homepage.listings.loadingMore')}</p>
            </div>
          )}

          {/* End of Listings */}
          {!hasMore && listings.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {listings.length === totalCount 
                  ? t('homepage.listings.reachedEnd', { total: totalCount })
                  : t('homepage.listings.noMoreListings')
                }
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Ad */}
        <div className="hidden lg:block">
          <div className="ml-6">
            <HomepageSidebar />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('homepage.stats.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('homepage.stats.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('homepage.howItWorks.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('homepage.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('homepage.howItWorks.step1.title')}
              </h3>
              <p className="text-gray-600">
                {t('homepage.howItWorks.step1.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('homepage.howItWorks.step2.title')}
              </h3>
              <p className="text-gray-600">
                {t('homepage.howItWorks.step2.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('homepage.howItWorks.step3.title')}
              </h3>
              <p className="text-gray-600">
                {t('homepage.howItWorks.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('homepage.cta.title')}
          </h2>
          <p className="text-xl mb-8 text-red-100">
            {t('homepage.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-listing">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100" asChild={true}>
                {t('homepage.cta.startSelling')}
              </Button>
            </Link>
            <Link href="/listings">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600" asChild={true}>
                {t('homepage.cta.browseListings')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
