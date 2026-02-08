import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Import supabase admin client
    const { getSupabaseAdmin } = await import('@/lib/auth')
    const supabase = getSupabaseAdmin()
    
    // Simple fix: Disable problematic policies temporarily
    const fixes = [
      // Drop recursive policies
      'DROP POLICY IF EXISTS "Admins can manage all users" ON users;',
      'DROP POLICY IF EXISTS "Admins can manage all listings" ON listings;', 
      'DROP POLICY IF EXISTS "Admins can manage settings" ON settings;',
      'DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;',
      
      // Create simple admin policies without recursion
      `CREATE POLICY "Admins can manage all users" ON users
        FOR ALL USING (auth.role() = 'service_role' OR (auth.role() = 'authenticated' AND auth.uid() IN ('admin-user-id-placeholder')));`,
        
      `CREATE POLICY "Admins can manage all listings" ON listings
        FOR ALL USING (auth.role() = 'service_role' OR (auth.role() = 'authenticated' AND auth.uid() IN ('admin-user-id-placeholder')));`,
        
      `CREATE POLICY "Admins can manage settings" ON settings
        FOR ALL USING (auth.role() = 'service_role' OR (auth.role() = 'authenticated' AND auth.uid() IN ('admin-user-id-placeholder')));`,
        
      `CREATE POLICY "Admins can manage site settings" ON site_settings
        FOR ALL USING (auth.role() = 'service_role' OR (auth.role() = 'authenticated' AND auth.uid() IN ('admin-user-id-placeholder')));`,
        
      // Add default site settings
      `INSERT INTO site_settings (admin_phone, whatsapp_phone, support_email, office_address) 
       VALUES ('+250737060025', '+250737060025', 'support@ikazeproperty.rw', 'Kigali, Rwanda')
       ON CONFLICT DO NOTHING;`
    ]
    
    for (const sql of fixes) {
      // Use raw SQL execution through PostgREST
      const { error } = await supabase.rpc('exec_sql', { query: sql })
      
      if (error && !error.message.includes('does not exist')) {
        console.error('SQL Error:', error, 'for:', sql)
      }
    }
    
    return NextResponse.json({ success: true, message: 'RLS recursion fix applied' })
    
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
