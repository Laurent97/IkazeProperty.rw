export interface AdCampaign {
  id: string
  user_id: string
  ad_type: 'premium_listing' | 'banner' | 'sponsored'
  status: 'draft' | 'pending' | 'active' | 'paused' | 'completed' | 'rejected'
  title: string
  description?: string
  target_categories?: string[]
  target_locations?: Record<string, any>
  target_audience?: Record<string, any>
  budget_total?: number
  budget_daily?: number
  bid_type?: 'cpc' | 'cpm' | 'fixed'
  bid_amount?: number
  spent_amount: number
  start_date?: string
  end_date?: string
  schedule?: Record<string, any>
  media_urls?: string[]
  primary_image_url?: string
  video_url?: string
  cta_text?: string
  cta_link?: string
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  admin_notes?: string
  approved_by?: string
  approved_at?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface AdPlacement {
  id: string
  name: string
  code: string
  description?: string
  dimensions?: string
  location?: string
  ad_type: ('premium_listing' | 'banner' | 'sponsored')[]
  price_per_day: number
  is_active: boolean
  max_ads: number
  priority: number
  created_at: string
  updated_at: string
}

export interface AdRotation {
  id: string
  ad_campaign_id: string
  placement_id: string
  display_order: number
  weight: number
  start_date?: string
  end_date?: string
  is_active: boolean
  created_at: string
}

export interface AdAnalytics {
  id: string
  ad_campaign_id: string
  user_id?: string
  event_type: 'impression' | 'click' | 'conversion'
  event_data?: Record<string, any>
  ip_address?: string
  user_agent?: string
  referrer?: string
  created_at: string
}

export interface UserAdCredits {
  id: string
  user_id: string
  balance: number
  pending_amount: number
  last_top_up?: string
  created_at: string
  updated_at: string
}

export interface PremiumFeature {
  id: string
  code: string
  name: string
  description?: string
  price: number
  duration_days: number
  placement_code?: string
  max_per_listing: number
  is_active: boolean
  created_at: string
}

export interface UserPremiumPurchase {
  id: string
  user_id: string
  listing_id?: string
  premium_feature_id: string
  start_date: string
  end_date?: string
  status: string
  amount_paid: number
  created_at: string
}

export interface AdTransaction {
  id: string
  user_id: string
  ad_campaign_id?: string
  transaction_type: 'top_up' | 'ad_spend' | 'refund'
  amount: number
  payment_method?: string
  payment_reference?: string
  description?: string
  status: string
  created_at: string
}

export interface PremiumFeatureConfig {
  code: string
  name: string
  description: string
  price: number
  duration: number
  placement?: string
  max_per_listing?: number
  reach?: string
  platforms?: string[]
}

export const premiumFeatures: Record<string, PremiumFeatureConfig> = {
  featured_placement: {
    code: 'featured_placement',
    name: 'Featured Placement',
    description: 'Appears at top of category pages for 7 days',
    price: 15000,
    duration: 7,
    placement: 'category_top',
    max_per_listing: 1
  },
  urgent_badge: {
    code: 'urgent_badge',
    name: 'Urgent Badge',
    description: 'Red URGENT badge with priority ranking',
    price: 5000,
    duration: 14,
    placement: 'listing_card'
  },
  homepage_carousel: {
    code: 'homepage_carousel',
    name: 'Homepage Feature',
    description: 'Featured in homepage carousel for 3 days',
    price: 25000,
    duration: 3,
    placement: 'homepage_carousel',
    max_per_listing: 1
  },
  social_boost: {
    code: 'social_boost',
    name: 'Social Media Boost',
    description: 'Promoted on our social media channels',
    price: 10000,
    duration: 7,
    platforms: ['facebook', 'instagram', 'twitter']
  },
  whatsapp_blast: {
    code: 'whatsapp_blast',
    name: 'WhatsApp Broadcast',
    description: 'Sent to relevant subscriber groups',
    price: 8000,
    duration: 1,
    reach: '1000+ subscribers'
  }
}

export interface AdInventory {
  placements: {
    homepage: {
      leaderboard: { size: '970x250', price: 50000 }
      sidebar: { size: '300x600', price: 30000 }
      interstitial: { size: 'fullscreen', price: 100000 }
    }
    category_pages: {
      top_banner: { size: '728x90', price: 20000 }
      inline: { size: '300x250', price: 15000 }
    }
    listing_detail: {
      sticky_sidebar: { size: '300x250', price: 25000 }
      below_description: { size: '728x90', price: 18000 }
    }
  }
}

export interface AdCreative {
  id: string
  campaign_id: string
  type: 'image' | 'video' | 'html'
  content: string
  dimensions?: string
  file_size?: number
  mime_type?: string
  is_primary?: boolean
  created_at: string
}

export interface AdTargeting {
  categories?: string[]
  locations?: {
    provinces?: string[]
    districts?: string[]
    sectors?: string[]
  }
  audience?: {
    age_range?: [number, number]
    gender?: 'male' | 'female' | 'all'
    interests?: string[]
    language?: string[]
  }
  devices?: {
    desktop?: boolean
    mobile?: boolean
    tablet?: boolean
  }
  time?: {
    hours?: number[]
    days?: string[]
  }
}

export interface AdMetrics {
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc?: number
  cpm?: number
  spend: number
  revenue?: number
  roi?: number
}

export interface AdPerformanceReport {
  campaign_id: string
  campaign_name: string
  date_range: {
    start: string
    end: string
  }
  metrics: AdMetrics
  breakdown?: {
    by_date: Record<string, AdMetrics>
    by_placement: Record<string, AdMetrics>
    by_device: Record<string, AdMetrics>
  }
}
