'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Menu, X, User, PlusCircle, Heart, Bell, ChevronDown, LayoutDashboard, Home, Car, Trees, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LanguageSwitcher from '@/components/ui/language-switcher'
import ChatBot from '@/components/chat/ChatBot'
import WhatsAppIntegration from '@/components/chat/WhatsAppIntegration'
import NotificationDropdown from '@/components/notifications/NotificationDropdown'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, setUser } = useAuth()
  const locale = useLocale()
  const t = useTranslations()

  const categories = [
    { id: 'houses', name: t('listing.houses'), href: `/${locale}/listings/houses`, icon: Home },
    { id: 'cars', name: t('listing.cars'), href: `/${locale}/listings/cars`, icon: Car },
    { id: 'land', name: t('listing.land'), href: `/${locale}/listings/land`, icon: Trees },
    { id: 'other', name: t('listing.other'), href: `/${locale}/listings/other`, icon: Package },
  ]

  const supportLinks = [
    { name: t('navigation.customerService'), href: `/${locale}/customer-service` },
    { name: t('navigation.faq'), href: `/${locale}/faq` },
    { name: t('navigation.safety'), href: `/${locale}/safety` },
  ]

  const legalLinks = [
    { name: t('navigation.terms'), href: `/${locale}/terms` },
    { name: t('navigation.privacy'), href: `/${locale}/privacy` },
    { name: t('navigation.commissionAgreement'), href: `/${locale}/commission-agreement` },
    { name: t('navigation.disputeResolution'), href: `/${locale}/dispute-resolution` },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 safe-area-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center touch-target">
            <img 
              src="/images/ikazeproperty-logo.svg" 
              alt="Ikaze Property" 
              className="h-12 sm:h-14 object-contain"
            />
          </Link>

          {/* Notification Dropdown - Desktop */}
          <div className="hidden lg:flex">
            <NotificationDropdown />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 pr-4">
            <div className="relative group">
              <button className="text-gray-700 hover:text-red-600 font-medium transition-colors flex items-center">
                {t('navigation.categories')}
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-80 lg:w-96 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 max-h-80 lg:max-h-96 overflow-y-auto">
                {categories.map((category) => {
                  const Icon = category.icon
                  
                  return (
                    <div key={category.id} className="border-b border-gray-100 last:border-b-0">
                      <Link
                        href={category.href}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        <span className="font-medium">{category.name}</span>
                      </Link>
                    </div>
                  )
                })}
                
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-700 hover:text-red-600 font-medium transition-colors flex items-center">
                {t('navigation.support')}
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
                {t('navigation.legal')}
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
            <Link href={`/${locale}/how-it-works`} className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              {t('navigation.howItWorks')}
            </Link>
            <Link href={`/${locale}/about`} className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              {t('navigation.about')}
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            <LanguageSwitcher />
            <Link href={`/${locale}/favorites`} className="hidden sm:flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors touch-target">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium hidden md:block">{t('navigation.favorites')}</span>
            </Link>
            <Link href={`/${locale}/create-listing`} className="hidden sm:flex items-center space-x-1 bg-red-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-red-700 transition-colors touch-target">
              <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium hidden md:block">{t('listing.create')}</span>
            </Link>
            {user ? (
              <Link href={`/${locale}/dashboard`} className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors touch-target">
                <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium hidden lg:block">{t('navigation.dashboard')}</span>
              </Link>
            ) : (
              <Link href={`/${locale}/auth/login`} className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors touch-target">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">{t('navigation.login')}</span>
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

        {/* Mobile Notification Dropdown */}
        <div className="lg:hidden flex">
          <NotificationDropdown />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div className="mobile-menu-overlay active" onClick={() => setIsMenuOpen(false)} />
          <div className="mobile-menu-panel active lg:hidden">
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h2 className="text-lg font-semibold text-gray-900">{t('navigation.menu')}</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="touch-target p-1 text-gray-500 hover:text-gray-700"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            {categories.map((category) => {
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
                </Link>
              )
            })}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                {t('navigation.support')}
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
                  {t('navigation.legal')}
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
                  href={`/${locale}/how-it-works`}
                  className="block px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors touch-target"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navigation.howItWorks')}
                </Link>
                <Link
                  href={`/${locale}/about`}
                  className="block px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors touch-target"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navigation.about')}
                </Link>
                <Link
                  href={`/${locale}/favorites`}
                  className="block px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors touch-target"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navigation.favorites')}
                </Link>
                <Link
                  href={`/${locale}/create-listing`}
                  className="block px-3 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors touch-target mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('listing.create')}
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
