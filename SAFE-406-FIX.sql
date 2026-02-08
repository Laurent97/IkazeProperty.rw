-- Safe Fix for Registration 406 Error (Handles Existing Policies)
-- Run this in Supabase SQL Editor

-- Step 1: Check what policies currently exist
-- (This will show you what's already there)
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

-- Step 2: Drop all existing policies that might cause conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can view other users' public info" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Public access to basic user info" ON users;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Enable service role to manage users" ON users;

-- Step 3: Create clean, simple policies that work
-- Allow service role to do anything (needed for the trigger)
CREATE POLICY "Enable service role full access" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read user profiles
CREATE POLICY "Allow authenticated read access" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to manage their own profile
CREATE POLICY "Allow self profile management" ON users
  FOR ALL USING (auth.uid() = id);

-- Step 4: Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 5: Verify the new policies
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

-- Step 6: Test the trigger function
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_auth_user';
