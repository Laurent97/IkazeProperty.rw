-- Fix watermark constraint issues
-- This script removes all watermark-related constraints and triggers

-- 1. Drop the problematic table
DROP TABLE IF EXISTS watermark_processing_log CASCADE;

-- 2. Remove any triggers that reference watermark tables
DROP TRIGGER IF EXISTS on_media_upload_log_watermark ON listing_media;
DROP TRIGGER IF EXISTS on_media_update_watermark ON listing_media;
DROP TRIGGER IF EXISTS after_media_insert_watermark ON listing_media;

-- 3. Remove watermark-related functions
DROP FUNCTION IF EXISTS log_watermark_processing() CASCADE;
DROP FUNCTION IF EXISTS process_watermark_for_media() CASCADE;

-- 4. Check for any remaining watermark policies
DROP POLICY IF EXISTS "Users can view watermarked media" ON listing_media;
DROP POLICY IF EXISTS "Users can update watermarked media" ON listing_media;

-- 5. Reset any watermark-related columns
ALTER TABLE listing_media 
DROP COLUMN IF EXISTS watermark_status CASCADE,
DROP COLUMN IF EXISTS watermark_url CASCADE,
DROP COLUMN IF EXISTS is_watermarked CASCADE;

-- 6. Clean up any watermark-related indexes
DROP INDEX IF EXISTS idx_watermark_status;
DROP INDEX IF EXISTS idx_watermark_processing;

-- 7. Verify the table structure
\d listing_media

-- 8. Test insert to make sure it works
INSERT INTO listing_media (
    listing_id, 
    media_type, 
    url, 
    public_id, 
    order_index, 
    is_primary,
    created_at,
    updated_at
) VALUES (
    'test-id',
    'image',
    'https://test.com/test.jpg',
    'test/test.jpg',
    0,
    false,
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- 9. Clean up test data
DELETE FROM listing_media WHERE listing_id = 'test-id';

SELECT 'Watermark system cleanup completed successfully' as status;
