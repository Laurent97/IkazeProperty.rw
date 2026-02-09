const { createClient } = require('@supabase/supabase-js')

// Use the service role key for admin access
const supabase = createClient(
  'https://swshkufpktnacbotddpb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c2hrdWZwa3RuYWNib3RkZHBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ1MTgzOSwiZXhwIjoyMDg2MDI3ODM5fQ.T_LnaxClQV-ddubCnBnVk0d0lgkmT0GUs1EsD1qVG3U'
)

async function testCreateCarListing() {
  try {
    console.log('🧪 Testing car listing creation API...')
    
    // Test data that would be sent from frontend
    const listingData = {
      title: 'Test Car Listing',
      description: 'Test description',
      price: 15000,
      currency: 'RWF',
      price_type: 'fixed',
      category: 'cars',
      transaction_type: 'sale',
      location: {
        province: 'Kigali',
        district: 'Nyarugenge',
        sector: 'Muhima',
        cell: 'Rugando',
        village: 'Rugando',
        address: 'Test Address'
      },
      seller_id: '54e47ad8-42b5-4058-b0d0-b3fd6accb6df', // Test user ID
      commission_rate: 0.02,
      commission_type: 'owner',
      commission_agreed: true,
      featured: false,
      promoted: false,
      views: 0,
      likes: 0,
      visit_fee_enabled: true,
      visit_fee_amount: 15000,
      visit_fee_payment_methods: {
        mtn_momo: { phone_number: '+250737060025' },
        airtel_money: { phone_number: '' },
        equity_bank: { account_name: '', account_number: '' }
      },
      // This is the key part - car details
      car_details: {
        vehicle_type: 'car',
        make: 'Toyota',
        model: 'Camry',
        year_manufacture: 2020,
        condition: 'used',
        fuel_type: 'petrol',
        transmission: 'automatic',
        engine_capacity: 2000,
        mileage: 50000,
        color: 'blue',
        doors: 4,
        seats: 5,
        features: ['air conditioning', 'power windows'],
        ownership_papers: true,
        insurance_status: 'valid',
        road_worthiness: true,
        last_service_date: '2024-01-01',
        rental_daily_rate: null,
        rental_weekly_rate: null,
        rental_monthly_rate: null,
        security_deposit: null,
        minimum_rental_period: null,
        delivery_option: false,
        driver_included: false
      }
    }
    
    console.log('📝 Sending listing data:', listingData)
    
    // Call the API endpoint directly
    const response = await fetch('http://localhost:3001/api/listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c2hrdWZwa3RuYWNib3RkZHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTE4MzksImV4cCI6MjA4NjAyNzgzOX0.XjlJZscCno-_czhwXqwdSlKgUUpDZty6i37mtwqcnA8'
      },
      body: JSON.stringify(listingData)
    })
    
    const result = await response.json()
    console.log('📥 API Response:', result)
    
    if (result.success) {
      console.log('✅ Listing created successfully!')
      
      // Check if car details were saved
      const { data: carDetails, error: carError } = await supabase
        .from('car_details')
        .select('*')
        .eq('listing_id', result.data.id)
        .single()

      console.log('🚗 Car details after creation:', { carDetails, carError })
    } else {
      console.log('❌ Listing creation failed:', result.error)
    }
    
  } catch (err) {
    console.error('Test error:', err)
  }
}

testCreateCarListing()
