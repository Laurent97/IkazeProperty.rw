import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PaymentProcessorFactory } from '@/lib/payment/factory'
import { PaymentInitRequest } from '@/types/payment'

// Legacy providers list (kept for backward compatibility)
const MOMO_PROVIDERS = [
  { name: 'MTN', code: 'MTN_RW' },
  { name: 'Airtel', code: 'AIRTEL_RW' },
  { name: 'Tigo', code: 'TIGO_RW' }
]

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization')
    if (!authorization) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    const token = authorization.replace('Bearer ', '')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      amount, 
      payment_method, 
      phone_number,
      crypto_type,
      listing_id,
      ad_campaign_id,
      transaction_type,
      description,
      metadata,
      promotion_id
    } = body

    if (!amount || !payment_method) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, payment_method' },
        { status: 400 }
      )
    }

    const paymentRequest: PaymentInitRequest = {
      user_id: user.id,
      payment_method,
      amount: parseFloat(amount),
      currency: 'RWF',
      transaction_type: transaction_type || (promotion_id ? 'ad_promotion' : 'payment'),
      listing_id,
      ad_campaign_id,
      description,
      metadata: {
        ...metadata,
        promotion_id
      },
      phone_number,
      crypto_type
    }

    const result = await PaymentProcessorFactory.initiatePayment(paymentRequest)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Payment processing failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error: any) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    providers: MOMO_PROVIDERS
  })
}
