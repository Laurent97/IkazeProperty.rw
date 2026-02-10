import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const body = await request.json()
    const { 
      listing_id, 
      promotion_type, 
      price,
      duration_days = 30 
    } = body

    if (!listing_id || !promotion_type || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate end date
    const start_date = new Date().toISOString()
    const end_date = new Date(Date.now() + duration_days * 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('promoted_listings')
      .insert({
        listing_id,
        promotion_type,
        start_date,
        end_date,
        price: parseFloat(price),
        paid: false
      })

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || 'Failed to create promotion' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        promotion_id: (data as any).id,
        payment_url: `/payment?promotion_id=${(data as any).id}&amount=${price}`
      }
    })

  } catch (error: any) {
    console.error('Create promotion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create promotion' },
      { status: 500 }
    )
  }
}
