import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/auth'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { listingId } = await request.json()

    if (!listingId) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      )
    }

    // Get current user (optional, handle gracefully)
    let currentUser = null
    try {
      currentUser = await getCurrentUser()
    } catch (error) {
      // User is not authenticated, that's fine for tracking views
      console.log('User not authenticated, tracking anonymous view')
    }
    
    // Get client info
    const userAgent = request.headers.get('user-agent') || null
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      null
    
    // Generate a session ID for anonymous users
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Use admin client to avoid RLS issues
    const supabase = getSupabaseAdmin()

    // Direct insert into listing_views table
    const { error } = await supabase
      .from('listing_views')
      .insert({
        listing_id: listingId,
        user_id: currentUser?.id || null,
        ip_address: ipAddress || null,
        user_agent: userAgent,
        session_id: currentUser ? null : sessionId
      } as any)

    if (error) {
      console.error('Error inserting view:', error)
      // Don't return 500 for view tracking failures, just log them
      return NextResponse.json({ 
        success: true, 
        warning: 'View tracking failed but request succeeded' 
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in track-view API:', error)
    // Don't fail the entire request for view tracking issues
    return NextResponse.json({ 
      success: true, 
      warning: 'View tracking encountered an error but request succeeded' 
    })
  }
}
