import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase-client'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        seller:users!listings_seller_id_fkey(
          id,
          full_name,
          email,
          avatar_url,
          phone_number,
          verified
        ),
        listing_media(
          id,
          url,
          public_id,
          media_type,
          order_index,
          is_primary
        ),
        house_details!inner(
          id,
          listing_id,
          property_type,
          bedrooms,
          bathrooms,
          total_area,
          year_built,
          condition,
          furnished,
          parking,
          features,
          utilities_included,
          rent_duration,
          security_deposit,
          advance_payment,
          minimum_lease_period,
          available_from
        ),
        car_details!inner(
          id,
          listing_id,
          vehicle_type,
          make,
          model,
          year_manufacture,
          condition,
          fuel_type,
          transmission,
          engine_capacity,
          mileage,
          color,
          doors,
          seats,
          features,
          ownership_papers,
          insurance_status,
          road_worthiness,
          last_service_date,
          rental_daily_rate,
          rental_weekly_rate,
          rental_monthly_rate,
          security_deposit,
          minimum_rental_period,
          delivery_option,
          driver_included
        ),
        land_details!inner(
          id,
          listing_id,
          plot_type,
          plot_size,
          size_unit,
          shape,
          topography,
          soil_type,
          road_access,
          fenced,
          utilities_available,
          land_title_type,
          title_deed_number,
          surveyed,
          zoning_approval,
          development_permits,
          tax_clearance,
          nearest_main_road_distance,
          nearest_town_distance,
          nearby_amenities
        ),
        other_item_details!inner(
          id,
          listing_id,
          subcategory,
          brand,
          model,
          condition,
          warranty_available,
          warranty_period,
          reason_for_selling,
          original_purchase_date,
          age_of_item
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching listing:', error)
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
