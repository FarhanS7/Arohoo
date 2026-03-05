import http from 'http';

const testRegister = async () => {
  const data = JSON.stringify({
    email: `testuser_${Date.now()}@example.com`,
    password: "password123"
  });

  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/api/v1/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  console.log("Testing POST /api/v1/auth/register...");

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      console.log('Response Body:', body);
      
      const response = JSON.parse(body);
      if (res.statusCode === 201 && response.token) {
        console.log("✅ Registration Successful! Token received.");
        process.exit(0);
      } else {
        console.log("❌ Registration Failed.");
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

// Wait a bit for server to start
setTimeout(testRegister, 3000);
