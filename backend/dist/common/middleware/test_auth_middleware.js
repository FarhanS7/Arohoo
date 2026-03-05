import { generateToken } from '../utils/jwt.js';
import { protect } from './auth.middleware.js';
const mockRes = {};
const mockNext = (err) => {
    if (err) {
        console.log('Middleware rejected with error:', err.message);
    }
    else {
        console.log('Middleware passed successfully!');
    }
};
async function testAuthMiddleware() {
    console.log("Testing Auth Middleware...");
    // Case 1: Valid Token
    const token = generateToken({ userId: '123', role: 'CUSTOMER' });
    const mockReqValid = {
        headers: {
            authorization: `Bearer ${token}`
        }
    };
    console.log("\nScenario: Valid Bearer Token");
    protect(mockReqValid, mockRes, mockNext);
    console.log('Attached User:', mockReqValid.user);
    // Case 2: Missing Token
    const mockReqMissing = {
        headers: {}
    };
    console.log("\nScenario: Missing Authorization Header");
    protect(mockReqMissing, mockRes, mockNext);
    // Case 3: Invalid Token
    const mockReqInvalid = {
        headers: {
            authorization: 'Bearer invalid-token'
        }
    };
    console.log("\nScenario: Invalid Token");
    protect(mockReqInvalid, mockRes, mockNext);
}
testAuthMiddleware();
