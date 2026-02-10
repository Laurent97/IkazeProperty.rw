-- Check if specific listing exists
SELECT id, title, category, status FROM listings WHERE id = '279659f6-2f7f-4d3e-a106-292334e39f1f';

-- Check all land listings
SELECT id, title, price FROM listings WHERE category = 'land' AND status = 'available' ORDER BY created_at DESC LIMIT 5;
