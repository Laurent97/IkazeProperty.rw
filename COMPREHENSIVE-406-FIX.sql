-- Comprehensive Fix for Registration 406 Error
-- Run this manually in the Supabase SQL Editor

-- Step 1: Fix RLS policies on users table
-- Drop all existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can view other users' public info" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Public access to basic user info" ON users;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Step 2: Create proper RLS policies that work with the trigger
-- Allow the trigger function to insert/update user profiles
CREATE POLICY "Enable service role to manage users" ON users
  FOR ALL USING (
    auth.role() = 'service_role' OR 
    auth.uid() = id
  );

-- Allow authenticated users to read user profiles
CREATE POLICY "Enable read access for all authenticated users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Step 3: Ensure the trigger function exists and works properly
-- Recreate the trigger function with proper permissions
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, role, verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'fullName'),
    NEW.phone,
    'user',
    false
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
        phone = COALESCE(EXCLUDED.phone, public.users.phone);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Step 5: Verify RLS is enabled on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 6: Test the setup by checking current policies
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

-- Step 7: Check if trigger exists
SELECT 
  event_object_table,
  trigger_name,
  action_timing,
  action_condition,
  action_orientation,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
