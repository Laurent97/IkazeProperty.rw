-- Diagnostic script to check current RLS setup
-- Run this in Supabase SQL Editor to see what's currently configured

-- Check if RLS is enabled on key tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('users', 'listings', 'listing_media', 'other_item_details', 'inquiries')
ORDER BY tablename;

-- Check current policies on users table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- Check if the trigger exists
SELECT 
  event_object_table as table_name,
  trigger_name,
  action_timing as timing,
  action_condition as condition,
  action_orientation as orientation,
  action_statement as statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created'
   OR event_object_table = 'users';

-- Check if the trigger function exists
SELECT 
  proname as function_name,
  prosrc as source_code
FROM pg_proc 
WHERE proname = 'handle_new_auth_user';

-- Check for any existing users
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN verified = true THEN 1 END) as verified_users
FROM users;

-- Check auth.users vs public.users sync
SELECT 
  COUNT(*) as auth_users_count
FROM auth.users;

SELECT 
  COUNT(*) as public_users_count
FROM public.users;

-- Find users in auth.users that don't exist in public.users
SELECT 
  COUNT(*) as missing_profiles_count
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users u WHERE u.id = au.id
);
