import { AppError } from '../../common/errors/AppError.js';
export class WishlistService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addItem(userId, productId) {
        try {
            return await this.prisma.wishlistItem.create({
                data: {
                    userId,
                    productId
                }
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new AppError('Product is already in your wishlist', 409);
            }
            throw error;
        }
    }
    async removeItem(userId, productId) {
        const item = await this.prisma.wishlistItem.findUnique({
            where: {
                userId_productId: { userId, productId }
            }
        });
        if (!item) {
            throw new AppError('Item not found in wishlist', 404);
        }
        return this.prisma.wishlistItem.delete({
            where: { id: item.id }
        });
    }
    async getUserWishlist(userId) {
        return this.prisma.wishlistItem.findMany({
            where: { userId },
            include: {
                product: {
                    include: {
                        variants: true,
                        images: true
                    }
                }
            }
        });
    }
}
