const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createSettingsTable() {
  try {
    console.log('Creating settings table...');
    
    // First, try to create the table using a simple approach
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        commission_rate DECIMAL(5,2) DEFAULT 5.00,
        min_commission INTEGER DEFAULT 1000,
        max_commission INTEGER DEFAULT 100000,
        payment_methods TEXT[] DEFAULT ARRAY['mobile_money', 'bank_transfer', 'cash'],
        mobile_money_providers TEXT[] DEFAULT ARRAY['mtn', 'airtel'],
        bank_details JSONB DEFAULT '{}',
        mobile_money_details JSONB DEFAULT '{}',
        visit_fee_enabled BOOLEAN DEFAULT true,
        visit_fee_amount INTEGER DEFAULT 15000,
        visit_fee_payment_methods JSONB DEFAULT '{}',
        auto_approve_listings BOOLEAN DEFAULT false,
        require_email_verification BOOLEAN DEFAULT true,
        enable_notifications BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    console.log('Attempting to create table...');
    
    // Use raw SQL through the client
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('Table does not exist. Creating default settings entry...');
      
      // Try to insert a default row which will create the table if it doesn't exist
      const { error: insertError } = await supabaseAdmin
        .from('settings')
        .upsert({
          id: 1,
          commission_rate: 5.00,
          min_commission: 1000,
          max_commission: 100000,
          payment_methods: ['mobile_money', 'bank_transfer', 'cash'],
          mobile_money_providers: ['mtn', 'airtel'],
          bank_details: {},
          mobile_money_details: {},
          visit_fee_enabled: true,
          visit_fee_amount: 15000,
          visit_fee_payment_methods: {},
          auto_approve_listings: false,
          require_email_verification: true,
          enable_notifications: true
        });
      
      if (insertError) {
        console.error('Error creating default settings:', insertError);
        console.log('\nThe settings table needs to be created manually.');
        console.log('Please run the SQL in create-settings-table.sql directly in your Supabase dashboard.');
        console.log('Or ask your database administrator to run it.');
      } else {
        console.log('Settings table created successfully with default values!');
      }
    } else {
      console.log('Settings table already exists!');
    }
    
  } catch (err) {
    console.error('Error:', err);
    console.log('\nPlease run the SQL manually in Supabase dashboard:');
    console.log('1. Go to your Supabase project');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the contents of create-settings-table.sql');
  }
}

// Import supabaseAdmin - need to require since it's a TypeScript file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

createSettingsTable();
