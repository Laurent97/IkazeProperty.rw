'use client'

import { useState } from 'react'
import { MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

interface InquiryButtonProps {
  listingId: string
  sellerId: string
  title: string
  className?: string
}

export default function InquiryButton({ 
  listingId, 
  sellerId, 
  title, 
  className = '' 
}: InquiryButtonProps) {
  const { user, isLoading } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!user) {
        window.location.href = '/auth/login'
        return
      }

      // Get session token for authorization
      const { supabaseClient } = await import('@/lib/supabase-client')
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      if (!session?.access_token) {
        setError('Authentication session expired. Please log in again.')
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          listing_id: listingId,
          message: message.trim()
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit inquiry')
      }

      setSuccess(true)
      setMessage('')
      setTimeout(() => {
        setShowModal(false)
        setSuccess(false)
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry')
    } finally {
      setLoading(false)
    }
  }

  const handleButtonClick = () => {
    if (!user) {
      window.location.href = '/auth/login'
      return
    }
    setShowModal(true)
  }

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Express Interest
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Listing: <strong>{title}</strong>
              </p>
            </div>

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-green-800 mb-1">Inquiry Submitted!</h4>
                <p className="text-sm text-green-700">
                  Your inquiry has been sent for admin review. You'll be notified once it's approved.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-red-800 text-sm">{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Introduce yourself and express your interest in this listing..."
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {loading ? 'Submitting...' : 'Submit Inquiry'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Button
      onClick={handleButtonClick}
      disabled={isLoading}
      className={`bg-red-600 hover:bg-red-700 ${className}`}
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      {isLoading ? 'Loading...' : (user ? 'Express Interest' : 'Login to Inquire')}
    </Button>
  )
}
