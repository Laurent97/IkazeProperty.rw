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
      logo: '\/api\/placeholder\/mtn-logo.png',
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
      logo: '\/api\/placeholder\/airtel-logo.png',
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
      logo: '\/api\/placeholder\/bank-logo.png',
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
      logo: '\/api\/placeholder\/visa-logo.png',
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
      id: Date.now().toString(),
      name: newPaymentMethod.name || '',
      type: newPaymentMethod.type || 'mobile',
      provider: newPaymentMethod.provider || '',
      accountInfo: newPaymentMethod.accountInfo || '',
      isActive: newPaymentMethod.isActive ?? true,
      fees: newPaymentMethod.fees || { deposit: 0, withdrawal: 0, transaction: 0 },
      supportedCurrencies: newPaymentMethod.supportedCurrencies || ['RWF'],
      processingTime: newPaymentMethod.processingTime || 'Instant',
      minAmount: newPaymentMethod.minAmount || 100,
      maxAmount: newPaymentMethod.maxAmount || 1000000,
      instructions: newPaymentMethod.instructions || '',
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
        ? { 
            id: method.id, 
            name: newPaymentMethod.name || method.name,
            type: newPaymentMethod.type || method.type,
            provider: newPaymentMethod.provider || method.provider,
            accountInfo: newPaymentMethod.accountInfo || method.accountInfo,
            isActive: newPaymentMethod.isActive ?? method.isActive,
            fees: newPaymentMethod.fees || method.fees,
            supportedCurrencies: newPaymentMethod.supportedCurrencies || method.supportedCurrencies,
            processingTime: newPaymentMethod.processingTime || method.processingTime,
            minAmount: newPaymentMethod.minAmount || method.minAmount,
            maxAmount: newPaymentMethod.maxAmount || method.maxAmount,
            instructions: newPaymentMethod.instructions || method.instructions,
            createdAt: method.createdAt,
            updatedAt: new Date().toISOString() 
          }
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
                  <Label htmlFor={`contactEmail-general`}>Contact Email</Label>
                  <Input id={`contactEmail-general`} defaultValue="info@ikazeproperty.rw" />
                </div>
                <div>
                  <Label htmlFor={`contactPhone-general`}>Contact Phone</Label>
                  <Input id={`contactPhone-general`} defaultValue="+250 788 123 456" />
                </div>
                <div>
                  <Label htmlFor={`officeAddress-general`}>Office Address</Label>
                  <Input id={`officeAddress-general`} defaultValue="Kigali, Rwanda" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maxListings-general">Max Listings per User</Label>
                  <Input id="maxListings-general" type="number" defaultValue="10" />
                </div>
                <div>
                  <Label htmlFor="visitFee-general">Default Visit Fee (RWF)</Label>
                  <Input id="visitFee-general" type="number" defaultValue="10000" />
                </div>
                <div>
                  <Label htmlFor="platformFeePercent-general">Platform Fee (%)</Label>
                  <Input id="platformFeePercent-general" type="number" defaultValue="10" />
                </div>
                <div>
                  <Label htmlFor="featuredPrice-general">Featured Listing Price (RWF)</Label>
                  <Input id="featuredPrice-general" type="number" defaultValue="50000" />
                </div>
                <div>
                  <Label htmlFor="listingDuration-general">Listing Duration (days)</Label>
                  <Input id="listingDuration-general" type="number" defaultValue="30" />
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
                  <Label htmlFor="smtpHost-general">SMTP Host</Label>
                  <Input id="smtpHost-general" placeholder="smtp.gmail.com" />
                </div>
                <div>
                  <Label htmlFor="smtpPort-general">SMTP Port</Label>
                  <Input id="smtpPort-general" type="number" defaultValue="587" />
                </div>
                <div>
                  <Label htmlFor="smtpUser-general">SMTP Username</Label>
                  <Input id="smtpUser-general" placeholder="noreply@ikazeproperty.rw" />
                </div>
                <div>
                  <Label htmlFor="smtpPassword-general">SMTP Password</Label>
                  <Input id="smtpPassword-general" type="password" />
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
                  <Label htmlFor="apiKey-general">API Key</Label>
                  <div className="flex gap-2">
                    <Input id="apiKey-general" defaultValue="sk_test_..." readOnly />
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="webhookSecret-general">Webhook Secret</Label>
                  <div className="flex gap-2">
                    <Input id="webhookSecret-general" defaultValue="whsec_..." readOnly />
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
                      <Label htmlFor="dbHost-general">Database Host</Label>
                      <Input id="dbHost-general" defaultValue="localhost" />
                    </div>
                    <div>
                      <Label htmlFor="dbPort-general">Database Port</Label>
                      <Input id="dbPort-general" type="number" defaultValue="5432" />
                    </div>
                    <div>
                      <Label htmlFor="dbName-general">Database Name</Label>
                      <Input id="dbName-general" defaultValue="ikazeproperty" />
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
                      <Label htmlFor="backupFrequency-general">Backup Frequency</Label>
                      <select className="w-full px-3 py-2 border rounded-lg">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="backupRetention-general">Retention Period</Label>
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
                  <Label htmlFor="defaultLanguage-general">Default Language</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>English</option>
                    <option>French</option>
                    <option>Kinyarwanda</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="supportedLanguages-general">Supported Languages</Label>
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
                  <Label htmlFor="defaultCurrency-general">Default Currency</Label>
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
                  <Label htmlFor="timezone-general">Timezone</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>Africa/Kigali</option>
                    <option>Africa/Nairobi</option>
                    <option>UTC</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="dateFormat-general">Date Format</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="timeFormat-general">Time Format</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>12-hour</option>
                    <option>24-hour</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="numberFormat-general">Number Format</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>1,234,567.89</option>
                    <option>1.234.567,89</option>
                    <option>1 234 567,89</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            {/* Payment Methods List */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-4">
                        <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{method.name}</p>
                            <Badge variant={method.isActive ? 'default' : 'secondary'}>
                              {method.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{method.provider}</p>
                          <p className="text-xs text-gray-500 mt-1">{method.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingPaymentMethod(method.id)
                            setNewPaymentMethod(method)
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTogglePaymentMethod(method.id)}
                        >
                          {method.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleDeletePaymentMethod(method.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Add/Edit Payment Method Form */}
            <Card>
              <CardHeader>
                <CardTitle>{editingPaymentMethod ? 'Edit Payment Method' : 'Add New Payment Method'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="method-name">Method Name *</Label>
                      <Input
                        id="method-name"
                        value={newPaymentMethod.name || ''}
                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, name: e.target.value})}
                        placeholder="e.g., MTN Mobile Money"
                      />
                    </div>
                    <div>
                      <Label htmlFor="provider">Provider/Company *</Label>
                      <Input
                        id="provider"
                        value={newPaymentMethod.provider || ''}
                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, provider: e.target.value})}
                        placeholder="e.g., MTN Rwanda"
                      />
                    </div>
                  </div>

                  {/* Payment Type */}
                  <div>
                    <Label htmlFor="type">Payment Type *</Label>
                    <select
                      id="type"
                      value={newPaymentMethod.type || 'mobile'}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, type: e.target.value as PaymentMethod['type']})}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="mobile">Mobile Money</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="card">Card Payment</option>
                      <option value="digital">Digital Wallet</option>
                    </select>
                  </div>

                  {/* Fees Section */}
                  <div>
                    <Label>Transaction Fees</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div>
                        <Label htmlFor="fee-deposit">Deposit Fee</Label>
                        <Input
                          id="fee-deposit"
                          type="number"
                          value={newPaymentMethod.fees?.deposit || 0}
                          onChange={(e) => setNewPaymentMethod({
                            ...newPaymentMethod, 
                            fees: {...newPaymentMethod.fees, deposit: parseInt(e.target.value)}
                          })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fee-withdrawal">Withdrawal Fee</Label>
                        <Input
                          id="fee-withdrawal"
                          type="number"
                          value={newPaymentMethod.fees?.withdrawal || 0}
                          onChange={(e) => setNewPaymentMethod({
                            ...newPaymentMethod, 
                            fees: {...newPaymentMethod.fees, withdrawal: parseInt(e.target.value)}
                          })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fee-transaction">Transaction Fee</Label>
                        <Input
                          id="fee-transaction"
                          type="number"
                          value={newPaymentMethod.fees?.transaction || 0}
                          onChange={(e) => setNewPaymentMethod({
                            ...newPaymentMethod, 
                            fees: {...newPaymentMethod.fees, transaction: parseInt(e.target.value)}
                          })}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Amount Limits */}
                  <div>
                    <Label>Transaction Limits (RWF)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label htmlFor="min-amount">Minimum Amount</Label>
                        <Input
                          id="min-amount"
                          type="number"
                          value={newPaymentMethod.minAmount || 100}
                          onChange={(e) => setNewPaymentMethod({...newPaymentMethod, minAmount: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-amount">Maximum Amount</Label>
                        <Input
                          id="max-amount"
                          type="number"
                          value={newPaymentMethod.maxAmount || 1000000}
                          onChange={(e) => setNewPaymentMethod({...newPaymentMethod, maxAmount: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Processing Time */}
                  <div>
                    <Label htmlFor="processing-time">Processing Time</Label>
                    <Input
                      id="processing-time"
                      value={newPaymentMethod.processingTime || 'Instant'}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, processingTime: e.target.value})}
                      placeholder="e.g., Instant, 1-3 business days"
                    />
                  </div>

                  {/* Instructions */}
                  <div>
                    <Label htmlFor="instructions">Payment Instructions</Label>
                    <textarea
                      id="instructions"
                      value={newPaymentMethod.instructions || ''}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, instructions: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
                      placeholder="Step-by-step instructions for this payment method..."
                    />
                  </div>

                  {/* Status */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is-active"
                      checked={newPaymentMethod.isActive || false}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, isActive: e.target.checked})}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="is-active">Active (available for users)</Label>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={editingPaymentMethod ? handleUpdatePaymentMethod : handleAddPaymentMethod}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {editingPaymentMethod ? 'Update Payment Method' : 'Add Payment Method'}
                    </Button>
                    {editingPaymentMethod && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingPaymentMethod(null)
                          setNewPaymentMethod({
                            name: '',
                            type: 'mobile',
                            provider: '',
                            isActive: true,
                            fees: { deposit: 0, withdrawal: 0, transaction: 0 },
                            supportedCurrencies: ['RWF'],
                            processingTime: 'Instant',
                            minAmount: 100,
                            maxAmount: 1000000
                          })
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

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
