import { asyncHandler } from '../../common/utils/async.handler.js';
import { CategoryService } from '../categories/category.service.js';
import MerchantServiceInstance from '../merchants/merchant.service.js';

const categoryService = new CategoryService();
const merchantService = MerchantServiceInstance;


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

/**
 * GET /api/v1/public/merchants
 * Public merchant list for trending brands/store discovery.
 */
export const getPublicMerchants = asyncHandler(async (req, res) => {
  const { isTrending, page, limit } = req.query;
  const p = parseInt(page) || 1;
  const l = parseInt(limit) || 20;

  const result = await merchantService.getPublicMerchants({ isTrending }, p, l);
  sendResponse(res, 200, result);
});

