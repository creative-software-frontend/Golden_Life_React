import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Product, ProductFilters, PaginationState } from '../types';
import { LOW_STOCK_THRESHOLD } from '../constants';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  // Get auth token from session storage
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

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('Authentication required. Please log in again.');
        setIsLoading(false);
        toast.error('Please log in to view products');
        return;
      }

      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${baseURL}/api/vendor/product/list`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      // Handle different response structures
      const responseData = response.data;
      let productList: Product[] = [];
      let total = 0;

      if (responseData.products) {
        productList = responseData.products;
        total = responseData.total || responseData.products.length;
      } else if (Array.isArray(responseData)) {
        productList = responseData;
        total = responseData.length;
      } else if (responseData.data) {
        productList = responseData.data.products || responseData.data;
        total = responseData.data.total || responseData.data.length;
      }

      setProducts(productList);
      setFilteredProducts(productList);
      setPagination((prev: PaginationState) => ({
        ...prev,
        totalItems: total,
        totalPages: Math.ceil(total / prev.pageSize),
      }));
      
      toast.success(`Loaded ${productList.length} products`);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load products';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // If network error, provide retry option
      if (err.code === 'ERR_NETWORK' || !err.response) {
        toast.error('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [baseURL]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Delete product
  const deleteProduct = async (productId: number): Promise<boolean> => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      await axios.delete(`${baseURL}/api/vendor/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove from local state
      setProducts(prev => prev.filter(p => p.id !== productId));
      setFilteredProducts(prev => prev.filter(p => p.id !== productId));
      
      toast.success('Product deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete product';
      toast.error(errorMessage);
      return false;
    }
  };

  // Toggle product status
  const toggleProductStatus = async (productId: number, currentStatus: 0 | 1): Promise<boolean> => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const newStatus = currentStatus === 0 ? 1 : 0;
      
      await axios.put(
        `${baseURL}/api/vendor/product/${productId}/status`,
        { status: newStatus },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      // Update in local state
      const updateProduct = (p: Product) => 
        p.id === productId ? { ...p, status: newStatus as 0 | 1 } : p;
      
      setProducts(prev => prev.map(updateProduct));
      setFilteredProducts(prev => prev.map(updateProduct));
      
      const action = newStatus === 1 ? 'activated' : 'deactivated';
      toast.success(`Product ${action} successfully`);
      return true;
    } catch (err: any) {
      console.error('Failed to toggle product status:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update product status';
      toast.error(errorMessage);
      return false;
    }
  };

  // Bulk actions
  const bulkDeleteProducts = async (productIds: number[]): Promise<boolean> => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Delete all selected products
      const deletePromises = productIds.map(id =>
        axios.delete(`${baseURL}/api/vendor/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      await Promise.all(deletePromises);

      // Remove from local state
      setProducts(prev => prev.filter(p => !productIds.includes(p.id)));
      setFilteredProducts(prev => prev.filter(p => !productIds.includes(p.id)));
      
      toast.success(`Deleted ${productIds.length} products successfully`);
      return true;
    } catch (err: any) {
      console.error('Failed to bulk delete products:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete products';
      toast.error(errorMessage);
      return false;
    }
  };

  const bulkToggleStatus = async (productIds: number[], newStatus: 0 | 1): Promise<boolean> => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Update all selected products
      const updatePromises = productIds.map(id =>
        axios.put(
          `${baseURL}/api/vendor/product/${id}/status`,
          { status: newStatus },
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        )
      );

      await Promise.all(updatePromises);

      // Update in local state
      const updateProduct = (p: Product) =>
        productIds.includes(p.id) ? { ...p, status: newStatus } : p;
      
      setProducts(prev => prev.map(updateProduct));
      setFilteredProducts(prev => prev.map(updateProduct));
      
      const action = newStatus === 1 ? 'activated' : 'deactivated';
      toast.success(`Successfully ${action} ${productIds.length} products`);
      return true;
    } catch (err: any) {
      console.error('Failed to bulk update status:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update products';
      toast.error(errorMessage);
      return false;
    }
  };

  // Apply filters and sorting
  const applyFilters = useCallback((filters: ProductFilters) => {
    let result = [...products];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(product =>
        product.product_title_english.toLowerCase().includes(searchTerm) ||
        product.product_title_bangla.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status === 'active') {
      result = result.filter(product => product.status === 1);
    } else if (filters.status === 'inactive') {
      result = result.filter(product => product.status === 0);
    }

    // Stock filter
    if (filters.stock === 'low_stock') {
      result = result.filter(product => product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD);
    } else if (filters.stock === 'out_of_stock') {
      result = result.filter(product => product.stock === 0);
    }

    // Sorting
    switch (filters.sort) {
      case 'price_asc':
        result.sort((a, b) => a.offer_price - b.offer_price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.offer_price - a.offer_price);
        break;
      case 'stock_asc':
        result.sort((a, b) => a.stock - b.stock);
        break;
      case 'stock_desc':
        result.sort((a, b) => b.stock - a.stock);
        break;
      case 'date_asc':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'date_desc':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    setFilteredProducts(result);
    setPagination((prev: PaginationState) => ({
      ...prev,
      currentPage: 1, // Reset to first page when filters change
      totalItems: result.length,
      totalPages: Math.ceil(result.length / prev.pageSize),
    }));
  }, [products]);

  // Update page size
  const updatePageSize = useCallback((pageSize: number) => {
    setPagination((prev: PaginationState) => ({
      ...prev,
      pageSize,
      currentPage: 1,
      totalPages: Math.ceil(filteredProducts.length / pageSize),
    }));
  }, [filteredProducts.length]);

  // Get paginated products
  const getPaginatedProducts = useCallback(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, pagination.currentPage, pagination.pageSize]);

  return {
    products: getPaginatedProducts(),
    allProducts: products,
    filteredProducts,
    isLoading,
    error,
    pagination,
    fetchProducts,
    deleteProduct,
    toggleProductStatus,
    bulkDeleteProducts,
    bulkToggleStatus,
    applyFilters,
    updatePageSize,
    setPagination,
  };
}
