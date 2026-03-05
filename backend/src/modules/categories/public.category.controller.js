import { asyncHandler } from '../../common/utils/async.handler.js';
import { PublicCategoryService } from './public.category.service.js';

const publicCategoryService = new PublicCategoryService();

/**
 * Controller for public category browsing.
 */
export const getPublicCategories = asyncHandler(async (req, res) => {
  const categories = await publicCategoryService.getPublicCategories();
  
  res.status(200).json({
    success: true,
    data: categories,
    error: null
  });
});
