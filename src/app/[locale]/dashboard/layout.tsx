'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  MessageSquare,
  Heart,
  Plus,
  TrendingUp,
  Shield,
  Megaphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getCurrentUser, signOut, getUserProfile } from '@/lib/auth'
import { supabase } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { setUser: setAuthUser } = useAuth()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        console.log('No user authenticated, redirecting to login')
        window.location.href = '/auth/login'
        return
      }

      setUser(currentUser)

      // Try to get user profile, but don't fail if it doesn't exist
      try {
        const profile = await getUserProfile(currentUser.id)
        setUserProfile(profile)
      } catch (profileError) {
        console.log('User profile not found, using default values')
        setUserProfile({
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.user_metadata?.full_name || 'User',
          role: 'user'
        })
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      // Don't fail completely, just redirect to login
      window.location.href = '/auth/login'
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setAuthUser(null) // Clear the auth context
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const isAdmin = userProfile?.role === 'admin'

  const navigation = [
    {
      name: 'Dashboard',
      href: isAdmin ? '/dashboard/admin' : '/dashboard/user',
      icon: Home,
      current: pathname === (isAdmin ? '/dashboard/admin' : '/dashboard/user')
    }
  ]

  if (isAdmin) {
    navigation.push(
      {
        name: 'Users',
        href: '/dashboard/admin/users',
        icon: User,
        current: pathname === '/dashboard/admin/users'
      },
      {
        name: 'Listings',
        href: '/dashboard/admin/listings',
        icon: Home,
        current: pathname === '/dashboard/admin/listings'
      },
      {
        name: 'Ads',
        href: '/dashboard/admin/ads',
        icon: Megaphone,
        current: pathname === '/dashboard/admin/ads' || pathname === '/admin/ads'
      },
      {
        name: 'Inquiries',
        href: '/dashboard/admin/inquiries',
        icon: MessageSquare,
        current: pathname === '/dashboard/admin/inquiries'
      },
      {
        name: 'Transactions',
        href: '/dashboard/admin/transactions',
        icon: TrendingUp,
        current: pathname === '/dashboard/admin/transactions'
      }
    )
  } else {
    navigation.push(
      {
        name: 'My Listings',
        href: '/dashboard/my-listings',
        icon: Home,
        current: pathname === '/dashboard/my-listings'
      },
      {
        name: 'My Inquiries',
        href: '/dashboard/my-inquiries',
        icon: MessageSquare,
        current: pathname === '/dashboard/my-inquiries'
      },
      {
        name: 'Favorites',
        href: '/dashboard/favorites',
        icon: Heart,
        current: pathname === '/dashboard/favorites'
      },
      {
        name: 'Transactions',
        href: '/dashboard/transactions',
        icon: TrendingUp,
        current: pathname === '/dashboard/transactions'
      }
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <span className="text-xl font-bold text-gray-900">IkazeProperty</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* User Profile */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {userProfile?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {userProfile?.email || user?.email}
                </p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {isAdmin ? (
                    <>
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3 mr-1" />
                      User
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${item.current
                      ? 'bg-red-50 text-red-700 border-r-2 border-red-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions */}
          <div className="px-4 py-6 border-t border-gray-200">
            {isAdmin ? (
              <Link href="/admin/ads">
                <Button className="w-full bg-red-600 hover:bg-red-700 mb-2">
                  <Megaphone className="h-4 w-4 mr-2" />
                  Manage Ads
                </Button>
              </Link>
            ) : (
              <Link href="/create-listing">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Listing
                </Button>
              </Link>
            )}
          </div>

          {/* Sign Out */}
          <div className="px-4 py-4">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Site
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
