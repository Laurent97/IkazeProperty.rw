import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { listing_id, message } = await request.json()

    if (!listing_id || !message) {
      return NextResponse.json(
        { error: 'Listing ID and message are required' },
        { status: 400 }
      )
    }

    // Get listing details
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('seller_id, title')
      .eq('id', listing_id)
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Check if user is not the seller
    if (listing.seller_id === currentUser.id) {
      return NextResponse.json(
        { error: 'Cannot inquire about your own listing' },
        { status: 400 }
      )
    }

    // Check if inquiry already exists
    const { data: existingInquiry } = await supabase
      .from('inquiries')
      .select('id')
      .eq('listing_id', listing_id)
      .eq('buyer_id', currentUser.id)
      .eq('status', 'pending')
      .single()

    if (existingInquiry) {
      return NextResponse.json(
        { error: 'You already have a pending inquiry for this listing' },
        { status: 400 }
      )
    }

    // Create inquiry
    const { data: inquiry, error: inquiryError } = await supabase
      .from('inquiries')
      .insert({
        listing_id,
        buyer_id: currentUser.id,
        seller_id: listing.seller_id,
        message,
        status: 'pending'
      })
      .select()
      .single()

    if (inquiryError) {
      return NextResponse.json(
        { error: 'Failed to create inquiry' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: inquiry
    })
  } catch (error) {
    console.error('Inquiry creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const role = searchParams.get('role') // 'buyer' or 'seller'

    let query = supabase
      .from('inquiries')
      .select(`
        *,
        listings(title, category, price),
        buyer:users!inquiries_buyer_id_fkey(email, full_name),
        seller:users!inquiries_seller_id_fkey(email, full_name)
      `)
      .order('created_at', { ascending: false })

    // Filter by user role
    if (role === 'buyer') {
      query = query.eq('buyer_id', currentUser.id)
    } else if (role === 'seller') {
      query = query.eq('seller_id', currentUser.id)
    } else {
      // Admin can see all inquiries
      const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('id', currentUser.id)
        .single()

      if (userProfile?.role !== 'admin') {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }
    }

    // Filter by status
    if (status) {
      query = query.eq('status', status)
    }

    const { data: inquiries, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch inquiries' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: inquiries
    })
  } catch (error) {
    console.error('Inquiry fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', currentUser.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const { inquiry_id, status, admin_notes } = await request.json()

    if (!inquiry_id || !status) {
      return NextResponse.json(
        { error: 'Inquiry ID and status are required' },
        { status: 400 }
      )
    }

    // Update inquiry
    const { data: inquiry, error } = await supabase
      .from('inquiries')
      .update({ status, admin_notes })
      .eq('id', inquiry_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update inquiry' },
        { status: 500 }
      )
    }

    // If approved, create a transaction record
    if (status === 'approved') {
      const { data: listing } = await supabase
        .from('listings')
        .select('price, commission_rate')
        .eq('id', inquiry.listing_id)
        .single()

      if (listing) {
        const commission_amount = Math.round(listing.price * listing.commission_rate)
        
        await supabase
          .from('transactions')
          .insert({
            listing_id: inquiry.listing_id,
            buyer_id: inquiry.buyer_id,
            seller_id: inquiry.seller_id,
            amount: listing.price,
            commission_amount,
            commission_rate: listing.commission_rate,
            status: 'pending'
          })
      }
    }

    return NextResponse.json({
      success: true,
      data: inquiry
    })
  } catch (error) {
    console.error('Inquiry update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
