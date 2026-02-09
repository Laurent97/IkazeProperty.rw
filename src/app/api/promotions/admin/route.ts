import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    // Get pending promotion payments with related data
    const { data, error } = await supabaseAdmin
      .from('listing_promotions')
      .select(`
        *,
        listing:listings(
          id,
          title,
          category,
          price,
          currency,
          seller:users!listings_seller_id_fkey(
            email,
            full_name,
            phone_number
          )
        ),
        package:promotion_packages(
          id,
          name,
          description,
          price,
          duration_days
        ),
        payment_transaction:payment_transactions(
          id,
          amount,
          currency,
          payment_method,
          status,
          payment_proof_url,
          created_at
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching pending promotions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch pending promotions' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })

  } catch (error: any) {
    console.error('Admin promotions API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { promotion_id, action, admin_notes } = body

    if (!promotion_id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: promotion_id, action' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be approve or reject' },
        { status: 400 }
      )
    }

    // Get the promotion details first
    const { data: promotion, error: fetchError } = await supabaseAdmin
      .from('listing_promotions')
      .select('*')
      .eq('id', promotion_id)
      .single()

    if (fetchError || !promotion) {
      return NextResponse.json(
        { error: 'Promotion not found' },
        { status: 404 }
      )
    }

    // Update promotion status
    const updateData: any = {
      status: action === 'approve' ? 'active' : 'cancelled',
      admin_notes: admin_notes || `Promotion ${action}d by admin`,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('listing_promotions')
      .update(updateData)
      .eq('id', promotion_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating promotion:', error)
      return NextResponse.json(
        { error: 'Failed to update promotion' },
        { status: 500 }
      )
    }

    // If approved, activate the promotion
    if (action === 'approve') {
      // Update payment transaction status
      if (promotion.payment_transaction_id) {
        await supabaseAdmin
          .from('payment_transactions')
          .update({
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', promotion.payment_transaction_id)
      }

      // Update listing to be promoted
      await supabaseAdmin
        .from('listings')
        .update({
          promoted: true,
          featured: promotion.package?.name?.toLowerCase().includes('featured') || false,
          updated_at: new Date().toISOString()
        })
        .eq('id', promotion.listing_id)
    }

    return NextResponse.json({
      success: true,
      data: {
        promotion: data,
        action: action,
        message: `Promotion ${action}d successfully`
      }
    })

  } catch (error: any) {
    console.error('Admin promotion action error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
