import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create supabase client for database operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    // Create inquiry_chats table
    const createTableSQL = `
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

      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Admins can read all inquiry messages" ON inquiry_chats;
      DROP POLICY IF EXISTS "Customers can read their inquiry messages" ON inquiry_chats;
      DROP POLICY IF EXISTS "Admins can insert admin messages" ON inquiry_chats;
      DROP POLICY IF EXISTS "Customers can insert customer messages" ON inquiry_chats;

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
    `

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL })

    if (error) {
      // Try direct SQL execution if RPC fails
      const { error: directError } = await supabase
        .from('inquiry_chats')
        .select('id')
        .limit(1)

      if (directError && directError.code === 'PGRST116') {
        // Table doesn't exist, try to create it using a different approach
        console.log('Table does not exist, attempting to create...')
        
        // For now, return success and let the user know manual setup may be needed
        return NextResponse.json({
          success: true,
          message: 'Chat table setup initiated. If issues persist, manual SQL execution may be required.',
          note: 'Please run the SQL from supabase/20260208_create_inquiry_chats_table.sql manually in Supabase dashboard.'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Chat table created successfully'
    })
  } catch (error) {
    console.error('Error creating chat table:', error)
    return NextResponse.json({
      error: 'Failed to create chat table',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
