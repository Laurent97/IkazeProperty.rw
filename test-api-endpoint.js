// Test if the API endpoint is working by checking the logs
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://swshkufpktnacbotddpb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c2hrdWZwa3RuYWNib3RkZHBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ1MTgzOSwiZXhwIjoyMDg2MDI3ODM5fQ.T_LnaxClQV-ddubCnBnVk0d0lgkmT0GUs1EsD1qVG3U'
)

async function testDirectInsert() {
  try {
    console.log('🧪 Testing direct car details insertion...')
    
    // Get the existing listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, title, category')
      .eq('id', 'b0e255ff-c7e9-4bc6-be31-51114ada2940')
      .single()

    console.log('📋 Found listing:', { listing, listingError })
    
    if (!listing) {
      console.log('❌ Listing not found')
      return
    }
    
    // Insert car details directly (simulating what the API should do)
    const carDetailsData = {
      listing_id: listing.id,
      vehicle_type: 'car',
      make: 'Nissan',
      model: 'Altima',
      year_manufacture: 2021,
      condition: 'used',
      fuel_type: 'petrol',
      transmission: 'automatic',
      engine_capacity: 2500,
      mileage: 30000,
      color: 'silver',
      doors: 4,
      seats: 5,
      features: ['cruise control', 'bluetooth'],
      ownership_papers: true,
      insurance_status: 'valid',
      road_worthiness: true,
      last_service_date: '2024-06-01'
    }
    
    console.log('📝 Inserting car details directly:', carDetailsData)
    
    const { data, error } = await supabase
      .from('car_details')
      .insert(carDetailsData)
      .select()
      .single()

    console.log('✅ Direct insert result:', { data, error })
    
    if (error) {
      console.error('❌ Direct insert failed:', error)
    } else {
      console.log('✅ Car details inserted successfully!')
      
      // Verify the insertion worked
      const { data: verifyData, error: verifyError } = await supabase
        .from('car_details')
        .select('*')
        .eq('listing_id', listing.id)
        .single()

      console.log('🔍 Verification:', { verifyData, verifyError })
    }
    
  } catch (err) {
    console.error('Test error:', err)
  }
}

testDirectInsert()
