import { NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function GET() {
  try {
    // Test environment variables
    const envVars = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Loaded' : 'Missing',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Loaded' : 'Missing',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Loaded' : 'Missing'
    }

    // Test Supabase connection
    let supabaseTest = 'Not tested'
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1)
      supabaseTest = error ? `Error: ${error.message}` : 'Connected successfully'
    } catch (error: any) {
      supabaseTest = `Connection error: ${error.message}`
    }

    // Test auth session
    let authTest = 'Not tested'
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      authTest = error ? `Error: ${error.message}` : session ? `Session found for ${session.user?.email}` : 'No session'
    } catch (error: any) {
      authTest = `Auth error: ${error.message}`
    }

    return NextResponse.json({
      environment: envVars,
      supabase: supabaseTest,
      auth: authTest,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
