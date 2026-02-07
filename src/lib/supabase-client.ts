import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Create a single Supabase client for the entire app
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }
})

// Export as default for backward compatibility
export default supabaseClient

// Helper function to fetch listings with proper error handling
export async function fetchListingsWithDetails(filters: {
  category?: string;
  searchQuery?: string;
  priceRange?: { min?: string; max?: string };
  subcategory?: string;
  condition?: string;
  sortBy?: string;
  limit?: number;
}) {
  try {
    const {
      category = 'other',
      searchQuery = '',
      priceRange = {},
      subcategory = '',
      condition = '',
      sortBy = 'created_at',
      limit = 50
    } = filters

    let query = supabaseClient
      .from('listings')
      .select(`
        *,
        seller:users!listings_seller_id_fkey(
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('status', 'available')
      .eq('category', category)

    // Apply text search
    if (searchQuery.trim()) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    }

    // Apply price range
    if (priceRange.min) {
      const min = parseInt(priceRange.min) || 0
      query = query.gte('price', min)
    }
    if (priceRange.max) {
      const max = parseInt(priceRange.max) || 1000000000
      query = query.lte('price', max)
    }

    // Apply sorting
    switch (sortBy) {
      case 'price':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'views':
        query = query.order('views', { ascending: false })
        break
      case 'likes':
        query = query.order('likes', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    query = query.limit(limit)

    const { data: listings, error: listingsError } = await query

    if (listingsError) {
      console.error('Error fetching listings:', listingsError)
      return { listings: [], error: listingsError }
    }

    if (!listings || listings.length === 0) {
      return { listings: [] }
    }

    // Fetch additional data in parallel
    const listingIds = (listings as any[]).map(l => l.id)
    
    const [mediaResult, detailsResult] = await Promise.all([
      supabaseClient
        .from('listing_media')
        .select('*')
        .in('listing_id', listingIds)
        .order('order_index', { ascending: true }),
      supabaseClient
        .from('other_item_details')
        .select('*')
        .in('listing_id', listingIds)
    ])

    // Process the data
    const listingsWithDetails = (listings as any[]).map(listing => {
      const listingMedia = mediaResult.data?.filter((m: any) => m.listing_id === listing.id) || []
      const listingDetails = detailsResult.data?.find((d: any) => d.listing_id === listing.id)

      return {
        ...listing,
        media: listingMedia.map((media: any) => ({
          url: media.url,
          public_id: media.public_id,
          media_type: media.media_type,
          is_primary: media.is_primary,
          order_index: media.order_index
        })),
        other_details: listingDetails ? {
          subcategory: (listingDetails as any).subcategory,
          brand: (listingDetails as any).brand,
          model: (listingDetails as any).model,
          condition: (listingDetails as any).condition,
          warranty_available: (listingDetails as any).warranty_available,
          warranty_period: (listingDetails as any).warranty_period,
          reason_for_selling: (listingDetails as any).reason_for_selling,
          original_purchase_date: (listingDetails as any).original_purchase_date,
          age_of_item: (listingDetails as any).age_of_item
        } : undefined
      }
    })

    // Apply additional filters after fetching
    let filteredListings = listingsWithDetails
    
    if (subcategory) {
      filteredListings = filteredListings.filter(l => 
        l.other_details?.subcategory === subcategory
      )
    }
    
    if (condition) {
      filteredListings = filteredListings.filter(l => 
        l.other_details?.condition === condition
      )
    }

    return { listings: filteredListings }
  } catch (error) {
    console.error('Error in fetchListingsWithDetails:', error)
    return { listings: [], error }
  }
}
