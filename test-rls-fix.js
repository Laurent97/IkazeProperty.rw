const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testRLSFix() {
    try {
        console.log('Testing RLS fix...');
        
        // Test 1: Try to query users table
        console.log('\n1. Testing users table access...');
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .limit(1);
        
        if (usersError) {
            console.error('❌ Users table error:', usersError);
        } else {
            console.log('✅ Users table accessible, found', users.length, 'users');
        }
        
        // Test 2: Try to query listings table
        console.log('\n2. Testing listings table access...');
        const { data: listings, error: listingsError } = await supabase
            .from('listings')
            .select('*')
            .limit(1);
        
        if (listingsError) {
            console.error('❌ Listings table error:', listingsError);
        } else {
            console.log('✅ Listings table accessible, found', listings.length, 'listings');
        }
        
        // Test 3: Try the specific query that was failing
        console.log('\n3. Testing the specific failing query...');
        const testUserId = 'dc0f31c8-603b-4e00-b52c-6c88336a156c';
        const { data: userQuery, error: userQueryError } = await supabase
            .from('users')
            .select('*')
            .eq('id', testUserId);
        
        if (userQueryError) {
            console.error('❌ Specific user query error:', userQueryError);
        } else {
            console.log('✅ Specific user query successful, found', userQuery.length, 'users');
        }
        
        // Test 4: Try the listings query that was failing
        console.log('\n4. Testing listings query for seller...');
        const { data: sellerListings, error: sellerError } = await supabase
            .from('listings')
            .select('*')
            .eq('seller_id', testUserId)
            .order('created_at', { ascending: false })
            .limit(5);
        
        if (sellerError) {
            console.error('❌ Seller listings query error:', sellerError);
        } else {
            console.log('✅ Seller listings query successful, found', sellerListings.length, 'listings');
        }
        
        console.log('\n🎉 RLS fix test completed!');
        
    } catch (error) {
        console.error('❌ Test error:', error.message);
    }
}

testRLSFix();
