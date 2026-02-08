import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create supabase client for database operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getCurrentUser(request: NextRequest) {
  const userSupabase = createClient(supabaseUrl!, supabaseServiceKey!)
  
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  
  const token = authHeader.replace('Bearer ', '')
  
  // Validate the JWT token using getUser with service role key
  const { data: { user }, error } = await userSupabase.auth.getUser(token)
  
  if (error || !user) {
    console.error('Auth validation error:', error?.message)
    return null
  }
  return user
}

// Create inquiry_chats table if it doesn't exist
async function ensureChatsTable() {
  const { error } = await supabase.rpc('create_inquiry_chats_table')
  if (error && !error.message.includes('already exists')) {
    console.error('Error creating chats table:', error)
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in and try again.' },
        { status: 401 }
      )
    }

    const inquiryId = params.id

    // Check if user is admin or the customer who sent the inquiry
    const { data: inquiry, error: inquiryError } = await supabase
      .from('inquiries')
      .select('buyer_id, seller_id')
      .eq('id', inquiryId)
      .single()

    if (inquiryError || !inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    // Check if user is admin or the buyer
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', currentUser.id)
      .single()

    const isAdmin = userProfile?.role === 'admin'
    const isBuyer = currentUser.id === inquiry.buyer_id

    if (!isAdmin && !isBuyer) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Ensure chats table exists
    await ensureChatsTable()

    // Fetch chat messages for this inquiry
    const { data: messages, error } = await supabase
      .from('inquiry_chats')
      .select('*')
      .eq('inquiry_id', inquiryId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: messages || []
    })
  } catch (error) {
    console.error('Chat fetch error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in and try again.' },
        { status: 401 }
      )
    }

    const inquiryId = params.id
    const { message, sender } = await request.json()

    if (!message || !sender) {
      return NextResponse.json(
        { error: 'Message and sender are required' },
        { status: 400 }
      )
    }

    // Validate sender
    if (sender !== 'admin' && sender !== 'customer') {
      return NextResponse.json(
        { error: 'Invalid sender type' },
        { status: 400 }
      )
    }

    // Check if user is admin or the customer who sent the inquiry
    const { data: inquiry, error: inquiryError } = await supabase
      .from('inquiries')
      .select('buyer_id, seller_id')
      .eq('id', inquiryId)
      .single()

    if (inquiryError || !inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    // Check permissions
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', currentUser.id)
      .single()

    const isAdmin = userProfile?.role === 'admin'
    const isBuyer = currentUser.id === inquiry.buyer_id

    // Admin can send as 'admin', buyer can send as 'customer'
    if (sender === 'admin' && !isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can send messages as admin' },
        { status: 403 }
      )
    }

    if (sender === 'customer' && !isBuyer) {
      return NextResponse.json(
        { error: 'Only the inquiry buyer can send messages as customer' },
        { status: 403 }
      )
    }

    // Ensure chats table exists
    await ensureChatsTable()

    // Create the message
    const { data: chatMessage, error } = await supabase
      .from('inquiry_chats')
      .insert({
        inquiry_id: inquiryId,
        sender_id: currentUser.id,
        sender_type: sender,
        message: message.trim(),
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating message:', error)
      return NextResponse.json(
        { error: `Failed to send message: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: chatMessage
    })
  } catch (error) {
    console.error('Chat send error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
