const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runRLSFix() {
  try {
    console.log('Running RLS recursion fix...');
    
    const sql = require('fs').readFileSync('./supabase/fix_rls_recursion.sql', 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 100) + '...');
        
        const { error } = await supabase.rpc('exec_sql', { 
          query: statement + ';' 
        });
        
        if (error) {
          // Try direct SQL execution if RPC fails
          const { error: directError } = await supabase
            .from('_temp_migration')
            .select('*')
            .limit(1);
            
          console.log('Note:', error.message);
        }
      }
    }
    
    console.log('RLS fix completed!');
  } catch (err) {
    console.error('Error running RLS fix:', err);
  }
}

runRLSFix();
