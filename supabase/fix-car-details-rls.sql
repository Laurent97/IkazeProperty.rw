-- Fix RLS policies for car_details, house_details, and land_details tables
-- These tables need to be publicly viewable for listing details to work properly

-- Enable RLS on details tables if not already enabled
ALTER TABLE IF EXISTS car_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS house_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS land_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS other_item_details ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view car details" ON car_details;
DROP POLICY IF EXISTS "Anyone can view house details" ON house_details;
DROP POLICY IF EXISTS "Anyone can view land details" ON land_details;
DROP POLICY IF EXISTS "Anyone can view other item details" ON other_item_details;

-- Create policies to allow anyone to view details (since they're related to public listings)
CREATE POLICY "Anyone can view car details" ON car_details
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view house details" ON house_details
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view land details" ON land_details
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view other item details" ON other_item_details
    FOR SELECT USING (true);

-- Only allow inserts/updates from admins or the listing owner
CREATE POLICY "Admins can manage car details" ON car_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = car_details.listing_id 
            AND (
                auth.uid() = listings.seller_id 
                OR EXISTS (
                    SELECT 1 FROM users 
                    WHERE users.id = auth.uid() 
                    AND users.role = 'admin'
                )
            )
        )
    );

CREATE POLICY "Admins can manage house details" ON house_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = house_details.listing_id 
            AND (
                auth.uid() = listings.seller_id 
                OR EXISTS (
                    SELECT 1 FROM users 
                    WHERE users.id = auth.uid() 
                    AND users.role = 'admin'
                )
            )
        )
    );

CREATE POLICY "Admins can manage land details" ON land_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = land_details.listing_id 
            AND (
                auth.uid() = listings.seller_id 
                OR EXISTS (
                    SELECT 1 FROM users 
                    WHERE users.id = auth.uid() 
                    AND users.role = 'admin'
                )
            )
        )
    );

CREATE POLICY "Admins can manage other item details" ON other_item_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = other_item_details.listing_id 
            AND (
                auth.uid() = listings.seller_id 
                OR EXISTS (
                    SELECT 1 FROM users 
                    WHERE users.id = auth.uid() 
                    AND users.role = 'admin'
                )
            )
        )
    );
