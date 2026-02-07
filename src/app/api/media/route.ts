import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with service role key for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing environment variables' },
        { status: 500 }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get JWT token from request headers
    const authorization = request.headers.get('authorization')
    if (!authorization) {
      console.log('No authorization header found in media API')
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    const token = authorization.replace('Bearer ', '')
    
    // Verify the JWT token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Token verification failed in media:', authError)
      return NextResponse.json(
        { error: 'Invalid or expired token', details: authError?.message },
        { status: 401 }
      )
    }

    console.log('✅ Authenticated user in media:', user.email)

    const body = await request.json()
    const { 
      listing_id, 
      media_type, 
      url, 
      public_id, 
      order_index = 0,
      is_primary = false 
    } = body

    if (!listing_id || !url || !public_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('listing_media')
      .insert({
        listing_id,
        media_type,
        url,
        public_id,
        order_index,
        is_primary
      })

    if (error) {
      console.error('Media insertion error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error: any) {
    console.error('Upload media error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload media' },
      { status: 500 }
    )
  }
}
