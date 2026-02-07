'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, User, PlusCircle, Heart, Bell, ChevronDown, LayoutDashboard, Home, Car, Trees, Package, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LanguageSwitcher from '@/components/ui/language-switcher'
import ChatBot from '@/components/chat/ChatBot'
import WhatsAppIntegration from '@/components/chat/WhatsAppIntegration'
import { useAuth } from '@/contexts/AuthContext'

interface Listing {
  id: string
  title: string
  price: number
  currency: string
  category: string
  status: string
  created_at: string
  seller_id: {
    id: string
    full_name: string
    email: string
  }
  listing_media: Array<{
    id: string
    url: string
    media_type: string
    order_index: number
    is_primary: boolean
  }>
}

interface CategoryListings {
  [key: string]: Listing[]
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryListings, setCategoryListings] = useState<CategoryListings>({})
  const [loadingListings, setLoadingListings] = useState(false)
  const { user, setUser } = useAuth()

  const categories = [
    { id: 'houses', name: 'Houses', href: '/listings/houses', icon: Home },
    { id: 'cars', name: 'Cars', href: '/listings/cars', icon: Car },
    { id: 'land', name: 'Land', href: '/listings/land', icon: Trees },
    { id: 'other', name: 'Other Items', href: '/listings/other', icon: Package },
  ]

  const supportLinks = [
    { name: 'Customer Service', href: '/customer-service' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Safety', href: '/safety' },
  ]

  const legalLinks = [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Commission Agreement', href: '/commission-agreement' },
    { name: 'Dispute Resolution', href: '/dispute-resolution' },
  ]

  // Fetch listings for all categories
  useEffect(() => {
    const fetchCategoryListings = async () => {
      setLoadingListings(true)
      try {
        const listingsData: CategoryListings = {}
        
        // Fetch listings for each category
        for (const category of categories) {
          const response = await fetch(`/api/listings?category=${category.id}&limit=5`)
          if (response.ok) {
            const result = await response.json()
            listingsData[category.id] = result.data || []
          } else {
            listingsData[category.id] = []
          }
        }
        
        setCategoryListings(listingsData)
      } catch (error) {
        console.error('Error fetching category listings:', error)
      } finally {
        setLoadingListings(false)
      }
    }

    fetchCategoryListings()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 safe-area-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 touch-target">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">I</span>
            </div>
            <span className="text-base sm:text-xl font-bold text-gray-900 hidden xs:block">IkazeProperty.rw</span>
            <span className="text-sm sm:text-base font-bold text-gray-900 xs:hidden">Ikaze</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-lg mx-4 xl:mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, cars, land..."
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 pr-4">
            <div className="relative group">
              <button className="text-gray-700 hover:text-red-600 font-medium transition-colors flex items-center">
                Categories
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-80 lg:w-96 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 max-h-80 lg:max-h-96 overflow-y-auto">
                {categories.map((category) => {
                  const listings = categoryListings[category.id] || []
                  const Icon = category.icon
                  
                  return (
                    <div key={category.id} className="border-b border-gray-100 last:border-b-0">
                      <Link
                        href={category.href}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        <span className="font-medium">{category.name}</span>
                        <span className="ml-auto text-xs text-gray-500">
                          {listings.length} {listings.length === 1 ? 'item' : 'items'}
                        </span>
                      </Link>
                      
                      {listings.length > 0 && (
                        <div className="px-4 pb-2 space-y-1">
                          {listings.slice(0, 3).map((listing) => {
                            const primaryImage = listing.listing_media.find(m => m.is_primary)
                            const fallbackImage = listing.listing_media[0]
                            const image = primaryImage || fallbackImage
                            
                            return (
                              <Link
                                key={listing.id}
                                href={`/listings/${listing.category}/${listing.id}`}
                                className="flex items-center p-2 rounded hover:bg-gray-50 transition-colors"
                              >
                                {image ? (
                                  <img
                                    src={image.url}
                                    alt={listing.title}
                                    className="w-10 h-10 object-cover rounded mr-3"
                                    onError={(e) => {
                                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNS41OCAxMiAxMiAxNS41OCAxMiAyMEMxMiAyNC40MiAxNS41OCAyOCAyMCAyOEMyNC40MiAyOCAyOCAyNC40MiAyOCAyMEMyOCAxNS41OCAyNC40MiAxMiAyMCAxMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
                                    }}
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-200 rounded mr-3 flex items-center justify-center">
                                    <ImageIcon className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {listing.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {listing.currency} {listing.price.toLocaleString()}
                                  </p>
                                </div>
                              </Link>
                            )
                          })}
                          
                          {listings.length > 3 && (
                            <Link
                              href={category.href}
                              className="block text-xs text-red-600 hover:text-red-700 font-medium pt-1"
                            >
                              View all {listings.length} items →
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
                
                {loadingListings && (
                  <div className="px-4 py-3 text-center text-gray-500 text-sm">
                    Loading listings...
                  </div>
                )}
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-700 hover:text-red-600 font-medium transition-colors flex items-center">
                Support
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {supportLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-700 hover:text-red-600 font-medium transition-colors flex items-center">
                Legal
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {legalLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/how-it-works" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              About
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            <LanguageSwitcher />
            <Link href="/favorites" className="hidden sm:flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors touch-target">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium hidden md:block">Favorites</span>
            </Link>
            <Link href="/create-listing" className="hidden sm:flex items-center space-x-1 bg-red-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-red-700 transition-colors touch-target">
              <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium hidden md:block">List Item</span>
            </Link>
            {user ? (
              <Link href="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors touch-target">
                <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium hidden lg:block">Dashboard</span>
              </Link>
            ) : (
              <Link href="/auth/login" className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors touch-target">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-red-600 transition-colors touch-target p-1"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="lg:hidden pb-3 px-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties, cars, land..."
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div className="mobile-menu-overlay active" onClick={() => setIsMenuOpen(false)} />
          <div className="mobile-menu-panel active lg:hidden">
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="touch-target p-1 text-gray-500 hover:text-gray-700"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            {categories.map((category) => {
              const listings = categoryListings[category.id] || []
              const Icon = category.icon
              
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span>{category.name}</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {listings.length}
                  </span>
                </Link>
              )
            })}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                Support
              </div>
              {supportLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                  Legal
                </div>
                {legalLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-sm touch-target"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link
                  href="/how-it-works"
                  className="block px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors touch-target"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors touch-target"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/favorites"
                  className="block px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors touch-target"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Favorites
                </Link>
                <Link
                  href="/create-listing"
                  className="block px-3 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors touch-target mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  List Item
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Chat Components */}
      <ChatBot />
      <WhatsAppIntegration />
    </header>
  )
}
