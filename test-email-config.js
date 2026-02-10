// Test email configuration
import { supabase } from '@/lib/auth'

async function testEmailConfiguration() {
  try {
    console.log('Testing email configuration...')
    
    // Test 1: Send password reset (tests SMTP)
    const { data, error } = await supabase.auth.resetPasswordForEmail('test@example.com', {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    
    if (error) {
      console.error('❌ SMTP Test Failed:', error.message)
      return false
    }
    
    console.log('✅ SMTP Test Passed - Email sent successfully!')
    return true
    
  } catch (error) {
    console.error('❌ Email Test Error:', error)
    return false
  }
}

// Test 2: Sign up with email verification
async function testEmailVerification() {
  try {
    console.log('Testing email verification...')
    
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'TestPassword123!',
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) {
      console.error('❌ Email Verification Test Failed:', error.message)
      return false
    }
    
    console.log('✅ Email Verification Test Passed!')
    console.log('📧 Check your email for the confirmation link')
    return true
    
  } catch (error) {
    console.error('❌ Email Verification Error:', error)
    return false
  }
}

// Run tests
export async function runEmailTests() {
  console.log('🚀 Starting Email Configuration Tests...\n')
  
  const smtpTest = await testEmailConfiguration()
  const verificationTest = await testEmailVerification()
  
  console.log('\n📊 Test Results:')
  console.log(`SMTP Configuration: ${smtpTest ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Email Verification: ${verificationTest ? '✅ PASS' : '❌ FAIL'}`)
  
  if (smtpTest && verificationTest) {
    console.log('\n🎉 All email tests passed! Your SMTP is working correctly.')
  } else {
    console.log('\n⚠️ Some tests failed. Check your SMTP configuration.')
  }
}

// For manual testing in browser console
// Uncomment and run: runEmailTests()
