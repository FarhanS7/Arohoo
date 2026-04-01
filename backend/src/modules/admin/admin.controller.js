import { asyncHandler } from '../../common/utils/async.handler.js';
import { AdminService } from './admin.service.js';

const adminService = new AdminService();

/**
 * Controller to handle admin operations.
 */
export const getAllMerchants = asyncHandler(async (req, res, next) => {
  const merchants = await adminService.getAllMerchants();

  res.status(200).json({
    success: true,
    data: merchants,
  });
});

/**
 * Controller to handle fetching pending merchants.
 */
export const getPendingMerchants = asyncHandler(async (req, res, next) => {
  const merchants = await adminService.getPendingMerchants();

  res.status(200).json({
    success: true,
    data: merchants,
  });
});

/**
 * Controller to handle merchant approval.
 */
export const approveMerchant = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  await adminService.approveMerchant(id);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

/**
 * Controller to handle merchant rejection.
 */
export const rejectMerchant = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  await adminService.rejectMerchant(id);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

/**
 * Controller to list all users.
 */
export const listUsers = asyncHandler(async (req, res, next) => {
  const users = await adminService.listUsers();

  res.status(200).json({
    success: true,
    data: users
  });
});

/**
 * Controller to update user role.
 */
export const updateUserRole = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await adminService.updateUserRole(id, role);

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * Controller to update user status.
 */
export const updateUserStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const user = await adminService.updateUserStatus(id, status);

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * Controller to toggle merchant trending status.
 */
export const toggleMerchantTrending = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const merchant = await adminService.toggleMerchantTrending(id);

  res.status(200).json({
    success: true,
    data: merchant
  });
});

/**
 * Controller to toggle product trending status.
 */
export const toggleProductTrending = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await adminService.toggleProductTrending(id);

  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * Controller to fetch platform-wide statistics.
 */
export const getPlatformStats = asyncHandler(async (req, res, next) => {
  const stats = await adminService.getPlatformStats();

  res.status(200).json({
    success: true,
    data: stats
  });
});

/**
 * Controller to fetch all products for platform management.
 */
export const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await adminService.getAllProducts();

  res.status(200).json({
    success: true,
    data: products
  });
});

/**
 * Controller to fetch specific merchant details for admin inspection.
 */
export const getMerchantDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const details = await adminService.getMerchantFullDetails(id);

  res.status(200).json({
    success: true,
    data: details
  });
});

/**
 * Controller for admin to modify a merchant's product.
 */
export const updateMerchantProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await adminService.updateProductByAdmin(productId, req.body);

  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * Controller for admin to update a merchant's order item status.
 */
export const updateMerchantOrderItemStatus = asyncHandler(async (req, res, next) => {
  const { orderItemId } = req.params;
  const { status } = req.body;
  const orderItem = await adminService.updateOrderItemStatusByAdmin(orderItemId, status);

  res.status(200).json({
    success: true,
    data: orderItem
  });
});
