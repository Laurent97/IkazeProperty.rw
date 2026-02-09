-- Create table for tracking listing views
CREATE TABLE IF NOT EXISTS listing_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_listing_views_listing_id ON listing_views(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_views_viewed_at ON listing_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_listing_views_user_id ON listing_views(user_id);

-- Create table for tracking listing likes (favorites already exists but we'll create a dedicated likes table for counting)
CREATE TABLE IF NOT EXISTS listing_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(listing_id, user_id) -- Prevent duplicate likes
);

-- Create indexes for likes table
CREATE INDEX IF NOT EXISTS idx_listing_likes_listing_id ON listing_likes(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_likes_user_id ON listing_likes(user_id);

-- Function to update listing likes count
CREATE OR REPLACE FUNCTION update_listing_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE listings 
    SET likes = (
        SELECT COUNT(*) 
        FROM listing_likes 
        WHERE listing_id = NEW.listing_id
    )
    WHERE id = NEW.listing_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update likes count
CREATE TRIGGER trigger_update_listing_likes_count
    AFTER INSERT OR DELETE OR UPDATE
    ON listing_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_listing_likes_count();

-- Function to update listing views count
CREATE OR REPLACE FUNCTION update_listing_views_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE listings 
    SET views = (
        SELECT COUNT(*) 
        FROM listing_views 
        WHERE listing_id = NEW.listing_id
    )
    WHERE id = NEW.listing_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update views count
CREATE TRIGGER trigger_update_listing_views_count
    AFTER INSERT OR DELETE OR UPDATE
    ON listing_views
    FOR EACH ROW
    EXECUTE FUNCTION update_listing_views_count();

-- Function to increment views when a listing is viewed
CREATE OR REPLACE FUNCTION increment_listing_views(p_listing_id UUID, p_user_id UUID DEFAULT NULL, p_ip_address INET DEFAULT NULL, p_user_agent TEXT DEFAULT NULL, p_session_id TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
    -- Check if this user/session has viewed this listing in the last hour (to prevent spam counting)
    IF NOT EXISTS (
        SELECT 1 FROM listing_views 
        WHERE listing_id = p_listing_id 
        AND (
            (user_id = p_user_id AND user_id IS NOT NULL) OR
            (session_id = p_session_id AND session_id IS NOT NULL) OR
            (ip_address = p_ip_address AND ip_address IS NOT NULL AND user_id IS NULL AND session_id IS NULL)
        )
        AND viewed_at > NOW() - INTERVAL '1 hour'
    ) THEN
        INSERT INTO listing_views (listing_id, user_id, ip_address, user_agent, session_id)
        VALUES (p_listing_id, p_user_id, p_ip_address, p_user_agent, p_session_id);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get recent views for a listing
CREATE OR REPLACE FUNCTION get_recent_views(p_listing_id UUID, p_limit INTEGER DEFAULT 20)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE,
    users_id UUID,
    users_full_name TEXT,
    users_email TEXT,
    users_avatar_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lv.id,
        lv.user_id,
        lv.ip_address,
        lv.user_agent,
        lv.viewed_at,
        u.id as users_id,
        u.full_name as users_full_name,
        u.email as users_email,
        u.avatar_url as users_avatar_url
    FROM listing_views lv
    LEFT JOIN users u ON lv.user_id = u.id
    WHERE lv.listing_id = p_listing_id
    ORDER BY lv.viewed_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get users who liked a listing
CREATE OR REPLACE FUNCTION get_listing_likers(p_listing_id UUID, p_limit INTEGER DEFAULT 20)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    users_id UUID,
    users_full_name TEXT,
    users_email TEXT,
    users_avatar_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ll.id,
        ll.user_id,
        ll.created_at,
        u.id as users_id,
        u.full_name as users_full_name,
        u.email as users_email,
        u.avatar_url as users_avatar_url
    FROM listing_likes ll
    JOIN users u ON ll.user_id = u.id
    WHERE ll.listing_id = p_listing_id
    ORDER BY ll.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Update existing listings to have correct counts
UPDATE listings 
SET likes = COALESCE(
    (SELECT COUNT(*) FROM favorite_listings fl WHERE fl.listing_id = listings.id), 
    0
);

UPDATE listings 
SET views = COALESCE(
    (SELECT COUNT(*) FROM listing_views lv WHERE lv.listing_id = listings.id), 
    0
);
