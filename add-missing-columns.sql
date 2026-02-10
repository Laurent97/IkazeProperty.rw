-- Add missing columns to settings table if they don't exist

-- Add missing columns one by one to avoid conflicts
DO $$
BEGIN
    -- Payment Settings
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='commission_rate') THEN
        ALTER TABLE settings ADD COLUMN commission_rate DECIMAL(5,2) DEFAULT 5.00;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='min_commission') THEN
        ALTER TABLE settings ADD COLUMN min_commission INTEGER DEFAULT 1000;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='max_commission') THEN
        ALTER TABLE settings ADD COLUMN max_commission INTEGER DEFAULT 100000;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='payment_methods') THEN
        ALTER TABLE settings ADD COLUMN payment_methods TEXT[] DEFAULT ARRAY['mobile_money', 'bank_transfer', 'cash'];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='mobile_money_providers') THEN
        ALTER TABLE settings ADD COLUMN mobile_money_providers TEXT[] DEFAULT ARRAY['mtn', 'airtel'];
    END IF;
    
    -- Bank Details
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='bank_details') THEN
        ALTER TABLE settings ADD COLUMN bank_details JSONB DEFAULT '{}';
    END IF;
    
    -- Mobile Money Details
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='mobile_money_details') THEN
        ALTER TABLE settings ADD COLUMN mobile_money_details JSONB DEFAULT '{}';
    END IF;
    
    -- Visit Fee Settings
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='visit_fee_enabled') THEN
        ALTER TABLE settings ADD COLUMN visit_fee_enabled BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='visit_fee_amount') THEN
        ALTER TABLE settings ADD COLUMN visit_fee_amount INTEGER DEFAULT 15000;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='visit_fee_payment_methods') THEN
        ALTER TABLE settings ADD COLUMN visit_fee_payment_methods JSONB DEFAULT '{}';
    END IF;
    
    -- System Settings
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='auto_approve_listings') THEN
        ALTER TABLE settings ADD COLUMN auto_approve_listings BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='require_email_verification') THEN
        ALTER TABLE settings ADD COLUMN require_email_verification BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='enable_notifications') THEN
        ALTER TABLE settings ADD COLUMN enable_notifications BOOLEAN DEFAULT true;
    END IF;
    
    -- Timestamps
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='created_at') THEN
        ALTER TABLE settings ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='updated_at') THEN
        ALTER TABLE settings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Insert default settings if row doesn't exist
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
