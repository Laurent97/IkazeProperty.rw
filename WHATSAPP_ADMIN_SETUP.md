# WhatsApp Number Admin Setup

## Database Update Required

To enable WhatsApp number management in the admin panel, you need to add the `whatsapp_phone` field to your `site_settings` table.

### Option 1: SQL Migration (Recommended)

Run this SQL in your Supabase SQL editor:

```sql
-- Add WhatsApp phone field to site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT NOT NULL DEFAULT '+250737060025';

-- Update existing records to have a WhatsApp phone
UPDATE site_settings SET whatsapp_phone = '+250737060025' WHERE whatsapp_phone IS NULL;
```

### Option 2: Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Table Editor → site_settings
3. Click "Add Column"
4. Set:
   - Name: `whatsapp_phone`
   - Type: `text`
   - Default: `+250737060025`
   - Not Null: `true`
5. Save the column

## After Database Update

Once the database is updated, the admin panel will include:
- WhatsApp Phone field in Site Settings
- Dynamic WhatsApp number loading in chat components
- Admin ability to update the number anytime

## Current Status

✅ Admin interface updated with WhatsApp field
✅ API endpoints updated to handle WhatsApp number
✅ Chat components updated to use dynamic number
⏳ Database migration required

## Testing

After updating the database:
1. Go to `/admin/site-settings`
2. Update the WhatsApp number
3. Test the WhatsApp chat functionality
4. Verify the number is used in WhatsApp integration

The WhatsApp number will be used automatically in:
- WhatsApp chat component
- WhatsApp web links
- Customer support responses
