-- Create ad analytics table
CREATE TABLE IF NOT EXISTS ad_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'click', 'conversion')),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX idx_ad_analytics_campaign_id ON ad_analytics(campaign_id);
CREATE INDEX idx_ad_analytics_event_type ON ad_analytics(event_type);
CREATE INDEX idx_ad_analytics_created_at ON ad_analytics(created_at);

-- Create RPC function to safely increment campaign metrics
CREATE OR REPLACE FUNCTION increment_campaign_metric(
  p_campaign_id UUID,
  p_field TEXT
)
RETURNS VOID AS $$
BEGIN
  IF p_field = 'impressions' THEN
    UPDATE ad_campaigns 
    SET impressions = impressions + 1, updated_at = NOW()
    WHERE id = p_campaign_id;
  ELSIF p_field = 'clicks' THEN
    UPDATE ad_campaigns 
    SET clicks = clicks + 1, updated_at = NOW()
    WHERE id = p_campaign_id;
  ELSIF p_field = 'conversions' THEN
    UPDATE ad_campaigns 
    SET conversions = conversions + 1, updated_at = NOW()
    WHERE id = p_campaign_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION increment_campaign_metric TO authenticated;
