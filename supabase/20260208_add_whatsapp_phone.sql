-- Add WhatsApp phone field to site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT NOT NULL DEFAULT '+250737060025';

-- Update existing records to have the WhatsApp phone
UPDATE site_settings SET whatsapp_phone = '+250737060025' WHERE whatsapp_phone IS NULL;

-- Update the seed data to match
INSERT INTO site_settings (admin_phone, whatsapp_phone, support_email, office_address)
VALUES ('+250 788 123 456', '+250737060025', 'support@ikazeproperty.rw', 'KN 123 St, Kiyovu')
ON CONFLICT DO NOTHING;
