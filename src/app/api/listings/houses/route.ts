import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    
    const supabase = getSupabaseClient()
    
    let query = supabase
      .from('listings')
      .select(`
        *,
        seller:users!listings_seller_id_fkey(
          id,
          full_name,
          email,
          avatar_url
        ),
        listing_media(
          id,
          url,
          public_id,
          media_type,
          order_index,
          is_primary
        ),
        house_details(
          id,
          listing_id,
          property_type,
          bedrooms,
          bathrooms,
          total_area,
          year_built,
          condition,
          furnished,
          parking,
          features,
          utilities_included,
          rent_duration,
          security_deposit,
          advance_payment,
          minimum_lease_period,
          available_from
        )
      `)
      .eq('category', 'houses')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
    
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Error fetching houses listings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch houses listings' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      listings: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
