import { OrderService } from '../../src/modules/orders/order.service.js';

describe('OrderService', () => {
  let orderService;
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = {
      $transaction: jest.fn((callback) => callback(mockPrisma)),
      productVariant: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      order: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    orderService = new OrderService(mockPrisma);
  });

  describe('createOrder', () => {
    it('should create an order and update stock in a transaction', async () => {
      const orderData = {
        userId: 'u1',
        shippingAddress: { name: 'John', phone: '123', addressLine1: 'St 1' },
        items: [{ variantId: 'v1', quantity: 2 }]
      };

      const mockVariant = { 
        id: 'v1', 
        productId: 'p1', 
        sku: 'SKU-RED-M', 
        price: 20, 
        stock: 10,
        product: { merchantId: 'm1' }
      };

      mockPrisma.productVariant.findUnique.mockResolvedValue(mockVariant);
      mockPrisma.order.create.mockResolvedValue({ id: 'ord1', totalAmount: 40 });

      const result = await orderService.createOrder(orderData);

      expect(result.id).toBe('ord1');
      expect(mockPrisma.productVariant.update).toHaveBeenCalledWith({
        where: { id: 'v1' },
        data: { stock: { decrement: 2 } }
      });
      expect(mockPrisma.order.create).toHaveBeenCalled();
    });

    it('should rollback and throw error if out of stock', async () => {
      const orderData = {
        userId: 'u1',
        shippingAddress: { name: 'John', phone: '123', addressLine1: 'St 1' },
        items: [{ variantId: 'v1', quantity: 20 }]
      };

      const mockVariant = { id: 'v1', sku: 'SKU-1', stock: 10, price: 5, product: { merchantId: 'm1' } };
      mockPrisma.productVariant.findUnique.mockResolvedValue(mockVariant);

      await expect(orderService.createOrder(orderData))
        .rejects.toThrow('Not enough stock for SKU SKU-1');
      
      expect(mockPrisma.order.create).not.toHaveBeenCalled();
    });
  });
});
