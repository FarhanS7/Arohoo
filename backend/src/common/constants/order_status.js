/**
 * Standardized order statuses for the marketplace.
 */
export const OrderStatus = {
  PENDING: 'PENDING',     // Initial state
  CONFIRMED: 'CONFIRMED', // Manually confirmed by admin
  SHIPPED: 'SHIPPED',     // Handed over to logistics
  DELIVERED: 'DELIVERED', // Final state
  CANCELLED: 'CANCELLED', // Terminated
};

/**
 * Payment statuses specifically for COD workflow.
 */
export const PaymentStatus = {
  COD_PENDING: 'COD_PENDING', // Awaiting cash on delivery
  PAID: 'PAID',               // Cash received
  REFUNDED: 'REFUNDED',       // Returned and refunded
};
