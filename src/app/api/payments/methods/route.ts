import { NextResponse } from 'next/server';
import { PaymentProcessorFactory } from '@/lib/payment/factory';
import { PaymentMethodOption } from '@/types/payment';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Get supported payment methods
    const supportedMethods = PaymentProcessorFactory.getSupportedMethods();
    
    // Get payment configurations to check active status
    const { data: configurations } = await supabaseAdmin
      .from('payment_configurations')
      .select('payment_method, is_active')
      .in('payment_method', supportedMethods);

    const paymentMethodOptions: PaymentMethodOption[] = [
      {
        id: 'wallet',
        name: 'Wallet Balance',
        displayName: 'Wallet Balance',
        icon: '/icons/wallet.svg',
        description: 'Pay using your wallet balance',
        isActive: configurations?.find(c => c.payment_method === 'wallet')?.is_active ?? true,
        requiresPhone: false,
        requiresCryptoSelection: false
      },
      {
        id: 'mtn_momo',
        name: 'MTN Mobile Money',
        displayName: 'MTN Mobile Money',
        icon: '/icons/mtn-momo.png',
        description: 'Pay with MTN Mobile Money',
        isActive: configurations?.find(c => c.payment_method === 'mtn_momo')?.is_active ?? false,
        requiresPhone: true,
        requiresCryptoSelection: false
      },
      {
        id: 'airtel_money',
        name: 'Airtel Money',
        displayName: 'Airtel Money',
        icon: '/icons/airtel-money.png',
        description: 'Pay with Airtel Money',
        isActive: configurations?.find(c => c.payment_method === 'airtel_money')?.is_active ?? false,
        requiresPhone: true,
        requiresCryptoSelection: false
      },
      {
        id: 'equity_bank',
        name: 'Equity Bank',
        displayName: 'Equity Bank',
        icon: '/icons/equity-bank.png',
        description: 'Pay with Equity Bank account',
        isActive: configurations?.find(c => c.payment_method === 'equity_bank')?.is_active ?? false,
        requiresPhone: false,
        requiresCryptoSelection: false
      },
      {
        id: 'crypto',
        name: 'Cryptocurrency',
        displayName: 'Cryptocurrency',
        icon: '/icons/crypto.png',
        description: 'Pay with Bitcoin, Ethereum, or USDT',
        isActive: configurations?.find(c => c.payment_method === 'crypto')?.is_active ?? false,
        requiresPhone: false,
        requiresCryptoSelection: true,
        supportedCryptos: ['bitcoin', 'ethereum', 'usdt']
      }
    ];

    return NextResponse.json({
      methods: paymentMethodOptions,
      supported: supportedMethods
    });
  } catch (error: any) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
