-- Add payment_instructions field to mobile_money_details
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
