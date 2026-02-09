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
        promoted,
        featured,
        seller_id:users(id, full_name, email),
        listing_media(
          id,
          url,
          media_type,
          order_index,
          is_primary
        ),
        listing_promotions(
          id,
          promotion_type,
          status,
          starts_at,
          expires_at
        )
      `)
      .eq('status', 'available')
      .order('promoted', { ascending: false })
      .order('featured', { ascending: false })
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
    console.log('🚗 Car details in API:', body.car_details)
    console.log('🏠 House details in API:', body.house_details)
    console.log('🌳 Land details in API:', body.land_details)
    console.log('📦 Other details in API:', body.other_details)
    
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

    // Set commission rate based on commission type (if provided)
    let finalCommissionRate = 0.30 // Default for agent

    if (body.commission_type === 'owner') {
      finalCommissionRate = 0.02 // 2% for owners
    } else if (body.commission_type === 'agent') {
      finalCommissionRate = 0.30 // 30% for agents
    }

    console.log('🔍 Validating fields:')
    console.log('- title:', title)
    console.log('- description:', description)
    console.log('- price:', price)
    console.log('- category:', category)
    console.log('- seller_id:', seller_id)
    console.log('- commission_type:', body.commission_type)
    console.log('- commission_rate:', finalCommissionRate)

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
        commission_rate: finalCommissionRate,
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

    // Create category-specific details if provided
    console.log('🔍 Checking category:', body.category)
    console.log('🔍 Has car details:', !!body.car_details)
    
    if (body.category === 'cars' && body.car_details) {
      console.log('🚗 Creating car details for listing:', listing.id)
      console.log('🚗 Car details data:', body.car_details)
      
      try {
        const { data: carDetailsData, error: carDetailsError } = await supabase
          .from('car_details')
          .insert({
            listing_id: listing.id,
            ...body.car_details
          })
          .select()
          .single()

        if (carDetailsError) {
          console.error('Car details creation error:', carDetailsError)
        } else {
          console.log('✅ Car details created:', carDetailsData)
        }
      } catch (error) {
        console.error('Error creating car details:', error)
      }
    } else {
      console.log('🚗 Skipping car details - category:', body.category, 'has data:', !!body.car_details)
    }

    // Similar for other categories can be added here
    console.log('🔍 Checking house details - category:', body.category, 'has data:', !!body.house_details)
    
    if (body.category === 'houses' && body.house_details) {
      console.log('🏠 Creating house details for listing:', listing.id)
      console.log('🏠 House details data:', body.house_details)
      
      try {
        const { data: houseDetailsData, error: houseDetailsError } = await supabase
          .from('house_details')
          .insert({
            listing_id: listing.id,
            ...body.house_details
          })
          .select()
          .single()

        if (houseDetailsError) {
          console.error('House details creation error:', houseDetailsError)
        } else {
          console.log('✅ House details created:', houseDetailsData)
        }
      } catch (error) {
        console.error('Error creating house details:', error)
      }
    } else {
      console.log('🏠 Skipping house details - category:', body.category, 'has data:', !!body.house_details)
    }

    console.log('🔍 Checking land details - category:', body.category, 'has data:', !!body.land_details)
    
    if (body.category === 'land' && body.land_details) {
      console.log('🌳 Creating land details for listing:', listing.id)
      console.log('🌳 Land details data:', body.land_details)
      
      try {
        const { data: landDetailsData, error: landDetailsError } = await supabase
          .from('land_details')
          .insert({
            listing_id: listing.id,
            ...body.land_details
          })
          .select()
          .single()

        if (landDetailsError) {
          console.error('Land details creation error:', landDetailsError)
        } else {
          console.log('✅ Land details created:', landDetailsData)
        }
      } catch (error) {
        console.error('Error creating land details:', error)
      }
    } else {
      console.log('🌳 Skipping land details - category:', body.category, 'has data:', !!body.land_details)
    }

    console.log('🔍 Checking other details - category:', body.category, 'has data:', !!body.other_details)
    
    if (body.category === 'other' && body.other_details) {
      console.log('📦 Creating other item details for listing:', listing.id)
      console.log('📦 Other details data:', body.other_details)
      
      try {
        const { data: otherDetailsData, error: otherDetailsError } = await supabase
          .from('other_item_details')
          .insert({
            listing_id: listing.id,
            ...body.other_details
          })
          .select()
          .single()

        if (otherDetailsError) {
          console.error('Other details creation error:', otherDetailsError)
        } else {
          console.log('✅ Other details created:', otherDetailsData)
        }
      } catch (error) {
        console.error('Error creating other details:', error)
      }
    } else {
      console.log('📦 Skipping other details - category:', body.category, 'has data:', !!body.other_details)
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
