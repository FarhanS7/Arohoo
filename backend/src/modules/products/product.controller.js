import { asyncHandler } from '../../common/utils/async.handler.js';
import { ProductService } from './product.service.js';
import { uploadToCloudinary } from '../../common/utils/cloudinary.service.js';
import { AppError } from '../../common/errors/AppError.js';

const productService = new ProductService();

export const createProduct = asyncHandler(async (req, res) => {
  const merchantId = req.user.merchantId;
  const product = await productService.createProduct(req.body, merchantId);

  res.status(201).json({
    success: true,
    data: product,
    error: null
  });
});

export const getMerchantProducts = asyncHandler(async (req, res) => {
  const merchantId = req.user.merchantId;
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
  const merchantId = req.user.merchantId;
  const product = await productService.getProductById(req.params.id, merchantId);

  res.status(200).json({
    success: true,
    data: product,
    error: null
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const merchantId = req.user.merchantId;
  const product = await productService.updateProduct(req.params.id, merchantId, req.body);

  res.status(200).json({
    success: true,
    data: product,
    error: null
  });
});

export const uploadProductImages = asyncHandler(async (req, res) => {
  const merchantId = req.user.merchantId;
  const productId = req.params.productId;
  
  console.log('--- DEBUG: IMAGE UPLOAD ---');
  console.log('ProductId:', productId);
  console.log('Files received:', req.files ? req.files.length : 'none');
  if (req.files && req.files.length > 0) {
    req.files.forEach((f, i) => console.log(`File ${i}: ${f.originalname}, Size: ${f.size}`));
  }
  
  if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
    console.error('ERROR: No files in request body!');
    throw new AppError('Please upload at least one image', 400);
  }

  // Upload all files to Cloudinary concurrently
  const uploadPromises = req.files.map((file, index) => 
    uploadToCloudinary(file.buffer, 'arohoo/products').then(url => ({
      url,
      order: index
    }))
  );

  const images = await Promise.all(uploadPromises);
  const updatedImages = await productService.uploadProductImages(productId, merchantId, images);

  res.status(200).json({
    success: true,
    data: updatedImages,
    error: null
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const merchantId = req.user.merchantId;
  await productService.deleteProduct(req.params.id, merchantId);

  res.status(200).json({
    success: true,
    data: null,
    message: 'Product deleted successfully',
    error: null
  });
});

export const getPublicTrendingProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  const result = await productService.getTrendingProducts(limit);

  res.status(200).json(result);
});

export const getPublicProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  
  const result = await productService.getPublicProducts(req.query, page, limit);

  res.status(200).json({
    success: true,
    ...result,
    error: null
  });
});

export const getPublicProductById = asyncHandler(async (req, res) => {
  const result = await productService.getProductById(req.params.id);

  res.status(200).json({
    success: true,
    data: result,
    error: null
  });
});
