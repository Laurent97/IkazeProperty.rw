import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  try {
    console.log('Running likes functions migration...')
    
    // Create increment_likes function
    const { error: incrementError } = await supabase.rpc('sql', {
      sql: `
        CREATE OR REPLACE FUNCTION increment_likes(listing_id UUID)
        RETURNS VOID AS $$
        BEGIN
            UPDATE listings 
            SET likes = likes + 1 
            WHERE id = listing_id;
        END;
        $$ LANGUAGE plpgsql;
      `
    })

    if (incrementError) {
      console.error('Error creating increment_likes function:', incrementError)
    } else {
      console.log('✅ increment_likes function created successfully')
    }

    // Create decrement_likes function
    const { error: decrementError } = await supabase.rpc('sql', {
      sql: `
        CREATE OR REPLACE FUNCTION decrement_likes(listing_id UUID)
        RETURNS VOID AS $$
        BEGIN
            UPDATE listings 
            SET likes = GREATEST(likes - 1, 0) 
            WHERE id = listing_id;
        END;
        $$ LANGUAGE plpgsql;
      `
    })

    if (decrementError) {
      console.error('Error creating decrement_likes function:', decrementError)
    } else {
      console.log('✅ decrement_likes function created successfully')
    }

    console.log('Migration completed!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

runMigration()
