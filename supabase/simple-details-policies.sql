-- Simple RLS policies for details tables without custom functions
-- This allows users to insert details for their own listings and admins to manage all details

-- Drop existing policies that might be blocking insertion
DROP POLICY IF EXISTS "Anyone can view car details" ON car_details;
DROP POLICY IF EXISTS "Anyone can view house details" ON house_details;
DROP POLICY IF EXISTS "Anyone can view land details" ON land_details;
DROP POLICY IF EXISTS "Anyone can view other item details" ON other_item_details;

-- CAR_DETAILS policies
-- Public can view car details
CREATE POLICY "Public can view car details" ON car_details
    FOR SELECT USING (true);

-- Users can insert car details for their own listings
CREATE POLICY "Users can insert car details" ON car_details
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = car_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Users can update car details for their own listings  
CREATE POLICY "Users can update car details" ON car_details
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = car_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Admins can manage all car details
CREATE POLICY "Admins can manage car details" ON car_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- HOUSE_DETAILS policies
-- Public can view house details
CREATE POLICY "Public can view house details" ON house_details
    FOR SELECT USING (true);

-- Users can insert house details for their own listings
CREATE POLICY "Users can insert house details" ON house_details
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = house_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Users can update house details for their own listings
CREATE POLICY "Users can update house details" ON house_details
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = house_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Admins can manage all house details
CREATE POLICY "Admins can manage house details" ON house_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- LAND_DETAILS policies
-- Public can view land details
CREATE POLICY "Public can view land details" ON land_details
    FOR SELECT USING (true);

-- Users can insert land details for their own listings
CREATE POLICY "Users can insert land details" ON land_details
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = land_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Users can update land details for their own listings
CREATE POLICY "Users can update land details" ON land_details
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = land_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Admins can manage all land details
CREATE POLICY "Admins can manage land details" ON land_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- OTHER_ITEM_DETAILS policies
-- Public can view other item details
CREATE POLICY "Public can view other item details" ON other_item_details
    FOR SELECT USING (true);

-- Users can insert other item details for their own listings
CREATE POLICY "Users can insert other item details" ON other_item_details
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = other_item_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Users can update other item details for their own listings
CREATE POLICY "Users can update other item details" ON other_item_details
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = other_item_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

-- Admins can manage all other item details
CREATE POLICY "Admins can manage other item details" ON other_item_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );
