// Debug environment variable loading
console.log('=== Environment Variable Debug ===');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', 'NEXT_PUBLIC_SUPABASE_ANON_KEY' in process.env);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY value:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY exists:', 'SUPABASE_SERVICE_ROLE_KEY' in process.env);
console.log('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY value:', process.env.SUPABASE_SERVICE_ROLE_KEY);

// Try to load the variables explicitly
require('dotenv').config();

console.log('\n=== After dotenv.config() ===');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', 'NEXT_PUBLIC_SUPABASE_ANON_KEY' in process.env);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY value:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY exists:', 'SUPABASE_SUPABASE_SERVICE_ROLE_KEY' in process.env);
console.log('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY value:', process.env.SUPABASE_SERVICE_ROLE_KEY);
