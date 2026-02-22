import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Debug version of inquiries API that bypasses all RLS
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Debug inquiry API called')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing environment variables')
      return NextResponse.json(
        { error: 'Missing environment variables' },
        { status: 500 }
      )
    }

    // Create admin client that bypasses RLS completely
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get auth header
    const authHeader = request.headers.get('authorization')
    console.log('🔍 Auth header:', authHeader ? 'Present' : 'Missing')
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    console.log('🔍 Auth result:', { user: user?.email, error: authError?.message })
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token', details: authError?.message },
        { status: 401 }
      )
    }

    const { listing_id, message } = await request.json()
    console.log('🔍 Request data:', { listing_id, message })

    if (!listing_id || !message) {
      return NextResponse.json(
        { error: 'Listing ID and message are required' },
        { status: 400 }
      )
    }

    // Get listing details using admin client
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('seller_id, title')
      .eq('id', listing_id)
      .single()

    console.log('🔍 Listing result:', { listing, error: listingError?.message })

    if (listingError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found', details: listingError?.message },
        { status: 404 }
      )
    }

    // Check if user is not the seller
    if (listing.seller_id === user.id) {
      return NextResponse.json(
        { error: 'Cannot inquire about your own listing' },
        { status: 400 }
      )
    }

    // Create inquiry using admin client (bypasses RLS)
    const { data: inquiry, error: inquiryError } = await supabase
      .from('inquiries')
      .insert({
        listing_id,
        buyer_id: user.id,
        seller_id: listing.seller_id,
        message,
        status: 'pending'
      })
      .select()
      .single()

    console.log('🔍 Inquiry result:', { inquiry, error: inquiryError?.message })

    if (inquiryError) {
      return NextResponse.json(
        { error: 'Failed to create inquiry', details: inquiryError?.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: inquiry
    })

  } catch (error) {
    console.error('💥 Debug inquiry API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
