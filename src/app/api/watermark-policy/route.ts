import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/auth'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    const supabase = getSupabaseAdmin()
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's watermark permissions
    const { data: permissions, error } = await (supabase as any)
      .rpc('get_user_watermark_permissions', {
        p_user_id: currentUser.id
      })

    if (error) {
      console.error('Error fetching watermark permissions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch permissions' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      permissions: permissions || []
    })

  } catch (error) {
    console.error('Error in watermark policy GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    const supabase = getSupabaseAdmin()
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { action, policyName, listingId, durationHours = 1 } = await request.json()

    switch (action) {
      case 'create_session':
        // Create a watermark viewing session
        const { data: sessionToken, error: sessionError } = await (supabase as any)
          .rpc('create_watermark_session', {
            p_user_id: currentUser.id,
            p_listing_id: listingId || null,
            p_purpose: 'view_watermarks',
            p_duration_hours: durationHours
          })

        if (sessionError) {
          return NextResponse.json(
            { error: 'Failed to create session' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          sessionToken,
          expiresAt: new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString()
        })

      case 'assign_policy':
        // Assign watermark policy to user (admin only)
        const { data: userRole } = await (supabase as any)
          .from('users')
          .select('role')
          .eq('id', currentUser.id)
          .single()

        if (userRole?.role !== 'admin') {
          return NextResponse.json(
            { error: 'Admin privileges required' },
            { status: 403 }
          )
        }

        if (!policyName) {
          return NextResponse.json(
            { error: 'Policy name is required' },
            { status: 400 }
          )
        }

        const { data: assignResult, error: assignError } = await (supabase as any)
          .rpc('assign_watermark_policy', {
            p_user_id: currentUser.id,
            p_policy_name: policyName,
            p_assigned_by: currentUser.id
          })

        if (assignError) {
          return NextResponse.json(
            { error: 'Failed to assign policy' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: `Policy ${policyName} assigned successfully`
        })

      case 'check_permission':
        // Check if user can view watermarks for a listing
        if (!listingId) {
          return NextResponse.json(
            { error: 'Listing ID is required' },
            { status: 400 }
          )
        }

        const { data: canView, error: permissionError } = await (supabase as any)
          .rpc('can_view_watermarks', {
            p_user_id: currentUser.id,
            p_listing_id: listingId
          })

        if (permissionError) {
          return NextResponse.json(
            { error: 'Failed to check permission' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          canViewWatermarks: canView,
          listingId
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error in watermark policy POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
