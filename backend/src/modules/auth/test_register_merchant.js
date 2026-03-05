import http from 'http';

const testRegisterMerchant = async () => {
  const data = JSON.stringify({
    email: `merchant_${Date.now()}@example.com`,
    password: "password123",
    storeName: "Merchant Hub"
  });

  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/api/v1/auth/register-merchant',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  console.log("Testing POST /api/v1/auth/register-merchant...");

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      console.log('Response Body:', body);
      
      const response = JSON.parse(body);
      if (res.statusCode === 201 && response.token) {
        console.log("✅ Merchant Registration Successful! Token received.");
        process.exit(0);
      } else {
        console.log("❌ Merchant Registration Failed.");
        process.exit(1);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Request Error:', error);
    process.exit(1);
  });

  req.write(data);
  req.end();
};

testRegisterMerchant();
