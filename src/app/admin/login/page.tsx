'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCurrentUser, getUserProfile } from '@/lib/auth'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [autoAuthenticating, setAutoAuthenticating] = useState(true)
  const router = useRouter()

  // Check if user is already authenticated with main app
  useEffect(() => {
    checkMainAppAuth()
  }, [])

  const checkMainAppAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        setAutoAuthenticating(false)
        return
      }

      // Check if user has admin role
      const profile = await getUserProfile(currentUser.id) as any
      if (profile && profile.role === 'admin') {
        // Auto-authenticate admin system
        document.cookie = 'admin-token=authenticated; path=/admin; max-age=86400'
        router.push('/admin')
      } else {
        setAutoAuthenticating(false)
        setError('Access denied. Admin privileges required.')
      }
    } catch (error) {
      console.error('Error checking main app auth:', error)
      setAutoAuthenticating(false)
      setError('Authentication check failed. Please try manual login.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Simulate authentication - replace with actual API call
      if (email === 'admin@example.com' && password === 'admin123') {
        // Set authentication cookie
        document.cookie = 'admin-token=authenticated; path=/admin; max-age=86400'
        router.push('/admin')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Simulate authentication - replace with actual API call
      if (email === 'admin@example.com' && password === 'admin123') {
        // Set authentication cookie
        document.cookie = 'admin-token=authenticated; path=/admin; max-age=86400'
        router.push('/admin')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <p className="text-gray-600 mt-2">Sign in to access the admin panel</p>
          </CardHeader>
          <CardContent>
            {autoAuthenticating ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Checking authentication...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            ) : (
              <form onSubmit={handleManualLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
              
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            )}
            
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-gray-600">
                Demo credentials: admin@example.com / admin123
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Already authenticated?{' '}
                <button 
                  type="button" 
                  onClick={checkMainAppAuth}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Check main app authentication
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
