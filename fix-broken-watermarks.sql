-- Fix broken watermark URLs by using correct Cloudinary syntax
-- The previous transformation had duplicate text overlays and incorrect syntax

DO $$
DECLARE
    fixed_count INTEGER := 0;
    media_record RECORD;
    new_url TEXT;
BEGIN
    RAISE NOTICE 'Starting watermark URL fix process...';
    
    -- Process all images with broken watermarks
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
        AND (lm.url LIKE '%l_text:www.ikazeproperty.org%' OR lm.url LIKE '%watermark%')
    LOOP
        BEGIN
            -- Fix the URL with correct Cloudinary syntax
            -- Remove any existing transformations and add correct watermark
            new_url := REGEXP_REPLACE(
                media_record.url, 
                '/upload/.*?/', 
                '/upload/w_300,h_60,c_fit/l_text:www.ikazeproperty.org,co_rgb:dc2626,g_south_east,x_15,y_15,bo_3px_solid_rgb:991b1b,ro_8/'
            );
            
            -- If no transformation exists, add it
            IF new_url = media_record.url THEN
                new_url := REGEXP_REPLACE(
                    media_record.url, 
                    '/upload/', 
                    '/upload/w_300,h_60,c_fit/l_text:www.ikazeproperty.org,co_rgb:dc2626,g_south_east,x_15,y_15,bo_3px_solid_rgb:991b1b,ro_8/'
                );
            END IF;
            
            UPDATE listing_media 
            SET url = new_url
            WHERE id = media_record.id;
            
            fixed_count := fixed_count + 1;
            
            RAISE NOTICE 'Fixed watermark URL for image % (listing: %)', 
                media_record.id, media_record.listing_title;
                
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to fix image %: %', 
                media_record.id, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'Watermark URL fix completed. Fixed % images.', fixed_count;
END $$;

-- First, let's restore original URLs to fix broken images
UPDATE listing_media 
SET url = REGEXP_REPLACE(
    url, 
    '/upload/.*?/', 
    '/upload/'
)
WHERE media_type = 'image'
AND (url LIKE '%l_text:www.ikazeproperty.org%' OR url LIKE '%watermark%');

-- Now apply correct watermark transformation
UPDATE listing_media 
SET url = REGEXP_REPLACE(
    url, 
    '/upload/', 
    '/upload/w_300,h_60,c_fit/l_text:www.ikazeproperty.org,co_rgb:dc2626,g_south_east,x_15,y_15,bo_3px_solid_rgb:991b1b,ro_8/'
)
WHERE media_type = 'image'
AND url NOT LIKE '%l_text:www.ikazeproperty.org%'
AND url NOT LIKE '%watermark%';

-- Show results
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

-- Show sample of URLs
SELECT 
    id,
    listing_id,
    CASE 
        WHEN url LIKE '%l_text:www.ikazeproperty.org%' THEN 'Watermarked'
        ELSE 'Not watermarked'
    END as status,
    LEFT(url, 120) as url_preview
FROM listing_media
WHERE media_type = 'image'
ORDER BY created_at DESC
LIMIT 5;
