-- Fix RLS policies for users table
-- This migration ensures proper access control for the users table

-- First, ensure RLS is enabled on the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create policies for the users table

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT
    USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy 3: Service role (admin) can do everything
CREATE POLICY "Service role can manage all users" ON users
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Policy 4: Users can insert their own profile (for registration)
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy 5: Allow public read access to basic user info for listings
CREATE POLICY "Public can view basic user info" ON users
    FOR SELECT
    USING (true); -- Allow public access to user profiles for listing display

-- Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;
GRANT SELECT ON users TO anon;
