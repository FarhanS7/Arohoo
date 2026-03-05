import { asyncHandler } from '../../common/utils/async.handler.js';
import { CategoryService } from './category.service.js';

const categoryService = new CategoryService();

/**
 * Helper to wrap response in standard format.
 */
const sendResponse = (res, statusCode, data = null, error = null) => {
  res.status(statusCode).json({
    success: !error,
    data,
    error,
  });
};

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body, req.user);
  sendResponse(res, 201, category);
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories();
  sendResponse(res, 200, categories);
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  sendResponse(res, 200, category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body, req.user);
  sendResponse(res, 200, category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id, req.user);
  sendResponse(res, 200, { message: 'Category deleted successfully' });
});
