const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function runMainSettingsMigration() {
  try {
    console.log('Running main settings table migration...');
    
    // Read the SQL file
    const fs = require('fs');
    const sql = fs.readFileSync('./create-main-settings-table.sql', 'utf8');
    
    console.log('SQL file loaded, attempting to create table...');
    
    // Try to insert default settings first - this will tell us if the table exists
    const defaultSettings = {
      id: 1,
      commission_rate: 5.00,
      min_commission: 1000,
      max_commission: 100000,
      payment_methods: ['mobile_money', 'bank_transfer', 'cash'],
      mobile_money_providers: ['mtn', 'airtel'],
      bank_details: {
        bank_name: "",
        account_name: "",
        account_number: "",
        branch_code: ""
      },
      mobile_money_details: {
        mtn: {
          phone_number: "",
          account_name: "",
          merchant_id: "",
          payment_instructions: ""
        },
        airtel: {
          phone_number: "",
          account_name: "",
          merchant_id: "",
          payment_instructions: ""
        }
      },
      visit_fee_enabled: true,
      visit_fee_amount: 15000,
      visit_fee_payment_methods: {},
      auto_approve_listings: false,
      require_email_verification: true,
      enable_notifications: true
    };
    
    const { data, error } = await supabaseAdmin
      .from('settings')
      .upsert(defaultSettings)
      .select();
    
    if (error) {
      if (error.code === 'PGRST204') {
        console.log('❌ Settings table does not exist.');
        console.log('\n📋 To create the settings table manually:');
        console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
        console.log('2. Select your project');
        console.log('3. Go to SQL Editor');
        console.log('4. Copy and paste the contents of create-main-settings-table.sql');
        console.log('5. Click "Run" to execute the SQL');
        console.log('\n📄 SQL file location: create-main-settings-table.sql');
      } else {
        console.error('❌ Error creating settings:', error);
      }
    } else {
      console.log('✅ Settings table created successfully!');
      console.log('📊 Default settings inserted:', data);
    }
    
  } catch (err) {
    console.error('❌ Migration error:', err);
    console.log('\n📋 Manual setup required:');
    console.log('Please run the SQL in create-main-settings-table.sql manually in Supabase dashboard.');
  }
}

runMainSettingsMigration();
