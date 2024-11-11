// Domain types
export type OrderId = string;
export type UserId = string;

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: OrderId;
  userId: UserId;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
}
