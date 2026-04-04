import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { MerchantService } from '../../src/modules/merchants/merchant.service.js';
import { updateMerchantProfileSchema } from '../../src/modules/merchants/merchant.validator.js';

describe('Merchant Profile Management', () => {
  let merchantService;
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = {
      merchant: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    merchantService = new MerchantService(mockPrisma);
  });

  describe('updateMerchantProfile', () => {
    const merchantId = 'm-123';
    const updateData = {
      storeName: 'Updated Store',
      description: 'A great store',
      logo: 'https://example.com/logo.png'
    };

    it('should successfully update a merchant profile', async () => {
      mockPrisma.merchant.findUnique.mockResolvedValue({ id: merchantId });
      mockPrisma.merchant.update.mockResolvedValue({ id: merchantId, ...updateData });

      const result = await merchantService.updateMerchantProfile(merchantId, updateData);

      expect(mockPrisma.merchant.findUnique).toHaveBeenCalledWith({ where: { id: merchantId } });
      expect(mockPrisma.merchant.update).toHaveBeenCalledWith({
        where: { id: merchantId },
        data: updateData
      });
      expect(result.storeName).toBe('Updated Store');
    });

    it('should throw 404 if merchant does not exist', async () => {
      mockPrisma.merchant.findUnique.mockResolvedValue(null);

      await expect(merchantService.updateMerchantProfile(merchantId, updateData))
        .rejects.toThrow('Merchant not found');
    });

    it('should throw error if merchantId is missing', async () => {
      await expect(merchantService.updateMerchantProfile(null, updateData))
        .rejects.toThrow('Merchant ID is required');
    });
  });

  describe('Validation Schema', () => {
    it('should validate correct data', () => {
      const validData = {
        storeName: 'New Name',
        bannerUrl: 'https://img.com/banner.jpg'
      };
      expect(() => updateMerchantProfileSchema.parse(validData)).not.toThrow();
    });

    it('should allow empty strings for optional images', () => {
      const data = { bannerUrl: '' };
      expect(() => updateMerchantProfileSchema.parse(data)).not.toThrow();
    });

    it('should fail for invalid URLs', () => {
      const invalidData = { logo: 'not-a-url' };
      expect(() => updateMerchantProfileSchema.parse(invalidData)).toThrow();
    });
  });
});
