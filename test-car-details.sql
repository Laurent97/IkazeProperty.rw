-- Test query to check if we can access car details
SELECT 
  car_details.*,
  listings.title,
  listings.category,
  users.email as seller_email
FROM listings
LEFT JOIN car_details ON listings.id = car_details.listing_id
LEFT JOIN users ON listings.seller_id = users.id
WHERE listings.id = '7b363cca-3f02-44cd-ade9-8ced0ff1b05b'
LIMIT 1;
