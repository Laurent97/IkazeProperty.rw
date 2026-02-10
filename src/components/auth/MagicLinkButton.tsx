'use client'

import { signInWithMagicLink } from '@/lib/auth'
import { useState } from 'react'
import { Mail } from 'lucide-react'

export default function MagicLinkButton() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [message, setMessage] = useState('')

  const handleMagicLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!email.trim()) {
      setMessage('Please enter your email address')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      await signInWithMagicLink(email)
      setMessage('✅ Magic link sent! Check your email.')
      setTimeout(() => {
        setShowInput(false)
        setEmail('')
        setMessage('')
      }, 3000)
    } catch (error: any) {
      setMessage('❌ ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (showInput) {
    return (
      <div className="space-y-3">
        <form onSubmit={handleMagicLink} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Link'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowInput(false)
                setEmail('')
                setMessage('')
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
        {message && (
          <p className="text-sm text-center">{message}</p>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowInput(true)}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
    >
      <Mail className="w-5 h-5" />
      Sign in with Magic Link
    </button>
  )
}
