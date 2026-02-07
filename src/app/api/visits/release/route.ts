import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase';

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

    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { visit_request_id } = await request.json();
    if (!visit_request_id) {
      return NextResponse.json({ error: 'Missing visit_request_id' }, { status: 400 });
    }

    const { data: visit, error: visitError } = await supabaseAdmin
      .from('visit_requests')
      .select('*')
      .eq('id', visit_request_id)
      .single();

    if (visitError || !visit) {
      return NextResponse.json({ error: 'Visit request not found' }, { status: 404 });
    }

    if (visit.status !== 'paid') {
      return NextResponse.json({ error: 'Visit fee not paid yet' }, { status: 400 });
    }

    if (visit.payout_status === 'released') {
      return NextResponse.json({ error: 'Payout already released' }, { status: 400 });
    }

    const payoutAmount = Number(visit.seller_payout || 0);

    const { data: wallet } = await supabaseAdmin
      .from('user_wallets')
      .select('*')
      .eq('user_id', visit.seller_id)
      .single();

    let walletRecord = wallet;
    if (!walletRecord) {
      const { data: newWallet, error: walletError } = await supabaseAdmin
        .from('user_wallets')
        .insert({ user_id: visit.seller_id, balance: 0, locked_balance: 0, currency: 'RWF' })
        .select()
        .single();

      if (walletError || !newWallet) {
        return NextResponse.json({ error: walletError?.message || 'Failed to create wallet' }, { status: 500 });
      }
      walletRecord = newWallet;
    }

    const previousBalance = Number(walletRecord.balance || 0);
    const newBalance = previousBalance + payoutAmount;

    const { error: updateWalletError } = await supabaseAdmin
      .from('user_wallets')
      .update({ balance: newBalance })
      .eq('id', walletRecord.id);

    if (updateWalletError) {
      return NextResponse.json({ error: updateWalletError.message }, { status: 500 });
    }

    await supabaseAdmin
      .from('wallet_transactions')
      .insert({
        wallet_id: walletRecord.id,
        transaction_type: 'deposit',
        amount: payoutAmount,
        previous_balance: previousBalance,
        new_balance: newBalance,
        reference: `VISIT-${visit.id}`,
        description: 'Visit fee payout'
      });

    const { data: updatedVisit, error: updateVisitError } = await supabaseAdmin
      .from('visit_requests')
      .update({
        status: 'released',
        payout_status: 'released',
        released_by: user.id,
        released_at: new Date().toISOString()
      })
      .eq('id', visit.id)
      .select()
      .single();

    if (updateVisitError) {
      return NextResponse.json({ error: updateVisitError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, visit: updatedVisit });
  } catch (error: any) {
    console.error('Release visit payout error:', error);
    return NextResponse.json({ error: error.message || 'Failed to release payout' }, { status: 500 });
  }
}
