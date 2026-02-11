import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = getSupabaseAdmin()

    // Fetch the listing with all related data
    const { data: listing, error } = await supabase
      .from('listings')
      .select(`
        *,
        seller:users!listings_seller_id_fkey(
          id,
          full_name,
          email,
          avatar_url
        ),
        land_details:land_details(*),
        house_details:house_details(*),
        car_details:car_details(*),
        media:listing_media(
          url,
          media_type,
          is_primary,
          order_index
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching listing:', error)
      return NextResponse.json(
        { error: 'Failed to fetch listing' },
        { status: 500 }
      )
    }

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      listing
    })

  } catch (error) {
    console.error('Error in admin listing detail API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
