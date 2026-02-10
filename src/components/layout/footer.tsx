'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { usePaymentContext } from '@/contexts/PaymentContext'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function Footer() {
  const { getPlatformInfo } = usePaymentContext()
  const platformInfo = getPlatformInfo()
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  
  return (
    <footer className="bg-gray-900 text-white safe-area-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src="/images/ikazeproperty-logo.svg" 
                alt="Ikaze Property" 
                className="h-12 sm:h-14 object-contain"
              />
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              Rwanda's trusted marketplace for properties, vehicles, and more. Secure transactions with admin-mediated connections.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors touch-target p-1" aria-label="Facebook">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors touch-target p-1" aria-label="Twitter">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors touch-target p-1" aria-label="Instagram">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors touch-target p-1" aria-label="YouTube">
                <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Categories</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link href={`/${locale}/listings/houses`} className="text-gray-400 hover:text-red-500 transition-colors text-sm sm:text-base">
                  Houses & Apartments
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/listings/cars`} className="text-gray-400 hover:text-red-500 transition-colors text-sm sm:text-base">
                  Cars & Vehicles
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/listings/land`} className="text-gray-400 hover:text-red-500 transition-colors text-sm sm:text-base">
                  Land & Plots
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/listings/other`} className="text-gray-400 hover:text-red-500 transition-colors text-sm sm:text-base">
                  Other Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Support</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-red-500 transition-colors text-sm sm:text-base">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-red-500 transition-colors text-sm sm:text-base">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/customer-service" className="text-gray-400 hover:text-red-500 transition-colors text-sm sm:text-base">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-400 hover:text-red-500 transition-colors text-sm sm:text-base">
                  Safety Center
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-red-500 transition-colors text-sm sm:text-base">
                  Blog & Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Legal</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-red-500 transition-colors text-sm sm:text-base">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-red-500 transition-colors text-sm sm:text-base">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/commission-agreement" className="text-gray-400 hover:text-red-500 transition-colors text-sm sm:text-base">
                  Commission Agreement
                </Link>
              </li>
              <li>
                <Link href="/dispute-resolution" className="text-gray-400 hover:text-red-500 transition-colors text-sm sm:text-base">
                  Dispute Resolution
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
              <span className="text-gray-400 text-xs sm:text-sm">{platformInfo.email}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
              <span className="text-gray-400 text-xs sm:text-sm">{platformInfo.phone}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
              <span className="text-gray-400 text-xs sm:text-sm">{platformInfo.address}</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            © 2024 IkazeProperty.rw. All rights reserved. Made with ❤️ in Rwanda.
          </p>
        </div>
      </div>
    </footer>
  )
}
