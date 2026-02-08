-- Update the default value for whatsapp_phone column in site_settings table
ALTER TABLE site_settings ALTER COLUMN whatsapp_phone SET DEFAULT '+250 XXX XXX XXX';

-- Update any existing records that still have the old hardcoded value
UPDATE site_settings SET whatsapp_phone = '+250 XXX XXX XXX' WHERE whatsapp_phone = '+250737060025';
