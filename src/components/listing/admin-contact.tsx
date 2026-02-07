'use client'

import { Phone, Mail, MapPin } from 'lucide-react'
import { usePaymentMethods } from '@/contexts/PaymentContext'

interface AdminContactProps {
  className?: string
}

export default function AdminContactInfo({ className = '' }: AdminContactProps) {
  const { getPlatformInfo } = usePaymentMethods()
  const platformInfo = getPlatformInfo()

  return (
    <div className={`text-xs text-gray-600 space-y-1 ${className}`}>
      <div className="flex items-center">
        <Phone className="h-3 w-3 mr-2 text-gray-500" />
        <span>{platformInfo.phone}</span>
      </div>
      <div className="flex items-center">
        <Mail className="h-3 w-3 mr-2 text-gray-500" />
        <span>{platformInfo.email}</span>
      </div>
      <div className="flex items-center">
        <MapPin className="h-3 w-3 mr-2 text-gray-500" />
        <span>{platformInfo.address}</span>
      </div>
    </div>
  )
}
