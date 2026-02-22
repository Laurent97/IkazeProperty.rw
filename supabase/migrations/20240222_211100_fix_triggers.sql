-- Fix or create triggers for watermark processing
-- This migration ensures triggers work correctly with the updated table structure

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_listing_media_insert ON listing_media;
DROP FUNCTION IF EXISTS process_watermark_for_listing_media();

-- Create function to process watermark when media is uploaded
CREATE OR REPLACE FUNCTION process_watermark_for_listing_media()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into watermark processing log
    INSERT INTO watermark_processing_log (
        listing_id,
        media_id,
        old_url,
        status,
        processing_started_at
    ) VALUES (
        NEW.listing_id,
        NEW.id,
        NEW.url, -- Store original URL as old_url
        'pending',
        NOW()
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically process watermarks when media is uploaded
CREATE TRIGGER on_listing_media_insert
    AFTER INSERT ON listing_media
    FOR EACH ROW
    EXECUTE FUNCTION process_watermark_for_listing_media();

-- Grant necessary permissions for the trigger function
GRANT EXECUTE ON FUNCTION process_watermark_for_listing_media() TO authenticated;
GRANT EXECUTE ON FUNCTION process_watermark_for_listing_media() TO service_role;
