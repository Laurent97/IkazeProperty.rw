import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
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

    // Log the structure
    console.log('Test listings data:', JSON.stringify(listings, null, 2))

    return NextResponse.json({
      success: true,
      count: listings?.length || 0,
      listings: listings?.map(listing => ({
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
