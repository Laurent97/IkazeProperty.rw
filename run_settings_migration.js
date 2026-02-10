const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Found' : 'Missing');
console.log('Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Found' : 'Missing');

async function runSettingsMigration() {
  try {
    console.log('Running settings table migration...');
    
    const sql = require('fs').readFileSync('./create-settings-table.sql', 'utf8');
    
    // Execute the SQL
    const { error } = await supabase.rpc('sql', { sql });
    
    if (error) {
      console.error('Migration error:', error);
      console.log('Trying individual statements...');
      
      // Split by semicolons and execute each statement
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (const statement of statements) {
        console.log('Executing:', statement.substring(0, 100) + '...');
        const { error: stmtError } = await supabase.rpc('sql', { sql: statement });
        if (stmtError) {
          console.error('Statement error:', stmtError);
        } else {
          console.log('Statement executed successfully');
        }
      }
    } else {
      console.log('Settings table migration completed successfully!');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

runSettingsMigration();
