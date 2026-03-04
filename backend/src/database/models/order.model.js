import { OrderStatus, PaymentStatus } from '../../common/constants/order_status.js';

/**
 * Order Model structure (Database-compatible)
 * 
 * Fields:
 * - id: String (UUID) - Primary Key
 * - customerId: String - Reference to User id
 * - merchantId: String - Reference to User (Merchant) id
 * - totalAmount: Decimal - Total price of items + shipping
 * - status: Enum (OrderStatus) - Defaults to PENDING
 * - paymentStatus: Enum (PaymentStatus) - Defaults to COD_PENDING
 * - deliveryAddress: String - Snapshotted address at time of order
 * - createdAt: Date
 * - updatedAt: Date
 */

export const OrderModel = {
  tableName: 'orders',
  fields: {
    id: { type: 'String', primaryKey: true },
    customerId: { type: 'String', required: true },
    merchantId: { type: 'String', required: true },
    totalAmount: { type: 'Decimal', required: true },
    status: { 
      type: 'Enum', 
      values: Object.values(OrderStatus), 
      default: OrderStatus.PENDING,
      required: true 
    },
    paymentStatus: { 
      type: 'Enum', 
      values: Object.values(PaymentStatus), 
      default: PaymentStatus.COD_PENDING,
      required: true 
    },
    deliveryAddress: { type: 'String', required: true },
    createdAt: { type: 'Date' },
    updatedAt: { type: 'Date' }
  }
};
