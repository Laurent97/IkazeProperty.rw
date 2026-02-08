const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runMigration() {
  try {
    console.log('Running migration...');
    
    const { error } = await supabase.rpc('sql', {
      sql: require('fs').readFileSync('./supabase/20260208_add_payment_instructions_field_direct.sql', 'utf8')
    });
    
    if (error) {
      console.error('Migration error:', error);
    } else {
      console.log('Migration completed successfully!');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

runMigration();
