const { createClient } = require('@supabase/supabase-js')

// Use the service role key for admin access
const supabase = createClient(
  'https://swshkufpktnacbotddpb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c2hrdWZwa3RuYWNib3RkZHBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ1MTgzOSwiZXhwIjoyMDg2MDI3ODM5fQ.T_LnaxClQV-ddubCnBnVk0d0lgkmT0GUs1EsD1qVG3U'
)

async function testInsertCarDetails() {
  try {
    console.log('🧪 Testing car details insertion...')
    
    // Test data
    const carDetailsData = {
      listing_id: 'b0e255ff-c7e9-4bc6-be31-51114ada2940',
      vehicle_type: 'car',
      make: 'Nissan',
      model: 'Test Model',
      year_manufacture: 2020,
      condition: 'used',
      fuel_type: 'petrol',
      transmission: 'automatic',
      engine_capacity: 2000,
      mileage: 50000,
      color: 'blue',
      doors: 4,
      seats: 5
    }
    
    console.log('📝 Inserting car details:', carDetailsData)
    
    const { data, error } = await supabase
      .from('car_details')
      .insert(carDetailsData)
      .select()
      .single()

    console.log('✅ Insert result:', { data, error })
    
    if (error) {
      console.error('❌ Insert failed:', error)
    } else {
      console.log('✅ Car details inserted successfully!')
      
      // Verify the insertion
      const { data: verifyData, error: verifyError } = await supabase
        .from('car_details')
        .select('*')
        .eq('listing_id', 'b0e255ff-c7e9-4bc6-be31-51114ada2940')
        .single()

      console.log('🔍 Verification:', { verifyData, verifyError })
    }
    
  } catch (err) {
    console.error('Test error:', err)
  }
}

testInsertCarDetails()
