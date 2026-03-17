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
    pageSize: 25, // Increased default from 10 to 25
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

      console.log('🔄 [useProducts] Fetching products from API...');
      const response = await axios.get(`${baseURL}/api/vendor/product/list`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          // No limit parameter - fetch all products
        },
      });

      console.log('📦 [useProducts] API Response:', {
        status: response.status,
        data: response.data,
        hasProducts: !!response.data.products,
        hasData: !!response.data.data,
        isArray: Array.isArray(response.data),
        productsLength: response.data.products?.length || 0,
        dataLength: response.data.data?.length || 0,
        total: response.data.total || 0
      });

      // Handle different response structures
      const responseData = response.data;
      let productList: Product[] = [];
      let total = 0;

      if (responseData.products) {
        console.log('✅ [useProducts] Found products array in response.products');
        productList = responseData.products;
        total = responseData.total || responseData.products.length;
      } else if (Array.isArray(responseData)) {
        console.log('✅ [useProducts] Response is direct array');
        productList = responseData;
        total = responseData.length;
      } else if (responseData.data) {
        console.log('✅ [useProducts] Found data object in response.data');
        productList = responseData.data.products || responseData.data;
        total = responseData.data.total || responseData.data.length;
      }

      console.log('📊 [useProducts] Processed data:', {
        productCount: productList.length,
        total,
        firstProduct: productList[0] ? {
          id: productList[0].id,
          title: productList[0].product_title_english,
          sku: productList[0].sku
        } : null
      });

      setProducts(productList);
      setFilteredProducts(productList);
      setPagination((prev: PaginationState) => ({
        ...prev,
        totalItems: total,
        totalPages: Math.ceil(total / prev.pageSize),
      }));
      
      toast.success(`Loaded ${productList.length} products`);
    } catch (err: any) {
      console.error('❌ [useProducts] Failed to fetch products:', err);
      console.error('[useProducts] Error details:', {
        message: err.message,
        response: err.response?.data,
        code: err.code
      });
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

  // Apply filters and sorting
  const applyFilters = useCallback((filters: ProductFilters) => {
    let result = [...products];
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

  // Update ebook status
  const updateEbookStatus = async (productId: number, isEbook: boolean): Promise<void> => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      await axios.post(
        `${baseURL}/api/vendor/product/${productId}/ebook`,
        { ebook: isEbook ? '1' : '0' },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      // Update local state
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, ebook: isEbook ? '1' : '0' } : p
      ));
      setFilteredProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, ebook: isEbook ? '1' : '0' } : p
      ));
    } catch (err: any) {
      console.error('Failed to update ebook status:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update ebook status';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update video link
  const updateVideoLink = async (productId: number, videoLink: string): Promise<void> => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      await axios.post(
        `${baseURL}/api/vendor/product/${productId}/video-link`,
        { video_link: videoLink },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      // Update local state
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, video_link: videoLink } : p
      ));
      setFilteredProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, video_link: videoLink } : p
      ));
    } catch (err: any) {
      console.error('Failed to update video link:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update video link';
      toast.error(errorMessage);
      throw err;
    }
  };

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
    bulkDeleteProducts,
    applyFilters,
    updatePageSize,
    setPagination,
    updateEbookStatus,
    updateVideoLink,
  };
}
