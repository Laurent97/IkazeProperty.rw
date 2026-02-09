-- Create RLS policies that allow users to insert details for their own listings
-- This fixes the issue where car_details, house_details, land_details, and other_item_details
-- are not being saved during listing creation

-- Enable RLS on details tables if not already enabled
ALTER TABLE IF EXISTS car_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS house_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS land_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS other_item_details ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policies that might be blocking insertion
DROP POLICY IF EXISTS "Public can view car details" ON car_details;
DROP POLICY IF EXISTS "Public can view house details" ON house_details;
DROP POLICY IF EXISTS "Public can view land details" ON land_details;
DROP POLICY IF EXISTS "Public can view other item details" ON other_item_details;
DROP POLICY IF EXISTS "Users can manage own car details" ON car_details;
DROP POLICY IF EXISTS "Users can manage own house details" ON house_details;
DROP POLICY IF EXISTS "Users can manage own land details" ON land_details;
DROP POLICY IF EXISTS "Users can manage own other item details" ON other_item_details;
DROP POLICY IF EXISTS "Admins can manage all car details" ON car_details;
DROP POLICY IF EXISTS "Admins can manage all house details" ON house_details;
DROP POLICY IF EXISTS "Admins can manage all land details" ON land_details;
DROP POLICY IF EXISTS "Admins can manage all other item details" ON other_item_details;

-- Create policies for CAR_DETAILS
-- Public can view car details (for listing detail pages)
CREATE POLICY "Anyone can view car details" ON car_details
    FOR SELECT USING (true);

-- Users can insert car details for their own listings
CREATE POLICY "Users can insert car details for own listings" ON car_details
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = car_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Users can update car details for their own listings
CREATE POLICY "Users can update car details for own listings" ON car_details
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = car_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Admins can do anything with car details
CREATE POLICY "Admins can manage all car details" ON car_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Create policies for HOUSE_DETAILS
-- Public can view house details
CREATE POLICY "Anyone can view house details" ON house_details
    FOR SELECT USING (true);

-- Users can insert house details for their own listings
CREATE POLICY "Users can insert house details for own listings" ON house_details
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = house_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Users can update house details for their own listings
CREATE POLICY "Users can update house details for own listings" ON house_details
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = house_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Admins can do anything with house details
CREATE POLICY "Admins can manage all house details" ON house_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Create policies for LAND_DETAILS
-- Public can view land details
CREATE POLICY "Anyone can view land details" ON land_details
    FOR SELECT USING (true);

-- Users can insert land details for their own listings
CREATE POLICY "Users can insert land details for own listings" ON land_details
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = land_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Users can update land details for their own listings
CREATE POLICY "Users can update land details for own listings" ON land_details
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = land_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Admins can do anything with land details
CREATE POLICY "Admins can manage all land details" ON land_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Create policies for OTHER_ITEM_DETAILS
-- Public can view other item details
CREATE POLICY "Anyone can view other item details" ON other_item_details
    FOR SELECT USING (true);

-- Users can insert other item details for their own listings
CREATE POLICY "Users can insert other item details for own listings" ON other_item_details
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = other_item_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Users can update other item details for their own listings
CREATE POLICY "Users can update other item details for own listings" ON other_item_details
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = other_item_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Admins can do anything with other item details
CREATE POLICY "Admins can manage all other item details" ON other_item_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );
