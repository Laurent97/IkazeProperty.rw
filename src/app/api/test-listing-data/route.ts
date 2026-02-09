import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/auth'

interface TestListing {
  id: string
  title: string
  category: string
  house_details?: any
  car_details?: any
  land_details?: any
  other_item_details?: any
  media?: Array<{
    url: string
    media_type: string
    is_primary: boolean
    order_index: number
  }>
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    // Test query to see what data we have
    const { data: listings, error } = await supabase
      .from('listings')
      .select(`
        id,
        title,
        category,
        house_details,
        car_details,
        land_details,
        other_item_details,
        media:listing_media(
          url,
          media_type,
          is_primary,
          order_index
        )
      `)
      .eq('status', 'available')
      .limit(5)

    if (error) {
      console.error('Error fetching test data:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    const typedListings = listings as TestListing[] | null

    // Log the structure
    console.log('Test listings data:', JSON.stringify(typedListings, null, 2))

    return NextResponse.json({
      success: true,
      count: typedListings?.length || 0,
      listings: typedListings?.map((listing: TestListing) => ({
        id: listing.id,
        title: listing.title,
        category: listing.category,
        hasHouseDetails: !!listing.house_details,
        hasCarDetails: !!listing.car_details,
        hasLandDetails: !!listing.land_details,
        hasOtherDetails: !!listing.other_item_details,
        mediaCount: listing.media?.length || 0,
        houseDetailsSample: listing.house_details ? {
          bedrooms: listing.house_details.bedrooms,
          bathrooms: listing.house_details.bathrooms,
          total_area: listing.house_details.total_area
        } : null,
        carDetailsSample: listing.car_details ? {
          make: listing.car_details.make,
          model: listing.car_details.model,
          year_manufacture: listing.car_details.year_manufacture
        } : null
      }))
    })

  } catch (error) {
    console.error('Error in test endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
