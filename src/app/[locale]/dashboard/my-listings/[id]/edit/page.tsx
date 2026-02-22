'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getSupabaseClient } from '@/lib/supabase-client'

export default function EditListingPage({ params }: { params: { id: string; locale: string } }) {
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push(`/${params.locale}/login`)
      return
    }

    fetchListing()
  }, [params.id, user, router])

  const fetchListing = async () => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', params.id)
        .eq('seller_id', user?.id)
        .single()

      if (error) {
        console.error('Error fetching listing:', error)
        router.push(`/${params.locale}/dashboard/my-listings`)
        return
      }

      if (data) {
        setListing(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('listings')
        .update({
          title: listing.title,
          description: listing.description,
          price: listing.price,
          category: listing.category,
          location: listing.location,
        })
        .eq('id', params.id)
        .eq('seller_id', user?.id)

      if (error) {
        console.error('Error updating listing:', error)
        alert('Failed to update listing')
      } else {
        alert('Listing updated successfully!')
        router.push(`/${params.locale}/dashboard/my-listings`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to update listing')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
          <p className="text-gray-600">The listing you're trying to edit doesn't exist or you don't have permission to edit it.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Listing</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={listing.title}
                onChange={(e) => setListing({...listing, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter listing title"
                aria-label="Listing title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={listing.description}
                onChange={(e) => setListing({...listing, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter listing description"
                aria-label="Listing description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (RWF)
              </label>
              <input
                type="number"
                value={listing.price}
                onChange={(e) => setListing({...listing, price: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter price in RWF"
                aria-label="Listing price"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={listing.category}
                onChange={(e) => setListing({...listing, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                aria-label="Listing category"
                required
              >
                <option value="houses">Houses</option>
                <option value="land">Land</option>
                <option value="cars">Cars</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push(`/${params.locale}/dashboard/my-listings`)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
