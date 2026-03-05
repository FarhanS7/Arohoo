import { AppError } from '../../common/errors/AppError.js';
export class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProduct(data) {
        const { name, merchantId, categoryId, description, variants = [], images = [] } = data;
        // 1. Validation: Max 5 images
        if (images.length > 5) {
            throw new AppError('Product cannot have more than 5 images', 400);
        }
        // 2. Creation with nested variants and images
        return this.prisma.product.create({
            data: {
                name,
                description,
                merchantId,
                categoryId,
                variants: {
                    create: variants.map(v => ({
                        sku: v.sku,
                        size: v.size,
                        color: v.color,
                        price: v.price,
                        stock: v.stock
                    }))
                },
                images: {
                    create: images.map(url => ({ url }))
                }
            },
            include: {
                variants: true,
                images: true
            }
        });
    }
    async getProductById(id, requesterMerchantId, isAdmin = false) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { variants: true, images: true }
        });
        if (!product) {
            throw new AppError('Product not found', 404);
        }
        // 3. Multi-tenant isolation check
        if (!isAdmin && product.merchantId !== requesterMerchantId) {
            throw new AppError('Forbidden: You do not have access to this product', 403);
        }
        return product;
    }
    async deleteProduct(id, merchantId, isAdmin = false) {
        const product = await this.getProductById(id, merchantId, isAdmin);
        // Cascade delete is handled at the database level via Prisma schema
        return this.prisma.product.delete({
            where: { id: product.id }
        });
    }
}
