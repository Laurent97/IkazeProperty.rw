-- Fix RLS policies for listings table
-- This migration ensures proper access control for the listings table

-- First, ensure RLS is enabled on the listings table
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view all listings" ON listings;
DROP POLICY IF EXISTS "Users can insert own listings" ON listings;
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
DROP POLICY IF EXISTS "Service role can manage all listings" ON listings;
DROP POLICY IF EXISTS "Users can delete own listings" ON listings;

-- Create policies for the listings table

-- Policy 1: Everyone (including anonymous) can view available listings
CREATE POLICY "Users can view all listings" ON listings
    FOR SELECT
    USING (status = 'available' OR auth.uid() = seller_id);

-- Policy 2: Authenticated users can insert their own listings
CREATE POLICY "Users can insert own listings" ON listings
    FOR INSERT
    WITH CHECK (auth.uid() = seller_id);

-- Policy 3: Users can update their own listings
CREATE POLICY "Users can update own listings" ON listings
    FOR UPDATE
    USING (auth.uid() = seller_id)
    WITH CHECK (auth.uid() = seller_id);

-- Policy 4: Users can delete their own listings
CREATE POLICY "Users can delete own listings" ON listings
    FOR DELETE
    USING (auth.uid() = seller_id);

-- Policy 5: Service role (admin) can do everything
CREATE POLICY "Service role can manage all listings" ON listings
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Grant necessary permissions
GRANT ALL ON listings TO authenticated;
GRANT ALL ON listings TO service_role;
GRANT SELECT ON listings TO anon;
