import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Missing required query params: from, to' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('exchange_rates')
      .select('rate, source, updated_at')
      .eq('from_currency', from)
      .eq('to_currency', to)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Exchange rate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      from,
      to,
      rate: data.rate,
      source: data.source,
      updated_at: data.updated_at
    });
  } catch (error: any) {
    console.error('Error fetching exchange rate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
