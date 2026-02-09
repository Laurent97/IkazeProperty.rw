import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/auth'

interface CheckMediaItem {
  id: string
  listing_id: string
  url: string
  media_type: string
  listings?: {
    title?: string
    category?: string
    status?: string
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    // Check current watermark status
    const { data: media, error } = await supabase
      .from('listing_media')
      .select(`
        id,
        listing_id,
        url,
        media_type,
        listings!listing_media_listing_id_fkey (
          title,
          category,
          status
        )
      `)
      .eq('media_type', 'image')
      .limit(10)

    if (error) {
      console.error('Error checking watermarks:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    const typedMedia = media as CheckMediaItem[] | null

    // Analyze watermark status
    const analysis = typedMedia?.map(item => ({
      id: item.id,
      listing_id: item.listing_id,
      listing_title: item.listings?.title,
      listing_category: item.listings?.category,
      url: item.url,
      hasWatermark: item.url.includes('watermark') || item.url.includes('l_text:www.ikazeproperty.org'),
      urlPreview: item.url.substring(0, 100) + '...'
    })) || []

    const totalImages = analysis.length
    const watermarkedImages = analysis.filter(item => item.hasWatermark).length
    const unwatermarkedImages = totalImages - watermarkedImages

    return NextResponse.json({
      success: true,
      summary: {
        total: totalImages,
        watermarked: watermarkedImages,
        unwatermarked: unwatermarkedImages,
        percentage: totalImages > 0 ? Math.round((watermarkedImages / totalImages) * 100) : 0
      },
      images: analysis
    })

  } catch (error) {
    console.error('Error checking watermarks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
