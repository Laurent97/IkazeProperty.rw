import { NextRequest, NextResponse } from 'next/server';
import { PaymentProcessorFactory } from '@/lib/payment/factory';
import { PaymentMethod } from '@/types/payment';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.payment_method || !body.reference) {
      return NextResponse.json(
        { error: 'Missing required fields: payment_method, reference' },
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

    // Process payment verification
    const result = await PaymentProcessorFactory.verifyPayment(
      body.payment_method as PaymentMethod,
      body.reference
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
