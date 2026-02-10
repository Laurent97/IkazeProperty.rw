import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('visit_requests')
      .select(`
        *,
        listing:listings (
          id,
          title,
          price,
          currency,
          location,
          category,
          listing_media (
            url,
            media_type,
            is_primary
          )
        ),
        buyer:users!visit_requests_buyer_id_fkey (
          id,
          full_name,
          email,
          phone,
          avatar_url
        ),
        seller:users!visit_requests_seller_id_fkey (
          id,
          full_name,
          email,
          phone,
          avatar_url
        ),
        // Add new buyer and visit detail fields
        buyer_name,
        buyer_email,
        buyer_phone,
        visit_date,
        visit_time,
        visit_notes
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply status filter if provided
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: visitRequests, error, count } = await query;

    if (error) {
      console.error('Error fetching visit requests:', error);
      return NextResponse.json(
        { error: 'Failed to fetch visit requests' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      visitRequests,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in visit requests management API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, admin_notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: id, status' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('visit_requests')
      .update({
        status,
        admin_notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating visit request:', error);
      return NextResponse.json(
        { error: 'Failed to update visit request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      visitRequest: data
    });

  } catch (error) {
    console.error('Error updating visit request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
