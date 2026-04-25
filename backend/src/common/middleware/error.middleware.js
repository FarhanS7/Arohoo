import logger from '../utils/logger.js';

/**
 * Global error handling middleware for Express.
 */
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Zod Validation Errors
  if (err.name === 'ZodError') {
    err.statusCode = 400;
    err.status = 'fail';
    err.message = 'Validation Error: ' + err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
  }

  // Handle Prisma Connection Errors
  if (err.code === 'P1001' || err.code === 'P1003' || err.code === 'P1017') {
    err.statusCode = 503;
    err.status = 'error';
    err.message = 'Database connection failed. Please ensure the database server is reachable and credentials are correct.';
  }

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // Production response
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Log error using Winston
  logger.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
};
