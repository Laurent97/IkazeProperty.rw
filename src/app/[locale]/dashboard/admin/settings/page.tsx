'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Save,
  DollarSign,
  CreditCard,
  BanknoteIcon,
  Percent,
  Globe,
  Mail,
  Phone,
  Building,
  FileText,
  Shield,
  Bell,
  Palette,
  Database,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/auth'
import { usePayment } from '@/contexts/PaymentContext'

export default function AdminSettingsPage() {
  const { refreshSettings } = usePayment()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    // Payment Settings
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
    
    // Platform Settings
    platform_name: 'IkazeProperty',
    platform_email: 'support@ikazeproperty.rw',
    platform_phone: '+250 788 123 456',
    platform_address: 'Kigali, Rwanda',
    
    // Commission Settings
    min_commission: 1000,
    max_commission: 100000,
    
    // Notification Settings
    email_notifications: true,
    sms_notifications: false,
    admin_alerts: true,
    
    // Security Settings
    require_verification: true,
    auto_approve_listings: false,
    max_daily_listings: 10,
    
    // Legal Settings
    terms_of_service: '',
    privacy_policy: '',
    refund_policy: ''
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      
      // Fetch settings from database or use defaults
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async (section?: string) => {
    try {
      setSaving(true)
      
      const { error } = await (supabase as any)
        .from('settings')
        .upsert({
          id: 1,
          ...settings,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      // Refresh payment context to update frontend
      await refreshSettings()
      
      // Exit editing mode if saving a specific section
      if (section) {
        setEditingSection(null)
      }
      
      alert(`Settings saved successfully! Frontend updated automatically.`)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleEditSection = (section: string) => {
    setEditingSection(section)
  }

  const handleCancelEdit = () => {
    setEditingSection(null)
    // Refetch settings to reset changes
    fetchSettings()
  }

  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === 'bank_details') {
      setSettings(prev => ({
        ...prev,
        bank_details: {
          ...prev.bank_details,
          [field]: value
        }
      }))
    } else if (section.startsWith('mobile_money_')) {
      const provider = section.replace('mobile_money_', '')
      setSettings(prev => ({
        ...prev,
        mobile_money_details: {
          ...prev.mobile_money_details,
          [provider]: {
            ...(prev.mobile_money_details as any)[provider],
            [field]: value
          }
        }
      }))
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handlePaymentMethodToggle = (method: string) => {
    setSettings(prev => ({
      ...prev,
      payment_methods: prev.payment_methods.includes(method)
        ? prev.payment_methods.filter(m => m !== method)
        : [...prev.payment_methods, method]
    }))
  }

  const handleMobileProviderToggle = (provider: string) => {
    setSettings(prev => ({
      ...prev,
      mobile_money_providers: prev.mobile_money_providers.includes(provider)
        ? prev.mobile_money_providers.filter(p => p !== provider)
        : [...prev.mobile_money_providers, provider]
    }))
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Settings</h1>
        <p className="text-gray-600">Manage platform settings, payment information, and configurations</p>
      </div>

      <div className="space-y-6">
        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Payment Settings
              </CardTitle>
              {editingSection === 'payment' ? (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleSaveSettings('payment')}
                    disabled={saving}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => handleEditSection('payment')}
                  variant="outline"
                  size="sm"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Percent className="h-4 w-4 inline mr-1" />
                  Commission Rate (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.commission_rate}
                  onChange={(e) => handleInputChange('', 'commission_rate', parseFloat(e.target.value))}
                  disabled={editingSection !== 'payment'}
                  className={editingSection !== 'payment' ? 'bg-gray-50' : ''}
                />
                <p className="text-xs text-gray-500 mt-1">Percentage charged on each transaction</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      type="number"
                      placeholder="Min"
                      value={settings.min_commission}
                      onChange={(e) => handleInputChange('', 'min_commission', parseInt(e.target.value))}
                      disabled={editingSection !== 'payment'}
                      className={editingSection !== 'payment' ? 'bg-gray-50' : ''}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={settings.max_commission}
                      onChange={(e) => handleInputChange('', 'max_commission', parseInt(e.target.value))}
                      disabled={editingSection !== 'payment'}
                      className={editingSection !== 'payment' ? 'bg-gray-50' : ''}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum and maximum commission amounts</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="h-4 w-4 inline mr-1" />
                Accepted Payment Methods
              </label>
              <div className="flex flex-wrap gap-2">
                {['mobile_money', 'bank_transfer', 'cash'].map(method => (
                  <Button
                    key={method}
                    variant={settings.payment_methods.includes(method) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePaymentMethodToggle(method)}
                  >
                    {method === 'mobile_money' && <CreditCard className="h-4 w-4 mr-1" />}
                    {method === 'bank_transfer' && <Building className="h-4 w-4 mr-1" />}
                    {method === 'cash' && <BanknoteIcon className="h-4 w-4 mr-1" />}
                    {method.replace('_', ' ').toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            {settings.payment_methods.includes('mobile_money') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Money Providers
                </label>
                <div className="flex flex-wrap gap-2">
                  {['mtn', 'airtel'].map(provider => (
                    <Button
                      key={provider}
                      variant={settings.mobile_money_providers.includes(provider) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleMobileProviderToggle(provider)}
                    >
                      {provider.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {settings.payment_methods.includes('bank_transfer') && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Bank Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <Input
                      value={settings.bank_details.bank_name}
                      onChange={(e) => handleInputChange('bank_details', 'bank_name', e.target.value)}
                      placeholder="Bank of Kigali"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                    <Input
                      value={settings.bank_details.account_name}
                      onChange={(e) => handleInputChange('bank_details', 'account_name', e.target.value)}
                      placeholder="IkazeProperty Ltd"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <Input
                      value={settings.bank_details.account_number}
                      onChange={(e) => handleInputChange('bank_details', 'account_number', e.target.value)}
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code</label>
                    <Input
                      value={settings.bank_details.branch_code}
                      onChange={(e) => handleInputChange('bank_details', 'branch_code', e.target.value)}
                      placeholder="001"
                    />
                  </div>
                </div>
              </div>
            )}

            {settings.payment_methods.includes('mobile_money') && (
              <div className="space-y-6">
                <h4 className="font-medium text-gray-900">Mobile Money Details</h4>
                
                {settings.mobile_money_providers.includes('mtn') && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-yellow-600 font-bold text-sm">M</span>
                      </div>
                      MTN Mobile Money
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <Input
                          value={settings.mobile_money_details.mtn.phone_number}
                          onChange={(e) => handleInputChange('mobile_money_mtn', 'phone_number', e.target.value)}
                          placeholder="+250 788 123 456"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                        <Input
                          value={settings.mobile_money_details.mtn.account_name}
                          onChange={(e) => handleInputChange('mobile_money_mtn', 'account_name', e.target.value)}
                          placeholder="IkazeProperty Ltd"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
                        <Input
                          value={settings.mobile_money_details.mtn.merchant_id}
                          onChange={(e) => handleInputChange('mobile_money_mtn', 'merchant_id', e.target.value)}
                          placeholder="MERCHANT001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Instructions</label>
                        <Input
                          value={settings.mobile_money_details.mtn.payment_instructions || ''}
                          onChange={(e) => handleInputChange('mobile_money_mtn', 'payment_instructions', e.target.value)}
                          placeholder="Dial *182# and follow instructions"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {settings.mobile_money_providers.includes('airtel') && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-red-600 font-bold text-sm">A</span>
                      </div>
                      Airtel Money
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <Input
                          value={settings.mobile_money_details.airtel.phone_number}
                          onChange={(e) => handleInputChange('mobile_money_airtel', 'phone_number', e.target.value)}
                          placeholder="+250 730 123 456"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                        <Input
                          value={settings.mobile_money_details.airtel.account_name}
                          onChange={(e) => handleInputChange('mobile_money_airtel', 'account_name', e.target.value)}
                          placeholder="IkazeProperty Ltd"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
                        <Input
                          value={settings.mobile_money_details.airtel.merchant_id}
                          onChange={(e) => handleInputChange('mobile_money_airtel', 'merchant_id', e.target.value)}
                          placeholder="AIRTEL001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Instructions</label>
                        <Input
                          value={settings.mobile_money_details.airtel.payment_instructions || ''}
                          onChange={(e) => handleInputChange('mobile_money_airtel', 'payment_instructions', e.target.value)}
                          placeholder="Dial *182# and follow instructions"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-800 mb-2">Mobile Money Setup Instructions</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Ensure the phone numbers are registered business accounts</li>
                    <li>• Merchant ID is required for business transactions</li>
                    <li>• Payment instructions will be shown to users during checkout</li>
                    <li>• Test transactions before going live</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                Platform Information
              </CardTitle>
              {editingSection === 'platform' ? (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleSaveSettings('platform')}
                    disabled={saving}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => handleEditSection('platform')}
                  variant="outline"
                  size="sm"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                <Input
                  value={settings.platform_name}
                  onChange={(e) => handleInputChange('', 'platform_name', e.target.value)}
                  disabled={editingSection !== 'platform'}
                  className={editingSection !== 'platform' ? 'bg-gray-50' : ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Support Email
                </label>
                <Input
                  type="email"
                  value={settings.platform_email}
                  onChange={(e) => handleInputChange('', 'platform_email', e.target.value)}
                  disabled={editingSection !== 'platform'}
                  className={editingSection !== 'platform' ? 'bg-gray-50' : ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Support Phone
                </label>
                <Input
                  value={settings.platform_phone}
                  onChange={(e) => handleInputChange('', 'platform_phone', e.target.value)}
                  disabled={editingSection !== 'platform'}
                  className={editingSection !== 'platform' ? 'bg-gray-50' : ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building className="h-4 w-4 inline mr-1" />
                  Address
                </label>
                <Input
                  value={settings.platform_address}
                  onChange={(e) => handleInputChange('', 'platform_address', e.target.value)}
                  disabled={editingSection !== 'platform'}
                  className={editingSection !== 'platform' ? 'bg-gray-50' : ''}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-red-600" />
                Security & Moderation
              </CardTitle>
              {editingSection === 'security' ? (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleSaveSettings('security')}
                    disabled={saving}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => handleEditSection('security')}
                  variant="outline"
                  size="sm"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.require_verification}
                  onChange={(e) => handleInputChange('', 'require_verification', e.target.checked)}
                  disabled={editingSection !== 'security'}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                />
                <div>
                  <span className="font-medium text-gray-900">Require User Verification</span>
                  <p className="text-sm text-gray-600">Users must verify identity before listing</p>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.auto_approve_listings}
                  onChange={(e) => handleInputChange('', 'auto_approve_listings', e.target.checked)}
                  disabled={editingSection !== 'security'}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                />
                <div>
                  <span className="font-medium text-gray-900">Auto-approve Listings</span>
                  <p className="text-sm text-gray-600">Listings go live immediately without review</p>
                </div>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Daily Listings per User
                </label>
                <Input
                  type="number"
                  min="1"
                  value={settings.max_daily_listings}
                  onChange={(e) => handleInputChange('', 'max_daily_listings', parseInt(e.target.value))}
                  disabled={editingSection !== 'security'}
                  className={editingSection !== 'security' ? 'bg-gray-50' : ''}
                />
                <p className="text-xs text-gray-500 mt-1">Prevent spam by limiting daily listings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-purple-600" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.email_notifications}
                onChange={(e) => handleInputChange('', 'email_notifications', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Email Notifications</span>
                <p className="text-sm text-gray-600">Send email alerts for important events</p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.sms_notifications}
                onChange={(e) => handleInputChange('', 'sms_notifications', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">SMS Notifications</span>
                <p className="text-sm text-gray-600">Send SMS alerts for urgent matters</p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.admin_alerts}
                onChange={(e) => handleInputChange('', 'admin_alerts', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Admin Alerts</span>
                <p className="text-sm text-gray-600">Notify admins of suspicious activity</p>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* Legal Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-gray-600" />
              Legal Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terms of Service</label>
              <Textarea
                rows={4}
                value={settings.terms_of_service}
                onChange={(e) => handleInputChange('', 'terms_of_service', e.target.value)}
                placeholder="Enter your terms of service..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Privacy Policy</label>
              <Textarea
                rows={4}
                value={settings.privacy_policy}
                onChange={(e) => handleInputChange('', 'privacy_policy', e.target.value)}
                placeholder="Enter your privacy policy..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Refund Policy</label>
              <Textarea
                rows={4}
                value={settings.refund_policy}
                onChange={(e) => handleInputChange('', 'refund_policy', e.target.value)}
                placeholder="Enter your refund policy..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => handleSaveSettings()}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}
