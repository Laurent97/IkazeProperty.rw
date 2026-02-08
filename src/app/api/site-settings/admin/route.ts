import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Add logging for debugging
    console.log('Site settings POST request received');
    
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      console.log('Missing authorization header');
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const token = authorization.replace('Bearer ', '');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.log('Auth error:', authError);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      console.log('User role:', userData?.role);
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    console.log('Request body:', body);
    const { admin_phone, whatsapp_phone, support_email, office_address } = body || {};

    if (!admin_phone || !whatsapp_phone || !support_email || !office_address) {
      console.log('Missing fields:', { admin_phone, whatsapp_phone, support_email, office_address });
      return NextResponse.json(
        { error: 'Missing required fields: admin_phone, whatsapp_phone, support_email, office_address' },
        { status: 400 }
      );
    }

    console.log('Attempting to upsert site settings...');
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .upsert({
        admin_phone,
        whatsapp_phone,
        support_email,
        office_address,
        updated_by: user.id
      })
      .select()
      .single();

    if (error) {
      console.log('Supabase upsert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Site settings updated successfully:', data);
    return NextResponse.json({ success: true, settings: data });
  } catch (error: any) {
    console.error('Site settings update error:', error);
    return NextResponse.json({ error: 'Failed to update site settings' }, { status: 500 });
  }
}
