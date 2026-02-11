'use client'

import { useState } from 'react'
import { Settings, Save, Bell, Shield, Database, Globe, CreditCard, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    // Simulate saving settings
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    alert('Settings saved successfully!')
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'localization', name: 'Localization', icon: Globe },
    { id: 'payment', name: 'Payment', icon: CreditCard },
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
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" defaultValue="info@ikazeproperty.rw" />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input id="contactPhone" defaultValue="+250 788 123 456" />
                </div>
                <div>
                  <Label htmlFor="officeAddress">Office Address</Label>
                  <Input id="officeAddress" defaultValue="Kigali, Rwanda" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maxListings">Max Listings per User</Label>
                  <Input id="maxListings" type="number" defaultValue="10" />
                </div>
                <div>
                  <Label htmlFor="visitFee">Default Visit Fee (RWF)</Label>
                  <Input id="visitFee" type="number" defaultValue="10000" />
                </div>
                <div>
                  <Label htmlFor="platformFeePercent">Platform Fee (%)</Label>
                  <Input id="platformFeePercent" type="number" defaultValue="10" />
                </div>
                <div>
                  <Label htmlFor="featuredPrice">Featured Listing Price (RWF)</Label>
                  <Input id="featuredPrice" type="number" defaultValue="50000" />
                </div>
                <div>
                  <Label htmlFor="listingDuration">Listing Duration (days)</Label>
                  <Input id="listingDuration" type="number" defaultValue="30" />
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
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input id="smtpHost" placeholder="smtp.gmail.com" />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" type="number" defaultValue="587" />
                </div>
                <div>
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input id="smtpUser" placeholder="noreply@ikazeproperty.rw" />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input id="smtpPassword" type="password" />
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
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input id="apiKey" defaultValue="sk_test_..." readOnly />
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="webhookSecret">Webhook Secret</Label>
                  <div className="flex gap-2">
                    <Input id="webhookSecret" defaultValue="whsec_..." readOnly />
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
                      <Label htmlFor="dbHost">Database Host</Label>
                      <Input id="dbHost" defaultValue="localhost" />
                    </div>
                    <div>
                      <Label htmlFor="dbPort">Database Port</Label>
                      <Input id="dbPort" type="number" defaultValue="5432" />
                    </div>
                    <div>
                      <Label htmlFor="dbName">Database Name</Label>
                      <Input id="dbName" defaultValue="ikazeproperty" />
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
                      <Label htmlFor="backupFrequency">Backup Frequency</Label>
                      <select className="w-full px-3 py-2 border rounded-lg">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="backupRetention">Retention Period</Label>
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
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>English</option>
                    <option>French</option>
                    <option>Kinyarwanda</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="supportedLanguages">Supported Languages</Label>
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
                  <Label htmlFor="currency">Default Currency</Label>
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
                  <Label htmlFor="timezone">Timezone</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>Africa/Kigali</option>
                    <option>Africa/Nairobi</option>
                    <option>UTC</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>12-hour</option>
                    <option>24-hour</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="numberFormat">Number Format</Label>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Mobile Money</p>
                      <p className="text-sm text-gray-600">MTN, Airtel Money</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-gray-600">Direct bank transfers</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Credit Card</p>
                      <p className="text-sm text-gray-600">Visa, Mastercard</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paymentGateway">Payment Gateway</Label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>Flutterwave</option>
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
