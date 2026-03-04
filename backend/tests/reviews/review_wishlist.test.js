import { ReviewService } from '../../src/modules/reviews/review.service.js';
import { WishlistService } from '../../src/modules/wishlist/wishlist.service.js';

describe('Review & Wishlist Services', () => {
  let mockPrisma;
  let reviewService;
  let wishlistService;

  beforeEach(() => {
    mockPrisma = {
      orderItem: { findFirst: jest.fn() },
      review: { create: jest.fn(), findMany: jest.fn() },
      wishlistItem: { create: jest.fn(), findUnique: jest.fn(), delete: jest.fn(), findMany: jest.fn() },
    };
    reviewService = new ReviewService(mockPrisma);
    wishlistService = new WishlistService(mockPrisma);
  });

  describe('ReviewService', () => {
    it('should throw 403 if user has not bought the product', async () => {
      mockPrisma.orderItem.findFirst.mockResolvedValue(null);

      await expect(reviewService.createReview({ userId: 'u1', productId: 'p1' }))
        .rejects.toThrow('You can only review products you have purchased and received');
    });

    it('should create review if user has purchased the product', async () => {
      mockPrisma.orderItem.findFirst.mockResolvedValue({ id: 'oi1' });
      mockPrisma.review.create.mockResolvedValue({ id: 'r1', rating: 5 });

      const result = await reviewService.createReview({ userId: 'u1', productId: 'p1', rating: 5 });
      expect(result.id).toBe('r1');
    });
  });

  describe('WishlistService', () => {
    it('should add item to wishlist', async () => {
      mockPrisma.wishlistItem.create.mockResolvedValue({ id: 'w1' });
      const result = await wishlistService.addItem('u1', 'p1');
      expect(result.id).toBe('w1');
    });

    it('should throw 409 for duplicate wishlist item', async () => {
      const error = new Error();
      error.code = 'P2002';
      mockPrisma.wishlistItem.create.mockRejectedValue(error);

      await expect(wishlistService.addItem('u1', 'p1'))
        .rejects.toThrow('Product is already in your wishlist');
    });
  });
});
