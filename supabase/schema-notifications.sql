-- Add notification system tables to existing schema

-- Notification Types
DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM (
        'payment_completed', 
        'payment_failed', 
        'promotion_activated', 
        'promotion_expiring', 
        'inquiry_received', 
        'inquiry_approved', 
        'listing_sold', 
        'wallet_topup', 
        'refund_processed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'push', 'in_app');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed', 'read');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional data for the notification
    channels notification_channel[] NOT NULL,
    priority notification_priority DEFAULT 'medium' NOT NULL,
    status notification_status DEFAULT 'pending' NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Notification Preferences Table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email BOOLEAN DEFAULT true NOT NULL,
    sms BOOLEAN DEFAULT true NOT NULL,
    push BOOLEAN DEFAULT true NOT NULL,
    in_app BOOLEAN DEFAULT true NOT NULL,
    payment_notifications BOOLEAN DEFAULT true NOT NULL,
    promotion_notifications BOOLEAN DEFAULT true NOT NULL,
    inquiry_notifications BOOLEAN DEFAULT true NOT NULL,
    marketing_notifications BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Notification Templates Table (for admin management)
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type notification_type NOT NULL UNIQUE,
    subject_template VARCHAR(200) NOT NULL,
    message_template TEXT NOT NULL,
    email_template TEXT,
    sms_template TEXT,
    push_template TEXT,
    variables JSONB, -- Available variables for the template
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Notification Logs (for debugging and analytics)
CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
    channel notification_channel NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'sent', 'failed', 'bounced', 'delivered'
    provider_response JSONB,
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);

-- Indexes for notification preferences
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

-- Indexes for notification logs
CREATE INDEX IF NOT EXISTS idx_notification_logs_notification_id ON notification_logs(notification_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_channel ON notification_logs(channel);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);

-- Enable RLS for notification tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
CREATE POLICY "Users can delete own notifications" ON notifications
    FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all notifications" ON notifications;
CREATE POLICY "Admins can manage all notifications" ON notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- RLS Policies for notification preferences
DROP POLICY IF EXISTS "Users can manage own preferences" ON notification_preferences;
CREATE POLICY "Users can manage own preferences" ON notification_preferences
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all preferences" ON notification_preferences;
CREATE POLICY "Admins can manage all preferences" ON notification_preferences
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- RLS Policies for notification logs
DROP POLICY IF EXISTS "Admins can view all logs" ON notification_logs;
CREATE POLICY "Admins can view all logs" ON notification_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notification_templates_updated_at ON notification_templates;
CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON notification_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create notification preferences for new users
CREATE OR REPLACE FUNCTION create_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notification_preferences (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS create_preferences_on_user_signup ON users;
CREATE TRIGGER create_preferences_on_user_signup
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_notification_preferences();

-- Insert default notification templates
INSERT INTO notification_templates (type, subject_template, message_template, variables) VALUES
('payment_completed', 'Payment Completed', 'Your payment of {{amount}} RWF via {{payment_method}} has been completed successfully.', '{"amount": "number", "payment_method": "string"}'),
('payment_failed', 'Payment Failed', 'Your payment of {{amount}} RWF via {{payment_method}} failed. Reason: {{reason}}', '{"amount": "number", "payment_method": "string", "reason": "string"}'),
('promotion_activated', 'Promotion Activated', 'Your promotion "{{package_name}}" for listing "{{listing_title}}" has been activated.', '{"package_name": "string", "listing_title": "string"}'),
('promotion_expiring', 'Promotion Expiring Soon', 'Your promotion for listing "{{listing_title}}" will expire in {{days_left}} days.', '{"listing_title": "string", "days_left": "number"}'),
('inquiry_received', 'New Inquiry Received', 'You have received a new inquiry for your listing "{{listing_title}}" from {{buyer_name}}.', '{"listing_title": "string", "buyer_name": "string"}'),
('inquiry_approved', 'Inquiry Approved', 'Your inquiry for "{{listing_title}}" has been approved. You can now contact the seller.', '{"listing_title": "string"}'),
('wallet_topup', 'Wallet Top-up Successful', 'Your wallet has been credited with {{amount}} RWF via {{payment_method}}.', '{"amount": "number", "payment_method": "string"}'),
('refund_processed', 'Refund Processed', 'A refund of {{amount}} RWF has been processed. Reason: {{reason}}', '{"amount": "number", "reason": "string"}')
ON CONFLICT (type) DO NOTHING;
