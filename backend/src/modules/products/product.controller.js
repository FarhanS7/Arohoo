import { asyncHandler } from '../../common/utils/async.handler.js';
import { ProductService } from './product.service.js';

const productService = new ProductService();

/**
 * Controller for creating a product.
 */
export const createProduct = asyncHandler(async (req, res) => {
  // req.user.merchantId is attached by protect/authorize middleware
  const merchantId = req.user?.merchant?.id;
  
  if (!merchantId) {
    return res.status(403).json({
      success: false,
      data: null,
      error: 'Only approved merchants can create products'
    });
  }

  const product = await productService.createProduct(req.body, merchantId);

  res.status(201).json({
    success: true,
    data: product,
    error: null
  });
});
