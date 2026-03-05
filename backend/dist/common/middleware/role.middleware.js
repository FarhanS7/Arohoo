import { ForbiddenError, UnauthorizedError } from '../errors/AppError.js';
/**
 * Middleware factory to authorize users based on roles.
 * Assumes req.user is populated by an authentication middleware.
 * @param {...string} allowedRoles - Roles permitted to access the resource.
 */
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new UnauthorizedError('Authentication required'));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new ForbiddenError('Insufficient permissions'));
        }
        next();
    };
};
