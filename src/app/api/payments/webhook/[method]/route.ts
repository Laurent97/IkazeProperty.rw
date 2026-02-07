import { NextRequest, NextResponse } from 'next/server';
import { PaymentProcessorFactory } from '@/lib/payment/factory';
import { PaymentMethod } from '@/types/payment';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ method: string }> }
) {
  try {
    const { method } = await params;
    const paymentMethod = method as PaymentMethod;
    
    // Validate payment method
    if (!PaymentProcessorFactory.getSupportedMethods().includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Process webhook
    await PaymentProcessorFactory.processWebhook(paymentMethod, body);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
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
