-- Add payment_instructions field to mobile_money_details
-- This migration adds the payment_instructions field to the mobile_money_details JSONB column

ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS payment_instructions TEXT;

-- Update existing records to include payment_instructions
UPDATE settings 
SET mobile_money_details = jsonb_set(
  mobile_money_details, 
  '{"mtn": {"provider_name": "MTN Mobile Money", "phone_number": "", "account_name": "", "merchant_id": "", "payment_instructions": "Dial *182# and proceed with payment"}, 
  "airtel": {"provider_name": "Airtel Money", "phone_number": "", "account_name": "", "merchant_id": "", "payment_instructions": ""}}'
)
WHERE id = 1;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_settings_id ON settings(id);

-- Add RLS (Row Level Security) policies
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
