// Test script to debug inquiry API
const fetch = require('node-fetch');

async function testInquiryAPI() {
  const testToken = 'your-test-token-here'; // You'll need to get a real token from browser
  
  try {
    const response = await fetch('http://localhost:3000/api/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`
      },
      body: JSON.stringify({
        listing_id: 'test-listing-id',
        message: 'Test inquiry message'
      })
    });

    const result = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testInquiryAPI();
