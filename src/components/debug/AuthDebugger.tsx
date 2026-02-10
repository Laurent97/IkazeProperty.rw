'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'

export default function AuthDebugger() {
  const { user, isLoading, sessionError } = useAuth()

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleClearStorage = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
  }

  if (process.env.NODE_ENV === 'production') {
    return null // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : sessionError ? (
              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            ) : user ? (
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
            )}
            Auth Status
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div>
            <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>User:</strong> {user ? user.email : 'Not logged in'}
          </div>
          {sessionError && (
            <div>
              <strong>Error:</strong> {sessionError}
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={handleRefresh}>
              Refresh
            </Button>
            <Button size="sm" variant="outline" onClick={handleClearStorage}>
              Clear Storage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
