import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Order, OrderFilters, OrdersApiResponse, OrderTrackingApiResponse, UpdateStatusApiResponse } from '../types/order.types';

export function useOrders() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  const getAuthToken = () => {
    const session = sessionStorage.getItem('vendor_session');
    if (!session) return null;
    try {
      const parsed = JSON.parse(session);
      return parsed.token || null;
    } catch {
      return null;
    }
  };

  /**
   * Fetch all orders with filters
   */
  const fetchOrders = useCallback(async (filters?: OrderFilters): Promise<Order[]> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔵 [API] Fetching orders with filters:', filters);

      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status && filters.status !== 'All') params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      console.log('🔵 [API] Request params:', params.toString());

      const response = await axios.get<OrdersApiResponse>(
        `${baseURL}/api/vendor/orders/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params
        }
      );

      console.log('🟢 [API] Orders response received:', response.data);

      if (response.data.success) {
        const orders = response.data.orders || [];
        console.log('✅ [API] Orders loaded successfully:', orders.length, 'orders');
        return orders;
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
    } catch (err: any) {
      console.error('❌ [API] Fetch orders error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch orders';
      setError(errorMessage);
      
      // Handle 404 specifically
      if (err.response?.status === 404) {
        toast.error('Orders endpoint not found. Please check API configuration.');
      } else if (err.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else {
        toast.error(errorMessage);
      }
      
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch single order details by order number
   */
  const fetchOrderDetails = useCallback(async (orderNo: string): Promise<Order | null> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔵 [API] Fetching order details for:', orderNo);

      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await axios.get<OrderTrackingApiResponse>(
        `${baseURL}/api/vendor/order/tracking`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { order_no: orderNo }
        }
      );

      console.log('🟢 [API] Order details response:', response.data);

      if (response.data.status) {
        const order = response.data.order || null;
        console.log('✅ [API] Order loaded successfully:', order?.order_no);
        return order;
      } else {
        throw new Error(response.data.message || 'Failed to fetch order details');
      }
    } catch (err: any) {
      console.error('❌ [API] Fetch order details error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch order details';
      setError(errorMessage);
      
      // Handle 404 specifically
      if (err.response?.status === 404) {
        toast.error('Order not found. The order number may be invalid.');
      } else {
        toast.error(errorMessage);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update order status
   */
  const updateOrderStatus = useCallback(async (orderNo: string, status: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔵 [API] Updating order status:', { orderNo, status });

      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Correct endpoint: POST /api/updatetStatus/order?id={order_no}
      const response = await axios.post<UpdateStatusApiResponse>(
        `${baseURL}/api/updatetStatus/order`,
        { status },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: { id: orderNo }
        }
      );

      console.log('🟢 [API] Status update response:', response.data);

      if (response.data.success) {
        toast.success('Order status updated successfully!');
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to update order status');
      }
    } catch (err: any) {
      console.error('❌ [API] Update order status error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update order status';
      setError(errorMessage);
      
      // Handle 404 specifically
      if (err.response?.status === 404) {
        toast.error('Update endpoint not found. Please check API configuration.');
      } else if (err.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else {
        toast.error(errorMessage);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchOrders,
    fetchOrderDetails,
    updateOrderStatus,
    isLoading,
    error,
  };
}
