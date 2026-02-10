import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables:', {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey
      })
      throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
    }

    // Create a single Supabase client for the entire app
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        flowType: 'pkce',
      },
      global: {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      },
      db: {
        schema: 'public'
      }
    })
  }
  return supabaseClient
}

// Export as default for backward compatibility
export default getSupabaseClient

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

    // Use the new API routes instead of direct Supabase queries
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const apiUrl = new URL(`/api/listings/${category}`, baseUrl)
    
    // Add query parameters
    if (searchQuery) apiUrl.searchParams.set('search', searchQuery)
    if (priceRange.min) apiUrl.searchParams.set('min', priceRange.min)
    if (priceRange.max) apiUrl.searchParams.set('max', priceRange.max)
    if (subcategory) apiUrl.searchParams.set('subcategory', subcategory)
    if (condition) apiUrl.searchParams.set('condition', condition)
    if (sortBy) apiUrl.searchParams.set('sort', sortBy)
    if (limit) apiUrl.searchParams.set('limit', limit.toString())
    
    const response = await fetch(apiUrl.toString())
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', errorText)
      return { listings: [], error: errorText }
    }
    
    const data = await response.json()
    return { listings: data.listings || [], error: null }
  } catch (error) {
    console.error('Error in fetchListingsWithDetails:', error)
    return { listings: [], error: (error as Error).message }
  }
}
