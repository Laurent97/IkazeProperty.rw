-- Add default site settings to fix 404 errors
INSERT INTO site_settings (admin_phone, whatsapp_phone, support_email, office_address) 
VALUES ('+250737060025', '+250737060025', 'support@ikazeproperty.rw', 'Kigali, Rwanda')
ON CONFLICT DO NOTHING;
