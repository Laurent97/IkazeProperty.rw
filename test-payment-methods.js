// Test script to verify payment methods API
async function testPaymentMethods() {
  try {
    console.log('Testing payment methods API...');
    
    const response = await fetch('http://localhost:3001/api/payments/methods');
    
    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('Payment methods response:', JSON.stringify(data, null, 2));
    
    if (data.methods) {
      const activeMethods = data.methods.filter(m => m.isActive);
      console.log('Active payment methods:', activeMethods.map(m => m.id));
      console.log('Payment method names:', activeMethods.map(m => `${m.id}: ${m.displayName}`));
    } else {
      console.log('No methods found in response');
    }
    
  } catch (error) {
    console.error('Error testing payment methods:', error);
  }
}

// Run the test
testPaymentMethods();
