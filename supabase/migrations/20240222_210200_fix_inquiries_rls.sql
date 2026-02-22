-- Fix RLS policies for inquiries table
-- This migration ensures proper access control for inquiries table

-- First, ensure RLS is enabled on the inquiries table
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own inquiries" ON inquiries;
DROP POLICY IF EXISTS "Users can create inquiries" ON inquiries;
DROP POLICY IF EXISTS "Service role can manage all inquiries" ON inquiries;
DROP POLICY IF EXISTS "Sellers can view inquiries for their listings" ON inquiries;

-- Create policies for the inquiries table

-- Policy 1: Users can view inquiries they are involved in (as buyer or seller)
CREATE POLICY "Users can view own inquiries" ON inquiries
    FOR SELECT
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Policy 2: Authenticated users can create inquiries (as buyers)
CREATE POLICY "Users can create inquiries" ON inquiries
    FOR INSERT
    WITH CHECK (auth.uid() = buyer_id);

-- Policy 3: Service role (admin) can do everything
CREATE POLICY "Service role can manage all inquiries" ON inquiries
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Policy 4: Sellers can view inquiries for their listings
CREATE POLICY "Sellers can view inquiries for their listings" ON inquiries
    FOR SELECT
    USING (auth.uid() = seller_id);

-- Grant necessary permissions
GRANT ALL ON inquiries TO authenticated;
GRANT ALL ON inquiries TO service_role;
GRANT SELECT ON inquiries TO anon;
