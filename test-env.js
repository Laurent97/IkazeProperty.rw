#!/usr/bin/env node

// Load environment variables from .env.local
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=')
    if (key && values.length > 0) {
      process.env[key.trim()] = values.join('=').trim()
    }
  })
}

// Test script to verify environment variables
console.log('🔍 Testing Environment Variables...\n')

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_APP_URL'
]

const optionalVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'NEXT_PUBLIC_CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
]

let allRequiredPresent = true

console.log('📋 Required Variables:')
requiredVars.forEach(varName => {
  const value = process.env[varName]
  const present = !!value
  const masked = present ? value.substring(0, 8) + '...' : 'MISSING'
  
  console.log(`  ${present ? '✅' : '❌'} ${varName}: ${masked}`)
  if (!present) allRequiredPresent = false
})

console.log('\n📋 Optional Variables:')
optionalVars.forEach(varName => {
  const value = process.env[varName]
  const present = !!value
  const masked = present ? value.substring(0, 8) + '...' : 'MISSING'
  
  console.log(`  ${present ? '✅' : '⚪'} ${varName}: ${masked}`)
})

console.log('\n' + '='.repeat(50))

if (allRequiredPresent) {
  console.log('🎉 All required environment variables are present!')
  console.log('📝 Next steps:')
  console.log('   1. Restart your development server')
  console.log('   2. Clear browser cache')
  console.log('   3. Test authentication flows')
} else {
  console.log('❌ Missing required environment variables!')
  console.log('📝 Fix steps:')
  console.log('   1. Check your .env.local file')
  console.log('   2. Add missing variables')
  console.log('   3. Restart your development server')
}

console.log('\n🔧 Quick Test Commands:')
console.log('   npm run dev')
console.log('   # Open http://localhost:3000')
console.log('   # Check browser console for auth errors')
