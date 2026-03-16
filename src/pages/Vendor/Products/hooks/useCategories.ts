import { useState, useCallback } from 'react';
import axios from 'axios';
import { Category, Subcategory } from '../types/product.types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
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

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      const response = await axios.get(`${baseURL}/api/vendor/ecommerce/categories`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      const rawData = response.data?.data || [];
      const mappedCategories: Category[] = rawData.map((item: any) => ({
        id: item.id,
        category_name: item.category_name || 'Category',
        category_name_bangla: item.category_name_bangla || item.category_name,
        category_slug: item.category_slug,
        category_image: item.category_image
      }));

      setCategories(mappedCategories);
      return mappedCategories;
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load categories';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [baseURL]);

  // Fetch subcategories by category ID
  const fetchSubcategories = useCallback(async (categoryId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      const response = await axios.get(
        `${baseURL}/api/vendor/ecommerce/subcategories?category_id=${categoryId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          }
        }
      );

      const rawData = response.data?.data || [];
      const mappedSubcategories: Subcategory[] = rawData.map((item: any) => ({
        id: item.id,
        category_id: item.category_id,
        subcategory_name: item.subcategory_name || 'Subcategory',
        subcategory_name_bangla: item.subcategory_name_bangla || item.subcategory_name,
        subcategory_slug: item.subcategory_slug
      }));

      setSubcategories(mappedSubcategories);
      return mappedSubcategories;
    } catch (err: any) {
      console.error('Failed to fetch subcategories:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load subcategories';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [baseURL]);

  // Clear subcategories when category changes
  const clearSubcategories = useCallback(() => {
    setSubcategories([]);
  }, []);

  return {
    categories,
    subcategories,
    isLoading,
    error,
    fetchCategories,
    fetchSubcategories,
    clearSubcategories,
  };
}
