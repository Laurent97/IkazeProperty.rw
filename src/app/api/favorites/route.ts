import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/auth'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
  } catch (error) {
    console.error('Error in POST favorite:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
  } catch (error) {
    console.error('Error in DELETE favorite:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listingId')

    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Check if favorited
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
  } catch (error) {
    console.error('Error in GET favorite:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
