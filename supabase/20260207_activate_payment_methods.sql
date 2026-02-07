-- Activate payment methods for visit requests
-- This enables MTN Mobile Money, Airtel Money, Equity Bank, and Crypto options

UPDATE payment_configurations 
SET is_active = true 
WHERE payment_method IN ('mtn_momo', 'airtel_money', 'equity_bank', 'crypto');

-- Keep wallet active as well
UPDATE payment_configurations 
SET is_active = true 
WHERE payment_method = 'wallet';
