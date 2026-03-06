import { asyncHandler } from '../../common/utils/async.handler.js';
import { ProductService } from './product.service.js';

const productService = new ProductService();

export const createProduct = asyncHandler(async (req, res) => {
  const merchantId = req.user?.merchant?.id;
  const product = await productService.createProduct(req.body, merchantId);

  res.status(201).json({
    success: true,
    data: product,
    error: null
  });
});

export const getMerchantProducts = asyncHandler(async (req, res) => {
  const merchantId = req.user?.merchant?.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const result = await productService.getMerchantProducts(merchantId, page, limit);

  res.status(200).json({
    success: true,
    ...result,
    error: null
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const merchantId = req.user?.merchant?.id;
  const product = await productService.getProductById(req.params.id, merchantId);

  res.status(200).json({
    success: true,
    data: product,
    error: null
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const merchantId = req.user?.merchant?.id;
  const product = await productService.updateProduct(req.params.id, merchantId, req.body);

  res.status(200).json({
    success: true,
    data: product,
    error: null
  });
});

export const uploadProductImages = asyncHandler(async (req, res) => {
  const merchantId = req.user?.merchant?.id;
  const productId = req.params.productId;
  
  if (!req.files || req.files.length === 0) {
    throw new AppError('Please upload at least one image', 400);
  }

  const images = req.files.map((file, index) => ({
    url: `/uploads/products/images/${file.filename}`,
    order: index
  }));

  const updatedImages = await productService.uploadProductImages(productId, merchantId, images);

  res.status(200).json({
    success: true,
    data: updatedImages,
    error: null
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const merchantId = req.user?.merchant?.id;
  await productService.deleteProduct(req.params.id, merchantId);

  res.status(200).json({
    success: true,
    data: null,
    message: 'Product deleted successfully',
    error: null
  });
});
