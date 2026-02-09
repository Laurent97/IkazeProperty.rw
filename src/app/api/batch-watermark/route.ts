import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { batchSize = 50, dryRun = false } = await request.json()

    console.log(`🚀 Starting batch watermark process (batch size: ${batchSize}, dry run: ${dryRun})`)

    // Get images that need watermarks
    const { data: imagesNeedingWatermark, error: fetchError } = await supabase
      .from('listing_media')
      .select(`
        id,
        listing_id,
        url,
        public_id,
        media_type,
        listings!listing_media_listing_id_fkey (
          id,
          title,
          status
        )
      `)
      .eq('media_type', 'image')
      .not('url', 'like', '%watermark%')
      .not('url', 'like', '%l_text:www.ikazeproperty.org%')
      .eq('listings.status', 'available')
      .limit(batchSize)

    if (fetchError) {
      console.error('❌ Error fetching images:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch images' },
        { status: 500 }
      )
    }

    if (!imagesNeedingWatermark || imagesNeedingWatermark.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No images need watermarking',
        processed: 0,
        total: 0
      })
    }

    console.log(`📊 Found ${imagesNeedingWatermark.length} images needing watermarks`)

    if (dryRun) {
      return NextResponse.json({
        success: true,
        message: 'Dry run completed',
        processed: 0,
        total: imagesNeedingWatermark.length,
        images: imagesNeedingWatermark.map(img => ({
          id: img.id,
          listing_id: img.listing_id,
          old_url: img.url,
          new_url: generateWatermarkedUrl(img.url),
          listing_title: img.listings?.title
        }))
      })
    }

    // Process each image
    const results = []
    for (const image of imagesNeedingWatermark) {
      try {
        const watermarkedUrl = generateWatermarkedUrl(image.url)
        
        // Update the database
        const { error: updateError } = await supabase
          .from('listing_media')
          .update({ url: watermarkedUrl })
          .eq('id', image.id)

        if (updateError) {
          console.error(`❌ Failed to update image ${image.id}:`, updateError)
          results.push({
            id: image.id,
            success: false,
            error: updateError.message
          })
        } else {
          console.log(`✅ Applied watermark to image ${image.id} for listing ${image.listing_id}`)
          results.push({
            id: image.id,
            success: true,
            old_url: image.url,
            new_url: watermarkedUrl,
            listing_title: image.listings?.title
          })
        }
      } catch (error) {
        console.error(`❌ Error processing image ${image.id}:`, error)
        results.push({
          id: image.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    console.log(`🎉 Batch completed: ${successCount} success, ${failureCount} failures`)

    return NextResponse.json({
      success: true,
      message: `Processed ${imagesNeedingWatermark.length} images`,
      processed: successCount,
      failed: failureCount,
      total: imagesNeedingWatermark.length,
      results: results
    })

  } catch (error) {
    console.error('❌ Batch watermark error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateWatermarkedUrl(originalUrl: string): string {
  // Apply Cloudinary transformation for watermark
  if (originalUrl.includes('/upload/')) {
    return originalUrl.replace(
      '/upload/',
      '/upload/w_300,h_60,c_fit,l_text:www.ikazeproperty.org,co_rgb:dc2626,g_south_east,x_15,y_15,l_text:www.ikazeproperty.org,co_rgb:dc2626,bo_3px_solid_rgb:991b1b,ro_8/'
    )
  }
  return originalUrl
}

export async function GET(request: NextRequest) {
  try {
    // Get watermark statistics
    const { data: stats } = await supabase
      .from('listing_media')
      .select('url')
      .eq('media_type', 'image')

    if (!stats) {
      return NextResponse.json({
        total: 0,
        watermarked: 0,
        unwatermarked: 0,
        percentage: 0
      })
    }

    const total = stats.length
    const watermarked = stats.filter((item: any) => 
      item.url.includes('watermark') || item.url.includes('l_text:www.ikazeproperty.org')
    ).length
    const unwatermarked = total - watermarked
    const percentage = total > 0 ? Math.round((watermarked / total) * 100) : 0

    return NextResponse.json({
      total,
      watermarked,
      unwatermarked,
      percentage
    })

  } catch (error) {
    console.error('❌ Error getting stats:', error)
    return NextResponse.json(
      { error: 'Failed to get statistics' },
      { status: 500 }
    )
  }
}
