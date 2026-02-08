-- Add payment method and payment details columns to visit_requests table
ALTER TABLE visit_requests 
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_details JSONB DEFAULT '{}'::jsonb;

-- Create index for payment_method
CREATE INDEX IF NOT EXISTS idx_visit_requests_payment_method ON visit_requests(payment_method);
