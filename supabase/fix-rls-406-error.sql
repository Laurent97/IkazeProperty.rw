-- Fix RLS for 406 Error
-- This script enables RLS on missing tables and creates necessary policies

-- Enable RLS on tables that don't have it
ALTER TABLE listing_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE other_item_details ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can view other users' public info" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Create/Recreate users table policies (most important for fixing 406)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- This is the key policy - allows viewing other users' public info for listings
CREATE POLICY "Users can view other users' public info" ON users
  FOR SELECT USING (
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Admins can view all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

-- Create policies for listing_media table
CREATE POLICY "Anyone can view media for available listings" ON listing_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings l 
      WHERE l.id = listing_media.listing_id 
      AND l.status = 'available'
    )
  );

CREATE POLICY "Sellers can manage their listing media" ON listing_media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM listings l 
      WHERE l.id = listing_media.listing_id 
      AND l.seller_id = auth.uid()
    )
  );

-- Create policies for other_item_details table
CREATE POLICY "Anyone can view details for available listings" ON other_item_details
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings l 
      WHERE l.id = other_item_details.listing_id 
      AND l.status = 'available'
    )
  );

CREATE POLICY "Sellers can manage their listing details" ON other_item_details
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM listings l 
      WHERE l.id = other_item_details.listing_id 
      AND l.seller_id = auth.uid()
    )
  );

-- Verify the changes
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('users', 'listings', 'listing_media', 'other_item_details')
ORDER BY tablename;

-- Show the policies that were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename IN ('users', 'listing_media', 'other_item_details')
ORDER BY tablename, policyname;
