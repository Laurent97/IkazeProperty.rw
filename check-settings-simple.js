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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSettings() {
  try {
    console.log('Checking settings table...');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    // Check if table exists and get data
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching settings:', error);
      if (error.code === 'PGRST116') {
        console.log('Settings table does not exist or is empty');
      }
    } else {
      console.log('Settings data found:', JSON.stringify(data, null, 2));
      
      // Specifically check mobile money details
      if (data.mobile_money_details) {
        console.log('\nMobile Money Details:');
        console.log('MTN:', JSON.stringify(data.mobile_money_details.mtn, null, 2));
        console.log('Airtel:', JSON.stringify(data.mobile_money_details.airtel, null, 2));
      } else {
        console.log('\nNo mobile_money_details found in settings');
      }
    }
  } catch (err) {
    console.error('Connection error:', err);
  }
}

checkSettings();
