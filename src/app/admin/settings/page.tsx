'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, Bell, Shield, Database, Globe, CreditCard, Mail, Phone, MapPin, Plus, Trash2, Edit2, Smartphone, Building, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/auth'

interface PaymentMethod {
  id: string
  name: string
  type: 'mobile' | 'bank' | 'card' | 'digital'
  provider: string
  accountInfo?: string
  isActive: boolean
  fees?: {
    deposit?: number
    withdrawal?: number
    transaction?: number
  }
  logo?: string
  supportedCurrencies?: string[]
  processingTime?: string
  minAmount?: number
  maxAmount?: number
  instructions?: string
  createdAt: string
  updatedAt: string
}

interface SiteSettings {
  platformName: string
  platformDescription: string
  contactEmail: string
  contactPhone: string
  officeAddress: string
  maxListings: number
  defaultVisitFee: number
  platformFeePercent: number
  featuredListingPrice: number
  listingDurationDays: number
  supportedLanguages: string[]
  defaultCurrency: string
  timezone: string
  dateFormat: string
  timeFormat: string
  numberFormat: string
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    platformName: 'IkazeProperty',
    platformDescription: "Rwanda's Premier Property Platform",
    contactEmail: 'info@ikazeproperty.rw',
    contactPhone: '+250 788 123 456',
    officeAddress: 'Kigali, Rwanda',
    maxListings: 10,
    defaultVisitFee: 10000,
    platformFeePercent: 10,
    featuredListingPrice: 50000,
    listingDurationDays: 30,
    supportedLanguages: ['English', 'French', 'Kinyarwanda'],
    defaultCurrency: 'RWF',
    timezone: 'Africa/Kigali',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12-hour',
    numberFormat: '1,234.567'
  })
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'mtn-momo',
      name: 'MTN Mobile Money',
      type: 'mobile',
      provider: 'MTN Rwanda',
      accountInfo: 'Dial *182# to activate',
      isActive: true,
      fees: {
        deposit: 0,
        withdrawal: 300,
        transaction: 100
      },
      logo: '/api/placeholder/mtn-logo.png',
      supportedCurrencies: ['RWF'],
      processingTime: 'Instant',
      minAmount: 100,
      maxAmount: 1000000,
      instructions: '1. Go to your MTN Mobile Money menu 2. Select "Pay with MoMo" 3. Enter merchant code 4. Follow instructions to complete payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'airtel-money',
      name: 'Airtel Money',
      type: 'mobile',
      provider: 'Airtel Rwanda',
      accountInfo: 'Dial *182# to activate',
      isActive: true,
      fees: {
        deposit: 0,
        withdrawal: 250,
        transaction: 100
      },
      logo: '/api/placeholder/airtel-logo.png',
      supportedCurrencies: ['RWF'],
      processingTime: 'Instant',
      minAmount: 100,
      maxAmount: 500000,
      instructions: '1. Go to your Airtel Money menu 2. Select "Pay with Airtel Money" 3. Enter merchant code 4. Follow instructions to complete payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      type: 'bank',
      provider: 'Local Banks',
      accountInfo: 'Account details provided during checkout',
      isActive: true,
      fees: {
        deposit: 500,
        withdrawal: 1000,
        transaction: 2000
      },
      logo: '/api/placeholder/bank-logo.png',
      supportedCurrencies: ['RWF', 'USD', 'EUR'],
      processingTime: '1-3 business days',
      minAmount: 5000,
      maxAmount: 10000000,
      instructions: 'Transfer funds directly to our bank account. Account details will be provided during checkout process.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'visa-card',
      name: 'Visa/Mastercard',
      type: 'card',
      provider: 'Visa/Mastercard Network',
      accountInfo: 'Card details collected during checkout',
      isActive: true,
      fees: {
        deposit: 299,
        withdrawal: 500,
        transaction: 299
      },
      logo: '/api/placeholder/visa-logo.png',
      supportedCurrencies: ['RWF', 'USD', 'EUR'],
      processingTime: 'Instant',
      minAmount: 1000,
      maxAmount: 5000000,
      instructions: 'Enter your card details securely during checkout. All transactions are encrypted and PCI compliant.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ])

  const [editingPaymentMethod, setEditingPaymentMethod] = useState<string | null>(null)
  const [newPaymentMethod, setNewPaymentMethod] = useState<Partial<PaymentMethod>>({
    name: '',
    type: 'mobile',
    provider: '',
    isActive: true,
    fees: {
      deposit: 0,
      withdrawal: 0,
      transaction: 0
    },
    supportedCurrencies: ['RWF'],
    processingTime: 'Instant',
    minAmount: 100,
    maxAmount: 1000000
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLoading(false)
      alert('Settings saved successfully!')
    } catch (error) {
      setLoading(false)
      alert('Error saving settings!')
    }
  }

  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.name || !newPaymentMethod.provider) {
      alert('Please fill in at least the name and provider fields')
      return
    }

    const method: PaymentMethod = {
      ...newPaymentMethod,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setPaymentMethods([...paymentMethods, method])
    setNewPaymentMethod({
      name: '',
      type: 'mobile',
      provider: '',
      isActive: true,
      fees: {
        deposit: 0,
        withdrawal: 0,
        transaction: 0
      },
      supportedCurrencies: ['RWF'],
      processingTime: 'Instant',
      minAmount: 100,
      maxAmount: 1000000
    })
  }

  const handleUpdatePaymentMethod = () => {
    if (!editingPaymentMethod || !newPaymentMethod.name || !newPaymentMethod.provider) {
      alert('Please fill in at least the name and provider fields')
      return
    }

    setPaymentMethods(paymentMethods.map(method => 
      method.id === editingPaymentMethod 
        ? { ...newPaymentMethod, id: method.id, updatedAt: new Date().toISOString() }
        : method
    ))
    setEditingPaymentMethod(null)
    setNewPaymentMethod({
      name: '',
      type: 'mobile',
      provider: '',
      isActive: true,
      fees: {
        deposit: 0,
        withdrawal: 0,
        transaction: 0
      },
      supportedCurrencies: ['RWF'],
      processingTime: 'Instant',
      minAmount: 100,
      maxAmount: 1000000
    })
  }

  const handleDeletePaymentMethod = (id: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(paymentMethods.filter(method => method.id !== id))
    }
  }

  const handleTogglePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => 
      method.id === id 
        ? { ...method, isActive: !method.isActive, updatedAt: new Date().toISOString() }
        : method
    ))
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'localization', name: 'Localization', icon: Globe },
    { id: 'payment', name: 'Payment Methods', icon: CreditCard },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600">Configure platform settings and preferences</p>
      </div>

      {/* Settings Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input id="platformName" defaultValue="IkazeProperty" />
                </div>
                <div>
                  <Label htmlFor="platformDescription">Description</Label>
                  <Input id="platformDescription" defaultValue="Rwanda's Premier Property Platform" />
                </div>
                <div>
                  <Label htmlFor={`contactEmail-${method.id}`}>Contact Email</Label>
                  <Input id={`contactEmail-${method.id}`} defaultValue="info@ikazeproperty.rw" />
                </div>
                <div>
                  <Label htmlFor={`contactPhone-${method.id}`}>Contact Phone</Label>
                  <Input id={`contactPhone-${method.id}`} defaultValue="+250 788 123 456" />
                </div>
                <div>
                  <Label htmlFor={`officeAddress-${method.id}`}>Office Address</Label>
                  <Input id={`officeAddress-${method.id}`} defaultValue="Kigali, Rwanda" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`maxListings-${method.id}`}>Max Listings per User</Label>
                  <Input id={`maxListings-${method.id}`} type="number" defaultValue="10" />
                </div>
                <div>
                  <Label htmlFor={`visitFee-${method.id}`}>Default Visit Fee (RWF)</Label>
                  <Input id={`visitFee-${method.id}`} type="number" defaultValue="10000" />
                </div>
                <div>
                  <Label htmlFor={`platformFeePercent-${method.id}`}>Platform Fee (%)</Label>
                  <Input id={`platformFeePercent-${method.id}`} type="number" defaultValue="10" />
                </div>
                <div>
                  <Label htmlFor={`featuredPrice-${method.id}`}>Featured Listing Price (RWF)</Label>
                  <Input id={`featuredPrice-${method.id}`} type="number" defaultValue="50000" />
                </div>
                <div>
                  <Label htmlFor={`listingDuration-${method.id}`}>Listing Duration (days)</Label>
                  <Input id={`listingDuration-${method.id}`} type="number" defaultValue="30" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New User Registration</p>
                    <p className="text-sm text-gray-600">Notify admin when new users register</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Listing Submitted</p>
                    <p className="text-sm text-gray-600">Notify admin when listings need approval</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Received</p>
                    <p className="text-sm text-gray-600">Notify admin when payments are completed</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Visit Request Created</p>
                    <p className="text-sm text-gray-600">Notify admin of new visit requests</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`smtpHost-${method.id}`}>SMTP Host</Label>
                  <Input id={`smtpHost-${method.id}`} placeholder="smtp.gmail.com" />
                </div>
                <div>
                  <Label htmlFor={`smtpPort-${method.id}`}>SMTP Port</Label>
                  <Input id={`smtpPort-${method.id}`} type="number" defaultValue="587" />
                </div>
                <div>
                  <Label htmlFor={`smtpUser-${method.id}`}>SMTP Username</Label>
                  <Input id={`smtpUser-${method.id}`} placeholder="noreply@ikazeproperty.rw" />
                </div>
                <div>
                  <Label htmlFor={`smtpPassword-${method.id}`}>SMTP Password</Label>
                  <Input id={`smtpPassword-${method.id}`} type="password" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
                  </div>
                  <select className="px-3 py-2 border rounded-lg">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>4 hours</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Password Requirements</p>
                    <p className="text-sm text-gray-600">Minimum password length</p>
                  </div>
                  <select className="px-3 py-2 border rounded-lg">
                    <option>8 characters</option>
                    <option>12 characters</option>
                    <option>16 characters</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login Attempts</p>
                    <p className="text-sm text-gray-600">Maximum failed attempts</p>
                  </div>
                  <select className="px-3 py-2 border rounded-lg">
                    <option>3 attempts</option>
                    <option>5 attempts</option>
                    <option>10 attempts</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`apiKey-${method.id}`}>API Key</Label>
                  <div className="flex gap-2">
                    <Input id={`apiKey-${method.id}`} defaultValue="sk_test_..." readOnly />
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor={`webhookSecret-${method.id}`}>Webhook Secret</Label>
                  <div className="flex gap-2">
                    <Input id={`webhookSecret-${method.id}`} defaultValue="whsec_..." readOnly />
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rate Limiting</p>
                    <p className="text-sm text-gray-600">Limit API requests per minute</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">CORS Protection</p>
                    <p className="text-sm text-gray-600">Enable CORS headers</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'database' && (
          <Card>
            <CardHeader>
              <CardTitle>Database Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Connection Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`dbHost-${method.id}`}>Database Host</Label>
                      <Input id={`dbHost-${method.id}`} defaultValue="localhost" />
                    </div>
                    <div>
                      <Label htmlFor={`dbPort-${method.id}`}>Database Port</Label>
                      <Input id={`dbPort-${method.id}`} type="number" defaultValue="5432" />
                    </div>
                    <div>
                      <Label htmlFor={`dbName-${method.id}`}>Database Name</Label>
                      <Input id={`dbName-${method.id}`} defaultValue="ikazeproperty" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Backup Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto Backup</p>
                        <p className="text-sm text-gray-600">Enable automatic backups</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                    <div>
                      <Label htmlFor={`backupFrequency-${method.id}`}>Backup Frequency</Label>
                      <select className="w-full px-3 py-2 border rounded-lg">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor={`backupRetention-${method.id}`}>Retention Period</Label>
                      <select className="w-full px-3 py-2 border rounded-lg">
                        <option>7 days</option>
                        <option>30 days</option>
                        <option>90 days</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Database Actions</h3>
                <div className="flex gap-4">
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    <Database className="h-4 w-4 mr-2" />
                    Clear Cache
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'localization' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Language Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`defaultLanguage-${method.id}`}>Default Language</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>English</option>
                    <option>French</option>
                    <option>Kinyarwanda</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor={`supportedLanguages-${method.id}`}>Supported Languages</Label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      English (en)
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      French (fr)
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      Kinyarwanda (rw)
                    </label>
                  </div>
                </div>
                <div>
                  <Label htmlFor={`currency-${method.id}`}>Default Currency</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>RWF (Rwandan Franc)</option>
                    <option>USD (US Dollar)</option>
                    <option>EUR (Euro)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`timezone-${method.id}`}>Timezone</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>Africa/Kigali</option>
                    <option>Africa/Nairobi</option>
                    <option>UTC</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor={`dateFormat-${method.id}`}>Date Format</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor={`timeFormat-${method.id}`}>Time Format</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>12-hour</option>
                    <option>24-hour</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor={`numberFormat-${method.id}`}>Number Format</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>1,234,567.89</option>
                    <option>1.234.567,89</option>
                    <option>1 234 567,89</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="provider">Provider/Company *</Label>
            <Input
              id={`provider-${method.id}`}
              value={newPaymentMethod.provider}
              onChange={(e) => setNewPaymentMethod({...newPaymentMethod, provider: e.target.value})}
              placeholder="e.g., MTN Rwanda, Bank of Kigali"
            />
                    <option>Stripe</option>
                    <option>PayPal</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="gatewayKey">Gateway API Key</Label>
                  <Input id="gatewayKey" type="password" />
                </div>
                <div>
                  <Label htmlFor="gatewaySecret">Gateway Secret</Label>
                  <Input id="gatewaySecret" type="password" />
                </div>
                <div>
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input id="webhookUrl" defaultValue="/api/payments/webhook" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          className="bg-red-600 hover:bg-red-700"
          disabled={loading}
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
