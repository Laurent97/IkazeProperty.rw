// Test environment variable loading
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Key is loaded' : 'Key is missing');
console.log('Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Service key is loaded' : 'Service key is missing');

// Test Supabase client initialization
try {
  const { createClient } = require('@supabase/supabase-js');
  const { Database } = require('@/types/database');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('Testing Supabase client initialization...');
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  
  console.log('✅ Supabase client created successfully');
  console.log('URL:', supabaseUrl);
  console.log('Anon Key present:', !!supabaseAnonKey);
  
} catch (error) {
  console.error('❌ Error creating Supabase client:', error.message);
}
