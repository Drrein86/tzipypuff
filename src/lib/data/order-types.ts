export interface OrderItem {
  id: string;
  nameHe: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes?: string;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered";
export type PaymentMethod = "cod" | "bit" | "card";

export interface Order {
  id: string;
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
}

export interface OrdersData {
  orders: Order[];
}
