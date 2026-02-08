-- Create inquiry_chats table for real-time chat between admin and customers
CREATE TABLE IF NOT EXISTS inquiry_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id),
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('admin', 'customer')),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inquiry_chats_inquiry_id ON inquiry_chats(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_inquiry_chats_created_at ON inquiry_chats(created_at);
CREATE INDEX IF NOT EXISTS idx_inquiry_chats_sender_id ON inquiry_chats(sender_id);

-- Enable RLS (Row Level Security)
ALTER TABLE inquiry_chats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- 1. Admins can read all messages for any inquiry
CREATE POLICY "Admins can read all inquiry messages" ON inquiry_chats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- 2. Customers can read messages for their own inquiries
CREATE POLICY "Customers can read their inquiry messages" ON inquiry_chats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM inquiries 
            WHERE inquiries.id = inquiry_chats.inquiry_id 
            AND inquiries.buyer_id = auth.uid()
        )
    );

-- 3. Admins can insert messages as admin
CREATE POLICY "Admins can insert admin messages" ON inquiry_chats
    FOR INSERT WITH CHECK (
        sender_type = 'admin' 
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- 4. Customers can insert messages as customer for their inquiries
CREATE POLICY "Customers can insert customer messages" ON inquiry_chats
    FOR INSERT WITH CHECK (
        sender_type = 'customer'
        AND EXISTS (
            SELECT 1 FROM inquiries 
            WHERE inquiries.id = inquiry_chats.inquiry_id 
            AND inquiries.buyer_id = auth.uid()
        )
    );

-- Create a function to create the table (for use in API)
CREATE OR REPLACE FUNCTION create_inquiry_chats_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Table creation is handled by the migration above
    -- This function exists to prevent errors when called from API
    NULL;
END;
$$;
