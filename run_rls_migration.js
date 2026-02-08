const fs = require('fs');
const http = require('http');

const sql = fs.readFileSync('./supabase/quick_rls_fix.sql', 'utf8');

const data = JSON.stringify({ sql });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/payments/run-migration',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
