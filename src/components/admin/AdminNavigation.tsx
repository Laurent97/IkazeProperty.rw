'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  List, 
  Megaphone, 
  MessageCircle, 
  CreditCard,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  href: string
  icon: React.ComponentType<any>
  label: string
  badge?: string
  group?: string
}

interface AdminNavigationProps {
  className?: string
}

export default function AdminNavigation({ className = '' }: AdminNavigationProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems: NavItem[] = [
    {
      href: '/admin',
      icon: LayoutDashboard,
      label: 'Dashboard',
      badge: 'New',
      group: 'main'
    },
    {
      href: '/admin/users',
      icon: Users,
      label: 'Users',
      group: 'management'
    },
    {
      href: '/admin/listings',
      icon: List,
      label: 'Listings',
      badge: '12',
      group: 'management'
    },
    {
      href: '/admin/ads',
      icon: Megaphone,
      label: 'Ads',
      badge: '3',
      group: 'management'
    },
    {
      href: '/admin/inquiries',
      icon: MessageCircle,
      label: 'Inquiries',
      badge: '5',
      group: 'management'
    },
    {
      href: '/admin/transactions',
      icon: CreditCard,
      label: 'Transactions',
      badge: '2',
      group: 'management'
    },
    {
      href: '/admin/visit-requests/new',
      icon: Calendar,
      label: 'Visit Requests',
      badge: '8',
      group: 'management'
    },
    {
      href: '/admin/site-settings',
      icon: Settings,
      label: 'Settings',
      group: 'system'
    },
    {
      href: '/admin/help',
      icon: HelpCircle,
      label: 'Help',
      group: 'system'
    },
    {
      href: '/admin/logout',
      icon: LogOut,
      label: 'Sign Out',
      group: 'system'
    }
  ]

  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.group || 'other']) {
      acc[item.group || 'other'] = []
    }
    acc[item.group || 'other'].push(item)
    return acc
  }, {} as Record<string, NavItem[]>)

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href || pathname === '/admin/' || pathname.startsWith('/admin/')
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  const NavItemComponent = ({ item, isMobile = false }: { item: NavItem; isMobile?: boolean }) => (
    <Link
      href={item.href}
      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive(item.href)
          ? 'bg-red-50 text-red-700 border border-red-200'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      } ${isMobile ? 'w-full justify-start' : ''}`}
      onClick={() => isMobile && setIsMobileMenuOpen(false)}
    >
      <item.icon className="h-4 w-4 flex-shrink-0" />
      <span className="truncate">{item.label}</span>
      {item.badge && (
        <Badge variant={isActive(item.href) ? 'default' : 'secondary'} className="ml-auto flex-shrink-0">
          {item.badge}
        </Badge>
      )}
    </Link>
  )

  return (
    <nav className={`bg-white shadow-lg border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition-colors">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">IkazeProperty</span>
              <span className="text-sm text-gray-500 hidden sm:inline">Admin</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item, index) => (
              <NavItemComponent key={index} item={item} />
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* Main Navigation */}
              <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Main
                </h3>
                <div className="space-y-1">
                  {groupedItems.main?.map((item, index) => (
                    <NavItemComponent key={`mobile-main-${index}`} item={item} isMobile />
                  ))}
                </div>
              </div>

              {/* Management */}
              <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Management
                </h3>
                <div className="space-y-1">
                  {groupedItems.management?.map((item, index) => (
                    <NavItemComponent key={`mobile-mgmt-${index}`} item={item} isMobile />
                  ))}
                </div>
              </div>

              {/* System */}
              <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  System
                </h3>
                <div className="space-y-1">
                  {groupedItems.system?.map((item, index) => (
                    <NavItemComponent key={`mobile-sys-${index}`} item={item} isMobile />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
