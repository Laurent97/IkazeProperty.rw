'use client'

import { useState } from 'react'
import { Eye, Lock, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WatermarkAccessRequestProps {
  listingId: string
  className?: string
}

export default function WatermarkAccessRequest({ listingId, className = '' }: WatermarkAccessRequestProps) {
  const [isRequesting, setIsRequesting] = useState(false)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [error, setError] = useState('')

  const requestAccess = async () => {
    setIsRequesting(true)
    setError('')

    try {
      const response = await fetch('/api/watermark-policy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_session',
          listingId,
          durationHours: 1 // 1 hour access
        })
      })

      const data = await response.json()

      if (data.success) {
        setSessionToken(data.sessionToken)
        setExpiresAt(data.expiresAt)
        // Reload the page to apply the new permissions
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        setError(data.error || 'Failed to request access')
      }
    } catch (err) {
      setError('Failed to request access')
    } finally {
      setIsRequesting(false)
    }
  }

  if (sessionToken) {
    return (
      <div className={`flex items-center gap-2 text-xs text-green-600 ${className}`}>
        <CheckCircle className="h-3 w-3" />
        <span>Access granted until {new Date(expiresAt || '').toLocaleTimeString()}</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Lock className="h-3 w-3" />
        <span>Details restricted</span>
      </div>
      <Button
        onClick={requestAccess}
        disabled={isRequesting}
        variant="outline"
        size="sm"
        className="text-xs h-6 px-2"
      >
        {isRequesting ? (
          <>
            <Clock className="h-3 w-3 animate-spin" />
            Requesting...
          </>
        ) : (
          <>
            <Eye className="h-3 w-3" />
            Request Access
          </>
        )}
      </Button>
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  )
}
