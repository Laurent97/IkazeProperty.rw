'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/auth'

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    admin_phone: '',
    whatsapp_phone: '',
    support_email: '',
    office_address: ''
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/site-settings')
      const data = await response.json()
      if (response.ok && data?.settings) {
        setFormData(data.settings)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setError('You must be logged in')
        return
      }

      const response = await fetch('/api/site-settings/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to save settings')
        return
      }

      setSuccess('Settings saved successfully')
    } catch (err: any) {
      setError(err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading site settings...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Site Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Default Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <div>
            <Label htmlFor="admin_phone">Admin Phone</Label>
            <Input
              id="admin_phone"
              value={formData.admin_phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, admin_phone: e.target.value })
              }
              placeholder={process.env.NEXT_PUBLIC_PLATFORM_PHONE || '+250 XXX XXX XXX'}
            />
          </div>

          <div>
            <Label htmlFor="whatsapp_phone">WhatsApp Phone</Label>
            <Input
              id="whatsapp_phone"
              value={formData.whatsapp_phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, whatsapp_phone: e.target.value })
              }
              placeholder={process.env.NEXT_PUBLIC_PLATFORM_WHATSAPP || '+250 XXX XXX XXX'}
            />
          </div>

          <div>
            <Label htmlFor="support_email">Support Email</Label>
            <Input
              id="support_email"
              value={formData.support_email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, support_email: e.target.value })
              }
              placeholder={process.env.NEXT_PUBLIC_PLATFORM_EMAIL || 'contact@ikazeproperty.rw'}
            />
          </div>

          <div>
            <Label htmlFor="office_address">Office Address</Label>
            <Input
              id="office_address"
              value={formData.office_address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, office_address: e.target.value })
              }
              placeholder="KN 123 St, Kiyovu"
            />
          </div>

          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-green-600">WhatsApp Customer Service</h3>
            <p className="text-sm text-gray-600 mb-4">
              Update your WhatsApp customer service number and test the connection
            </p>
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-sm font-medium text-gray-700">Current WhatsApp Number:</p>
              <p className="text-lg font-bold text-green-600">{formData.whatsapp_phone || 'Not set'}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button
              onClick={() => window.open(`https://wa.me/${formData.whatsapp_phone?.replace(/[^\d]/g, '')}`, '_blank')}
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-50"
              disabled={!formData.whatsapp_phone}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Test WhatsApp Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
