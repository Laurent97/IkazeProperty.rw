import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
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

    // First, let's try a simple count query
    const { count: totalCount, error: countError } = await supabaseAdmin
      .from('visit_requests')
      .select('*', { count: 'exact', head: true });

    console.log('Visit requests total count:', { totalCount, countError });

    // Now try the full query
    const { data, error } = await supabaseAdmin
      .from('visit_requests')
      .select(`
        *,
        listings(title, category, visit_fee_payment_methods),
        buyer:users!visit_requests_buyer_id_fkey(full_name, email),
        seller:users!visit_requests_seller_id_fkey(full_name, email, phone)
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    console.log('Admin visit requests query result:', { data, error, count: data?.length });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ visits: data || [] });
  } catch (error: any) {
    console.error('Admin visits error:', error);
    return NextResponse.json({ error: 'Failed to load visit requests' }, { status: 500 });
  }
}
