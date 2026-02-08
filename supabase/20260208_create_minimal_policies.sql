-- Create minimal RLS policies for core existing tables
-- Check what tables exist and create policies accordingly

-- Enable RLS on tables that we know exist
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Authenticated users can view listings" ON listings;
DROP POLICY IF EXISTS "Users can manage own listings" ON listings;
DROP POLICY IF EXISTS "Admins can manage all listings" ON listings;
DROP POLICY IF EXISTS "Anyone can view settings" ON settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON settings;
DROP POLICY IF EXISTS "Anyone can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;

-- Users Table Policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (
    auth.role() = 'authenticated' AND id = auth.uid()
  );

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND id = auth.uid()
  );

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- Listings Table Policies
CREATE POLICY "Authenticated users can view listings" ON listings
  FOR SELECT USING (
    auth.role() = 'authenticated' AND status = 'available'
  );

CREATE POLICY "Users can manage own listings" ON listings
  FOR ALL USING (
    auth.role() = 'authenticated' AND seller_id = auth.uid()
  );

CREATE POLICY "Admins can manage all listings" ON listings
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Settings Table Policies
CREATE POLICY "Anyone can view settings" ON settings
  FOR SELECT USING (
    auth.role() = 'authenticated'
  );

CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Site Settings Table Policies
CREATE POLICY "Anyone can view site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON site_settings
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );
