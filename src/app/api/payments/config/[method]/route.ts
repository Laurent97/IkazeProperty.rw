import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { PaymentMethod } from '@/types/payment';

const SUPPORTED_METHODS: PaymentMethod[] = [
  'mtn_momo',
  'airtel_money',
  'equity_bank',
  'crypto',
  'wallet'
];

const pick = (source: Record<string, any>, keys: string[]) =>
  keys.reduce((acc, key) => {
    if (source[key] !== undefined) {
      acc[key] = source[key];
    }
    return acc;
  }, {} as Record<string, any>);

export async function GET(request: NextRequest, context: { params: { method: string } }) {
  try {
    const method = context.params.method as PaymentMethod;
    if (!SUPPORTED_METHODS.includes(method)) {
      return NextResponse.json({ error: 'Unsupported payment method' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('payment_configurations')
      .select('payment_method, is_active, config_data')
      .eq('payment_method', method)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Payment configuration not found' }, { status: 404 });
    }

    const config = data.config_data || {};
    let publicConfig: Record<string, any> = {};

    switch (method) {
      case 'mtn_momo':
        publicConfig = pick(config, [
          'merchant_name',
          'merchant_code',
          'phone_number',
          'environment',
          'callback_url',
          'transaction_fee_percent',
          'fixed_fee',
          'min_amount',
          'max_amount'
        ]);
        break;
      case 'airtel_money':
        publicConfig = pick(config, [
          'merchant_msisdn',
          'country',
          'currency',
          'transaction_fee_percent',
          'fixed_fee',
          'min_amount',
          'max_amount'
        ]);
        break;
      case 'equity_bank':
        publicConfig = pick(config, [
          'account_number',
          'account_name',
          'api_endpoint',
          'transaction_fee_percent',
          'fixed_fee',
          'min_amount',
          'max_amount'
        ]);
        break;
      case 'crypto':
        publicConfig = pick(config, [
          'bitcoin',
          'ethereum',
          'usdt',
          'exchange_rate_provider',
          'manual_exchange_rate'
        ]);
        break;
      case 'wallet':
        publicConfig = config;
        break;
      default:
        publicConfig = {};
    }

    return NextResponse.json({
      payment_method: method,
      is_active: data.is_active,
      config: publicConfig
    });
  } catch (error: any) {
    console.error('Error fetching payment configuration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
