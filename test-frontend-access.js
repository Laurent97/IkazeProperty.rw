const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
      process.env[key.trim()] = values.join('=').trim();
    }
  });
}

// Use the same client as the frontend (public key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testFrontendAccess() {
  try {
    console.log('Testing frontend access to settings...');
    console.log('Using anon key (same as frontend)');
    
    // Test exactly what the frontend would see
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (error) {
      console.error('Frontend would see error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
    } else {
      console.log('✅ Frontend can access settings');
      console.log('Data structure:', JSON.stringify(data, null, 2));
      
      // Check specifically for mobile money details
      if (data.mobile_money_details) {
        console.log('\n=== Mobile Money Details (Frontend View) ===');
        console.log('MTN phone:', data.mobile_money_details.mtn?.phone_number);
        console.log('MTN account:', data.mobile_money_details.mtn?.account_name);
        console.log('Airtel phone:', data.mobile_money_details.airtel?.phone_number);
        console.log('Airtel account:', data.mobile_money_details.airtel?.account_name);
      } else {
        console.log('\n❌ No mobile_money_details found');
      }
      
      // Check bank details
      if (data.bank_details) {
        console.log('\n=== Bank Details (Frontend View) ===');
        console.log('Bank:', data.bank_details.bank_name);
        console.log('Account:', data.bank_details.account_name);
        console.log('Number:', data.bank_details.account_number);
      } else {
        console.log('\n❌ No bank_details found');
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

testFrontendAccess();
