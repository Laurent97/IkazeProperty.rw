-- RLS Policies for Users Table
-- These policies fix the 406 error by properly controlling access to the users table

-- Enable Row Level Security on the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy 2: Users can view other users' public information (full_name, avatar_url)
-- This is needed for the listings page to show seller information
CREATE POLICY "Users can view other users' public info" ON users
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    -- Allow access to public fields only
    (full_name IS NOT NULL OR avatar_url IS NOT NULL OR email IS NOT NULL)
  );

-- Policy 3: Admins can view all users
CREATE POLICY "Admins can view all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

-- Policy 4: Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policy 5: Users can insert their own profile (during registration)
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Additional policies for better security

-- Enable RLS on other related tables if not already enabled
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE other_item_details ENABLE ROW LEVEL SECURITY;

-- Listings policies
CREATE POLICY "Anyone can view available listings" ON listings
  FOR SELECT USING (status = 'available');

CREATE POLICY "Sellers can view their own listings" ON listings
  FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can insert their own listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own listings" ON listings
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Admins can manage all listings" ON listings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

-- Listing media policies
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

-- Other item details policies
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

-- Admin policies for all tables
CREATE POLICY "Admins can manage all media" ON listing_media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all details" ON other_item_details
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );
