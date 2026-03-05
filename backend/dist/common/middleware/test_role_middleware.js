import { authorize } from './role.middleware.js';
const mockRes = {};
const mockNext = (err) => {
    if (err) {
        console.log(`Middleware rejected: [${err.statusCode}] ${err.message}`);
    }
    else {
        console.log('Middleware passed successfully!');
    }
};
async function testRoleMiddleware() {
    console.log("Testing Role-Based Access Control Middleware...");
    // Scenario 1: ADMIN accessing ADMIN route
    const reqAdmin = { user: { role: 'ADMIN' } };
    console.log("\nScenario: ADMIN accessing route restricted to ADMIN");
    authorize('ADMIN')(reqAdmin, mockRes, mockNext);
    // Scenario 2: CUSTOMER accessing ADMIN route
    const reqCustomer = { user: { role: 'CUSTOMER' } };
    console.log("\nScenario: CUSTOMER accessing route restricted to ADMIN");
    authorize('ADMIN')(reqCustomer, mockRes, mockNext);
    // Scenario 3: MERCHANT accessing ADMIN or MERCHANT route
    const reqMerchant = { user: { role: 'MERCHANT' } };
    console.log("\nScenario: MERCHANT accessing route restricted to ['ADMIN', 'MERCHANT']");
    authorize('ADMIN', 'MERCHANT')(reqMerchant, mockRes, mockNext);
    // Scenario 4: Missing req.user
    const reqNone = {};
    console.log("\nScenario: No authenticated user");
    authorize('ADMIN')(reqNone, mockRes, mockNext);
}
testRoleMiddleware();
