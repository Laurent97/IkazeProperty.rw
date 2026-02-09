const { createClient } = require('@supabase/supabase-js')

// Use the service role key for admin access
const supabase = createClient(
  'https://swshkufpktnacbotddpb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c2hrdWZwa3RuYWNib3RkZHBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ1MTgzOSwiZXhwIjoyMDg2MDI3ODM5fQ.T_LnaxClQV-ddubCnBnVk0d0lgkmT0GUs1EsD1qVG3U'
)

async function testSpecificListing() {
  try {
    console.log('🔍 Testing car details for listing: b0e255ff-c7e9-4bc6-be31-51114ada2940')
    
    // Test 1: Check if listing exists
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, title, category')
      .eq('id', 'b0e255ff-c7e9-4bc6-be31-51114ada2940')
      .single()

    console.log('📋 Listing data:', { listing, listingError })
    
    if (!listing) {
      console.log('❌ Listing not found')
      return
    }
    
    // Test 2: Check car details with service role (bypass RLS)
    const { data: carDetails, error: carDetailsError } = await supabase
      .from('car_details')
      .select('*')
      .eq('listing_id', 'b0e255ff-c7e9-4bc6-be31-51114ada2940')

    console.log('🚗 Car details (service role):', { carDetails, carDetailsError })
    
    // Test 3: Check with regular query (like the app uses)
    const { data: joinedData, error: joinedError } = await supabase
      .from('listings')
      .select(`
        id,
        title,
        category,
        car_details(*)
      `)
      .eq('id', 'b0e255ff-c7e9-4bc6-be31-51114ada2940')
      .single()

    console.log('🔗 Joined data:', { joinedData, joinedError })
    
    // Test 4: Check all car details in database
    const { data: allCarDetails, error: allError } = await supabase
      .from('car_details')
      .select('listing_id, make, model')
      .limit(5)

    console.log('📊 All car details (sample):', { allCarDetails, allError })
    
  } catch (err) {
    console.error('Test error:', err)
  }
}

testSpecificListing()
