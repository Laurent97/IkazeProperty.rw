-- Create custom types for enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'agent', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_category AS ENUM ('houses', 'cars', 'land', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('rent', 'buy', 'sale');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('available', 'sold', 'rented', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE price_type AS ENUM ('fixed', 'negotiable', 'auction');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE currency_type AS ENUM ('RWF', 'USD', 'EUR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inquiry_status AS ENUM ('pending', 'approved', 'rejected', 'connected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'cancelled', 'disputed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE media_type AS ENUM ('image', 'video');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE promotion_type AS ENUM ('featured', 'urgent', 'video', 'social', 'email', 'higher_images', '360_tour');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ad Management Types
DO $$ BEGIN
    CREATE TYPE ad_type AS ENUM ('premium_listing', 'banner', 'sponsored');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ad_status AS ENUM ('draft', 'pending', 'active', 'paused', 'completed', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE bid_type AS ENUM ('cpc', 'cpm', 'fixed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ad_event_type AS ENUM ('impression', 'click', 'conversion');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role user_role DEFAULT 'user' NOT NULL,
    avatar_url TEXT,
    verified BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price BIGINT NOT NULL,
    currency currency_type DEFAULT 'RWF' NOT NULL,
    price_type price_type DEFAULT 'fixed' NOT NULL,
    category listing_category NOT NULL,
    transaction_type transaction_type NOT NULL,
    status listing_status DEFAULT 'available' NOT NULL,
    location JSONB NOT NULL, -- {province, district, sector, cell, village, address, coordinates}
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 0.30 NOT NULL,
    commission_agreed BOOLEAN DEFAULT false NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    promoted BOOLEAN DEFAULT false NOT NULL,
    views INTEGER DEFAULT 0 NOT NULL,
    likes INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- House details table
CREATE TABLE IF NOT EXISTS house_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    property_type TEXT NOT NULL, -- house, apartment, duplex, villa, commercial
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    total_area INTEGER NOT NULL, -- in m²
    year_built INTEGER,
    condition TEXT NOT NULL, -- new, renovated, good, needs_repair
    furnished TEXT NOT NULL, -- furnished, semi_furnished, unfurnished
    parking TEXT NOT NULL, -- garage, open, security
    features JSONB, -- array of features
    utilities_included JSONB, -- array of utilities
    rent_duration TEXT, -- monthly, yearly, short_term
    security_deposit BIGINT,
    advance_payment BIGINT,
    minimum_lease_period TEXT,
    available_from DATE
);

-- Car details table
CREATE TABLE IF NOT EXISTS car_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    vehicle_type TEXT NOT NULL, -- car, motorcycle, truck, bus, suv
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year_manufacture INTEGER NOT NULL,
    condition TEXT NOT NULL, -- new, used
    fuel_type TEXT NOT NULL, -- petrol, diesel, electric, hybrid
    transmission TEXT NOT NULL, -- automatic, manual
    engine_capacity INTEGER NOT NULL, -- in cc
    mileage INTEGER NOT NULL, -- in km
    color TEXT NOT NULL,
    doors INTEGER NOT NULL,
    seats INTEGER NOT NULL,
    features JSONB, -- array of features
    ownership_papers BOOLEAN DEFAULT false,
    insurance_status TEXT,
    road_worthiness BOOLEAN DEFAULT false,
    last_service_date DATE,
    rental_daily_rate BIGINT,
    rental_weekly_rate BIGINT,
    rental_monthly_rate BIGINT,
    security_deposit BIGINT,
    minimum_rental_period TEXT,
    delivery_option BOOLEAN DEFAULT false,
    driver_included BOOLEAN DEFAULT false
);

-- Land details table
CREATE TABLE IF NOT EXISTS land_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    plot_type TEXT NOT NULL, -- residential, commercial, agricultural, industrial
    plot_size INTEGER NOT NULL,
    size_unit TEXT DEFAULT 'm²' NOT NULL, -- m², hectares
    shape TEXT NOT NULL, -- regular, irregular
    topography TEXT NOT NULL, -- flat, sloping, hilly
    soil_type TEXT,
    road_access TEXT NOT NULL, -- tarmac, gravel, footpath
    fenced BOOLEAN DEFAULT false NOT NULL,
    utilities_available JSONB, -- array of utilities
    land_title_type TEXT NOT NULL, -- freehold, leasehold, customary
    title_deed_number TEXT,
    surveyed BOOLEAN DEFAULT false NOT NULL,
    zoning_approval BOOLEAN DEFAULT false,
    development_permits BOOLEAN DEFAULT false,
    tax_clearance BOOLEAN DEFAULT false,
    nearest_main_road_distance INTEGER, -- in meters
    nearest_town_distance INTEGER, -- in meters
    nearby_amenities JSONB -- array of amenities
);

-- Other item details table
CREATE TABLE IF NOT EXISTS other_item_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    subcategory TEXT NOT NULL,
    brand TEXT,
    model TEXT,
    condition TEXT NOT NULL, -- new, used, like_new
    warranty_available BOOLEAN DEFAULT false NOT NULL,
    warranty_period TEXT,
    reason_for_selling TEXT,
    original_purchase_date DATE,
    age_of_item TEXT
);

-- Listing media table
CREATE TABLE IF NOT EXISTS listing_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    media_type media_type NOT NULL,
    url TEXT NOT NULL,
    public_id TEXT NOT NULL, -- Cloudinary public_id
    order_index INTEGER NOT NULL,
    is_primary BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    status inquiry_status DEFAULT 'pending' NOT NULL,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    amount BIGINT NOT NULL,
    commission_amount BIGINT NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    status transaction_status DEFAULT 'pending' NOT NULL,
    payment_method TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    inquiry_id UUID REFERENCES inquiries(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    admin_mediated BOOLEAN DEFAULT false NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Promoted listings table
CREATE TABLE IF NOT EXISTS promoted_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    promotion_type promotion_type NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    price BIGINT NOT NULL,
    paid BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Saved searches table
CREATE TABLE IF NOT EXISTS saved_searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    filters JSONB NOT NULL, -- {category, transaction_type, price_min, price_max, location, features}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Favorite listings table
CREATE TABLE IF NOT EXISTS favorite_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, listing_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    reviewed_user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(reviewer_id, transaction_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at);
CREATE INDEX IF NOT EXISTS idx_listings_featured ON listings(featured);

CREATE INDEX IF NOT EXISTS idx_inquiries_listing_id ON inquiries(listing_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_buyer_id ON inquiries(buyer_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_seller_id ON inquiries(seller_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

CREATE INDEX IF NOT EXISTS idx_transactions_listing_id ON transactions(listing_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

CREATE INDEX IF NOT EXISTS idx_messages_transaction_id ON messages(transaction_id);
CREATE INDEX IF NOT EXISTS idx_messages_inquiry_id ON messages(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);

CREATE INDEX IF NOT EXISTS idx_listing_media_listing_id ON listing_media(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_media_order ON listing_media(listing_id, order_index);

CREATE INDEX IF NOT EXISTS idx_favorite_listings_user_id ON favorite_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_listings_listing_id ON favorite_listings(listing_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inquiries_updated_at ON inquiries;
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for listings
DROP POLICY IF EXISTS "Anyone can view listings" ON listings;
CREATE POLICY "Anyone can view listings" ON listings
    FOR SELECT USING (status = 'available');

DROP POLICY IF EXISTS "Users can view own listings" ON listings;
CREATE POLICY "Users can view own listings" ON listings
    FOR SELECT USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can create own listings" ON listings;
CREATE POLICY "Users can create own listings" ON listings
    FOR INSERT WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can update own listings" ON listings;
CREATE POLICY "Users can update own listings" ON listings
    FOR UPDATE USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Admins can manage all listings" ON listings;
CREATE POLICY "Admins can manage all listings" ON listings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- RLS Policies for inquiries
DROP POLICY IF EXISTS "Users can view own inquiries" ON inquiries;
CREATE POLICY "Users can view own inquiries" ON inquiries
    FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can create inquiries" ON inquiries;
CREATE POLICY "Users can create inquiries" ON inquiries
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Admins can view all inquiries" ON inquiries;
CREATE POLICY "Admins can view all inquiries" ON inquiries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can update inquiries" ON inquiries;
CREATE POLICY "Admins can update inquiries" ON inquiries
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- RLS Policies for transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
CREATE POLICY "Admins can view all transactions" ON transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- RLS Policies for messages
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
CREATE POLICY "Users can view own messages" ON messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can create messages" ON messages;
CREATE POLICY "Users can create messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for favorite_listings
DROP POLICY IF EXISTS "Users can manage own favorites" ON favorite_listings;
CREATE POLICY "Users can manage own favorites" ON favorite_listings
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for saved_searches
DROP POLICY IF EXISTS "Users can manage own saved searches" ON saved_searches;
CREATE POLICY "Users can manage own saved searches" ON saved_searches
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for reviews
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
CREATE POLICY "Users can view all reviews" ON reviews
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create own reviews" ON reviews;
CREATE POLICY "Users can create own reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, full_name, role, verified) 
VALUES ('admin@ikazeproperty.rw', 'System Administrator', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- AD MANAGEMENT SYSTEM TABLES
-- ========================================

-- Ad Campaigns Table
CREATE TABLE IF NOT EXISTS ad_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ad_type ad_type NOT NULL,
    status ad_status DEFAULT 'draft',
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Targeting
    target_categories VARCHAR[],
    target_locations JSONB,
    target_audience JSONB,
    
    -- Budget & Billing
    budget_total DECIMAL(10,2),
    budget_daily DECIMAL(10,2),
    bid_type bid_type,
    bid_amount DECIMAL(10,2),
    spent_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Schedule
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    schedule JSONB,
    
    -- Creative
    media_urls TEXT[],
    primary_image_url TEXT,
    video_url TEXT,
    cta_text VARCHAR(50),
    cta_link TEXT,
    
    -- Performance Tracking
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    ctr DECIMAL(5,2) DEFAULT 0,
    
    -- Admin Fields
    admin_notes TEXT,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad Placements Table
CREATE TABLE IF NOT EXISTS ad_placements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    dimensions VARCHAR(20),
    location VARCHAR(50),
    ad_type ad_type[] NOT NULL,
    price_per_day DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    max_ads INTEGER DEFAULT 1,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad Rotations Table
CREATE TABLE IF NOT EXISTS ad_rotations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ad_campaign_id UUID REFERENCES ad_campaigns(id) ON DELETE CASCADE,
    placement_id UUID REFERENCES ad_placements(id) ON DELETE CASCADE,
    display_order INTEGER,
    weight INTEGER DEFAULT 1,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad Analytics Table
CREATE TABLE IF NOT EXISTS ad_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ad_campaign_id UUID REFERENCES ad_campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type ad_event_type NOT NULL,
    event_data JSONB,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Ad Credits/Wallet Table
CREATE TABLE IF NOT EXISTS user_ad_credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    balance DECIMAL(10,2) DEFAULT 0,
    pending_amount DECIMAL(10,2) DEFAULT 0,
    last_top_up TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Premium Features Table
CREATE TABLE IF NOT EXISTS premium_features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    placement_code VARCHAR(50),
    max_per_listing INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Premium Purchases Table
CREATE TABLE IF NOT EXISTS user_premium_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    premium_feature_id UUID REFERENCES premium_features(id),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active',
    amount_paid DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad Transactions Table
CREATE TABLE IF NOT EXISTS ad_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ad_campaign_id UUID REFERENCES ad_campaigns(id) ON DELETE SET NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'top_up', 'ad_spend', 'refund'
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_reference TEXT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INSERT DEFAULT AD PLACEMENTS
-- ========================================

INSERT INTO ad_placements (name, code, description, dimensions, location, ad_type, price_per_day, priority) VALUES
('Homepage Leaderboard', 'homepage_leaderboard', 'Top banner on homepage', '970x250', 'homepage_top', ARRAY['banner', 'sponsored']::ad_type[], 50000, 1),
('Homepage Sidebar', 'homepage_sidebar', 'Right sidebar on homepage', '300x600', 'homepage_right', ARRAY['banner', 'sponsored']::ad_type[], 30000, 2),
('Category Top Banner', 'category_top', 'Top banner on category pages', '728x90', 'category_top', ARRAY['banner', 'sponsored']::ad_type[], 20000, 1),
('Category Sidebar', 'category_sidebar', 'Right sidebar on category pages', '300x250', 'category_right', ARRAY['banner', 'sponsored']::ad_type[], 15000, 2),
('Listing Detail Sidebar', 'listing_sidebar', 'Sidebar on listing detail pages', '300x250', 'listing_right', ARRAY['banner', 'sponsored']::ad_type[], 25000, 1),
('Featured Listings Carousel', 'featured_carousel', 'Homepage featured listings carousel', 'variable', 'homepage_featured', ARRAY['premium_listing']::ad_type[], 25000, 1),
('Category Featured Placement', 'category_featured', 'Top placement in category results', 'variable', 'category_featured', ARRAY['premium_listing']::ad_type[], 15000, 1);

-- ========================================
-- INSERT DEFAULT PREMIUM FEATURES
-- ========================================

INSERT INTO premium_features (code, name, description, price, duration_days, placement_code, max_per_listing) VALUES
('featured_placement', 'Featured Placement', 'Appears at top of category pages for 7 days', 15000, 7, 'category_featured', 1),
('urgent_badge', 'Urgent Badge', 'Red URGENT badge with priority ranking', 5000, 14, 'listing_card', 1),
('homepage_carousel', 'Homepage Feature', 'Featured in homepage carousel for 3 days', 25000, 3, 'featured_carousel', 1),
('social_boost', 'Social Media Boost', 'Promoted on social media channels', 10000, 7, 'external', 1),
('whatsapp_blast', 'WhatsApp Broadcast', 'Sent to relevant subscriber groups', 8000, 1, 'external', 1);

-- ========================================
-- CREATE INDEXES FOR AD TABLES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_ad_campaigns_user_id ON ad_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_status ON ad_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_ad_type ON ad_campaigns(ad_type);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_start_date ON ad_campaigns(start_date);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_end_date ON ad_campaigns(end_date);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_created_at ON ad_campaigns(created_at);

CREATE INDEX IF NOT EXISTS idx_ad_placements_code ON ad_placements(code);
CREATE INDEX IF NOT EXISTS idx_ad_placements_is_active ON ad_placements(is_active);
CREATE INDEX IF NOT EXISTS idx_ad_placements_location ON ad_placements(location);

CREATE INDEX IF NOT EXISTS idx_ad_rotations_campaign_id ON ad_rotations(ad_campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_rotations_placement_id ON ad_rotations(placement_id);
CREATE INDEX IF NOT EXISTS idx_ad_rotations_is_active ON ad_rotations(is_active);

CREATE INDEX IF NOT EXISTS idx_ad_analytics_campaign_id ON ad_analytics(ad_campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_analytics_event_type ON ad_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_ad_analytics_created_at ON ad_analytics(created_at);

CREATE INDEX IF NOT EXISTS idx_user_ad_credits_user_id ON user_ad_credits(user_id);

CREATE INDEX IF NOT EXISTS idx_user_premium_purchases_user_id ON user_premium_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_premium_purchases_listing_id ON user_premium_purchases(listing_id);
CREATE INDEX IF NOT EXISTS idx_user_premium_purchases_status ON user_premium_purchases(status);

CREATE INDEX IF NOT EXISTS idx_ad_transactions_user_id ON ad_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_transactions_transaction_type ON ad_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_ad_transactions_status ON ad_transactions(status);

-- ========================================
-- CREATE TRIGGERS FOR AD TABLES
-- ========================================

DROP TRIGGER IF EXISTS update_ad_campaigns_updated_at ON ad_campaigns;
CREATE TRIGGER update_ad_campaigns_updated_at BEFORE UPDATE ON ad_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ad_placements_updated_at ON ad_placements;
CREATE TRIGGER update_ad_placements_updated_at BEFORE UPDATE ON ad_placements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_ad_credits_updated_at ON user_ad_credits;
CREATE TRIGGER update_user_ad_credits_updated_at BEFORE UPDATE ON user_ad_credits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ENABLE RLS FOR AD TABLES
-- ========================================

ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ad_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_premium_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_transactions ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES FOR AD TABLES
-- ========================================

-- Ad Campaigns Policies
DROP POLICY IF EXISTS "Users can view own ad campaigns" ON ad_campaigns;
CREATE POLICY "Users can view own ad campaigns" ON ad_campaigns
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own ad campaigns" ON ad_campaigns;
CREATE POLICY "Users can create own ad campaigns" ON ad_campaigns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ad campaigns" ON ad_campaigns;
CREATE POLICY "Users can update own ad campaigns" ON ad_campaigns
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all ad campaigns" ON ad_campaigns;
CREATE POLICY "Admins can manage all ad campaigns" ON ad_campaigns
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- User Ad Credits Policies
DROP POLICY IF EXISTS "Users can view own ad credits" ON user_ad_credits;
CREATE POLICY "Users can view own ad credits" ON user_ad_credits
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ad credits" ON user_ad_credits;
CREATE POLICY "Users can update own ad credits" ON user_ad_credits
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all ad credits" ON user_ad_credits;
CREATE POLICY "Admins can manage all ad credits" ON user_ad_credits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- User Premium Purchases Policies
DROP POLICY IF EXISTS "Users can view own premium purchases" ON user_premium_purchases;
CREATE POLICY "Users can view own premium purchases" ON user_premium_purchases
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own premium purchases" ON user_premium_purchases;
CREATE POLICY "Users can create own premium purchases" ON user_premium_purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all premium purchases" ON user_premium_purchases;
CREATE POLICY "Admins can manage all premium purchases" ON user_premium_purchases
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Ad Transactions Policies
DROP POLICY IF EXISTS "Users can view own ad transactions" ON ad_transactions;
CREATE POLICY "Users can view own ad transactions" ON ad_transactions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own ad transactions" ON ad_transactions;
CREATE POLICY "Users can create own ad transactions" ON ad_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all ad transactions" ON ad_transactions;
CREATE POLICY "Admins can manage all ad transactions" ON ad_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =====================================
-- PAYMENT SYSTEM SCHEMA
-- =====================================

-- Payment Method Types
DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('mtn_momo', 'airtel_money', 'equity_bank', 'crypto', 'wallet');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE wallet_transaction_type AS ENUM ('deposit', 'withdrawal', 'payment', 'refund', 'lock', 'unlock');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE crypto_type AS ENUM ('bitcoin', 'ethereum', 'usdt');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Payment Configurations (Admin Managed)
CREATE TABLE IF NOT EXISTS payment_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    payment_method payment_method NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    config_data JSONB NOT NULL,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Payment Transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    ad_campaign_id UUID REFERENCES ad_campaigns(id) ON DELETE SET NULL,
    
    -- Payment Details
    payment_method payment_method NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'RWF' NOT NULL,
    transaction_type VARCHAR(50), -- 'ad_promotion', 'listing_fee', 'wallet_topup', 'premium_feature'
    
    -- Status Tracking
    status payment_status DEFAULT 'pending' NOT NULL,
    provider_reference VARCHAR(100), -- Provider transaction ID
    our_reference VARCHAR(50) UNIQUE NOT NULL, -- Our internal reference
    
    -- Payment Provider Details
    provider_response JSONB,
    callback_data JSONB,
    
    -- Metadata
    description TEXT,
    metadata JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- User Wallet System
CREATE TABLE IF NOT EXISTS user_wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    balance DECIMAL(12,2) DEFAULT 0 NOT NULL,
    locked_balance DECIMAL(12,2) DEFAULT 0 NOT NULL, -- For pending transactions
    currency VARCHAR(3) DEFAULT 'RWF' NOT NULL,
    
    -- Crypto Wallet Addresses
    btc_address VARCHAR(100),
    eth_address VARCHAR(100),
    usdt_address VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Wallet Transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_id UUID REFERENCES user_wallets(id) ON DELETE CASCADE NOT NULL,
    transaction_type wallet_transaction_type NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    previous_balance DECIMAL(12,2) NOT NULL,
    new_balance DECIMAL(12,2) NOT NULL,
    reference VARCHAR(100),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Payment Webhook Logs
CREATE TABLE IF NOT EXISTS payment_webhook_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    payment_method payment_method,
    event_type VARCHAR(50),
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'received' NOT NULL,
    processed BOOLEAN DEFAULT false NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Promotion Packages
CREATE TABLE IF NOT EXISTS promotion_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    features JSONB NOT NULL, -- Array of features
    is_active BOOLEAN DEFAULT true NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Listing Promotions
CREATE TABLE IF NOT EXISTS listing_promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    package_id UUID REFERENCES promotion_packages(id) NOT NULL,
    payment_transaction_id UUID REFERENCES payment_transactions(id) ON DELETE SET NULL,
    
    status VARCHAR(20) DEFAULT 'active' NOT NULL, -- 'active', 'expired', 'cancelled'
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Promotion performance tracking
    views_before_promotion INTEGER DEFAULT 0,
    views_during_promotion INTEGER DEFAULT 0,
    inquiries_before_promotion INTEGER DEFAULT 0,
    inquiries_during_promotion INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(listing_id, package_id, status)
);

-- Exchange Rates (for crypto conversions)
CREATE TABLE IF NOT EXISTS exchange_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_currency VARCHAR(10) NOT NULL, -- 'BTC', 'ETH', 'USDT', 'USD'
    to_currency VARCHAR(10) NOT NULL, -- 'RWF'
    rate DECIMAL(20,8) NOT NULL,
    source VARCHAR(50) NOT NULL, -- 'coinbase', 'binance', 'manual'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(from_currency, to_currency, source)
);

-- Payment Refunds
CREATE TABLE IF NOT EXISTS payment_refunds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    original_transaction_id UUID REFERENCES payment_transactions(id) ON DELETE CASCADE NOT NULL,
    refund_transaction_id UUID REFERENCES payment_transactions(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- 'pending', 'processing', 'completed', 'failed'
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Payment Method Limits
CREATE TABLE IF NOT EXISTS payment_method_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    payment_method payment_method NOT NULL,
    user_tier VARCHAR(20) DEFAULT 'basic' NOT NULL, -- 'basic', 'verified', 'premium'
    min_amount DECIMAL(10,2) DEFAULT 0 NOT NULL,
    max_amount DECIMAL(10,2) NOT NULL,
    daily_limit DECIMAL(12,2) NOT NULL,
    monthly_limit DECIMAL(12,2) NOT NULL,
    transaction_fee_percent DECIMAL(5,2) DEFAULT 0 NOT NULL,
    fixed_fee DECIMAL(10,2) DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(payment_method, user_tier)
);

-- =====================================
-- INDEXES FOR PAYMENT SYSTEM
-- =====================================

-- Payment Transactions Indexes
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_method ON payment_transactions(payment_method);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference ON payment_transactions(our_reference);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON payment_transactions(created_at);

-- User Wallets Indexes
CREATE INDEX IF NOT EXISTS idx_user_wallets_user_id ON user_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_wallets_balance ON user_wallets(balance);

-- Wallet Transactions Indexes
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at);

-- Listing Promotions Indexes
CREATE INDEX IF NOT EXISTS idx_listing_promotions_listing_id ON listing_promotions(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_promotions_status ON listing_promotions(status);
CREATE INDEX IF NOT EXISTS idx_listing_promotions_expires_at ON listing_promotions(expires_at);

-- Exchange Rates Indexes
CREATE INDEX IF NOT EXISTS idx_exchange_rates_currency_pair ON exchange_rates(from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_updated_at ON exchange_rates(updated_at);

-- Payment Webhook Logs Indexes
CREATE INDEX IF NOT EXISTS idx_payment_webhook_logs_method ON payment_webhook_logs(payment_method);
CREATE INDEX IF NOT EXISTS idx_payment_webhook_logs_processed ON payment_webhook_logs(processed);
CREATE INDEX IF NOT EXISTS idx_payment_webhook_logs_created_at ON payment_webhook_logs(created_at);

-- =====================================
-- RLS POLICIES FOR PAYMENT SYSTEM
-- =====================================

-- Payment Configurations Policies
DROP POLICY IF EXISTS "Admins can manage payment configurations" ON payment_configurations;
CREATE POLICY "Admins can manage payment configurations" ON payment_configurations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Payment Transactions Policies
DROP POLICY IF EXISTS "Users can view own payment transactions" ON payment_transactions;
CREATE POLICY "Users can view own payment transactions" ON payment_transactions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all payment transactions" ON payment_transactions;
CREATE POLICY "Admins can manage all payment transactions" ON payment_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- User Wallets Policies
DROP POLICY IF EXISTS "Users can view own wallet" ON user_wallets;
CREATE POLICY "Users can view own wallet" ON user_wallets
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own wallet" ON user_wallets;
CREATE POLICY "Users can update own wallet" ON user_wallets
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all wallets" ON user_wallets;
CREATE POLICY "Admins can manage all wallets" ON user_wallets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Wallet Transactions Policies
DROP POLICY IF EXISTS "Users can view own wallet transactions" ON wallet_transactions;
CREATE POLICY "Users can view own wallet transactions" ON wallet_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_wallets 
            WHERE user_wallets.id = wallet_transactions.wallet_id 
            AND user_wallets.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins can manage all wallet transactions" ON wallet_transactions;
CREATE POLICY "Admins can manage all wallet transactions" ON wallet_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Listing Promotions Policies
DROP POLICY IF EXISTS "Users can view own listing promotions" ON listing_promotions;
CREATE POLICY "Users can view own listing promotions" ON listing_promotions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = listing_promotions.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins can manage all listing promotions" ON listing_promotions;
CREATE POLICY "Admins can manage all listing promotions" ON listing_promotions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Payment Refunds Policies
DROP POLICY IF EXISTS "Users can view own payment refunds" ON payment_refunds;
CREATE POLICY "Users can view own payment refunds" ON payment_refunds
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM payment_transactions 
            WHERE payment_transactions.id = payment_refunds.original_transaction_id 
            AND payment_transactions.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins can manage all payment refunds" ON payment_refunds;
CREATE POLICY "Admins can manage all payment refunds" ON payment_refunds
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =====================================
-- TRIGGERS FOR PAYMENT SYSTEM
-- =====================================

-- Update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_payment_configurations_updated_at ON payment_configurations;
CREATE TRIGGER update_payment_configurations_updated_at 
    BEFORE UPDATE ON payment_configurations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_wallets_updated_at ON user_wallets;
CREATE TRIGGER update_user_wallets_updated_at 
    BEFORE UPDATE ON user_wallets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at 
    BEFORE UPDATE ON payment_transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_listing_promotions_updated_at ON listing_promotions;
CREATE TRIGGER update_listing_promotions_updated_at 
    BEFORE UPDATE ON listing_promotions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_method_limits_updated_at ON payment_method_limits;
CREATE TRIGGER update_payment_method_limits_updated_at 
    BEFORE UPDATE ON payment_method_limits 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create wallet for new users
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_wallets (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS create_wallet_on_user_signup ON users;
CREATE TRIGGER create_wallet_on_user_signup
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_user_wallet();

-- Generate unique payment reference
CREATE OR REPLACE FUNCTION generate_payment_reference()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.our_reference IS NULL THEN
        NEW.our_reference := 'PAY' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS') || LPAD(EXTRACT(MICROSECONDS FROM NOW())::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS generate_payment_reference_trigger ON payment_transactions;
CREATE TRIGGER generate_payment_reference_trigger
    BEFORE INSERT ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION generate_payment_reference();

-- Lock wallet balance for pending payments
CREATE OR REPLACE FUNCTION lock_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'pending' AND OLD.status IS NULL THEN
        UPDATE user_wallets 
        SET balance = balance - NEW.amount,
            locked_balance = locked_balance + NEW.amount
        WHERE user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS lock_wallet_balance_trigger ON payment_transactions;
CREATE TRIGGER lock_wallet_balance_trigger
    AFTER INSERT ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION lock_wallet_balance();

-- Unlock/completed wallet balance
CREATE OR REPLACE FUNCTION finalize_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'pending' THEN
        IF NEW.status = 'completed' THEN
            -- Payment successful, keep locked balance as spent
            UPDATE user_wallets 
            SET locked_balance = locked_balance - NEW.amount
            WHERE user_id = NEW.user_id;
        ELSIF NEW.status IN ('failed', 'expired', 'refunded') THEN
            -- Payment failed, return balance to wallet
            UPDATE user_wallets 
            SET balance = balance + NEW.amount,
                locked_balance = locked_balance - NEW.amount
            WHERE user_id = NEW.user_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS finalize_wallet_balance_trigger ON payment_transactions;
CREATE TRIGGER finalize_wallet_balance_trigger
    AFTER UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION finalize_wallet_balance();

-- Create wallet transaction record
CREATE OR REPLACE FUNCTION create_wallet_transaction()
RETURNS TRIGGER AS $$
DECLARE
    wallet_record user_wallets%ROWTYPE;
BEGIN
    SELECT * INTO wallet_record FROM user_wallets WHERE user_id = NEW.user_id;
    
    IF TG_OP = 'INSERT' THEN
        INSERT INTO wallet_transactions (wallet_id, transaction_type, amount, previous_balance, new_balance, reference, description)
        VALUES (wallet_record.id, 'lock', NEW.amount, wallet_record.balance + NEW.amount, wallet_record.balance, NEW.our_reference, 
                CASE WHEN NEW.payment_method = 'wallet' THEN 'Payment initiated' ELSE 'Payment locked' END);
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status = 'pending' AND NEW.status = 'completed' THEN
            INSERT INTO wallet_transactions (wallet_id, transaction_type, amount, previous_balance, new_balance, reference, description)
            VALUES (wallet_record.id, 'payment', NEW.amount, wallet_record.balance + NEW.amount, wallet_record.balance, NEW.our_reference, 'Payment completed');
        ELSIF OLD.status = 'pending' AND NEW.status IN ('failed', 'expired') THEN
            INSERT INTO wallet_transactions (wallet_id, transaction_type, amount, previous_balance, new_balance, reference, description)
            VALUES (wallet_record.id, 'unlock', NEW.amount, wallet_record.balance - NEW.amount, wallet_record.balance, NEW.our_reference, 'Payment failed - funds returned');
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS create_wallet_transaction_trigger ON payment_transactions;
CREATE TRIGGER create_wallet_transaction_trigger
    AFTER INSERT OR UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION create_wallet_transaction();

-- Initialize default promotion packages
INSERT INTO promotion_packages (name, description, price, duration_days, features, sort_order) VALUES
('Urgent Badge', 'Red URGENT badge to attract immediate attention', 5000, 14, 
 '["Red URGENT badge", "Higher ranking in search", "Email alerts to subscribers"]', 1),
('Featured Placement', 'Top placement in category pages with featured badge', 15000, 7, 
 '["Top of category pages", "Featured badge", "30% more views", "Priority in search"]', 2),
('Premium Package', 'Complete promotion package with maximum visibility', 25000, 10, 
 '["Featured placement", "Urgent badge", "WhatsApp broadcast", "Social media mention", "Priority support"]', 3);

-- Initialize default payment method limits
INSERT INTO payment_method_limits (payment_method, user_tier, min_amount, max_amount, daily_limit, monthly_limit, transaction_fee_percent, fixed_fee) VALUES
('mtn_momo', 'basic', 100, 500000, 1000000, 10000000, 2.5, 100),
('mtn_momo', 'verified', 100, 1000000, 2000000, 20000000, 2.0, 50),
('airtel_money', 'basic', 100, 500000, 1000000, 10000000, 2.5, 100),
('airtel_money', 'verified', 100, 1000000, 2000000, 20000000, 2.0, 50),
('equity_bank', 'basic', 1000, 5000000, 10000000, 100000000, 1.5, 500),
('equity_bank', 'verified', 1000, 10000000, 20000000, 200000000, 1.0, 300),
('wallet', 'basic', 100, 1000000, 5000000, 50000000, 0.0, 0),
('wallet', 'verified', 100, 2000000, 10000000, 100000000, 0.0, 0);
