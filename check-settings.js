import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAndUpdateSettings() {
  try {
    console.log('Checking current settings in database...')
    
    // Check current settings
    const { data: currentSettings, error: fetchError } = await supabase
      .from('settings')
      .select('*')
      .single()

    if (fetchError) {
      console.error('Error fetching settings:', fetchError)
      return
    }

    console.log('Current settings:', currentSettings)

    // Update with proper values if they're still the defaults
    if (currentSettings) {
      const updates = {}
      
      // Only update if still using hardcoded defaults
      if (currentSettings.platform_phone === '+250 788 123 456') {
        updates.platform_phone = '+250 788 123 456' // You can change this to the actual number
      }
      
      if (currentSettings.platform_email === 'support@ikazeproperty.rw') {
        updates.platform_email = 'support@ikazeproperty.rw' // You can change this to the actual email
      }
      
      if (currentSettings.platform_address === 'Kigali, Rwanda') {
        updates.platform_address = 'KN 123 St, Kiyovu, Kigali' // More specific address
      }

      if (Object.keys(updates).length > 0) {
        console.log('Updating settings with:', updates)
        
        const { error: updateError } = await supabase
          .from('settings')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', 1)

        if (updateError) {
          console.error('Error updating settings:', updateError)
        } else {
          console.log('✅ Settings updated successfully!')
        }
      } else {
        console.log('✅ Settings are already up to date')
      }
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

checkAndUpdateSettings()
