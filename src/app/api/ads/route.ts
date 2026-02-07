import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const placement = searchParams.get('placement')
    const status = searchParams.get('status') || 'active'

    if (!placement) {
      return NextResponse.json(
        { error: 'Placement parameter is required' },
        { status: 400 }
      )
    }

    // First, get the placement ID from ad_rotations table
    const { data: rotations, error: rotationError } = await supabaseAdmin
      .from('ad_rotations')
      .select('ad_campaign_id')
      .eq('is_active', true)
      // Note: You'll need to add placement_id to your ad_rotations table or use a different approach
      .limit(10)

    if (rotationError) {
      console.error('Error fetching rotations:', rotationError)
    }

    // For now, let's fetch all active campaigns and filter by type
    const { data: campaigns, error } = await supabaseAdmin
      .from('ad_campaigns')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Error fetching ad campaigns:', error)
      return NextResponse.json(
        { error: 'Failed to fetch ad campaigns' },
        { status: 500 }
      )
    }

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({ ad: null })
    }

    // Get the first campaign (you can implement rotation logic later)
    const campaign = campaigns[0]

    const adData = {
      id: campaign.id,
      title: campaign.title,
      image: campaign.primary_image_url || campaign.media_urls?.[0] || null,
      link: campaign.cta_link,
      description: campaign.description,
      type: campaign.ad_type,
      isSponsored: campaign.ad_type !== 'premium_listing',
      campaignId: campaign.id,
      budget: parseFloat(campaign.budget_total) || 0,
      spent: parseFloat(campaign.spent_amount) || 0,
      startDate: campaign.start_date,
      endDate: campaign.end_date,
      advertiser: {
        name: 'Advertiser', // You can join with users table to get real name
        email: null
      }
    }

    return NextResponse.json({ ad: adData })
  } catch (error) {
    console.error('Error in ads API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
