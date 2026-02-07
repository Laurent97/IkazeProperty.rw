-- Check existing RLS policies
-- Run this script first to see what policies already exist

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('users', 'listings', 'listing_media', 'other_item_details')
ORDER BY tablename, policyname;

-- Check if RLS is enabled on tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('users', 'listings', 'listing_media', 'other_item_details')
ORDER BY tablename;
