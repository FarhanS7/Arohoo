import http from 'http';
import { generateToken } from '../../common/utils/jwt.js';

const testPendingMerchants = async () => {
  const adminToken = generateToken({
    userId: 'admin-uuid-placeholder',
    role: 'ADMIN'
  });

  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/api/v1/admin/merchants/pending',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  };

  console.log("Testing GET /api/v1/admin/merchants/pending as ADMIN...");

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      console.log('Response:', body);
      
      if (res.statusCode === 200) {
        console.log("✅ Successfully reached pending merchants endpoint.");
      } else {
        console.log("❌ Failed to reach pending merchants endpoint.");
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

testPendingMerchants();
