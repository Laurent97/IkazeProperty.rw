-- Add new fields to visit_requests table for buyer contact information and visit details

-- These fields were added to the visit_requests table:
-- buyer_name: text - Buyer's full name
-- buyer_email: text - Buyer's email address  
-- buyer_phone: text - Buyer's phone number
-- visit_date: date - Preferred visit date
-- visit_time: text - Preferred visit time
-- visit_notes: text - Additional visit notes

ALTER TABLE visit_requests 
ADD COLUMN buyer_name TEXT,
ADD COLUMN buyer_email TEXT,
ADD COLUMN buyer_phone TEXT,
ADD COLUMN visit_date DATE,
ADD COLUMN visit_time TEXT,
ADD COLUMN visit_notes TEXT;

-- Add indexes for better performance (skip if already exists)
CREATE INDEX IF NOT EXISTS idx_visit_requests_buyer_name ON visit_requests(buyer_name);
CREATE INDEX IF NOT EXISTS idx_visit_requests_visit_date ON visit_requests(visit_date);
CREATE INDEX IF NOT EXISTS idx_visit_requests_listing_id ON visit_requests(listing_id);
