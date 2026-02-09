-- Function to apply watermark to existing images in Cloudinary
CREATE OR REPLACE FUNCTION apply_watermark_to_existing_media()
RETURNS TABLE (
    media_id UUID,
    listing_id UUID,
    old_url TEXT,
    new_url TEXT,
    status TEXT,
    error_message TEXT
) AS $$
DECLARE
    media_record RECORD;
    transformed_url TEXT;
BEGIN
    -- Create a temporary table to store results
    CREATE TEMP TABLE IF NOT EXISTS watermark_results (
        media_id UUID,
        listing_id UUID,
        old_url TEXT,
        new_url TEXT,
        status TEXT,
        error_message TEXT
    );
    
    -- Get all media that doesn't have watermark in the URL
    FOR media_record IN 
        SELECT 
            lm.id,
            lm.listing_id,
            lm.url,
            lm.public_id,
            lm.media_type
        FROM listing_media lm
        JOIN listings l ON lm.listing_id = l.id
        WHERE lm.media_type = 'image'
        AND lm.url NOT LIKE '%watermark%'
        AND l.status = 'available'
        LIMIT 100  -- Process in batches to avoid timeout
    LOOP
        BEGIN
            -- Apply Cloudinary transformation to add watermark
            transformed_url := lm.url || 
                CASE 
                    WHEN lm.public_id IS NOT NULL THEN
                        REGEXP_REPLACE(lm.url, '/upload/', '/upload/w_300,h_60,c_fit,l_text:www.ikazeproperty.org,co_rgb:dc2626,g_south_east,x_15,y_15,l_text:www.ikazeproperty.org,co_rgb:dc2626,bo_3px_solid_rgb:991b1b,ro_8/')
                    ELSE lm.url
                END;
            
            -- Update the media record with watermarked URL
            UPDATE listing_media 
            SET url = transformed_url
            WHERE id = lm.id;
            
            -- Insert result into temporary table
            INSERT INTO watermark_results VALUES (
                lm.id,
                lm.listing_id,
                lm.url,
                transformed_url,
                'success',
                NULL
            );
            
            -- Log the transformation
            RAISE NOTICE 'Applied watermark to media % for listing %', lm.id, lm.listing_id;
            
        EXCEPTION WHEN OTHERS THEN
            -- Insert error result into temporary table
            INSERT INTO watermark_results VALUES (
                lm.id,
                lm.listing_id,
                lm.url,
                lm.url,
                'error',
                SQLERRM
            );
            
            RAISE NOTICE 'Failed to apply watermark to media %: %', lm.id, SQLERRM;
        END;
    END LOOP;
    
    -- Return the results
    RETURN QUERY SELECT * FROM watermark_results ORDER BY media_id;
END;
$$ LANGUAGE plpgsql;

-- Function to batch process watermarks
CREATE OR REPLACE FUNCTION batch_apply_watermarks(batch_size INTEGER DEFAULT 50)
RETURNS INTEGER AS $$
DECLARE
    processed_count INTEGER := 0;
    media_record RECORD;
BEGIN
    -- Get a batch of images without watermarks
    FOR media_record IN 
        SELECT 
            lm.id,
            lm.listing_id,
            lm.url,
            lm.public_id
        FROM listing_media lm
        JOIN listings l ON lm.listing_id = l.id
        WHERE lm.media_type = 'image'
        AND lm.url NOT LIKE '%watermark%'
        AND l.status = 'available'
        LIMIT batch_size
    LOOP
        BEGIN
            -- Apply watermark transformation
            UPDATE listing_media 
            SET url = REGEXP_REPLACE(
                lm.url, 
                '/upload/', 
                '/upload/w_300,h_60,c_fit,l_text:www.ikazeproperty.org,co_rgb:dc2626,g_south_east,x_15,y_15,l_text:www.ikazeproperty.org,co_rgb:dc2626,bo_3px_solid_rgb:991b1b,ro_8/'
            )
            WHERE id = media_record.id;
            
            processed_count := processed_count + 1;
            
            RAISE NOTICE 'Applied watermark to media % (batch %)', media_record.id, processed_count;
        END;
    END LOOP;
    
    RETURN processed_count;
END;
$$ LANGUAGE plpgsql;

