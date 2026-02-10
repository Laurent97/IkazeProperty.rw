-- Create main settings table for comprehensive admin configuration
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  
  -- Payment Settings
  commission_rate DECIMAL(5,2) DEFAULT 5.00,
  min_commission INTEGER DEFAULT 1000,
  max_commission INTEGER DEFAULT 100000,
  payment_methods TEXT[] DEFAULT ARRAY['mobile_money', 'bank_transfer', 'cash'],
  mobile_money_providers TEXT[] DEFAULT ARRAY['mtn', 'airtel'],
  
  -- Bank Details (JSON structure)
  bank_details JSONB DEFAULT '{}',
  
  -- Mobile Money Details (JSON structure)
  mobile_money_details JSONB DEFAULT '{}',
  
  -- Visit Fee Settings
  visit_fee_enabled BOOLEAN DEFAULT true,
  visit_fee_amount INTEGER DEFAULT 15000,
  visit_fee_payment_methods JSONB DEFAULT '{}',
  
  -- System Settings
  auto_approve_listings BOOLEAN DEFAULT false,
  require_email_verification BOOLEAN DEFAULT true,
  enable_notifications BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for settings table
CREATE POLICY "Admins can view settings" ON settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update settings" ON settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert settings" ON settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_settings_updated_at 
    BEFORE UPDATE ON settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO settings (
  commission_rate,
  min_commission,
  max_commission,
  payment_methods,
  mobile_money_providers,
  bank_details,
  mobile_money_details,
  visit_fee_enabled,
  visit_fee_amount,
  visit_fee_payment_methods,
  auto_approve_listings,
  require_email_verification,
  enable_notifications
) VALUES (
  5.00,
  1000,
  100000,
  ARRAY['mobile_money', 'bank_transfer', 'cash'],
  ARRAY['mtn', 'airtel'],
  '{"bank_name": "", "account_name": "", "account_number": "", "branch_code": ""}',
  '{"mtn": {"phone_number": "", "account_name": "", "merchant_id": "", "payment_instructions": ""}, "airtel": {"phone_number": "", "account_name": "", "merchant_id": "", "payment_instructions": ""}}',
  true,
  15000,
  '{}',
  false,
  true,
  true
) ON CONFLICT (id) DO NOTHING;
