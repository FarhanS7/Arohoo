/**
 * Pagination utility to calculate skip and take for Prisma
 * @param {number} page
 * @param {number} limit
 */
export const getPagination = (page = 1, limit = 20) => {
  const sanitizedPage = Math.max(1, page);
  const sanitizedLimit = Math.min(100, Math.max(1, limit));
  
  const skip = (sanitizedPage - 1) * sanitizedLimit;
  const take = sanitizedLimit;
  
  return {
    skip,
    take,
    meta: {
      page: sanitizedPage,
      limit: sanitizedLimit
    }
  };
};
