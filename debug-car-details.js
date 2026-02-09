require('dotenv').config()

const { createClient } = require('@supabase/supabase-js')

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function debugCarDetails() {
  console.log('🔍 Debugging car details for listing ID: 7b363cca-3f02-44cd-ade9-8ced0ff1b05b')
  
  try {
    // Test the exact same query as the listing page with explicit car details fields
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        car_details(
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
        )
      `)
      .eq('id', '7b363cca-3f02-44cd-ade9-8ced0ff1b05b')
      .single()

    console.log('📋 Query result:', { data, error })
    
    if (data) {
      console.log('🚗 Car details type:', typeof data.car_details)
      console.log('🚗 Car details value:', data.car_details)
      console.log('🚗 Car details keys:', data.car_details ? Object.keys(data.car_details) : 'null')
      
      // Check if there are multiple car details records
      const { data: allCarDetails, error: carDetailsError } = await supabase
        .from('car_details')
        .select('*')
        .eq('listing_id', '7b363cca-3f02-44cd-ade9-8ced0ff1b05b')

      console.log('📋 All car details for this listing:', allCarDetails)
      console.log('📋 Number of car details records:', allCarDetails?.length || 0)
    }

  } catch (err) {
    console.error('Debug error:', err)
  }
}

debugCarDetails()
