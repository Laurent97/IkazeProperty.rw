import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase';
import { PaymentMethod, CryptoType } from '@/types/payment';

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
      visit_fee,
      phone_number,
      account_name,
      merchant_id,
      bank_name,
      account_number,
      branch_code,
      crypto_type,
      wallet_address
    } = body as {
      listing_id: string;
      payment_method: PaymentMethod;
      visit_fee?: number;
      phone_number?: string;
      account_name?: string;
      merchant_id?: string;
      bank_name?: string;
      account_number?: string;
      branch_code?: string;
      crypto_type?: CryptoType;
      wallet_address?: string;
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

    // For now, bypass the complex payment processor and create a simple reference
    const reference = `VISIT${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // Create a simple transaction record (optional for now)
    try {
      await supabaseAdmin
        .from('payment_transactions')
        .insert({
          user_id: user.id,
          listing_id: listing.id,
          payment_method: payment_method,
          amount: visitFeeAmount,
          currency: 'RWF',
          transaction_type: 'visit_fee',
          status: 'pending',
          our_reference: reference,
          description: 'Visit fee payment',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours expiry
        });
    } catch (transactionError) {
      console.error('Failed to create transaction record:', transactionError);
      // Continue even if transaction creation fails
    }

    const { data: visitRequest, error: visitError } = await supabaseAdmin
      .from('visit_requests')
      .insert({
        listing_id: listing.id,
        buyer_id: user.id,
        seller_id: listing.seller_id,
        visit_fee_amount: visitFeeAmount,
        platform_fee: platformFee,
        seller_payout: sellerPayout,
        payment_transaction_id: null,
        payment_reference: reference,
        status: 'pending_payment'
      })
      .select()
      .single();

    console.log('Visit request creation result:', { visitRequest, visitError, listingId: listing.id, buyerId: user.id, sellerId: listing.seller_id });

    if (visitError) {
      return NextResponse.json({ error: visitError.message || 'Failed to create visit request' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      visit_request: visitRequest,
      payment: {
        reference: reference,
        instructions: 'Please complete the payment using the provided payment details and upload proof of payment.'
      }
    });
  } catch (error: any) {
    console.error('Visit request error:', error);
    return NextResponse.json({ error: error.message || 'Failed to request visit' }, { status: 500 });
  }
}
