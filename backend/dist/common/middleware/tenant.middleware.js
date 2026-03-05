/**
 * Middleware to enforce tenant isolation.
 * Injects merchantId into req.tenant for merchants.
 * Allows ADMIN to bypass and sets req.tenant to null.
 * Rejects merchants without a merchantId profile.
 */
export function tenantMiddleware(req, res, next) {
    const user = req.user;
    // 1. Safety check - authentication middleware should have run already
    if (!user) {
        return res.status(401).json({
            status: 'fail',
            message: "Unauthorized - Authentication required"
        });
    }
    // 2. Admin Bypass
    if (user.role === "ADMIN") {
        req.tenant = null;
        return next();
    }
    // 3. Merchant Enforcement
    if (user.role === "MERCHANT") {
        if (!user.merchantId) {
            return res.status(403).json({
                status: 'fail',
                message: "Forbidden - Merchant profile missing for this account",
            });
        }
        req.tenant = {
            merchantId: user.merchantId,
        };
        return next();
    }
    // 4. Default handles CUSTOMER (Customers do not have tenants)
    req.tenant = null;
    next();
}
