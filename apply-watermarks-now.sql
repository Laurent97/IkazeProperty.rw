-- Apply watermarks to all existing images immediately
-- This will update the URLs to include watermark transformations

DO $$
DECLARE
    updated_count INTEGER := 0;
    media_record RECORD;
BEGIN
    RAISE NOTICE 'Starting watermark application process...';
    
    -- Process all images that don't have watermarks
    FOR media_record IN 
        SELECT 
            lm.id,
            lm.listing_id,
            lm.url,
            lm.public_id,
            l.title as listing_title
        FROM listing_media lm
        JOIN listings l ON lm.listing_id = l.id
        WHERE lm.media_type = 'image'
        AND lm.url NOT LIKE '%watermark%'
        AND lm.url NOT LIKE '%l_text:www.ikazeproperty.org%'
        AND l.status = 'available'
    LOOP
        BEGIN
            -- Apply watermark transformation to the URL
            UPDATE listing_media 
            SET url = REGEXP_REPLACE(
                media_record.url, 
                '/upload/', 
                '/upload/w_300,h_60,c_fit,l_text:www.ikazeproperty.org,co_rgb:dc2626,g_south_east,x_15,y_15,l_text:www.ikazeproperty.org,co_rgb:dc2626,bo_3px_solid_rgb:991b1b,ro_8/'
            )
            WHERE id = media_record.id;
            
            updated_count := updated_count + 1;
            
            RAISE NOTICE 'Applied watermark to image % (listing: %)', 
                media_record.id, media_record.listing_title;
                
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to watermark image %: %', 
                media_record.id, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'Watermark application completed. Updated % images.', updated_count;
END $$;

-- Show results
SELECT 
    COUNT(*) as total_images,
    COUNT(CASE WHEN url LIKE '%watermark%' OR url LIKE '%l_text:www.ikazeproperty.org%' THEN 1 END) as watermarked_images,
    COUNT(CASE WHEN url NOT LIKE '%watermark%' AND url NOT LIKE '%l_text:www.ikazeproperty.org%' THEN 1 END) as unwatermarked_images,
    ROUND(
        (COUNT(CASE WHEN url LIKE '%watermark%' OR url LIKE '%l_text:www.ikazeproperty.org%' THEN 1 END) * 100.0 / COUNT(*)), 
        2
    ) as watermark_percentage
FROM listing_media lm
JOIN listings l ON lm.listing_id = l.id
WHERE lm.media_type = 'image'
AND l.status = 'available';

-- Show sample of updated URLs
SELECT 
    id,
    listing_id,
    CASE 
        WHEN url LIKE '%l_text:www.ikazeproperty.org%' THEN 'Watermarked'
        ELSE 'Not watermarked'
    END as status,
    LEFT(url, 100) as url_preview
FROM listing_media
WHERE media_type = 'image'
ORDER BY created_at DESC
LIMIT 5;
