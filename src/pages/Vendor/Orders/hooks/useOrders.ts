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

      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status && filters.status !== 'All') params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await axios.get<OrdersApiResponse>(
        `${baseURL}/api/vendor/orders/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params
        }
      );

      if (response.data.success) {
        return response.data.orders || [];
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
    } catch (err: any) {
      console.error('Fetch orders error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch orders';
      setError(errorMessage);
      toast.error(errorMessage);
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

      if (response.data.status) {
        return response.data.order || null;
      } else {
        throw new Error(response.data.message || 'Failed to fetch order details');
      }
    } catch (err: any) {
      console.error('Fetch order details error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch order details';
      setError(errorMessage);
      toast.error(errorMessage);
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

      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

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

      if (response.data.success) {
        toast.success('Order status updated successfully!');
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to update order status');
      }
    } catch (err: any) {
      console.error('Update order status error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update order status';
      setError(errorMessage);
      toast.error(errorMessage);
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
