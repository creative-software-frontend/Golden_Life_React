// Order interfaces matching API structure

export interface OrderProduct {
  id: number;
  product_id: number;
  order_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface StatusHistory {
  id: number;
  order_id: number;
  status: string;
  changed_by: number;
  created_at: string;
}

export interface Order {
  id: number;
  order_no: string;
  user_id?: string;
  user_name: string;
  user_phone: string;
  user_address: string;
  delivery_charge: string;
  total: string;
  status: OrderStatus;
  created_at: string;
  products: OrderProduct[];
  status_history?: StatusHistory[];
  payment?: {
    payment_method: string;
    transaction_number: string;
  };
}

export type OrderStatus = 'Order Placed' | 'Pending' | 'Processing' | 'Packaging' | 'Ready to Ship' | 'Delivered' | 'Cancelled';

export interface OrdersApiResponse {
  success: boolean;
  orders: Order[];
  message?: string;
}

export interface OrderTrackingApiResponse {
  status: boolean;
  order: Order;
  status_history: StatusHistory[];
  message?: string;
}

export interface UpdateStatusApiResponse {
  success: boolean;
  message: string;
  order?: Order;
}

export interface OrderFilters {
  search?: string;
  status?: OrderStatus | 'All' | 'today';
  page?: number;
  limit?: number;
}
