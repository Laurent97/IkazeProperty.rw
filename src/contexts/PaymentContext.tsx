'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/auth'

interface PaymentSettings {
  commission_rate: number
  payment_methods: string[]
  mobile_money_providers: string[]
  bank_details: {
    bank_name: string
    account_name: string
    account_number: string
    branch_code: string
  }
  mobile_money_details: {
    mtn: {
      provider_name: string
      phone_number: string
      account_name: string
      merchant_id: string
      payment_instructions: string
    }
    airtel: {
      provider_name: string
      phone_number: string
      account_name: string
      merchant_id: string
      payment_instructions: string
    }
  }
  platform_name: string
  platform_email: string
  platform_phone: string
  platform_address: string
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
  platform_email: 'support@ikazeproperty.rw',
  platform_phone: '+250 788 123 456',
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

      // Fetch from site_settings table
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('*')
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      if (data) {
        // Type the data properly
        const siteData = data as {
          admin_phone: string
          support_email: string
          office_address: string
        }
        
        // Map site_settings to PaymentSettings format
        setPaymentSettings({
          commission_rate: 5, // Default commission rate
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
          // Add platform info from site_settings
          platform_name: 'IkazeProperty',
          platform_email: siteData.support_email || 'support@ikazeproperty.rw',
          platform_phone: siteData.admin_phone || '+250 788 123 456',
          platform_address: siteData.office_address || 'Kigali, Rwanda'
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
      email: context.paymentSettings?.platform_email || 'support@ikazeproperty.rw',
      phone: context.paymentSettings?.platform_phone || '+250 788 123 456',
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
      email: paymentSettings?.platform_email || 'support@ikazeproperty.rw',
      phone: paymentSettings?.platform_phone || '+250 788 123 456',
      address: paymentSettings?.platform_address || 'Kigali, Rwanda'
    })
  }
}
