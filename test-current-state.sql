-- Test current state of the database
-- Check if tables exist and have data

-- Check listings table
SELECT 
    'listings' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN status = 'available' THEN 1 END) as available_listings
FROM listings
UNION ALL
-- Check house_details table
SELECT 
    'house_details' as table_name,
    COUNT(*) as total_records,
    NULL as available_listings
FROM house_details
UNION ALL
-- Check car_details table
SELECT 
    'car_details' as table_name,
    COUNT(*) as total_records,
    NULL as available_listings
FROM car_details
UNION ALL
-- Check land_details table
SELECT 
    'land_details' as table_name,
    COUNT(*) as total_records,
    NULL as available_listings
FROM land_details
UNION ALL
-- Check other_item_details table
SELECT 
    'other_item_details' as table_name,
    COUNT(*) as total_records,
    NULL as available_listings
FROM other_item_details
UNION ALL
-- Check listing_media table
SELECT 
    'listing_media' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN media_type = 'image' THEN 1 END) as image_count
FROM listing_media;

-- Check sample listing with details
SELECT 
    l.id,
    l.title,
    l.category,
    CASE 
        WHEN hd.id IS NOT NULL THEN 'Has house details'
        WHEN cd.id IS NOT NULL THEN 'Has car details'
        WHEN ld.id IS NOT NULL THEN 'Has land details'
        WHEN od.id IS NOT NULL THEN 'Has other details'
        ELSE 'No details'
    END as details_status,
    COUNT(lm.id) as media_count
FROM listings l
LEFT JOIN house_details hd ON l.id = hd.listing_id
LEFT JOIN car_details cd ON l.id = cd.listing_id
LEFT JOIN land_details ld ON l.id = ld.listing_id
LEFT JOIN other_item_details od ON l.id = od.listing_id
LEFT JOIN listing_media lm ON l.id = lm.listing_id
WHERE l.status = 'available'
GROUP BY l.id, l.title, l.category, hd.id, cd.id, ld.id, od.id
LIMIT 5;

-- Check watermark status of images
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
