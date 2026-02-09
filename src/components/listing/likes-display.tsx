'use client'

import { useState, useEffect } from 'react'
import { Heart, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { supabase } from '@/lib/auth'

interface LikesDisplayProps {
  listingId: string
  likesCount: number
  className?: string
}

interface User {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
}

interface LikeWithUser {
  user_id: string
  created_at: string
  users: User
}

export default function LikesDisplay({ listingId, likesCount, className = '' }: LikesDisplayProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchLikedUsers = async () => {
    if (likesCount === 0) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('listing_likes')
        .select(`
          user_id,
          created_at,
          users!listing_likes_user_id_fkey (
            id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      const typedData = data as LikeWithUser[] | null
      const uniqueUsers = (typedData || []).map(item => item.users).filter(Boolean)
      setUsers(uniqueUsers as User[])
    } catch (error) {
      console.error('Error fetching liked users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen && users.length === 0) {
      fetchLikedUsers()
    }
  }

  if (likesCount === 0) {
    return (
      <div className={`flex items-center gap-1 text-gray-500 ${className}`}>
        <Heart className="h-4 w-4" />
        <span className="text-sm">No likes yet</span>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className={`flex items-center gap-1 text-gray-600 hover:text-red-600 ${className}`}>
          <Heart className="h-4 w-4" />
          <span className="text-sm font-medium">{likesCount}</span>
          <span className="text-xs text-gray-500">likes</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            People who liked this listing
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No one has liked this listing yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar_url || ''} alt={user.full_name || ''} />
                    <AvatarFallback>
                      {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {user.full_name || 'Anonymous User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email || 'No email'}
                    </p>
                  </div>
                </div>
              ))}
              {users.length < likesCount && (
                <div className="text-center py-2 text-sm text-gray-500">
                  And {likesCount - users.length} more...
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
