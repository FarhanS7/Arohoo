import { OrderStatus } from '../../common/constants/order_status.js';
import { AppError } from '../../common/errors/AppError.js';
export class OrderService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Creates an order with items from multiple merchants in a transaction.
     * @param {Object} data - Order data (userId, shipingAddress, cartItems).
     */
    async createOrder(data) {
        const { userId, shippingAddress, items } = data;
        if (!shippingAddress || !shippingAddress.addressLine1 || !shippingAddress.phone) {
            throw new AppError('Incomplete shipping information', 400);
        }
        // items: [{ productId, variantId, quantity }]
        return this.prisma.$transaction(async (tx) => {
            let totalAmount = 0;
            const orderItemsToCreate = [];
            for (const item of items) {
                // 1. Fetch product variant and check stock
                const variant = await tx.productVariant.findUnique({
                    where: { id: item.variantId },
                    include: { product: true }
                });
                if (!variant) {
                    throw new AppError(`Product variant ${item.variantId} not found`, 404);
                }
                if (variant.stock < item.quantity) {
                    throw new AppError(`Not enough stock for SKU ${variant.sku}`, 400);
                }
                // 2. Decrement stock
                await tx.productVariant.update({
                    where: { id: variant.id },
                    data: { stock: { decrement: item.quantity } }
                });
                const itemTotal = Number(variant.price) * item.quantity;
                totalAmount += itemTotal;
                orderItemsToCreate.push({
                    productId: variant.productId,
                    merchantId: variant.product.merchantId,
                    quantity: item.quantity,
                    price: variant.price,
                    status: OrderStatus.NEW_ORDER
                });
            }
            // 3. Create Order and OrderItems
            return tx.order.create({
                data: {
                    userId,
                    shippingAddress, // JSON snapshot
                    totalAmount,
                    orderItems: {
                        create: orderItemsToCreate
                    }
                },
                include: {
                    orderItems: true
                }
            });
        });
    }
    async getOrderById(id, requesterId, userRole) {
        // Strategy: Admins see everything. Customers see own. Merchants see own items.
        // Simplifying for basic access
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { orderItems: true }
        });
        if (!order)
            throw new AppError('Order not found', 404);
        return order;
    }
}
