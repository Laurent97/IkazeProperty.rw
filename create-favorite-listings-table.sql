-- Create favorite_listings table if it doesn't exist
CREATE TABLE IF NOT EXISTS favorite_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, listing_id) -- Prevent duplicate favorites
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_favorite_listings_user_id ON favorite_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_listings_listing_id ON favorite_listings(listing_id);

-- Enable Row Level Security
ALTER TABLE favorite_listings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own favorites
CREATE POLICY "Users can view their own favorites" ON favorite_listings
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can insert their own favorites" ON favorite_listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites" ON favorite_listings
    FOR DELETE USING (auth.uid() = user_id);

-- Users can update their own favorites (if needed)
CREATE POLICY "Users can update their own favorites" ON favorite_listings
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to update likes count when favorite is added/removed
CREATE OR REPLACE FUNCTION update_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE listings 
        SET likes = COALESCE(likes, 0) + 1
        WHERE id = NEW.listing_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE listings 
        SET likes = GREATEST(COALESCE(likes, 0) - 1, 0)
        WHERE id = OLD.listing_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic likes count updates
DROP TRIGGER IF EXISTS trigger_update_favorites_count_insert ON favorite_listings;
CREATE TRIGGER trigger_update_favorites_count_insert
    AFTER INSERT ON favorite_listings
    FOR EACH ROW
    EXECUTE FUNCTION update_favorites_count();

DROP TRIGGER IF EXISTS trigger_update_favorites_count_delete ON favorite_listings;
CREATE TRIGGER trigger_update_favorites_count_delete
    AFTER DELETE ON favorite_listings
    FOR EACH ROW
    EXECUTE FUNCTION update_favorites_count();

-- Initialize likes count from existing favorites
UPDATE listings 
SET likes = COALESCE(
    (SELECT COUNT(*) FROM favorite_listings fl WHERE fl.listing_id = listings.id), 
    0
)
WHERE likes IS NULL;
