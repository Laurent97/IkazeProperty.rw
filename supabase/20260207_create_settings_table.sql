-- Create settings table for admin configuration
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  commission_rate DECIMAL(5,2) DEFAULT 5.00,
  payment_methods TEXT[] DEFAULT ARRAY['mobile_money', 'bank_transfer', 'cash'],
  mobile_money_providers TEXT[] DEFAULT ARRAY['mtn', 'airtel'],
  
  -- Bank details
  bank_details JSONB DEFAULT '{"bank_name":"","account_name":"","account_number":"","branch_code":""}'::jsonb,
  
  -- Mobile money details
  mobile_money_details JSONB DEFAULT '{
    "mtn": {
      "provider_name": "MTN Mobile Money",
      "phone_number": "",
      "account_name": "",
      "merchant_id": "",
      "payment_instructions": ""
    },
    "airtel": {
      "provider_name": "Airtel Money", 
      "phone_number": "",
      "account_name": "",
      "merchant_id": "",
      "payment_instructions": ""
    }
  }'::jsonb,
  
  -- Platform settings
  platform_name VARCHAR(255) DEFAULT 'IkazeProperty',
  platform_email VARCHAR(255) DEFAULT 'contact@ikazeproperty.rw',
  platform_phone VARCHAR(50) DEFAULT '+250 XXX XXX XXX',
  platform_address TEXT DEFAULT 'Kigali, Rwanda',
  
  -- Commission settings
  min_commission INTEGER DEFAULT 1000,
  max_commission INTEGER DEFAULT 100000,
  
  -- Notification settings
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  admin_alerts BOOLEAN DEFAULT true,
  
  -- Security settings
  require_verification BOOLEAN DEFAULT true,
  auto_approve_listings BOOLEAN DEFAULT false,
  max_daily_listings INTEGER DEFAULT 10,
  
  -- Legal settings
  terms_of_service TEXT DEFAULT '',
  privacy_policy TEXT DEFAULT '',
  refund_policy TEXT DEFAULT '',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings if table is empty
INSERT INTO settings (
  id, commission_rate, payment_methods, mobile_money_providers,
  bank_details, mobile_money_details,
  platform_name, platform_email, platform_phone, platform_address,
  min_commission, max_commission,
  email_notifications, sms_notifications, admin_alerts,
  require_verification, auto_approve_listings, max_daily_listings,
  terms_of_service, privacy_policy, refund_policy
) SELECT 
  1, 5.00, ARRAY['mobile_money', 'bank_transfer', 'cash'], ARRAY['mtn', 'airtel'],
  '{"bank_name":"","account_name":"","account_number":"","branch_code":""}'::jsonb,
  '{
    "mtn": {
      "provider_name": "MTN Mobile Money",
      "phone_number": "",
      "account_name": "",
      "merchant_id": "",
      "payment_instructions": ""
    },
    "airtel": {
      "provider_name": "Airtel Money",
      "phone_number": "",
      "account_name": "",
      "merchant_id": "",
      "payment_instructions": ""
    }
  }'::jsonb,
  'IkazeProperty', 'contact@ikazeproperty.rw', '+250 XXX XXX XXX', 'Kigali, Rwanda',
  1000, 100000,
  true, false, true,
  true, false, 10,
  '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE id = 1);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_settings_id ON settings(id);

-- Add RLS (Row Level Security) policies
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated read" ON settings;
DROP POLICY IF EXISTS "Allow admin update" ON settings;
DROP POLICY IF EXISTS "Allow admin insert" ON settings;

-- Only allow authenticated users to read settings
CREATE POLICY "Allow authenticated read" ON settings
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only allow admin users to update settings
CREATE POLICY "Allow admin update" ON settings
  FOR UPDATE USING (
    auth.role() = 'authenticated' 
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Only allow admin users to insert settings
CREATE POLICY "Allow admin insert" ON settings
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' 
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at 
  BEFORE UPDATE ON settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
