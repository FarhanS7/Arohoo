import { asyncHandler } from '../../common/utils/async.handler.js';
import { ProductService } from './product.service.js';

const productService = new ProductService();

/**
 * Controller for public product catalog
 */

export const listProducts = asyncHandler(async (req, res) => {
  const { 
    categoryId, 
    minPrice, 
    maxPrice, 
    q, 
    size,
    color,
    page, 
    limit 
  } = req.query;

  const filters = {
    categoryId,
    query: q,
    minPrice,
    maxPrice,
    variants: (size || color) ? { size, color } : undefined
  };

  const p = parseInt(page) || 1;
  const l = parseInt(limit) || 20;

  const result = await productService.getPublicProducts(filters, p, l);

  res.status(200).json({
    success: true,
    ...result,
    error: null
  });
});

export const searchProducts = listProducts; // Currently identical, but separate for future extension

export const getProductDetail = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  res.status(200).json({
    success: true,
    data: product,
    error: null
  });
});
