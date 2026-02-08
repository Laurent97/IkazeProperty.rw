'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/auth'

interface PaymentSettings {
  commission_rate?: number
  payment_methods?: string[]
  mobile_money_providers?: string[]
  bank_details?: {
    bank_name: string
    account_name: string
    account_number: string
    branch_code: string
  }
  mobile_money_details?: {
    mtn?: any
    airtel?: any
  }
  platform_name?: string
  platform_email?: string
  platform_phone?: string
  platform_whatsapp?: string
  platform_address?: string
  min_commission?: number
  max_commission?: number
  email_notifications?: boolean
  sms_notifications?: boolean
  admin_alerts?: boolean
  require_verification?: boolean
  auto_approve_listings?: boolean
  max_daily_listings?: number
  terms_of_service?: string
  privacy_policy?: string
  refund_policy?: string
}

interface PaymentContextType {
  paymentSettings: PaymentSettings | null
  loading: boolean
  error: string | null
  refreshSettings: () => Promise<void>
}

const defaultPaymentSettings: PaymentSettings = {
  commission_rate: 5,
  payment_methods: ['mobile_money', 'bank_transfer', 'cash'],
  mobile_money_providers: ['mtn', 'airtel'],
  bank_details: {
    bank_name: '',
    account_name: '',
    account_number: '',
    branch_code: ''
  },
  mobile_money_details: {
    mtn: {
      provider_name: 'MTN Mobile Money',
      phone_number: '',
      account_name: '',
      merchant_id: '',
      payment_instructions: ''
    },
    airtel: {
      provider_name: 'Airtel Money',
      phone_number: '',
      account_name: '',
      merchant_id: '',
      payment_instructions: ''
    }
  },
  platform_name: 'IkazeProperty',
  platform_email: 'support@ikazeproperty.org',
  platform_phone: '+250737060025',
  platform_whatsapp: '+250737060025',
  platform_address: 'Kigali, Rwanda'
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPaymentSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch from settings table
      const { data, error: fetchError } = await supabase
        .from('settings')
        .select('*')
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      if (data) {
        // Type the data properly - settings table has all fields
        const settingsData = data as {
          commission_rate?: number
          payment_methods?: string[]
          mobile_money_providers?: string[]
          bank_details?: {
            bank_name: string
            account_name: string
            account_number: string
            branch_code: string
          }
          mobile_money_details?: {
            mtn?: {
              provider_name: string
              phone_number: string
              account_name: string
              merchant_id: string
              payment_instructions: string
            }
            airtel?: {
              provider_name: string
              phone_number: string
              account_name: string
              merchant_id: string
              payment_instructions: string
            }
          }
          platform_name?: string
          platform_email?: string
          platform_phone?: string
          platform_address?: string
          min_commission?: number
          max_commission?: number
          email_notifications?: boolean
          sms_notifications?: boolean
          admin_alerts?: boolean
          require_verification?: boolean
          auto_approve_listings?: boolean
          max_daily_listings?: number
          terms_of_service?: string
          privacy_policy?: string
          refund_policy?: string
        }
        
        // Map settings to PaymentSettings format
        setPaymentSettings({
          commission_rate: settingsData.commission_rate || 5,
          payment_methods: settingsData.payment_methods || ['mobile_money', 'bank_transfer', 'cash'],
          mobile_money_providers: settingsData.mobile_money_providers || ['mtn', 'airtel'],
          bank_details: settingsData.bank_details || {
            bank_name: '',
            account_name: '',
            account_number: '',
            branch_code: ''
          },
          mobile_money_details: settingsData.mobile_money_details || {
            mtn: {
              provider_name: 'MTN Mobile Money',
              phone_number: '',
              account_name: '',
              merchant_id: '',
              payment_instructions: ''
            },
            airtel: {
              provider_name: 'Airtel Money',
              phone_number: '',
              account_name: '',
              merchant_id: '',
              payment_instructions: ''
            }
          },
          platform_name: settingsData.platform_name || 'IkazeProperty',
          platform_email: settingsData.platform_email || 'support@ikazeproperty.org',
          platform_phone: settingsData.platform_phone || '+250737060025',
          platform_address: settingsData.platform_address || 'Kigali, Rwanda',
          platform_whatsapp: settingsData.platform_phone || '+250737060025' // Use phone for WhatsApp
        })
      } else {
        // Use default settings if none exist
        setPaymentSettings(defaultPaymentSettings)
      }
    } catch (err) {
      console.error('Error fetching payment settings:', err)
      setError('Failed to load payment settings')
      setPaymentSettings(defaultPaymentSettings)
    } finally {
      setLoading(false)
    }
  }

  const refreshSettings = async () => {
    await fetchPaymentSettings()
  }

  useEffect(() => {
    fetchPaymentSettings()
  }, [])

  return (
    <PaymentContext.Provider value={{
      paymentSettings,
      loading,
      error,
      refreshSettings
    }}>
      {children}
    </PaymentContext.Provider>
  )
}

export function usePayment() {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider')
  }
  return context
}

export function usePaymentContext() {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error('usePaymentContext must be used within a PaymentProvider')
  }
  return {
    ...context,
    getPlatformInfo: () => ({
      name: context.paymentSettings?.platform_name || 'IkazeProperty',
      email: context.paymentSettings?.platform_email || 'support@ikazeproperty.org',
      phone: context.paymentSettings?.platform_phone || '+250737060025',
      whatsapp: context.paymentSettings?.platform_whatsapp || '+250737060025',
      address: context.paymentSettings?.platform_address || 'Kigali, Rwanda'
    })
  }
}

// Helper functions for common payment operations
export function usePaymentMethods() {
  const { paymentSettings } = usePayment()
  
  return {
    getAvailableMethods: () => paymentSettings?.payment_methods || [],
    getMobileMoneyProviders: () => paymentSettings?.mobile_money_providers || [],
    getBankDetails: () => paymentSettings?.bank_details,
    getMobileMoneyDetails: (provider: 'mtn' | 'airtel') => paymentSettings?.mobile_money_details?.[provider],
    getCommissionRate: () => paymentSettings?.commission_rate || 5,
    isMethodAvailable: (method: string) => paymentSettings?.payment_methods?.includes(method) || false,
    isProviderAvailable: (provider: string) => paymentSettings?.mobile_money_providers?.includes(provider) || false,
    getPlatformInfo: () => ({
      name: paymentSettings?.platform_name || 'IkazeProperty',
      email: paymentSettings?.platform_email || process.env.NEXT_PUBLIC_PLATFORM_EMAIL || 'support@ikazeproperty.org',
      phone: paymentSettings?.platform_phone || process.env.NEXT_PUBLIC_PLATFORM_PHONE || '+250737060025',
      address: paymentSettings?.platform_address || process.env.NEXT_PUBLIC_PLATFORM_ADDRESS || 'Kigali, Rwanda'
    })
  }
}
