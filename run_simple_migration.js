const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://swshkufpktnacbotddpb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c2hrdWZwa3RuYWNib3RkZHBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ1MTgzOSwiZXhwIjoyMDg2MDI3ODM5fQ.T_LnaxClQV-ddubCnBnVk0d0lgkmT0GUs1EsD1qVG3U');

async function runMigration() {
  try {
    console.log('Running simple migration...');
    
    const { error } = await supabase.rpc('sql_query', {
      query: require('fs').readFileSync('./supabase/fix_rls_recursion.sql', 'utf8')
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
