import { OrderStatus } from '../../common/constants/order_status.js';
import { AppError } from '../../common/errors/AppError.js';

export class ReviewService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Creates a product review. Only allowed if user has a DELIVERED order for the product.
   */
  async createReview(data) {
    const { userId, productId, rating, comment } = data;

    // 1. Verify purchase (Buyer verification)
    const purchase = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: OrderStatus.DELIVERED
        }
      }
    });

    if (!purchase) {
      throw new AppError('You can only review products you have purchased and received', 403);
    }

    // 2. Create review (unique constraint on userId + productId in schema handles duplicates)
    try {
      return await this.prisma.review.create({
        data: {
          userId,
          productId,
          rating,
          comment
        }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new AppError('You have already reviewed this product', 409);
      }
      throw error;
    }
  }

  async getProductReviews(productId) {
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { id: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
