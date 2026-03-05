/**
 * Utility for standardized API responses.
 */
export const sendResponse = (res, statusCode, data, message = 'success') => {
  res.status(statusCode).json({
    status: statusCode >= 400 ? 'error' : 'success',
    message,
    data
  });
};
