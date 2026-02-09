'use client'

import { useState, useEffect } from 'react'
import { Eye, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { supabase } from '@/lib/auth'

interface ViewsDisplayProps {
  listingId: string
  viewsCount: number
  className?: string
}

interface ViewRecord {
  id: string
  user_id: string | null
  ip_address: string | null
  user_agent: string | null
  viewed_at: string
  users?: {
    id: string
    full_name: string | null
    email: string | null
    avatar_url: string | null
  }
}

export default function ViewsDisplay({ listingId, viewsCount, className = '' }: ViewsDisplayProps) {
  const [views, setViews] = useState<ViewRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchViews = async () => {
    if (viewsCount === 0) return
    
    setLoading(true)
    try {
      // Get views from the new listing_views table
      const { data: viewData, error: viewError } = await supabase
        .from('listing_views')
        .select(`
          id,
          user_id,
          ip_address,
          user_agent,
          viewed_at,
          users!listing_views_user_id_fkey (
            id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('listing_id', listingId)
        .order('viewed_at', { ascending: false })
        .limit(20)

      if (viewError) {
        console.error('Error fetching views:', viewError)
        setViews([])
      } else {
        setViews(viewData || [])
      }
    } catch (error) {
      console.error('Error fetching views:', error)
      setViews([])
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen && views.length === 0) {
      fetchViews()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  if (viewsCount === 0) {
    return (
      <div className={`flex items-center gap-1 text-gray-500 ${className}`}>
        <Eye className="h-4 w-4" />
        <span className="text-sm">No views yet</span>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className={`flex items-center gap-1 text-gray-600 hover:text-blue-600 ${className}`}>
          <Eye className="h-4 w-4" />
          <span className="text-sm font-medium">{viewsCount}</span>
          <span className="text-xs text-gray-500">views</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            Recent views
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : views.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No views recorded yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {views.map((view) => (
                <div key={view.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    {view.users ? (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {view.users.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Eye className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {view.users?.full_name || 'Anonymous Visitor'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(view.viewed_at)}
                      {view.ip_address && ` • ${view.ip_address}`}
                    </p>
                  </div>
                </div>
              ))}
              {views.length < viewsCount && (
                <div className="text-center py-2 text-sm text-gray-500">
                  And {viewsCount - views.length} more views...
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
