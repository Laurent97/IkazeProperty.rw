import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase';
import { PaymentInitRequest, PaymentMethod, CryptoType } from '@/types/payment';
import { PaymentProcessorFactory } from '@/lib/payment/factory';

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const token = authorization.replace('Bearer ', '');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const body = await request.json();
    const {
      listing_id,
      payment_method,
      phone_number,
      crypto_type
    } = body as {
      listing_id: string;
      payment_method: PaymentMethod;
      phone_number?: string;
      crypto_type?: CryptoType;
    };

    if (!listing_id || !payment_method) {
      return NextResponse.json(
        { error: 'Missing required fields: listing_id, payment_method' },
        { status: 400 }
      );
    }

    const { data: listing, error: listingError } = await supabaseAdmin
      .from('listings')
      .select('id, seller_id, visit_fee_enabled, visit_fee_amount')
      .eq('id', listing_id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (!listing.visit_fee_enabled) {
      return NextResponse.json({ error: 'Visit fee is disabled for this listing' }, { status: 400 });
    }

    const visitFeeAmount = Number(listing.visit_fee_amount || 15000);
    const platformFee = Math.round(visitFeeAmount * 0.3);
    const sellerPayout = visitFeeAmount - platformFee;

    const paymentRequest: PaymentInitRequest = {
      user_id: user.id,
      payment_method,
      amount: visitFeeAmount,
      currency: 'RWF',
      transaction_type: 'visit_fee',
      listing_id: listing.id,
      description: 'Visit fee payment',
      phone_number,
      crypto_type
    };

    const result = await PaymentProcessorFactory.initiatePayment(paymentRequest);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Payment initiation failed' }, { status: 400 });
    }

    const { data: transaction } = await supabaseAdmin
      .from('payment_transactions')
      .select('id')
      .eq('our_reference', result.reference)
      .single();

    const { data: visitRequest, error: visitError } = await supabaseAdmin
      .from('visit_requests')
      .insert({
        listing_id: listing.id,
        buyer_id: user.id,
        seller_id: listing.seller_id,
        visit_fee_amount: visitFeeAmount,
        platform_fee: platformFee,
        seller_payout: sellerPayout,
        payment_transaction_id: transaction?.id || null,
        payment_reference: result.reference,
        status: 'pending_payment'
      })
      .select()
      .single();

    if (visitError) {
      return NextResponse.json({ error: visitError.message || 'Failed to create visit request' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      visit_request: visitRequest,
      payment: result
    });
  } catch (error: any) {
    console.error('Visit request error:', error);
    return NextResponse.json({ error: error.message || 'Failed to request visit' }, { status: 500 });
  }
}
