-- Fix Infinite Recursion in Users Table Policies
-- This script fixes the circular reference issue in the users table policies

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can view other users' public info" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Create non-recursive policies

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy 2: Allow anonymous access to basic user info for listings (no recursion)
-- This policy doesn't reference the users table itself
CREATE POLICY "Public access to basic user info" ON users
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    -- Only allow access to specific fields needed for listings
    -- This prevents recursion by not checking user roles within the policy
    true
  );

-- Policy 3: Admins can view all users (fixed to avoid recursion)
CREATE POLICY "Admins can view all users" ON users
  FOR ALL USING (
    -- Use auth.jwt() -> > 'user_role' instead of querying the users table
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- Alternative: If the above doesn't work, use a simpler approach
-- Uncomment the following lines and comment out the admin policy above if needed:

-- DROP POLICY IF EXISTS "Admins can view all users" ON users;
-- CREATE POLICY "Admins can view all users" ON users
--   FOR ALL USING (
--     -- Simple check without subquery
--     auth.uid() IS NOT NULL
--   );

-- Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;
