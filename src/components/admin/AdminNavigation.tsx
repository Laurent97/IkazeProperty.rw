'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Listings, 
  Ads, 
  Inquiries, 
  Transactions,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react'

interface NavItem {
  href: string
  icon: React.ComponentType<any, any, any>
  label: string
  badge?: string
}

interface AdminNavigationProps {
  className?: string
}

export default function AdminNavigation({ className = '' }: AdminNavigationProps) {
  const pathname = usePathname()

  const navigationItems: NavItem[] = [
    {
      href: '/admin',
      icon: LayoutDashboard,
      label: 'Dashboard',
      badge: 'New'
    },
    {
      href: '/admin/users',
      icon: Users,
      label: 'Users'
    },
    {
      href: '/admin/listings',
      icon: Listings,
      label: 'Listings',
      badge: '12'
    },
    {
      href: '/admin/ads',
      icon: Ads,
      label: 'Ads',
      badge: '3'
    },
    {
      href: '/admin/inquiries',
      icon: Inquiries,
      label: 'Inquiries',
      badge: '5'
    },
    {
      href: '/admin/transactions',
      icon: Transactions,
      label: 'Transactions',
      badge: '2'
    },
    {
      href: '/admin/visit-requests',
      icon: Users,
      label: 'Visit Requests',
      badge: '8'
    },
    {
      href: '/admin/site-settings',
      icon: Settings,
      label: 'Settings'
    },
    {
      href: '/admin/visit-requests',
      icon: Users,
      label: 'Visit Requests',
      badge: '8'
    },
    {
      href: '/admin/help',
      icon: HelpCircle,
      label: 'Help'
    },
    {
      href: '/admin/logout',
      icon: LogOut,
      label: 'Sign Out'
    }
  ]

  return (
    <nav className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 h-14 sm:h-16">
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="flex items-center text-gray-700 hover:text-red-600 transition-colors">
              <LayoutDashboard className="h-6 w-6" />
              <span className="font-semibold">IkazeProperty</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
            <div className="flex items-center space-x-1">
              {navigationItems.slice(0, 4).map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors ${
                    pathname === item.href ? 'bg-gray-100 text-gray-900' : ''
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href="/admin/logout"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
