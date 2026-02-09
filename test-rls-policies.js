const { createClient } = require('@supabase/supabase-js')

// Use the service role key for admin operations
const supabase = createClient(
  'https://swshkufpktnacbotddpb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c2hrdWZwa3RuYWNib3RkZHBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ1MTgzOSwiZXhwIjoyMDg2MDI3ODM5fQ.T_LnaxClQV-ddubCnBnVk0d0lgkmT0GUs1EsD1qVG3U'
)

async function testRLSPolicies() {
  try {
    console.log('🧪 Testing RLS policies for car details insertion...')
    
    // Test 1: Try to insert car details as a regular user (should fail without proper policies)
    console.log('\n📝 Test 1: Insert car details without authentication...')
    const testCarDetails = {
      listing_id: 'b0e255ff-c7e9-4bc6-be31-51114ada2940',
      vehicle_type: 'car',
      make: 'Test',
      model: 'Test Model',
      year_manufacture: 2022,
      condition: 'new',
      fuel_type: 'petrol',
      transmission: 'manual',
      engine_capacity: 1500,
      mileage: 10000,
      color: 'red',
      doors: 2,
      seats: 4
    }
    
    const { data, error } = await supabase
      .from('car_details')
      .insert(testCarDetails)
      .select()
      .single()

    console.log('📊 Insert result:', { data, error })
    
    if (error) {
      console.log('❌ Insert failed (expected without proper RLS policies):', error.message)
    } else {
      console.log('✅ Insert succeeded (unexpected!)')
    }
    
    // Test 2: Check current RLS policies
    console.log('\n🔍 Checking current RLS policies for car_details...')
    
    // This will show what policies currently exist
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'car_details')
    
    console.log('📋 Current car_details policies:', { policies, policiesError })
    
    if (policiesError) {
      console.log('❌ Could not fetch policies:', policiesError.message)
    } else {
      console.log('✅ Found policies:', policies?.length || 0)
      policies?.forEach((policy, index) => {
        console.log(`  ${index + 1}. ${policy.policyname} - ${policy.perms}`)
      })
    }
    
    // Test 3: Try to create a simple policy manually
    console.log('\n🔧 Testing manual policy creation...')
    
    try {
      // Try to create a simple policy that allows insertion
      const { data: policyData, error: policyError } = await supabase
        .from('pg_policies')
        .insert({
          policyname: 'Test car details insert policy',
          tablename: 'car_details',
          policytype: 'INSERT',
          roles: ['authenticated', 'anon'],
          cmd: 'true',
          with_check: 'true',
          definition: 'true'
        })
        .select()
        .single()

      console.log('📊 Policy creation result:', { policyData, policyError })
      
      if (policyError) {
        console.log('❌ Policy creation failed:', policyError.message)
      } else {
        console.log('✅ Policy created successfully!')
        
        // Test insertion again
        console.log('\n📝 Testing insertion with new policy...')
        const { data: insertData2, error: insertError2 } = await supabase
          .from('car_details')
          .insert(testCarDetails)
          .select()
          .single()

        console.log('📊 Insert result with new policy:', { insertData2, insertError2 })
      }
    } catch (policyErr) {
      console.log('❌ Policy creation failed:', policyErr.message)
    }
    
  } catch (err) {
    console.error('❌ Test error:', err)
  }
}

testRLSPolicies()
