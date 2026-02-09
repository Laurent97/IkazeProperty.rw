-- EMERGENCY FIX: Remove all watermark transformations to restore images immediately
-- This will restore all images to working state

UPDATE listing_media 
SET url = REGEXP_REPLACE(
    url, 
    '/upload/.*?/', 
    '/upload/'
)
WHERE media_type = 'image';

-- Remove any remaining watermark transformations
UPDATE listing_media 
SET url = REGEXP_REPLACE(
    url, 
    '/upload/w_.*?/', 
    '/upload/'
)
WHERE media_type = 'image';

-- Remove any l_text transformations
UPDATE listing_media 
SET url = REGEXP_REPLACE(
    url, 
    '/upload/.*l_text:.*?/', 
    '/upload/'
)
WHERE media_type = 'image';

-- Final cleanup - ensure clean URLs
UPDATE listing_media 
SET url = REGEXP_REPLACE(
    url, 
    '/upload/[^/]*?/', 
    '/upload/'
)
WHERE media_type = 'image';

-- Show verification results
SELECT 
    COUNT(*) as total_images,
    COUNT(CASE WHEN url LIKE '/upload/v1/%' THEN 1 END) as clean_urls,
    COUNT(CASE WHEN url LIKE '%l_text:%' THEN 1 END) as still_has_watermark,
    COUNT(CASE WHEN url LIKE '%w_%' THEN 1 END) as still_has_transformations
FROM listing_media lm
JOIN listings l ON lm.listing_id = l.id
WHERE lm.media_type = 'image'
AND l.status = 'available';

-- Show sample URLs to verify they're clean
SELECT 
    id,
    listing_id,
    CASE 
        WHEN url LIKE '/upload/v1/%' AND url NOT LIKE '%l_text:%' AND url NOT LIKE '%w_%' THEN 'Clean'
        ELSE 'Still has transformations'
    END as status,
    LEFT(url, 80) as url_sample
FROM listing_media
WHERE media_type = 'image'
ORDER BY created_at DESC
LIMIT 10;
