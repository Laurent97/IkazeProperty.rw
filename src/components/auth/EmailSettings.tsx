'use client'

import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { changeUserEmail } from '@/lib/auth'

export default function EmailSettings({ user }: { user: any }) {
  const [email, setEmail] = useState(user?.email || '')
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showChangeForm, setShowChangeForm] = useState(false)

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newEmail.trim()) {
      setMessage('Please enter a new email address')
      return
    }

    if (newEmail === email) {
      setMessage('New email must be different from current email')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      await changeUserEmail(newEmail)
      setMessage('✅ Confirmation email sent! Please check your new email inbox.')
      setEmail(newEmail)
      setNewEmail('')
      setTimeout(() => {
        setShowChangeForm(false)
        setMessage('')
      }, 3000)
    } catch (error: any) {
      setMessage('❌ ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="h-5 w-5 mr-2 text-blue-600" />
          Email Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Email Address
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="email"
              value={email}
              disabled
              aria-label="Current email address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
            <div className="relative group">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Verified
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This email is verified and used for account notifications
          </p>
        </div>

        {/* Change Email Button */}
        {!showChangeForm ? (
          <Button
            onClick={() => setShowChangeForm(true)}
            variant="outline"
            className="w-full"
          >
            Change Email Address
          </Button>
        ) : (
          /* Email Change Form */
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email address"
                aria-label="New email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {message && (
              <div className={`flex items-center p-3 rounded-lg ${
                message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message.includes('✅') ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-2" />
                )}
                <span className="text-sm">{message.replace('✅ ', '').replace('❌ ', '')}</span>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Sending...' : 'Send Confirmation'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowChangeForm(false)
                  setNewEmail('')
                  setMessage('')
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Email Change Process:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Enter your new email address</li>
            <li>Click "Send Confirmation" button</li>
            <li>Check your new email inbox for confirmation link</li>
            <li>Click the link to complete the change</li>
            <li>Your old email will no longer work for login</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
