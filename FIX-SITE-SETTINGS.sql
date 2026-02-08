-- Fix for Site Settings 406 Error
-- Run this in Supabase SQL Editor

-- Step 1: Ensure site_settings table exists and has proper structure
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_phone TEXT NOT NULL,
  whatsapp_phone TEXT NOT NULL,
  support_email TEXT NOT NULL,
  office_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_by UUID REFERENCES users(id)
);

-- Step 2: Create updated_at trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 3: Fix RLS policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;
DROP POLICY IF EXISTS "Public read access to site settings" ON site_settings;

-- Create simple policies that work
CREATE POLICY "Public read access to site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Step 4: Ensure there's at least one record
INSERT INTO site_settings (admin_phone, whatsapp_phone, support_email, office_address)
VALUES ('+250 788 123 456', '+250737060025', 'support@ikazeproperty.rw', 'KN 123 St, Kiyovu')
ON CONFLICT DO NOTHING;

-- Step 5: Verify the data
SELECT 
  id,
  admin_phone,
  whatsapp_phone,
  support_email,
  office_address,
  created_at,
  updated_at
FROM site_settings
ORDER BY updated_at DESC
LIMIT 1;
