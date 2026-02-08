'use client'

import { useEffect, useState } from 'react'

export default function EnvTestPage() {
  const [envVars, setEnvVars] = useState({
    supabaseUrl: '',
    supabaseAnonKey: '',
    hasUrl: false,
    hasKey: false
  })

  useEffect(() => {
    // Check if environment variables are available on client side
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setEnvVars({
      supabaseUrl: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'NOT FOUND',
      supabaseAnonKey: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NOT FOUND',
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Environment Variables Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg">NEXT_PUBLIC_SUPABASE_URL:</h3>
            <p className={`font-mono ${envVars.hasUrl ? 'text-green-600' : 'text-red-600'}`}>
              {envVars.supabaseUrl}
            </p>
            <p className="text-sm text-gray-600">
              Status: {envVars.hasUrl ? '✅ Available' : '❌ Missing'}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">NEXT_PUBLIC_SUPABASE_ANON_KEY:</h3>
            <p className={`font-mono ${envVars.hasKey ? 'text-green-600' : 'text-red-600'}`}>
              {envVars.supabaseAnonKey}
            </p>
            <p className="text-sm text-gray-600">
              Status: {envVars.hasKey ? '✅ Available' : '❌ Missing'}
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Next Steps:</h3>
            {envVars.hasUrl && envVars.hasKey ? (
              <p className="text-green-600">✅ Environment variables are properly loaded!</p>
            ) : (
              <div className="text-red-600">
                <p>❌ Environment variables are missing on client side</p>
                <p className="text-sm mt-2">
                  Check that your .env.local file is in the project root and restart the dev server.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