-- Create a table to track watermark processing status
CREATE TABLE IF NOT EXISTS watermark_processing_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    batch_number INTEGER,
    media_id UUID,
    listing_id UUID,
    old_url TEXT,
    new_url TEXT,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT CHECK (status IN ('success', 'error', 'pending')),
    error_message TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_watermark_processing_log_batch ON watermark_processing_log(batch_number);
CREATE INDEX IF NOT EXISTS idx_watermark_processing_log_media ON watermark_processing_log(media_id);
CREATE INDEX IF NOT EXISTS idx_watermark_processing_log_status ON watermark_processing_log(status);

-- Function to log watermark processing
CREATE OR REPLACE FUNCTION log_watermark_processing(
    p_media_id UUID,
    p_listing_id UUID,
    p_old_url TEXT,
    p_new_url TEXT,
    p_status TEXT,
    p_error_message TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO watermark_processing_log (
        media_id,
        listing_id,
        old_url,
        new_url,
        status,
        error_message
    ) VALUES (
        p_media_id,
        p_listing_id,
        p_old_url,
        p_new_url,
        p_status,
        p_error_message
    );
END;
$$ LANGUAGE plpgsql;

-- Update trigger to automatically apply watermarks to new uploads
CREATE OR REPLACE FUNCTION auto_apply_watermark_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Only apply to new image uploads
    IF TG_OP = 'INSERT' AND NEW.media_type = 'image' THEN
        -- Check if URL already has watermark
        IF NEW.url NOT LIKE '%watermark%' AND NEW.url NOT LIKE '%l_text:www.ikazeproperty.org%' THEN
            -- Apply watermark transformation
            NEW.url := REGEXP_REPLACE(
                NEW.url, 
                '/upload/', 
                '/upload/w_300,h_60,c_fit,l_text:www.ikazeproperty.org,co_rgb:dc2626,g_south_east,x_15,y_15,l_text:www.ikazeproperty.org,co_rgb:dc2626,bo_3px_solid_rgb:991b1b,ro_8/'
            );
            
            -- Log the automatic application
            PERFORM log_watermark_processing(
                NEW.id,
                NEW.listing_id,
                OLD.url,
                NEW.url,
                'auto_applied',
                NULL
            );
            
            RAISE NOTICE 'Auto-applied watermark to new media %', NEW.id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic watermark application
DROP TRIGGER IF EXISTS trigger_auto_apply_watermark ON listing_media;
CREATE TRIGGER trigger_auto_apply_watermark
    AFTER INSERT ON listing_media
    FOR EACH ROW
    EXECUTE FUNCTION auto_apply_watermark_trigger();

-- Function to get watermark statistics
CREATE OR REPLACE FUNCTION get_watermark_statistics()
RETURNS TABLE (
    total_images BIGINT,
    watermarked_images BIGINT,
    unwatermarked_images BIGINT,
    watermark_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
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
END;
$$ LANGUAGE plpgsql;

-- Sample queries to use the functions:

-- 1. Apply watermarks to first 100 existing images
-- SELECT * FROM apply_watermark_to_existing_media();

-- 2. Process in batches of 50
-- SELECT batch_apply_watermarks(50);

-- 3. Get watermark statistics
-- SELECT * FROM get_watermark_statistics();

-- 4. Manual watermark application for specific listing
-- UPDATE listing_media 
-- SET url = REGEXP_REPLACE(
--     url, 
--     '/upload/', 
--     '/upload/w_300,h_60,c_fit,l_text:www.ikazeproperty.org,co_rgb:dc2626,g_south_east,x_15,y_15,l_text:www.ikazeproperty.org,co_rgb:dc2626,bo_3px_solid_rgb:991b1b,ro_8/'
-- )
-- WHERE listing_id = 'your-listing-id' AND media_type = 'image';

-- 5. Check which images need watermarks
-- SELECT 
--     lm.id,
--     lm.listing_id,
--     lm.url,
--     CASE 
--         WHEN lm.url LIKE '%watermark%' OR lm.url LIKE '%l_text:www.ikazeproperty.org%' THEN 'Already watermarked'
--         ELSE 'Needs watermark'
--     END as watermark_status
-- FROM listing_media lm
-- JOIN listings l ON lm.listing_id = l.id
-- WHERE lm.media_type = 'image'
-- AND l.status = 'available'
-- ORDER BY lm.created_at DESC
-- LIMIT 20;
