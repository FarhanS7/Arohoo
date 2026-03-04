import { UserRole } from '../constants/roles.js';
import { ForbiddenError } from '../errors/AppError.js';

/**
 * Middleware factory to ensure the resource owner matches the authenticated user.
 * Admins are allowed to bypass this check.
 * @param {string} paramName - The name of the request param containing the resource ID.
 * @param {function} getOwnerId - Async function to fetch the owner ID from the database for that resource.
 */
export const ensureOwnership = (paramName, getOwnerId) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return next(new ForbiddenError('Authentication required to verify ownership'));
      }

      // Admin bypass
      if (req.user.role === UserRole.ADMIN) {
        return next();
      }

      const resourceId = req.params[paramName];
      if (!resourceId) {
        return next(new Error(`Ownership check failed: parameter '${paramName}' is missing.`));
      }

      const ownerId = await getOwnerId(resourceId);

      if (ownerId !== req.user.id) {
        return next(new ForbiddenError('You do not have permission to access this resource.'));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
