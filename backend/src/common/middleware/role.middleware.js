
/**
 * Middleware factory to authorize users based on roles.
 * Assumes req.user is populated by an authentication middleware.
 * @param {...string} allowedRoles - Roles permitted to access the resource.
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};
