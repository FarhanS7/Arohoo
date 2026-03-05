import http from 'http';
const testLogin = async () => {
    const data = JSON.stringify({
        email: "admin@arohhoo.com", // Assumes seed script ran or this exists
        password: "securepassword"
    });
    const options = {
        hostname: 'localhost',
        port: 8000,
        path: '/api/v1/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };
    console.log("Testing POST /api/v1/auth/login...");
    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log('Status Code:', res.statusCode);
            console.log('Response Body:', body);
            const response = JSON.parse(body);
            if (res.statusCode === 200 && response.token) {
                console.log("✅ Login Successful! Token received.");
                process.exit(0);
            }
            else {
                console.log("❌ Login Failed.");
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
testLogin();
