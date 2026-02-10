-- Enable RLS on settings table if not already enabled
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "settings_public_select" ON settings;
DROP POLICY IF EXISTS "settings_admin_policy" ON settings;

-- Create policy for public read access (everyone can read settings)
CREATE POLICY "settings_public_select" ON settings
  FOR SELECT USING (true);

-- Create policy for admin insert/update (only admins can modify)
CREATE POLICY "settings_admin_policy" ON settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT SELECT ON settings TO anon;
GRANT SELECT ON settings TO authenticated;
GRANT ALL ON settings TO service_role;
