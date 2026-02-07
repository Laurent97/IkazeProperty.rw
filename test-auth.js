// Test authentication in Next.js environment
console.log('=== Authentication Test ===');
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Key is loaded' : 'Key is missing');
console.log('Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Service key is loaded' : 'Service key is missing');

// Test if we can import and use the auth context
try {
  const { useAuth } = require('@/contexts/AuthContext');
  console.log('✅ AuthContext imported successfully');
  
  // Test if we can create the auth provider
  const { AuthProvider } = require('@/contexts/AuthContext');
  console.log('✅ AuthProvider imported successfully');
  
  // Test if we can create a simple React component
  const React = require('react');
  const { useState } = React;
  
  function TestComponent() {
    const { user } = useAuth();
    console.log('✅ useAuth hook works, user:', user);
    return React.createElement('div', null, `User: ${user?.email || 'No user'}`);
  }
  
  console.log('✅ Test component created successfully');
  
} catch (error) {
  console.error('❌ Error in auth test:', error.message);
}
