const { createClient } = require('@supabase/supabase-js');

// Create admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  try {
    console.log('Adding WhatsApp phone field to site_settings table...');
    
    // Add the column
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT NOT NULL DEFAULT \'+250737060025\''
    });
    
    if (alterError) {
      console.error('Error adding column:', alterError);
      return;
    }
    
    // Update existing records
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: 'UPDATE site_settings SET whatsapp_phone = \'+250737060025\' WHERE whatsapp_phone IS NULL'
    });
    
    if (updateError) {
      console.error('Error updating records:', updateError);
      return;
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('WhatsApp phone field added to site_settings table');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();
