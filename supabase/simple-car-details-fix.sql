-- Simple fix for car details access without custom functions
-- This script enables proper RLS policies for car details, house details, and land details

-- Enable RLS on details tables if not already enabled
ALTER TABLE IF EXISTS car_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS house_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS land_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS other_item_details ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be causing issues
DROP POLICY IF EXISTS "Public can view car details" ON car_details;
DROP POLICY IF EXISTS "Public can view house details" ON house_details;
DROP POLICY IF EXISTS "Public can view land details" ON land_details;
DROP POLICY IF EXISTS "Public can view other item details" ON other_item_details;

-- Create simple public access policies
CREATE POLICY "Public can view car details" ON car_details
    FOR SELECT USING (true);

CREATE POLICY "Public can view house details" ON house_details
    FOR SELECT USING (true);

CREATE POLICY "Public can view land details" ON land_details
    FOR SELECT USING (true);

CREATE POLICY "Public can view other item details" ON other_item_details
    FOR SELECT USING (true);

-- Allow owners to manage their own details
CREATE POLICY "Users can manage own car details" ON car_details
    FOR ALL USING (
        auth.uid() = car_details.listing_id
    );

CREATE POLICY "Users can manage own house details" ON house_details
    FOR ALL USING (
        auth.uid() = house_details.listing_id
    );

CREATE POLICY "Users can manage own land details" ON land_details
    FOR ALL USING (
        auth.uid() = land_details.listing_id
    );

CREATE POLICY "Users can manage own other item details" ON other_item_details
    FOR ALL USING (
        auth.uid() = other_item_details.listing_id
    );

-- Allow admins to manage all details
CREATE POLICY "Admins can manage all car details" ON car_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all house details" ON house_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all land details" ON land_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all other item details" ON other_item_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );
