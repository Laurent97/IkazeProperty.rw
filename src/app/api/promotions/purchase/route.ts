import { NextRequest, NextResponse } from 'next/server';
import { PromotionRequest, PaymentInitRequest } from '@/types/payment';
import { PaymentProcessorFactory } from '@/lib/payment/factory';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body: PromotionRequest = await request.json();
    
    // Validate required fields
    if (!body.listing_id || !body.package_id || !body.payment_method) {
      return NextResponse.json(
        { error: 'Missing required fields: listing_id, package_id, payment_method' },
        { status: 400 }
      );
    }

    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authorization.replace('Bearer ', '');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get promotion package details
    const { data: packageData, error: packageError } = await supabaseAdmin
      .from('promotion_packages')
      .select('*')
      .eq('id', body.package_id)
      .eq('is_active', true)
      .single();

    if (packageError || !packageData) {
      return NextResponse.json(
        { error: 'Promotion package not found or inactive' },
        { status: 404 }
      );
    }

    // Verify listing ownership
    const { data: listingData } = await supabaseAdmin
      .from('listings')
      .select('seller_id')
      .eq('id', body.listing_id)
      .single();

    if (listingData?.seller_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only promote your own listings' },
        { status: 403 }
      );
    }

    // Check if promotion already exists
    const { data: existingPromotion } = await supabaseAdmin
      .from('listing_promotions')
      .select('*')
      .eq('listing_id', body.listing_id)
      .eq('package_id', body.package_id)
      .eq('status', 'active')
      .single();

    if (existingPromotion) {
      return NextResponse.json(
        { error: 'This promotion is already active for this listing' },
        { status: 400 }
      );
    }

    // Create payment request
    const paymentRequest: PaymentInitRequest = {
      user_id: user.id,
      payment_method: body.payment_method,
      amount: packageData.price,
      currency: 'RWF',
      transaction_type: 'ad_promotion',
      listing_id: body.listing_id,
      description: `Promotion: ${packageData.name} for listing`,
      metadata: {
        package_id: body.package_id,
        package_name: packageData.name,
        duration_days: packageData.duration_days
      },
      phone_number: body.phone_number,
      crypto_type: body.crypto_type
    };

    // Process payment
    const paymentResult = await PaymentProcessorFactory.initiatePayment(paymentRequest);

    if (paymentResult.success) {
      // Create promotion record (will be activated after payment confirmation)
      const promotionData = {
        listing_id: body.listing_id,
        package_id: body.package_id,
        payment_transaction_id: paymentResult.reference,
        status: 'pending',
        starts_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + packageData.duration_days * 24 * 60 * 60 * 1000).toISOString()
      };

      const { data: promotion, error: promotionError } = await supabaseAdmin
        .from('listing_promotions')
        .insert(promotionData)
        .select()
        .single();

      if (promotionError) {
        console.error('Error creating promotion record:', promotionError);
      }

      return NextResponse.json({
        success: true,
        payment: paymentResult,
        promotion: promotion
      });
    } else {
      return NextResponse.json(
        { error: paymentResult.error },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Promotion purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
