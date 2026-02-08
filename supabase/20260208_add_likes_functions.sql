-- Function to increment likes count on a listing
CREATE OR REPLACE FUNCTION increment_likes(listing_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE listings 
    SET likes = likes + 1 
    WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement likes count on a listing
CREATE OR REPLACE FUNCTION decrement_likes(listing_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE listings 
    SET likes = GREATEST(likes - 1, 0) 
    WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql;
