import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Test if visit_requests table exists
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'visit_requests');

    console.log('Tables query result:', { tables, tablesError });

    // Test direct query to visit_requests
    const { data: visitRequests, error: visitError } = await supabaseAdmin
      .from('visit_requests')
      .select('count')
      .limit(1);

    console.log('Visit requests count query:', { visitRequests, visitError });

    // Test if we can create a simple visit request
    const { data: testInsert, error: insertError } = await supabaseAdmin
      .from('visit_requests')
      .select('id')
      .limit(1);

    console.log('Test select result:', { testInsert, insertError });

    return NextResponse.json({
      tableExists: !tablesError && tables && tables.length > 0,
      visitRequestsError: visitError?.message,
      testSelectError: insertError?.message,
      visitRequestsCount: visitRequests?.length || 0
    });
  } catch (error: any) {
    console.error('Test API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
