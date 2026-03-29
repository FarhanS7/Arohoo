import { asyncHandler } from '../../common/utils/async.handler.js';
import mallService from './mall.service.js';

/**
 * Public Mall Controller
 */
export const getAllMalls = asyncHandler(async (req, res, next) => {
  const malls = await mallService.getAllMalls();
  res.status(200).json({
    status: 'success',
    data: malls,
  });
});

export const getMallById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const mall = await mallService.getMallById(id);
  res.status(200).json({
    status: 'success',
    data: mall,
  });
});

/**
 * Admin Mall Controller
 */
export const createMall = asyncHandler(async (req, res, next) => {
  const mall = await mallService.createMall(req.body);
  res.status(201).json({
    status: 'success',
    data: mall,
  });
});

export const updateMall = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const mall = await mallService.updateMall(id, req.body);
  res.status(200).json({
    status: 'success',
    data: mall,
  });
});

export const deleteMall = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  await mallService.deleteMall(id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const addMerchantToMall = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { merchantId } = req.body;
  const mall = await mallService.addMerchantToMall(id, merchantId);
  res.status(200).json({
    status: 'success',
    data: mall,
  });
});

export const removeMerchantFromMall = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { merchantId } = req.body;
  const mall = await mallService.removeMerchantFromMall(id, merchantId);
  res.status(200).json({
    status: 'success',
    data: mall,
  });
});
