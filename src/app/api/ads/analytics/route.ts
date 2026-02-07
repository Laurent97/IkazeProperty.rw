import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { campaignId, type, userAgent, ip, referrer } = body

    if (!campaignId || !type) {
      return NextResponse.json(
        { error: 'Campaign ID and type are required' },
        { status: 400 }
      )
    }

    if (!['impression', 'click'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either impression or click' },
        { status: 400 }
      )
    }

    // Record the analytics event using your existing table structure
    const { data, error } = await supabaseAdmin
      .from('ad_analytics')
      .insert({
        ad_campaign_id: campaignId,
        event_type: type,
        user_agent: userAgent,
        ip_address: ip,
        referrer: referrer,
        event_data: {
          timestamp: new Date().toISOString(),
          source: 'web'
        }
      })
      .select()
      .single()

    if (error) {
      console.error('Error recording analytics:', error)
      return NextResponse.json(
        { error: 'Failed to record analytics' },
        { status: 500 }
      )
    }

    // Update campaign metrics using a simpler approach
    const updateField = type === 'impression' ? 'impressions' : 'clicks'
    
    // First get current value, then update
    const { data: currentCampaign } = await supabaseAdmin
      .from('ad_campaigns')
      .select(updateField)
      .eq('id', campaignId)
      .single()
    
    if (currentCampaign) {
      const currentValue = (currentCampaign as any)[updateField] || 0
      const { error: updateError } = await supabaseAdmin
        .from('ad_campaigns')
        .update({
          [updateField]: currentValue + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId)
      
      if (updateError) {
        console.error('Error updating campaign metrics:', updateError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      analyticsId: data.id 
    })
  } catch (error) {
    console.error('Error in analytics API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
