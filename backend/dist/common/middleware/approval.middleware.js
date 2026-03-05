import { UserRole } from '../constants/roles.js';
import { ForbiddenError } from '../errors/AppError.js';
/**
 * Middleware to ensure only approved merchants can perform certain actions.
 * Assumes req.user is populated and includes role and isApproved status.
 */
export const ensureApprovedMerchant = (req, res, next) => {
    if (req.user.role === UserRole.MERCHANT && !req.user.isApproved) {
        return next(new ForbiddenError('Merchant account pending admin approval. You cannot list or sell products yet.'));
    }
    next();
};
