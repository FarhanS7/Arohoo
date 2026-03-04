/**
 * Order statuses refined for the Order Domain implementation.
 */
export const OrderStatus = {
  NEW_ORDER: 'NEW_ORDER',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
};

/**
 * Payment statuses remain consistent for COD.
 */
export const PaymentStatus = {
  COD_PENDING: 'COD_PENDING',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
};
