import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/auth'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ 
        error: 'Not authenticated' 
      }, { status: 401 })
    }

    const { listingId } = await request.json()
    
    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorite_listings')
      .select('*')
      .eq('user_id', user.id)
      .eq('listing_id', listingId)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Already favorited' }, { status: 409 })
    }

    // Add to favorites
    const { error } = await supabase
      .from('favorite_listings')
      .insert({
        user_id: user.id,
        listing_id: listingId
      } as any)

    if (error) {
      console.error('Error adding favorite:', error)
      return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 })
    }

    return NextResponse.json({ success: true, favorited: true })
  } catch (error: any) {
    console.error('Error in POST favorite:', error)
    
    // Handle authentication errors gracefully
    if (error.message?.includes('AuthSessionMissing') || error.status === 400) {
      return NextResponse.json({ 
        error: 'Not authenticated' 
      }, { status: 401 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ 
        error: 'Not authenticated' 
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listingId')

    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Remove from favorites
    const { error } = await supabase
      .from('favorite_listings')
      .delete()
      .eq('user_id', user.id)
      .eq('listing_id', listingId)

    if (error) {
      console.error('Error removing favorite:', error)
      return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 })
    }

    return NextResponse.json({ success: true, favorited: false })
  } catch (error: any) {
    console.error('Error in DELETE favorite:', error)
    
    // Handle authentication errors gracefully
    if (error.message?.includes('AuthSessionMissing') || error.status === 400) {
      return NextResponse.json({ 
        error: 'Not authenticated' 
      }, { status: 401 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        isFavorited: false,
        favorites: [],
        error: 'Not authenticated' 
      }, { status: 200 })
    }

    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listingId')

    const supabase = getSupabaseAdmin()

    if (listingId) {
      // Check if specific listing is favorited (existing functionality)
      const { data, error } = await supabase
        .from('favorite_listings')
        .select('*')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking favorite status:', error)
        return NextResponse.json({ error: 'Failed to check favorite status' }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        isFavorited: !!data 
      })
    } else {
      // Get all favorites with full listing data
      const { data, error } = await supabase
        .from('favorite_listings')
        .select(`
          listings (
            id,
            title,
            price,
            currency,
            category,
            status,
            location,
            views,
            likes,
            featured,
            created_at,
            listing_media (
              id,
              url,
              media_type,
              is_primary,
              order_index
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching favorites:', error)
        return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
      }

      const favorites = (data as any[] || []).map(fav => fav.listings).filter(Boolean)
      return NextResponse.json({ 
        success: true, 
        favorites 
      })
    }
  } catch (error: any) {
    console.error('Error in GET favorites:', error)
    
    // Handle authentication errors gracefully
    if (error.message?.includes('AuthSessionMissing') || error.status === 400) {
      return NextResponse.json({ 
        success: true, 
        isFavorited: false,
        favorites: [],
        error: 'Not authenticated' 
      }, { status: 200 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
