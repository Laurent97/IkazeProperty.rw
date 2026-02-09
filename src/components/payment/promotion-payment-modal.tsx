'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { PaymentMethod } from '@/types/payment'
import { usePaymentContext } from '@/contexts/PaymentContext'

interface PromotionPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  promotionType: string
  promotionPrice: number
  onSubmit: (paymentData: {
    method: PaymentMethod
    proof: File | null
    phoneNumber?: string
  }) => void
  loading?: boolean
}

export default function PromotionPaymentModal({
  isOpen,
  onClose,
  promotionType,
  promotionPrice,
  onSubmit,
  loading = false
}: PromotionPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn_momo')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const { paymentSettings } = usePaymentContext()

  if (!isOpen) return null

  const handleSubmit = () => {
    if ((paymentMethod === 'mtn_momo' || paymentMethod === 'airtel_money') && !phoneNumber.trim()) {
      alert('Please enter your phone number')
      return
    }

    onSubmit({
      method: paymentMethod,
      proof: paymentProof,
      phoneNumber: phoneNumber.trim() || undefined
    })
  }

  const getPaymentMethodName = (method: PaymentMethod): string => {
    const names: Record<PaymentMethod, string> = {
      mtn_momo: 'MTN Mobile Money',
      airtel_money: 'Airtel Money',
      equity_bank: 'Equity Bank',
      crypto: 'Cryptocurrency',
      wallet: 'Wallet Balance'
    }
    return names[method] || method
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold">Pay for Promotion</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 touch-target p-1"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <div className="text-sm text-gray-700">
            Promotion fee: <strong>{promotionPrice.toLocaleString()} RWF</strong>
          </div>
          <div className="text-xs text-gray-600">
            Boost your {promotionType} listing visibility and get faster responses.
          </div>
          
          {/* Payment proof upload */}
          <div className="space-y-3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
              <h4 className="font-medium mb-2">Upload payment proof</h4>
              <input
                id="promotion-payment-proof-upload"
                type="file"
                accept="image/*"
                onChange={(e: any) => setPaymentProof(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                aria-label="Upload payment confirmation"
                title="Upload screenshot or photo of payment confirmation"
              />
              {paymentProof && (
                <div className="mt-2 text-xs text-gray-500">
                  Proof: {paymentProof.name}
                  <button
                    type="button"
                    onClick={() => setPaymentProof(null)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="promotion-payment-method" className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              id="promotion-payment-method"
              value={paymentMethod}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              title="Payment Method Selection"
            >
              <option value="mtn_momo">MTN Mobile Money</option>
              <option value="airtel_money">Airtel Money</option>
              <option value="equity_bank">Equity Bank</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="wallet">Wallet Balance</option>
            </select>

            {(paymentMethod === 'mtn_momo' || paymentMethod === 'airtel_money') && (
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    {getPaymentMethodName(paymentMethod)} Payment Details
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">Send payment to the number below:</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Phone Number:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {paymentMethod === 'mtn_momo' 
                          ? paymentSettings?.mobile_money_details?.mtn?.phone_number || '+250737060025'
                          : paymentSettings?.mobile_money_details?.airtel?.phone_number || 'Not configured'
                        }
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Account Name:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {paymentMethod === 'mtn_momo' 
                          ? paymentSettings?.mobile_money_details?.mtn?.account_name || 'ikaze property'
                          : paymentSettings?.mobile_money_details?.airtel?.account_name || 'Not configured'
                        }
                      </span>
                    </div>
                    
                    {(paymentMethod === 'mtn_momo' 
                      ? paymentSettings?.mobile_money_details?.mtn?.merchant_id
                      : paymentSettings?.mobile_money_details?.airtel?.merchant_id) && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Merchant ID:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {paymentMethod === 'mtn_momo' 
                            ? paymentSettings?.mobile_money_details?.mtn?.merchant_id || 'KIZZO125'
                            : paymentSettings?.mobile_money_details?.airtel?.merchant_id
                          }
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {(paymentMethod === 'mtn_momo' 
                    ? paymentSettings?.mobile_money_details?.mtn?.payment_instructions
                    : paymentSettings?.mobile_money_details?.airtel?.payment_instructions) && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm font-medium text-blue-800 mb-1">Payment Instructions:</p>
                      <p className="text-sm text-blue-700">
                        {paymentMethod === 'mtn_momo' 
                          ? paymentSettings?.mobile_money_details?.mtn?.payment_instructions || 'Dial *182# and proceed with the payment'
                          : paymentSettings?.mobile_money_details?.airtel?.payment_instructions
                        }
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Phone Number</label>
                  <input
                    type="tel"
                    placeholder="078X XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            )}
            
            {paymentMethod === 'equity_bank' && (
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Bank Transfer Details</h4>
                  <p className="text-xs text-gray-600 mb-3">Send payment to the account below:</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bank Name:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {paymentSettings?.bank_details?.bank_name || 'Not configured'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Account Name:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {paymentSettings?.bank_details?.account_name || 'Not configured'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Account Number:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {paymentSettings?.bank_details?.account_number || 'Not configured'}
                      </span>
                    </div>
                    
                    {paymentSettings?.bank_details?.branch_code && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Branch Code:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {paymentSettings?.bank_details?.branch_code}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === 'crypto' && (
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Cryptocurrency Payment</h4>
                  <p className="text-sm text-gray-600">
                    Cryptocurrency payment details will be displayed here once configured by administrator.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              aria-label="Cancel promotion payment"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700"
              aria-label="Submit promotion payment"
            >
              {loading ? 'Processing...' : `Pay ${promotionPrice.toLocaleString()} RWF`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
