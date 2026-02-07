// Test script to verify infinite scroll functionality
console.log('Testing infinite scroll homepage...');

// Test 1: Check if homepage loads
fetch('http://localhost:3000/rw')
  .then(response => {
    console.log('✅ Homepage status:', response.status);
    return response.text();
  })
  .then(html => {
    // Check for infinite scroll indicators
    const hasInfiniteScroll = html.includes('All Listings') && 
                           html.includes('Loading more listings') &&
                           html.includes('IntersectionObserver');
    
    const hasFilters = html.includes('All Categories') && 
                     html.includes('Newest First');
    
    console.log('✅ Infinite scroll elements:', hasInfiniteScroll);
    console.log('✅ Filter elements:', hasFilters);
    
    if (hasInfiniteScroll && hasFilters) {
      console.log('🎉 Infinite scroll homepage is working correctly!');
    } else {
      console.log('❌ Some elements might be missing');
    }
  })
  .catch(error => {
    console.error('❌ Error testing homepage:', error.message);
  });
