-- Create essential RLS policies for existing tables
-- Only create policies for tables that actually exist

-- Enable RLS on essential tables if not already enabled
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS listing_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS other_item_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Authenticated users can view listings" ON listings;
DROP POLICY IF EXISTS "Users can manage own listings" ON listings;
DROP POLICY IF EXISTS "Admins can manage all listings" ON listings;
DROP POLICY IF EXISTS "Users can manage own media" ON listing_media;
DROP POLICY IF EXISTS "Admins can manage all media" ON listing_media;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can manage all notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can manage own conversations" ON conversations;
DROP POLICY IF EXISTS "Admins can manage all conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view own disputes" ON disputes;
DROP POLICY IF EXISTS "Users can create own disputes" ON disputes;
DROP POLICY IF EXISTS "Users can update own disputes" ON disputes;
DROP POLICY IF EXISTS "Admins can manage all disputes" ON disputes;
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Admins can manage all payments" ON payments;
DROP POLICY IF EXISTS "Users can create own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON reviews;
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
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() AND u.role = 'admin'
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

-- Listing Media Table Policies
CREATE POLICY "Users can manage own media" ON listing_media
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM listings l 
      WHERE l.id = listing_media.listing_id AND l.seller_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all media" ON listing_media
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Other Item Details Table Policies
CREATE POLICY "Users can manage own item details" ON other_item_details
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM listings l 
      WHERE l.id = other_item_details.listing_id AND l.seller_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all item details" ON other_item_details
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Notifications Table Policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (
    auth.role() = 'authenticated' AND user_id = auth.uid()
  );

CREATE POLICY "Admins can manage all notifications" ON notifications
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Conversations Table Policies
CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    (buyer_id = auth.uid() OR seller_id = auth.uid())
  );

CREATE POLICY "Users can manage own conversations" ON conversations
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    (buyer_id = auth.uid() OR seller_id = auth.uid())
  );

CREATE POLICY "Admins can manage all conversations" ON conversations
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Messages Table Policies
CREATE POLICY "Users can manage own messages" ON messages
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM conversations c 
      WHERE c.id = messages.conversation_id AND 
      (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  );

-- Disputes Table Policies
CREATE POLICY "Users can view own disputes" ON disputes
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    (buyer_id = auth.uid() OR seller_id = auth.uid())
  );

CREATE POLICY "Users can create own disputes" ON disputes
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    (buyer_id = auth.uid() OR seller_id = auth.uid())
  );

CREATE POLICY "Users can update own disputes" ON disputes
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    (buyer_id = auth.uid() OR seller_id = auth.uid())
  );

CREATE POLICY "Admins can manage all disputes" ON disputes
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Payments Table Policies
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    (payer_id = auth.uid() OR payee_id = auth.uid())
  );

CREATE POLICY "Admins can manage all payments" ON payments
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Reviews Table Policies
CREATE POLICY "Users can create own reviews" ON reviews
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND reviewer_id = auth.uid()
  );

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND reviewer_id = auth.uid()
  );

CREATE POLICY "Admins can manage all reviews" ON reviews
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
