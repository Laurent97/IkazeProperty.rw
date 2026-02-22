-- Fix watermark_processing_log table structure
-- This migration ensures the table has the correct columns

-- Drop table if it exists to recreate with correct structure
DROP TABLE IF EXISTS watermark_processing_log;

-- Create watermark_processing_log table with correct columns
CREATE TABLE watermark_processing_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    media_id UUID REFERENCES listing_media(id) ON DELETE CASCADE,
    old_url TEXT, -- Original URL before watermark processing
    new_url TEXT, -- URL after watermark processing
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    error_message TEXT,
    processing_started_at TIMESTAMPTZ,
    processing_completed_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX idx_watermark_log_listing_id ON watermark_processing_log(listing_id);
CREATE INDEX idx_watermark_log_media_id ON watermark_processing_log(media_id);
CREATE INDEX idx_watermark_log_status ON watermark_processing_log(status);

-- Enable RLS on watermark_processing_log
ALTER TABLE watermark_processing_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own watermark logs" ON watermark_processing_log;
DROP POLICY IF EXISTS "Service role can manage all watermark logs" ON watermark_processing_log;

-- Create policies for watermark_processing_log table
CREATE POLICY "Users can view own watermark logs" ON watermark_processing_log
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = watermark_processing_log.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage all watermark logs" ON watermark_processing_log
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Grant necessary permissions
GRANT ALL ON watermark_processing_log TO authenticated;
GRANT ALL ON watermark_processing_log TO service_role;
