import { asyncHandler } from '../../common/utils/async.handler.js';
import merchantService from './merchant.service.js';
import { updateMerchantProfileSchema } from './merchant.validator.js';
import { uploadToCloudinary } from '../../common/utils/cloudinary.service.js';
import { AppError } from '../../common/errors/AppError.js';

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
      logo: updatedMerchant.logo,
      address: updatedMerchant.address
    }
  });
});

/**
 * Controller to get current merchant profile.
 */
export const getProfile = asyncHandler(async (req, res, next) => {
  const { merchantId } = req.user;
  const merchant = await merchantService.prisma.merchant.findUnique({
    where: { id: merchantId },
    select: {
      storeName: true,
      description: true,
      bannerUrl: true,
      logo: true,
      address: true
    }
  });

  if (!merchant) throw new AppError('Merchant not found', 404);

  res.status(200).json({
    success: true,
    data: merchant
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

/**
 * Controller to upload merchant logo.
 */
export const uploadLogo = asyncHandler(async (req, res, next) => {
  const { merchantId } = req.user;
  if (!req.file) throw new AppError('Image file is required', 400);

  // Upload to Cloudinary
  const logoUrl = await uploadToCloudinary(req.file.buffer, 'arohoo/merchants/logos');
  const updatedMerchant = await merchantService.updateMerchantProfile(merchantId, { logo: logoUrl });

  res.status(200).json({
    success: true,
    data: { logo: updatedMerchant.logo }
  });
});

/**
 * Controller to upload merchant banner.
 */
export const uploadBanner = asyncHandler(async (req, res, next) => {
  const { merchantId } = req.user;
  if (!req.file) throw new AppError('Image file is required', 400);

  // Upload to Cloudinary
  const bannerUrl = await uploadToCloudinary(req.file.buffer, 'arohoo/merchants/banners');
  const updatedMerchant = await merchantService.updateMerchantProfile(merchantId, { bannerUrl: bannerUrl });

  res.status(200).json({
    success: true,
    data: { bannerUrl: updatedMerchant.bannerUrl }
  });
});

/**
 * Controller to get public merchant profile.
 */
export const getPublicProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const merchant = await merchantService.getPublicMerchantById(id);

  res.status(200).json({
    success: true,
    data: merchant
  });
});
