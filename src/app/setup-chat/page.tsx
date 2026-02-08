'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SetupChatPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')

  const setupChatTable = async () => {
    try {
      setLoading(true)
      setResult('')

      const response = await fetch('/api/setup/chat-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setResult(`✅ Success: ${data.message}`)
      } else {
        setResult(`❌ Error: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Setup Chat Table</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Click the button below to create the inquiry_chats table needed for the chat functionality.
          </p>
          
          <Button
            onClick={setupChatTable}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Setting up...' : 'Setup Chat Table'}
          </Button>

          {result && (
            <div className={`p-3 rounded text-sm ${result.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {result}
            </div>
          )}

          <div className="text-xs text-gray-500">
            <p className="font-medium">If this doesn't work:</p>
            <p>1. Go to your Supabase dashboard</p>
            <p>2. Navigate to SQL Editor</p>
            <p>3. Run the SQL from: supabase/20260208_create_inquiry_chats_table.sql</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
