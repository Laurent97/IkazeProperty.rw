-- Fix infinite recursion in RLS policies
-- This script replaces problematic EXISTS subqueries with direct auth.role() checks

-- Disable RLS temporarily to drop and recreate policies
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE ad_analytics DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_ad_credits DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_premium_purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE ad_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_configurations DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets DISABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE listing_promotions DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_refunds DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view listings" ON listings;
DROP POLICY IF EXISTS "Users can view own listings" ON listings;
DROP POLICY IF EXISTS "Users can create own listings" ON listings;
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
DROP POLICY IF EXISTS "Admins can manage all listings" ON listings;
DROP POLICY IF EXISTS "Users can view own inquiries" ON inquiries;
DROP POLICY IF EXISTS "Users can create inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admins can view all inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON inquiries;
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can create messages" ON messages;
DROP POLICY IF EXISTS "Users can manage own favorites" ON favorite_listings;
DROP POLICY IF EXISTS "Users can manage own saved searches" ON saved_searches;
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create own reviews" ON reviews;

-- Ad management policies
DROP POLICY IF EXISTS "Users can view own ad campaigns" ON ad_campaigns;
DROP POLICY IF EXISTS "Users can create own ad campaigns" ON ad_campaigns;
DROP POLICY IF EXISTS "Users can update own ad campaigns" ON ad_campaigns;
DROP POLICY IF EXISTS "Admins can manage all ad campaigns" ON ad_campaigns;
DROP POLICY IF EXISTS "Users can view own ad credits" ON user_ad_credits;
DROP POLICY IF EXISTS "Users can update own ad credits" ON user_ad_credits;
DROP POLICY IF EXISTS "Admins can manage all ad credits" ON user_ad_credits;
DROP POLICY IF EXISTS "Users can view own premium purchases" ON user_premium_purchases;
DROP POLICY IF EXISTS "Users can create own premium purchases" ON user_premium_purchases;
DROP POLICY IF EXISTS "Admins can manage all premium purchases" ON user_premium_purchases;
DROP POLICY IF EXISTS "Users can view own ad transactions" ON ad_transactions;
DROP POLICY IF EXISTS "Users can create own ad transactions" ON ad_transactions;
DROP POLICY IF EXISTS "Admins can manage all ad transactions" ON ad_transactions;

-- Payment system policies
DROP POLICY IF EXISTS "Admins can manage payment configurations" ON payment_configurations;
DROP POLICY IF EXISTS "Users can view own payment transactions" ON payment_transactions;
DROP POLICY IF EXISTS "Admins can manage all payment transactions" ON payment_transactions;
DROP POLICY IF EXISTS "Users can view own wallet" ON user_wallets;
DROP POLICY IF EXISTS "Users can update own wallet" ON user_wallets;
DROP POLICY IF EXISTS "Admins can manage all wallets" ON user_wallets;
DROP POLICY IF EXISTS "Users can view own wallet transactions" ON wallet_transactions;
DROP POLICY IF EXISTS "Admins can manage all wallet transactions" ON wallet_transactions;
DROP POLICY IF EXISTS "Users can view own listing promotions" ON listing_promotions;
DROP POLICY IF EXISTS "Admins can manage all listing promotions" ON listing_promotions;
DROP POLICY IF EXISTS "Users can view own payment refunds" ON payment_refunds;
DROP POLICY IF EXISTS "Admins can manage all payment refunds" ON payment_refunds;

-- Create a function to safely check user role without recursion
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Use raw SQL query to bypass RLS for role checking
    EXECUTE format('SELECT role FROM users WHERE id = %L', user_uuid) INTO user_role;
    RETURN COALESCE(user_role, 'user');
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'user';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate non-recursive RLS policies

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can view all users" ON users
    FOR SELECT USING (auth.role() = 'service_role');

-- RLS Policies for listings
CREATE POLICY "Anyone can view available listings" ON listings
    FOR SELECT USING (status = 'available');

CREATE POLICY "Users can view own listings" ON listings
    FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Users can create own listings" ON listings
    FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update own listings" ON listings
    FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Admins can manage all listings" ON listings
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- RLS Policies for inquiries
CREATE POLICY "Users can view own inquiries" ON inquiries
    FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create inquiries" ON inquiries
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Admins can view all inquiries" ON inquiries
    FOR SELECT USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update inquiries" ON inquiries
    FOR UPDATE USING (get_user_role(auth.uid()) = 'admin');

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Admins can view all transactions" ON transactions
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- RLS Policies for messages
CREATE POLICY "Users can view own messages" ON messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for favorite_listings
CREATE POLICY "Users can manage own favorites" ON favorite_listings
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for saved_searches
CREATE POLICY "Users can manage own saved searches" ON saved_searches
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Users can view all reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create own reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Ad Campaigns Policies
CREATE POLICY "Users can view own ad campaigns" ON ad_campaigns
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own ad campaigns" ON ad_campaigns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ad campaigns" ON ad_campaigns
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all ad campaigns" ON ad_campaigns
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- User Ad Credits Policies
CREATE POLICY "Users can view own ad credits" ON user_ad_credits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own ad credits" ON user_ad_credits
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all ad credits" ON user_ad_credits
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- User Premium Purchases Policies
CREATE POLICY "Users can view own premium purchases" ON user_premium_purchases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own premium purchases" ON user_premium_purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all premium purchases" ON user_premium_purchases
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Ad Transactions Policies
CREATE POLICY "Users can view own ad transactions" ON ad_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own ad transactions" ON ad_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all ad transactions" ON ad_transactions
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Payment Configurations Policies
CREATE POLICY "Admins can manage payment configurations" ON payment_configurations
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Payment Transactions Policies
CREATE POLICY "Users can view own payment transactions" ON payment_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all payment transactions" ON payment_transactions
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- User Wallets Policies
CREATE POLICY "Users can view own wallet" ON user_wallets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet" ON user_wallets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all wallets" ON user_wallets
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Wallet Transactions Policies
CREATE POLICY "Users can view own wallet transactions" ON wallet_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_wallets 
            WHERE user_wallets.id = wallet_transactions.wallet_id 
            AND user_wallets.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all wallet transactions" ON wallet_transactions
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Listing Promotions Policies
CREATE POLICY "Users can view own listing promotions" ON listing_promotions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = listing_promotions.listing_id 
            AND listings.seller_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all listing promotions" ON listing_promotions
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Payment Refunds Policies
CREATE POLICY "Users can view own payment refunds" ON payment_refunds
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM payment_transactions 
            WHERE payment_transactions.id = payment_refunds.original_transaction_id 
            AND payment_transactions.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all payment refunds" ON payment_refunds
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Re-enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ad_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_premium_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_refunds ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO authenticated, service_role;
