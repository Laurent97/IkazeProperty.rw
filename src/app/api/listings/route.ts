import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    console.log('📝 Fetching listings with params:', { category, limit, offset })

    // Build query
    let query = supabase
      .from('listings')
      .select(`
        id,
        title,
        price,
        currency,
        category,
        status,
        created_at,
        seller_id:users(id, full_name, email),
        listing_media(
          id,
          url,
          media_type,
          order_index,
          is_primary
        )
      `)
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Add category filter if provided
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: listings, error } = await query

    if (error) {
      console.error('❌ Error fetching listings:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Found ${listings?.length || 0} listings`)

    return NextResponse.json({
      success: true,
      data: listings || [],
      count: listings?.length || 0
    })

  } catch (error: any) {
    console.error('❌ Get listings error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}

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
      console.log('No authorization header found')
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    const token = authorization.replace('Bearer ', '')
    
    // Verify the JWT token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Token verification failed:', authError)
      return NextResponse.json(
        { error: 'Invalid or expired token', details: authError?.message },
        { status: 401 }
      )
    }

    console.log('✅ Authenticated user:', user.email)

    const body = await request.json()
    console.log('📝 Received body:', body)
    
    const { 
      title, 
      description, 
      price, 
      currency, 
      price_type, 
      category, 
      transaction_type, 
      location, 
      seller_id,
      visit_fee_enabled,
      visit_fee_amount,
      visit_fee_payment_methods,
      commission_rate = 0.30,
      commission_agreed,
      featured = false,
      promoted = false 
    } = body

    console.log('🔍 Validating fields:')
    console.log('- title:', title)
    console.log('- description:', description)
    console.log('- price:', price)
    console.log('- category:', category)
    console.log('- seller_id:', seller_id)

    // Validate required fields with better error messages
    const requiredFields = [
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description' },
      { key: 'price', label: 'Price' },
      { key: 'category', label: 'Category' },
      { key: 'seller_id', label: 'Seller ID' }
    ]
    
    const missingFields = requiredFields
      .filter(field => !body[field.key])
      .map(field => field.label)
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields)
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missingFields: missingFields,
          details: `Please provide: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // Also validate price is a valid number
    if (isNaN(parseFloat(body.price)) || parseFloat(body.price) <= 0) {
      console.error('❌ Invalid price:', body.price)
      return NextResponse.json(
        { error: 'Price must be a valid positive number' },
        { status: 400 }
      )
    }

    // Ensure the user exists in the users table
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()
    
    if (userCheckError || !existingUser) {
      console.error('❌ User not found in users table:', userCheckError)
      return NextResponse.json(
        { error: 'User profile not found. Please complete your profile first.' },
        { status: 400 }
      )
    }

    console.log('✅ User verified in users table:', existingUser.id)

    // Ensure the seller_id matches the authenticated user
    if (seller_id && seller_id !== user.id) {
      return NextResponse.json(
        { error: 'Cannot create listing for another user' },
        { status: 403 }
      )
    }

    // Create main listing with authenticated user as seller
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .insert({
        title,
        description,
        price: parseFloat(price),
        currency: currency || 'RWF',
        price_type,
        category,
        transaction_type,
        status: 'available',
        location,
        seller_id: user.id, // Use authenticated user's ID
        commission_rate: commission_rate,
        commission_agreed,
        featured,
        promoted,
        views: 0,
        likes: 0,
        visit_fee_enabled: visit_fee_enabled ?? true,
        visit_fee_amount: visit_fee_amount ?? 15000,
        visit_fee_payment_methods: visit_fee_payment_methods ?? {}
      })
      .select()
      .single()

    if (listingError) {
      console.error('Listing creation error:', listingError)
      return NextResponse.json(
        { error: listingError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: listing
    })

  } catch (error: any) {
    console.error('Create listing error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create listing' },
      { status: 500 }
    )
  }
}
