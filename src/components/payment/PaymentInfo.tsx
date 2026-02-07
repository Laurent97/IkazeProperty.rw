'use client'

import { usePaymentMethods } from '@/contexts/PaymentContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  CreditCard, 
  Building, 
  BanknoteIcon,
  Phone,
  User,
  CheckCircle
} from 'lucide-react'

export default function PaymentInfo() {
  const {
    getAvailableMethods,
    getMobileMoneyProviders,
    getBankDetails,
    getMobileMoneyDetails,
    getCommissionRate,
    isMethodAvailable,
    isProviderAvailable
  } = usePaymentMethods()

  const availableMethods = getAvailableMethods()
  const commissionRate = getCommissionRate()

  if (availableMethods.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center text-yellow-800">
            <DollarSign className="h-5 w-5 mr-2" />
            <span className="text-sm">Payment methods are being configured</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Commission Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-blue-800">
              <DollarSign className="h-5 w-5 mr-2" />
              <span className="font-medium">Platform Commission</span>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {commissionRate}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Accepted Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableMethods.includes('mobile_money') && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Mobile Money
              </h4>
              
              {isProviderAvailable('mtn') && (
                <div className="border border-gray-200 rounded-lg p-3 bg-yellow-50">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-xs">M</span>
                    </div>
                    <span className="font-medium text-gray-800">MTN Mobile Money</span>
                    <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                  </div>
                  {getMobileMoneyDetails('mtn') && (
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Phone:</strong> {getMobileMoneyDetails('mtn')?.phone_number || 'Not configured'}</p>
                      <p><strong>Account:</strong> {getMobileMoneyDetails('mtn')?.account_name || 'Not configured'}</p>
                      {getMobileMoneyDetails('mtn')?.payment_instructions && (
                        <p><strong>Instructions:</strong> {getMobileMoneyDetails('mtn')?.payment_instructions}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {isProviderAvailable('airtel') && (
                <div className="border border-gray-200 rounded-lg p-3 bg-red-50">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-xs">A</span>
                    </div>
                    <span className="font-medium text-gray-800">Airtel Money</span>
                    <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                  </div>
                  {getMobileMoneyDetails('airtel') && (
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Phone:</strong> {getMobileMoneyDetails('airtel')?.phone_number || 'Not configured'}</p>
                      <p><strong>Account:</strong> {getMobileMoneyDetails('airtel')?.account_name || 'Not configured'}</p>
                      {getMobileMoneyDetails('airtel')?.payment_instructions && (
                        <p><strong>Instructions:</strong> {getMobileMoneyDetails('airtel')?.payment_instructions}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {availableMethods.includes('bank_transfer') && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Bank Transfer
              </h4>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex items-center mb-2">
                  <Building className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-800">Bank Details</span>
                  <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                </div>
                {getBankDetails() && (
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Bank:</strong> {getBankDetails()?.bank_name || 'Not configured'}</p>
                    <p><strong>Account Name:</strong> {getBankDetails()?.account_name || 'Not configured'}</p>
                    <p><strong>Account Number:</strong> {getBankDetails()?.account_number || 'Not configured'}</p>
                    {getBankDetails()?.branch_code && (
                      <p><strong>Branch Code:</strong> {getBankDetails()?.branch_code}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {availableMethods.includes('cash') && (
            <div className="border border-gray-200 rounded-lg p-3 bg-green-50">
              <div className="flex items-center">
                <BanknoteIcon className="h-4 w-4 text-green-600 mr-2" />
                <span className="font-medium text-gray-800">Cash Payment</span>
                <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Cash payments accepted for in-person transactions
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Compact version for use in modals or sidebars
export function CompactPaymentInfo() {
  const {
    getAvailableMethods,
    getMobileMoneyProviders,
    getBankDetails,
    getMobileMoneyDetails,
    getCommissionRate,
    isProviderAvailable
  } = usePaymentMethods()

  const availableMethods = getAvailableMethods()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Commission:</span>
        <span className="text-blue-600 font-medium">{getCommissionRate()}%</span>
      </div>

      {availableMethods.includes('mobile_money') && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Mobile Money:</span>
          <div className="space-y-1">
            {isProviderAvailable('mtn') && getMobileMoneyDetails('mtn')?.phone_number && (
              <div className="flex items-center text-xs text-gray-600">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                MTN: {getMobileMoneyDetails('mtn')?.phone_number}
              </div>
            )}
            {isProviderAvailable('airtel') && getMobileMoneyDetails('airtel')?.phone_number && (
              <div className="flex items-center text-xs text-gray-600">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Airtel: {getMobileMoneyDetails('airtel')?.phone_number}
              </div>
            )}
          </div>
        </div>
      )}

      {availableMethods.includes('bank_transfer') && getBankDetails()?.account_number && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Bank Transfer:</span>
          <div className="text-xs text-gray-600">
            {getBankDetails()?.bank_name} - {getBankDetails()?.account_number}
          </div>
        </div>
      )}

      {availableMethods.includes('cash') && (
        <div className="flex items-center text-xs text-gray-600">
          <BanknoteIcon className="h-3 w-3 mr-2" />
          Cash payments accepted
        </div>
      )}
    </div>
  )
}
