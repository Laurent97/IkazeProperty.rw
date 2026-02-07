-- Create ad campaigns table
CREATE TABLE IF NOT EXISTS ad_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ad_type TEXT NOT NULL CHECK (ad_type IN ('banner', 'sidebar', 'featured', 'sponsored', 'premium_listing')),
  placement_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'paused', 'completed', 'rejected')),
  budget_total INTEGER NOT NULL DEFAULT 0,
  spent_amount INTEGER NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  landing_page TEXT,
  link TEXT,
  target_audience TEXT,
  advertiser_name TEXT,
  advertiser_email TEXT,
  admin_notes TEXT,
  rejection_reason TEXT,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ad creatives table
CREATE TABLE IF NOT EXISTS ad_creatives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  order_index INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_ad_campaigns_placement_status ON ad_campaigns(placement_code, status);
CREATE INDEX idx_ad_campaigns_status ON ad_campaigns(status);
CREATE INDEX idx_ad_campaigns_dates ON ad_campaigns(start_date, end_date);
CREATE INDEX idx_ad_creatives_campaign_id ON ad_creatives(campaign_id);
CREATE INDEX idx_ad_creatives_primary ON ad_creatives(campaign_id, is_primary);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ad_campaigns_updated_at 
  BEFORE UPDATE ON ad_campaigns 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
