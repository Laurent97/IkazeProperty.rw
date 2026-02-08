import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('admin_phone, whatsapp_phone, support_email, office_address')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Site settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ settings: data });
  } catch (error: any) {
    console.error('Site settings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to load site settings' },
      { status: 500 }
    );
  }
}
