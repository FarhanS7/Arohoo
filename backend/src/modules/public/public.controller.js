import { asyncHandler } from '../../common/utils/async.handler.js';
import { CategoryService } from '../categories/category.service.js';

const categoryService = new CategoryService();

/**
 * Standard response helper
 */
const sendResponse = (res, statusCode, data = null, error = null) => {
  res.status(statusCode).json({
    success: !error,
    data,
    error,
  });
};

/**
 * GET /api/public/categories
 * Public categorized list for home page/navigation.
 */
export const getPublicCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getPublicCategories();
  sendResponse(res, 200, categories);
});
