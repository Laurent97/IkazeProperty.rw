import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sql } = body
    
    if (!sql) {
      return NextResponse.json({ error: 'SQL is required' }, { status: 400 })
    }
    
    // Import supabase admin client
    const { getSupabaseAdmin } = await import('@/lib/auth')
    const supabase = getSupabaseAdmin()
    
    // Execute the migration using raw SQL
    const statements = sql.split(';').filter((stmt: string) => stmt.trim()).filter((stmt: string) => stmt.trim())
    
    for (const statement of statements) {
      // Use the Supabase client's direct SQL execution
      const { error } = await (supabase as any).from('raw').select('*').execute(statement)
      
      if (error) {
        console.error('Migration error:', error)
        return NextResponse.json({ error: error.message || 'Migration failed' }, { status: 500 })
      }
    }
    
    console.log('Migration completed successfully!')
    return NextResponse.json({ success: true, message: 'Migration completed' })
    
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
