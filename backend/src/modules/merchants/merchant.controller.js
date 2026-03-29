import { asyncHandler } from '../../common/utils/async.handler.js';
import merchantService from './merchant.service.js';
import { updateMerchantProfileSchema } from './merchant.validator.js';

/**
 * Controller to handle merchant-specific HTTP requests.
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
  // 1. Get merchantId from the authenticated user (attached by protect middleware)
  const { merchantId } = req.user;

  // 2. Validate input
  const validatedData = updateMerchantProfileSchema.parse(req.body);

  // 3. Update profile via service
  const updatedMerchant = await merchantService.updateMerchantProfile(merchantId, validatedData);

  res.status(200).json({
    success: true,
    data: {
      storeName: updatedMerchant.storeName,
      description: updatedMerchant.description,
      bannerUrl: updatedMerchant.bannerUrl,
      logo: updatedMerchant.logo
    }
  });
});

/**
 * Controller to get merchant statistics.
 */
export const getStats = asyncHandler(async (req, res, next) => {
  const { merchantId } = req.user;
  const stats = await merchantService.getMerchantDashboardStats(merchantId);

  res.status(200).json({
    status: 'success',
    data: stats
  });
});

/**
 * Controller to get all pending merchants (Admin only).
 */
export const getPending = asyncHandler(async (req, res, next) => {
  const pendingMerchants = await merchantService.getPendingMerchants();
  res.status(200).json({
    status: 'success',
    data: pendingMerchants
  });
});

/**
 * Controller to approve a merchant (Admin only).
 */
export const approve = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const approvedMerchant = await merchantService.approveMerchant(id);
  res.status(200).json({
    status: 'success',
    data: approvedMerchant
  });
});

/**
 * Controller to reject a merchant (Admin only).
 */
export const reject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const rejectedMerchant = await merchantService.rejectMerchant(id);
  res.status(200).json({
    status: 'success',
    data: rejectedMerchant
  });
});
