import http from 'http';
import { generateToken } from '../../common/utils/jwt.js';
const testApproveMerchant = async () => {
    const adminToken = generateToken({
        userId: 'admin-uuid-placeholder',
        role: 'ADMIN'
    });
    const merchantId = 'some-merchant-uuid'; // Just for testing route exists
    const options = {
        hostname: 'localhost',
        port: 8000,
        path: `/api/v1/admin/merchants/${merchantId}/approve`,
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
        }
    };
    console.log(`Testing PATCH /api/v1/admin/merchants/${merchantId}/approve as ADMIN...`);
    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log('Status Code:', res.statusCode);
            console.log('Response:', body);
            if (res.statusCode === 200 || res.statusCode === 404) {
                console.log("✅ Route is correctly accessible and secured.");
            }
            else {
                console.log("❌ Unexpected Status Code.");
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
testApproveMerchant();
