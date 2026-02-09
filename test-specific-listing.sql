-- Test query to check if car details exist for specific listing
SELECT 
  l.id as listing_id,
  l.title,
  l.category,
  cd.id as car_details_id,
  cd.vehicle_type,
  cd.make,
  cd.model,
  cd.year_manufacture,
  cd.condition,
  cd.fuel_type,
  cd.transmission,
  cd.mileage,
  cd.color,
  cd.doors,
  cd.seats
FROM listings l
LEFT JOIN car_details cd ON l.id = cd.listing_id
WHERE l.id = 'b0e255ff-c7e9-4bc6-be31-51114ada2940';
