import { api } from "./client";

export interface OrderItem {
  id: string;
  productId: string;
  productVariantId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    name: string;
    images?: { url: string }[];
  };
  productVariant: {
    size?: string;
    color?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: any; // Can be parsed if it's a string, or kept as object
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export const getOrderById = async (id: string): Promise<Order> => {
  const { data } = await api.get(`/orders/${id}`);
  return data.data;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const { data } = await api.get("/orders/me");
  return data.data;
};
