-- Step 1: Restore all images to original state (remove broken watermarks)
UPDATE listing_media 
SET url = REGEXP_REPLACE(
    url, 
    '/upload/.*?/', 
    '/upload/'
)
WHERE media_type = 'image';

-- Step 2: Apply simple, correct watermark transformation
UPDATE listing_media 
SET url = REGEXP_REPLACE(
    url, 
    '/upload/', 
    '/upload/w_250,h_50,c_fit/l_text:www.ikazeproperty.org,co_rgb:dc2626,g_south_east,x_10,y_10/'
)
WHERE media_type = 'image'
AND url NOT LIKE '%l_text:www.ikazeproperty.org%';

-- Show current status
SELECT 
    COUNT(*) as total_images,
    COUNT(CASE WHEN url LIKE '%l_text:www.ikazeproperty.org%' THEN 1 END) as watermarked_images,
    COUNT(CASE WHEN url NOT LIKE '%l_text:www.ikazeproperty.org%' THEN 1 END) as unwatermarked_images,
    ROUND(
        (COUNT(CASE WHEN url LIKE '%l_text:www.ikazeproperty.org%' THEN 1 END) * 100.0 / COUNT(*)), 
        2
    ) as watermark_percentage
FROM listing_media lm
JOIN listings l ON lm.listing_id = l.id
WHERE lm.media_type = 'image'
AND l.status = 'available';

-- Show sample URLs to verify they're not broken
SELECT 
    id,
    listing_id,
    CASE 
        WHEN url LIKE '%l_text:www.ikazeproperty.org%' THEN 'Watermarked'
        ELSE 'Original'
    END as status,
    LEFT(url, 100) as url_sample
FROM listing_media
WHERE media_type = 'image'
ORDER BY created_at DESC
LIMIT 5;
