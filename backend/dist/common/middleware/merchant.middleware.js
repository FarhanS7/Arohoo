import prisma from '../../infrastructure/database/prisma.js';
import { ForbiddenError } from '../errors/AppError.js';
/**
 * Middleware to verify if a merchant is approved.
 * Only applies to users with the 'MERCHANT' role.
 * Assumes req.user is populated by authentication middleware.
 */
export const isApprovedMerchant = async (req, res, next) => {
    try {
        // 1. If not a merchant, bypass this check (e.g., for ADMINs or CUSTOMERs)
        // Note: Usually, this is used in conjunction with authorize('MERCHANT')
        if (req.user.role !== 'MERCHANT') {
            return next();
        }
        // 2. Find merchant profile for the current user
        const merchant = await prisma.merchant.findUnique({
            where: { userId: req.user.userId },
            select: { isApproved: true, status: true }
        });
        if (!merchant) {
            return next(new ForbiddenError('Merchant profile not found.'));
        }
        // 3. Check approval status
        if (!merchant.isApproved || merchant.status !== 'APPROVED') {
            return next(new ForbiddenError('Your merchant account is pending approval or has been rejected.'));
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
