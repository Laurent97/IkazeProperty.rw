-- Simple Fix for 406 Error on Users Table
-- This creates a simple, non-recursive policy that allows access

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can view other users' public info" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Public access to basic user info" ON users;

-- Create a simple permissive policy that allows authenticated users to read user data
-- This is the minimal policy needed to fix the 406 error
CREATE POLICY "Enable read access for all authenticated users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Optional: If you need more granular control, you can add these later:
-- Policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policy for users to insert their own profile
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Test the policy by checking what exists now
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

-- Also verify RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'users';
