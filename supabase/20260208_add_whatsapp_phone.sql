-- Add WhatsApp phone field to site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT NOT NULL DEFAULT '+250 XXX XXX XXX';

-- Update existing records to have the WhatsApp phone
UPDATE site_settings SET whatsapp_phone = '+250 XXX XXX XXX' WHERE whatsapp_phone IS NULL;

-- Update the seed data to match
INSERT INTO site_settings (admin_phone, whatsapp_phone, support_email, office_address)
VALUES ('+250 XXX XXX XXX', '+250 XXX XXX XXX', 'contact@ikazeproperty.rw', 'KN 123 St, Kiyovu')
ON CONFLICT DO NOTHING;
