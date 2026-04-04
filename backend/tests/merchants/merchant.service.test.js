import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { MerchantService } from '../../src/modules/merchants/merchant.service.js';

describe('MerchantService Analytics', () => {
    let merchantService;
    let mockPrisma;

    beforeEach(() => {
        mockPrisma = {
            orderItem: {
                aggregate: jest.fn(),
                count: jest.fn(),
            },
            productVariant: {
                count: jest.fn(),
            },
        };
        merchantService = new MerchantService(mockPrisma);
    });

    describe('getMerchantDashboardStats', () => {
        it('should calculate correct stats for a merchant with sales', async () => {
            const merchantId = 'merchant-123';

            // Mock aggregate for revenue, sales, and total count
            mockPrisma.orderItem.aggregate.mockResolvedValue({
                _sum: {
                    subtotal: 1000.50,
                    quantity: 50
                },
                _count: {
                    id: 10
                }
            });

            // Mock count for delivered items
            mockPrisma.orderItem.count.mockResolvedValue(9);

            // Mock variant count for low stock
            mockPrisma.productVariant.count.mockResolvedValue(2);

            const stats = await merchantService.getMerchantDashboardStats(merchantId);

            expect(mockPrisma.orderItem.aggregate).toHaveBeenCalledWith({
                where: {
                    merchantId,
                    status: { not: 'CANCELLED' }
                },
                _sum: { subtotal: true, quantity: true },
                _count: { id: true }
            });

            expect(stats).toEqual({
                revenue: 1000.5,
                salesVolume: 50,
                fulfillmentRate: 90, // 9 / 10 * 100
                lowStockAlerts: 2
            });
        });

        it('should return zeros for a merchant with no sales', async () => {
            const merchantId = 'merchant-empty';

            mockPrisma.orderItem.aggregate.mockResolvedValue({
                _sum: { subtotal: null, quantity: null },
                _count: { id: 0 }
            });

            mockPrisma.orderItem.count.mockResolvedValue(0);
            mockPrisma.productVariant.count.mockResolvedValue(0);

            const stats = await merchantService.getMerchantDashboardStats(merchantId);

            expect(stats).toEqual({
                revenue: 0,
                salesVolume: 0,
                fulfillmentRate: 0,
                lowStockAlerts: 0
            });
        });

        it('should calculate fulfillment rate correctly with rounding', async () => {
            const merchantId = 'merchant-round';

            mockPrisma.orderItem.aggregate.mockResolvedValue({
                _sum: { subtotal: 100, quantity: 10 },
                _count: { id: 3 }
            });

            mockPrisma.orderItem.count.mockResolvedValue(1);
            mockPrisma.productVariant.count.mockResolvedValue(0);

            const stats = await merchantService.getMerchantDashboardStats(merchantId);

            // 1 / 3 * 100 = 33.3333... -> 33
            expect(stats.fulfillmentRate).toBe(33);
        });
    });
});
