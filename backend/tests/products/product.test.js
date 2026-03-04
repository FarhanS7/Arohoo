import { ProductService } from '../../src/modules/products/product.service.js';

describe('ProductService', () => {
  let productService;
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = {
      product: {
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };
    productService = new ProductService(mockPrisma);
  });

  describe('createProduct', () => {
    it('should create a product with variants and images', async () => {
      const productData = {
        name: 'T-Shirt',
        merchantId: 'm1',
        categoryId: 'c1',
        description: 'Cotton',
        variants: [{ sku: 'SKU-1', price: 10, stock: 5 }],
        images: ['url1', 'url2']
      };

      mockPrisma.product.create.mockResolvedValue({ id: 'p1', ...productData });

      const result = await productService.createProduct(productData);
      expect(result.id).toBe('p1');
      expect(mockPrisma.product.create).toHaveBeenCalled();
    });

    it('should throw 400 if more than 5 images are provided', async () => {
      const productData = {
        images: ['1', '2', '3', '4', '5', '6']
      };

      await expect(productService.createProduct(productData))
        .rejects.toThrow('Product cannot have more than 5 images');
    });
  });

  describe('getProductById - Multi-tenancy', () => {
    it('should throw 403 if a merchant tries to access another merchant\'s product', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1', merchantId: 'm2' });

      await expect(productService.getProductById('p1', 'm1'))
        .rejects.toThrow('Forbidden: You do not have access to this product');
    });

    it('should allow admin to access any product', async () => {
       const product = { id: 'p1', merchantId: 'm2' };
       mockPrisma.product.findUnique.mockResolvedValue(product);

       const result = await productService.getProductById('p1', 'm1', true);
       expect(result).toEqual(product);
    });
  });
});
