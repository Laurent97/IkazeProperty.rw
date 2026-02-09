-- Simple fix for car_details, house_details, and land_details access
-- Allow anyone to view details of public listings

-- Enable RLS on details tables if not already enabled
ALTER TABLE IF EXISTS car_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS house_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS land_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS other_item_details ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can view car details" ON car_details;
DROP POLICY IF EXISTS "Anyone can view house details" ON house_details;
DROP POLICY IF EXISTS "Anyone can view land details" ON land_details;
DROP POLICY IF EXISTS "Anyone can view other item details" ON other_item_details;
DROP POLICY IF EXISTS "Admins can manage car details" ON car_details;
DROP POLICY IF EXISTS "Admins can manage house details" ON house_details;
DROP POLICY IF EXISTS "Admins can manage land details" ON land_details;
DROP POLICY IF EXISTS "Admins can manage other item details" ON other_item_details;

-- Create simple public access policies for all details tables
CREATE POLICY "Public can view car details" ON car_details
    FOR SELECT USING (true);

CREATE POLICY "Public can view house details" ON house_details
    FOR SELECT USING (true);

CREATE POLICY "Public can view land details" ON land_details
    FOR SELECT USING (true);

CREATE POLICY "Public can view other item details" ON other_item_details
    FOR SELECT USING (true);

-- Allow inserts/updates (only admins or listing owners should be able to do this)
CREATE POLICY "Users can manage own car details" ON car_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = car_details.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all car details" ON car_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Similar policies for house details
CREATE POLICY "Users can manage own house details" ON house_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = house_details.listing_id 
            AND listings.seller_id = auth.uid()
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

-- Similar policies for land details
CREATE POLICY "Users can manage own land details" ON land_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = land_details.listing_id 
            AND listings.seller_id = auth.uid()
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

-- Similar policies for other item details
CREATE POLICY "Users can manage own other item details" ON other_item_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = other_item_details.listing_id 
            AND listings.seller_id = auth.uid()
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
