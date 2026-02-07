-- Complete Reset and Fix for Users Table Policies
-- This script removes ALL existing policies and creates a simple working set

-- Drop ALL existing policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can view other users' public info" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Public access to basic user info" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON users;

-- Create simple, non-recursive policies that work

-- Main policy: Allow authenticated users to read user data
CREATE POLICY "Enable read access for all authenticated users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Optional: Add update/insert policies if needed
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Show the final policies
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
