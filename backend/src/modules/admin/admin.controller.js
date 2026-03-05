import { asyncHandler } from '../../common/utils/async.handler.js';
import { AdminService } from './admin.service.js';

const adminService = new AdminService();

/**
 * Controller to handle admin operations.
 */
export const getAllMerchants = asyncHandler(async (req, res, next) => {
  const merchants = await adminService.getAllMerchants();

  res.status(200).json({
    status: 'success',
    results: merchants.length,
    data: {
      merchants,
    },
  });
});

/**
 * Controller to handle fetching pending merchants.
 */
export const getPendingMerchants = asyncHandler(async (req, res, next) => {
  const merchants = await adminService.getPendingMerchants();

  res.status(200).json({
    status: 'success',
    results: merchants.length,
    data: {
      merchants,
    },
  });
});
