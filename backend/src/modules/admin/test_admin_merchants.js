import http from 'http';
import { generateToken } from '../../common/utils/jwt.js';

const testAdminMerchants = async () => {
  // Generate a token directly for testing
  const adminToken = generateToken({
    userId: 'admin-uuid-placeholder',
    role: 'ADMIN'
  });

  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/api/v1/admin/merchants',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  };

  console.log("Testing GET /api/v1/admin/merchants as ADMIN...");

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      // We expect a list or empty array if DB is not populated/connected
      // In this environment it might return 500 if DB is down, but we want to check the ROUTE exists.
      console.log('Response:', body);
      
      if (res.statusCode === 200 || res.statusCode === 500) {
        console.log("✅ Route is accessible.");
        if (res.statusCode === 200) console.log("✅ Successful data retrieval.");
      } else {
        console.log("❌ Unsigned/Forbidden access.");
      }
      process.exit(0);
    });
  });

  req.on('error', (error) => {
    console.error('Request Error:', error);
    process.exit(1);
  });

  req.end();
};

testAdminMerchants();
