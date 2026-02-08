const fetch = require('node-fetch');

async function runMigration() {
  try {
    console.log('Running migration via API...');
    
    const response = await fetch('http://localhost:3000/api/payments/run-migration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql: require('fs').readFileSync('supabase/20260208_add_payment_instructions_field.sql', 'utf8')
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Migration completed successfully!');
    } else {
      console.error('Migration error:', result.error);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

runMigration();
