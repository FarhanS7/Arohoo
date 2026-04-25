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

  // Handle Prisma Connection/Timeout Errors
  const prismaConnectionCodes = ['P1001', 'P1002', 'P1003', 'P1008', 'P1011', 'P1017'];
  if (prismaConnectionCodes.includes(err.code)) {
    err.statusCode = 503;
    err.status = 'error';
    err.isOperational = true;
    err.message = 'Database is currently unreachable. Please try again in a few minutes.';
  }

  // Handle other Prisma Known Request Errors
  if (err.name === 'PrismaClientKnownRequestError') {
    err.isOperational = true;
    // P2002: Unique constraint failed
    if (err.code === 'P2002') {
      err.statusCode = 400;
      err.message = `Duplicate value for field: ${err.meta?.target || 'unknown'}`;
    }
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
