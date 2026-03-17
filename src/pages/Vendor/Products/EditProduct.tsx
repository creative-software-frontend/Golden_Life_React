import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductForm } from './components/ProductForm';
import { useProductMutation } from './hooks/useProductMutation';
import { ProductFormData } from './types/product.types';
import axios from 'axios';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchProductById, updateProduct, isLoading: mutationLoading } = useProductMutation();
  const [productData, setProductData] = useState<ProductFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper functions
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        toast.error('Product ID is required');
        navigate('/vendor/dashboard/products');
        return;
      }

      try {
        console.log('🔄 Fetching product with ID:', id);
        
        const token = getAuthToken();
        
        const response = await axios.get(
          `${baseURL}/api/vendor/product/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            params: {
              product_id: Number(id)
            }
          }
        );

        console.log('✅ Product fetched successfully');
        
        // Extract product from response
        if (response.data?.data?.product) {
          const product = response.data.data.product;
          const gallery = response.data.data.gallery || [];
          
          // Convert API response to form data
          const formData: ProductFormData = {
            product_title_english: product.product_title_english,
            product_title_bangla: product.product_title_bangla,
            category_id: product.category_id,
            subcategory_id: product.subcategory_id,
            short_description_english: product.short_description_english,
            short_description_bangla: product.short_description_bangla,
            long_description_english: product.long_description_english,
            long_description_bangla: product.long_description_bangla,
            seller_price: parseFloat(product.seller_price) || 0,
            regular_price: parseFloat(product.regular_price) || 0,
            offer_price: parseFloat(product.offer_price) || 0,
            sku: product.sku,
            stock: parseInt(product.stock) || 0,
            video_link: product.video_link || undefined,
            ebook: product.ebook || '0', // Include ebook field
            images: [],
            existing_images: [
              product.product_image,
              ...gallery.map((g: any) => g.gal_img)
            ].filter(Boolean),
            removed_images: []
          };
          
          setProductData(formData);
          console.log('Form data loaded successfully');
        } else {
          throw new Error('Product data not found in response');
        }
        
      } catch (err: any) {
        console.error('❌ Fetch product error:', err);
        console.error('Error response:', err.response?.data);
        
        let errorMessage = 'Failed to load product for editing';
        
        if (err.response?.status === 404) {
          errorMessage = 'Product not found.';
        } else if (err.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (err.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        toast.error(errorMessage);
        setTimeout(() => {
          navigate('/vendor/dashboard/products');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, fetchProductById, navigate]);

  const handleSubmit = async (data: ProductFormData) => {
    try {
      if (!id) {
        throw new Error('Product ID is missing');
      }

      const formData = new FormData();

      // Append all text fields
      Object.keys(data).forEach((key) => {
        if (key !== 'images' && key !== 'existing_images' && key !== 'removed_images') {
          const value = data[key as keyof ProductFormData];
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        }
      });

      // Handle images - API expects 'product_image' for main image
      if (data.images && data.images.length > 0) {
        // Send first image as 'product_image' (required field)
        formData.append('product_image', data.images[0]);
        
        // Send remaining images as gallery
        if (data.images.length > 1) {
          for (let i = 1; i < data.images.length; i++) {
            formData.append('gallery_images[]', data.images[i]);
          }
        }
      }

      // Append existing images to keep
      if (data.existing_images && data.existing_images.length > 0) {
        formData.append('existing_images', JSON.stringify(data.existing_images));
      }

      // Append removed images
      if (data.removed_images && data.removed_images.length > 0) {
        formData.append('removed_images', JSON.stringify(data.removed_images));
      }

      console.log('Updating product...', id);
      console.log('Form data keys:', Array.from(formData.keys()));
      console.log('Has product_image:', formData.has('product_image'));

      const success = await updateProduct(Number(id), formData);

      if (success) {
        toast.success('Product updated successfully!');
        navigate('/vendor/dashboard/products');
      } else {
        toast.error('Failed to update product');
      }
    } catch (err: any) {
      console.error('Update product error:', err);
      // Error is already shown by useProductMutation
    }
  };

  const handleCancel = () => {
    navigate('/vendor/dashboard/products');
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 size={48} className="animate-spin text-[#E8A87C] mx-auto" />
          <p className="text-gray-600 font-semibold">Loading product...</p>
        </div>
      </div>
    );
  }

  // Always show form (with real or mock data)
  if (!productData) {
    // This should never happen now due to mock fallback
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600 font-semibold">Product not found</p>
          <Button onClick={() => navigate('/vendor/dashboard/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Edit Product
          </h1>
          <p className="text-sm text-muted-foreground">
            Update product information and images
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleCancel}
          className="hidden sm:flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Button>
      </div>

      {/* Product Form */}
      <ProductForm
        initialData={productData}
        onSubmit={handleSubmit}
        isLoading={mutationLoading}
        mode="edit"
      />
    </div>
  );
}
