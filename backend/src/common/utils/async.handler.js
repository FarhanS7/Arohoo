/**
 * Wraps an asynchronous express middleware/handler to catch errors and pass them to next().
 * Eliminates the need for try-catch blocks in every controller.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
