-- Create watermark viewing policy
CREATE TABLE IF NOT EXISTS watermark_policies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    policy_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    can_view_watermark BOOLEAN DEFAULT false,
    can_remove_watermark BOOLEAN DEFAULT false,
    can_bypass_watermark BOOLEAN DEFAULT false,
    applies_to TEXT[] DEFAULT '{image,video}', -- What media types this applies to
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true
);

-- Insert default policies
INSERT INTO watermark_policies (policy_name, description, can_view_watermark, can_remove_watermark, applies_to) VALUES
('admin_full', 'Administrator can view and remove watermarks from all media', true, true, '{image,video}'),
('admin_view', 'Administrator can view watermarks but not remove them', true, false, '{image,video}'),
('seller_own', 'Sellers can view watermarks on their own listings only', true, false, '{image,video}'),
('buyer_view', 'Buyers can view watermarks after expressing interest', true, false, '{image,video}'),
('public_restricted', 'Public users have restricted watermark viewing', false, false, '{image,video}')
ON CONFLICT (policy_name) DO NOTHING;

-- Create user policy assignments table
CREATE TABLE IF NOT EXISTS user_watermark_policies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    policy_id UUID NOT NULL REFERENCES watermark_policies(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE, -- Policy can expire
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, policy_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_watermark_policies_user ON user_watermark_policies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_watermark_policies_policy ON user_watermark_policies(policy_id);
CREATE INDEX IF NOT EXISTS idx_user_watermark_policies_active ON user_watermark_policies(is_active);

-- Function to check if user can view watermarks
CREATE OR REPLACE FUNCTION can_view_watermarks(p_user_id UUID, p_listing_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
    has_permission BOOLEAN := false;
    policy_record RECORD;
    seller_id UUID;
BEGIN
    -- Get the seller of the listing if provided
    IF p_listing_id IS NOT NULL THEN
        SELECT seller_id INTO seller_id
        FROM listings
        WHERE id = p_listing_id;
    END IF;
    
    -- Check if user is the seller of the listing
    IF seller_id IS NOT NULL AND seller_id = p_user_id THEN
        RETURN TRUE; -- Sellers can always view watermarks on their own listings
    END IF;
    
    -- Check for explicit policy assignments
    SELECT wp.* INTO policy_record
    FROM watermark_policies wp
    JOIN user_watermark_policies uwp ON wp.id = uwp.policy_id
    WHERE uwp.user_id = p_user_id
    AND uwp.is_active = true
    AND wp.is_active = true
    AND (uwp.expires_at IS NULL OR uwp.expires_at > NOW())
    ORDER BY wp.created_at DESC
    LIMIT 1;
    
    -- Return the policy setting
    IF policy_record.policy_name IS NOT NULL THEN
        RETURN policy_record.can_view_watermark;
    END IF;
    
    -- Default: Check if user is admin
    SELECT EXISTS(
        SELECT 1 FROM users 
        WHERE id = p_user_id 
        AND role = 'admin'
    ) INTO has_permission;
    
    RETURN COALESCE(has_permission, FALSE);
END;
$$ LANGUAGE plpgsql;

-- Function to get user's watermark permissions
CREATE OR REPLACE FUNCTION get_user_watermark_permissions(p_user_id UUID)
RETURNS TABLE (
    policy_name VARCHAR(50),
    description TEXT,
    can_view_watermark BOOLEAN,
    can_remove_watermark BOOLEAN,
    can_bypass_watermark BOOLEAN,
    applies_to TEXT[],
    assigned_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wp.policy_name,
        wp.description,
        wp.can_view_watermark,
        wp.can_remove_watermark,
        wp.can_bypass_watermark,
        wp.applies_to,
        uwp.assigned_at,
        uwp.expires_at,
        uwp.is_active
    FROM watermark_policies wp
    JOIN user_watermark_policies uwp ON wp.id = uwp.policy_id
    WHERE uwp.user_id = p_user_id
    AND uwp.is_active = true
    AND wp.is_active = true
    ORDER BY uwp.assigned_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to assign watermark policy to user
CREATE OR REPLACE FUNCTION assign_watermark_policy(
    p_user_id UUID,
    p_policy_name VARCHAR(50),
    p_assigned_by UUID DEFAULT NULL,
    p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    policy_id UUID;
BEGIN
    -- Get the policy ID
    SELECT id INTO policy_id
    FROM watermark_policies
    WHERE policy_name = p_policy_name
    AND is_active = true;
    
    IF policy_id IS NULL THEN
        RAISE EXCEPTION 'Policy % not found or inactive', p_policy_name;
    END IF;
    
    -- Remove any existing active policy for this user
    DELETE FROM user_watermark_policies
    WHERE user_id = p_user_id
    AND is_active = true;
    
    -- Assign the new policy
    INSERT INTO user_watermark_policies (
        user_id,
        policy_id,
        assigned_by,
        expires_at,
        is_active
    ) VALUES (
        p_user_id,
        policy_id,
        p_assigned_by,
        p_expires_at,
        true
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create a table to track watermark viewing sessions
CREATE TABLE IF NOT EXISTS watermark_viewing_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 hour',
    purpose VARCHAR(50) DEFAULT 'view_watermarks',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_watermark_sessions_user ON watermark_viewing_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_watermark_sessions_token ON watermark_viewing_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_watermark_sessions_expires ON watermark_viewing_sessions(expires_at);

-- Function to create watermark viewing session
CREATE OR REPLACE FUNCTION create_watermark_session(
    p_user_id UUID,
    p_listing_id UUID,
    p_purpose VARCHAR(50) DEFAULT 'view_watermarks',
    p_duration_hours INTEGER DEFAULT 1
) RETURNS VARCHAR(255) AS $$
DECLARE
    session_token VARCHAR(255);
BEGIN
    -- Generate a secure session token
    session_token := 'wm_' || encode(gen_random_bytes(32), 'hex');
    
    -- Clean up expired sessions
    DELETE FROM watermark_viewing_sessions
    WHERE expires_at < NOW();
    
    -- Insert new session
    INSERT INTO watermark_viewing_sessions (
        user_id,
        session_token,
        listing_id,
        purpose,
        expires_at
    ) VALUES (
        p_user_id,
        session_token,
        p_listing_id,
        p_purpose,
        NOW() + (p_duration_hours || ' hours')::INTERVAL
    );
    
    RETURN session_token;
END;
$$ LANGUAGE plpgsql;

-- Function to validate watermark viewing session
CREATE OR REPLACE FUNCTION validate_watermark_session(p_session_token VARCHAR(255))
RETURNS TABLE (
    valid BOOLEAN,
    user_id UUID,
    listing_id UUID,
    expires_at TIMESTAMP WITH TIME ZONE,
    purpose VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        expires_at > NOW() as valid,
        user_id,
        listing_id,
        expires_at,
        purpose
    FROM watermark_viewing_sessions
    WHERE session_token = p_session_token;
END;
$$ LANGUAGE plpgsql;

-- Sample usage queries:

-- 1. Check if user can view watermarks for a specific listing
-- SELECT can_view_watermarks('user-uuid', 'listing-uuid');

-- 2. Assign admin policy to user
-- SELECT assign_watermark_policy('user-uuid', 'admin_full', 'admin-uuid');

-- 3. Create viewing session for 1 hour
-- SELECT create_watermark_session('user-uuid', 'listing-uuid', 'view_watermarks', 1);

-- 4. Validate session token
-- SELECT * FROM validate_watermark_session('wm_session_token_here');

-- 5. Get user's current permissions
-- SELECT * FROM get_user_watermark_permissions('user-uuid');
