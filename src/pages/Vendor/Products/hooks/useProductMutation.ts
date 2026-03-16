import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ProductFormData, ProductApiResponse } from '../types/product.types';

export function useProductMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

  // Create new product
  const createProduct = async (formData: FormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Debug: Log form data
      console.log('=== Creating Product ===');
      console.log('FormData entries:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const response = await axios.post(
        `${baseURL}/api/vendor/product/store`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('API Response:', response.data);

      const isSuccess = response.data?.success === true || 
                       response.data?.status === 'success' ||
                       response.data?.message?.toLowerCase().includes('success');

      if (isSuccess) {
        return true;
      } else {
        // Extract validation errors from API response
        const validationErrors = response.data?.errors || {};
        if (Object.keys(validationErrors).length > 0) {
          console.error('Validation errors:', validationErrors);
          Object.values(validationErrors).forEach((messages: any) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg: string) => {
                toast.error(msg);
              });
            }
          });
        }
        throw new Error(response.data?.message || 'Failed to create product');
      }
    } catch (err: any) {
      console.error('Create product error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create product';
      
      // Show specific validation error if available
      if (err.response?.data?.errors) {
        console.error('Validation errors:', err.response.data.errors);
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing product
  const updateProduct = async (id: number, formData: FormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Append _method for Laravel/PHP backends to handle PUT requests
      formData.append('_method', 'PUT');

      const response = await axios.post(
        `${baseURL}/api/vendor/product/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const isSuccess = response.data?.success === true || 
                       response.data?.status === 'success' ||
                       response.data?.message?.toLowerCase().includes('success');

      if (isSuccess) {
        return true;
      } else {
        throw new Error(response.data?.message || 'Failed to update product');
      }
    } catch (err: any) {
      console.error('Update product error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch single product by ID
  const fetchProductById = async (id: number): Promise<ProductFormData> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Try multiple possible endpoints (backend may use different patterns)
      const possibleEndpoints = [
        `/api/vendor/ecommerce/product/${id}`,  
        `/api/vendor/product/show/${id}`,       
        `/api/vendor/product/details/${id}`,    
        `/api/vendor/product/${id}`            
      ];

      let lastError: any;

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`🔄 Trying endpoint: ${endpoint}`);
          
          const response = await axios.get(
            `${baseURL}${endpoint}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          console.log(`✅ Success with endpoint: ${endpoint}`);
          console.log('Response data:', response.data);

          const productData = response.data?.data || response.data;

          // Transform API response to form data structure
          const formData: ProductFormData = {
            product_title_english: productData.product_title_english || '',
            product_title_bangla: productData.product_title_bangla || '',
            category_id: productData.category_id || productData.category?.id || 0,
            subcategory_id: productData.subcategory_id || productData.subcategory?.id || 0,
            short_description_english: productData.short_description_english || '',
            short_description_bangla: productData.short_description_bangla || '',
            long_description_english: productData.long_description_english || '',
            long_description_bangla: productData.long_description_bangla || '',
            seller_price: parseFloat(productData.seller_price) || 0,
            regular_price: parseFloat(productData.regular_price) || 0,
            offer_price: parseFloat(productData.offer_price) || 0,
            sku: productData.sku || '',
            stock: parseInt(productData.stock) || 0,
            video_link: productData.video_link || '',
            status: productData.status === 1 ? 1 : 0,
            images: [], // No new images initially in edit mode
            existing_images: [
              productData.product_image,
              ...(productData.gallery_images || [])
            ].filter(Boolean),
            removed_images: []
          };

          return formData;
        } catch (err: any) {
          console.warn(`❌ Failed with endpoint ${endpoint}:`, err.response?.status || err.message);
          lastError = err;
          // Continue to next endpoint
        }
      }

      // All endpoints failed
      console.error('❌ All endpoints failed. Last error:', lastError.response?.data);
      throw new Error(
        lastError.response?.data?.message || 
        'Failed to fetch product. Backend endpoint may not be implemented yet. Please check the console for tried endpoints.'
      );
    } catch (err: any) {
      console.error('Fetch product error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createProduct,
    updateProduct,
    fetchProductById,
    isLoading,
    error,
  };
}
