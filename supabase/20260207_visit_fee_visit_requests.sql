-- Visit fee configuration on listings
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS visit_fee_enabled BOOLEAN DEFAULT true NOT NULL,
  ADD COLUMN IF NOT EXISTS visit_fee_amount BIGINT DEFAULT 15000 NOT NULL,
  ADD COLUMN IF NOT EXISTS visit_fee_payment_methods JSONB DEFAULT '{}'::jsonb NOT NULL;

-- Visit request status enum
DO $$ BEGIN
  CREATE TYPE visit_request_status AS ENUM ('pending_payment', 'paid', 'released', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Visit requests table
CREATE TABLE IF NOT EXISTS visit_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  visit_fee_amount BIGINT DEFAULT 15000 NOT NULL,
  platform_fee BIGINT DEFAULT 4500 NOT NULL,
  seller_payout BIGINT DEFAULT 10500 NOT NULL,
  payment_transaction_id UUID REFERENCES payment_transactions(id),
  payment_reference TEXT,
  status visit_request_status DEFAULT 'pending_payment' NOT NULL,
  payout_status TEXT DEFAULT 'pending' NOT NULL,
  released_by UUID REFERENCES users(id),
  released_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_visit_requests_listing_id ON visit_requests(listing_id);
CREATE INDEX IF NOT EXISTS idx_visit_requests_buyer_id ON visit_requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_visit_requests_seller_id ON visit_requests(seller_id);
CREATE INDEX IF NOT EXISTS idx_visit_requests_status ON visit_requests(status);
CREATE INDEX IF NOT EXISTS idx_visit_requests_payment_reference ON visit_requests(payment_reference);

-- updated_at trigger
DROP TRIGGER IF EXISTS update_visit_requests_updated_at ON visit_requests;
CREATE TRIGGER update_visit_requests_updated_at
  BEFORE UPDATE ON visit_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE visit_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Buyers can view own visit requests" ON visit_requests;
CREATE POLICY "Buyers can view own visit requests" ON visit_requests
  FOR SELECT USING (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Sellers can view visit requests" ON visit_requests;
CREATE POLICY "Sellers can view visit requests" ON visit_requests
  FOR SELECT USING (seller_id = auth.uid());

DROP POLICY IF EXISTS "Buyers can create visit requests" ON visit_requests;
CREATE POLICY "Buyers can create visit requests" ON visit_requests
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage visit requests" ON visit_requests;
CREATE POLICY "Admins can manage visit requests" ON visit_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Auto-update visit request when payment completes
CREATE OR REPLACE FUNCTION handle_visit_fee_payment_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND NEW.transaction_type = 'visit_fee' THEN
    UPDATE visit_requests
      SET status = 'paid',
          payment_transaction_id = NEW.id
      WHERE payment_reference = NEW.our_reference;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS visit_fee_payment_complete_trigger ON payment_transactions;
CREATE TRIGGER visit_fee_payment_complete_trigger
  AFTER UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION handle_visit_fee_payment_complete();
