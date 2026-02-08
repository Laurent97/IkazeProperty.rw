-- Quick fix for infinite recursion in RLS policies
-- Replace problematic admin policies with non-recursive versions

-- Drop problematic policies that cause recursion
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Admins can manage all listings" ON listings;
DROP POLICY IF EXISTS "Admins can manage settings" ON settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;

-- Create a simple function to check admin status without recursion
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Use auth.jwt() to get user role from JWT token instead of querying users table
  RETURN COALESCE((auth.jwt()->>'role') = 'admin', false);
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create non-recursive admin policies
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (
    auth.role() = 'authenticated' AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can manage all listings" ON listings
  FOR ALL USING (
    auth.role() = 'authenticated' AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (
    auth.role() = 'authenticated' AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can manage site settings" ON site_settings
  FOR ALL USING (
    auth.role() = 'authenticated' AND is_admin(auth.uid())
  );

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated, service_role;
