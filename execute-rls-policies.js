const { createClient } = require('@supabase/supabase-js')

// Use the service role key for admin operations
const supabase = createClient(
  'https://swshkufpktnacbotddpb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c2hrdWZwa3RuYWNib3RkZHBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ1MTgzOSwiZXhwIjoyMDg2MDI3ODM5fQ.T_LnaxClQV-ddubCnBnVk0d0lgkmT0GUs1EsD1qVG3U'
)

async function executeSQL() {
  try {
    console.log('🔧 Executing RLS policies for details tables...')
    
    // Read the SQL file
    const fs = require('fs')
    const path = require('path')
    const sqlFile = path.join(__dirname, 'supabase', 'simple-details-policies.sql')
    
    const sql = fs.readFileSync(sqlFile, 'utf8')
    console.log('📄 SQL file read successfully')
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`\n🔧 Executing statement ${i + 1}/${statements.length}:`)
      console.log(statement.substring(0, 100) + '...')
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { query: statement })
        
        if (error) {
          console.error('❌ Error:', error)
        } else {
          console.log('✅ Success:', data)
        }
      } catch (err) {
        console.error('❌ Statement failed:', err.message)
      }
    }
    
    console.log('\n✅ RLS policies execution completed!')
    
  } catch (err) {
    console.error('❌ Execution error:', err)
  }
}

executeSQL()
