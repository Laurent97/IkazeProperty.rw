@echo off
node -e "
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testQuery() {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        car_details.*,
        listings.title,
        listings.category,
        users.email as seller_email
      FROM listings
      LEFT JOIN car_details ON listings.id = car_details.listing_id
      LEFT JOIN users ON listings.seller_id = users.id
      WHERE listings.id = '7b363cca-3f02-44cd-ade9-8ced0ff1b05b'
      LIMIT 1
      `)

    console.log('Test query result:', { data, error });
    
    if (error) {
      console.error('Test query error:', error);
    } else {
      console.log('Test query data:', data);
    }
  } catch (err) {
    console.error('Test query error:', err);
  }
}

testQuery();
"
