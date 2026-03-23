import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductForm } from './components/ProductForm';
import { useProductMutation } from './hooks/useProductMutation';
import { ProductFormData } from './types/product.types';
import axios from 'axios';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateProduct, isLoading: mutationLoading } = useProductMutation();
  const [productData, setProductData] = useState<ProductFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

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

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        toast.error('Product ID is required');
        navigate('/vendor/dashboard/products');
        return;
      }

      try {
        setIsLoading(true);
        setFetchError(null);
        
        console.log('1. Fetching product with ID:', id);
        
        const token = getAuthToken();
        console.log('2. Auth token present:', token ? 'Yes' : 'No');
        
        if (!token) {
          throw new Error('Authentication required. Please login again.');
        }
        
        console.log('3. Making API call to:', `${baseURL}/api/vendor/product/details`);
        const response = await axios.get(`${baseURL}/api/vendor/product/details`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { product_id: Number(id) }
        });

        console.log('4. API Response status:', response.status);
        console.log('5. API Response data:', response.data);

        let product = null;
        let gallery = [];
        
        if (response.data?.data?.product) {
          console.log('6. Found product in response.data.data.product');
          product = response.data.data.product;
          gallery = response.data.data.gallery || [];
        } else if (response.data?.product) {
          console.log('6. Found product in response.data.product');
          product = response.data.product;
        } else if (response.data?.data) {
          console.log('6. Found product in response.data.data');
          product = response.data.data;
        } else {
          console.log('6. Unknown response structure');
          throw new Error('Product data not found in response');
        }
        
        console.log('7. Extracted product:', product);
        console.log('8. Gallery images:', gallery.length);

        const formData: ProductFormData = {
          product_title_english: product.product_title_english || '',
          product_title_bangla: product.product_title_bangla || '',
          category_id: product.category_id || 0,
          subcategory_id: product.subcategory_id || 0,
          short_description_english: product.short_description_english || '',
          short_description_bangla: product.short_description_bangla || '',
          long_description_english: product.long_description_english || '',
          long_description_bangla: product.long_description_bangla || '',
          seller_price: parseFloat(product.seller_price) || 0,
          regular_price: parseFloat(product.regular_price) || 0,
          offer_price: parseFloat(product.offer_price) || 0,
          sku: product.sku || '',
          stock: parseInt(product.stock) || 0,
          video_link: product.video_link || '',
          ebook: product.ebook || '0',
          images: [],
          existing_images: [
            product.product_image,
            ...gallery.map((g: any) => g.gal_img)
          ].filter(Boolean),
          removed_images: []
        };
        
        console.log('9. Form data prepared successfully');
        setProductData(formData);
        
      } catch (err: any) {
        console.error('10. Fetch product error:', err);
        console.error('11. Error response:', err.response?.data);
        
        let errorMessage = 'Failed to load product for editing';
        if (err.response?.status === 404) {
          errorMessage = 'Product not found.';
        } else if (err.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (err.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        setFetchError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (data: ProductFormData) => {
    console.log('===================');
    console.log('SUBMIT BUTTON CLICKED');
    console.log('===================');
    console.log('Data received from form:', data);
    
    try {
      if (!id) {
        console.error('No product ID found');
        throw new Error('Product ID is missing');
      }
      console.log('Product ID:', id);

      const formData = new FormData();

      console.log('Building FormData:');
      Object.keys(data).forEach((key) => {
        if (key !== 'images' && key !== 'existing_images' && key !== 'removed_images') {
          const value = data[key as keyof ProductFormData];
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
            console.log(`  Added ${key}: ${value}`);
          }
        }
      });

      if (data.images && data.images.length > 0) {
        console.log(`  Added product_image: ${data.images[0].name}`);
        formData.append('product_image', data.images[0]);
        if (data.images.length > 1) {
          for (let i = 1; i < data.images.length; i++) {
            console.log(`  Added gallery image ${i}: ${data.images[i].name}`);
            formData.append('gallery_images[]', data.images[i]);
          }
        }
      }

      if (data.existing_images && data.existing_images.length > 0) {
        console.log(`  Added existing_images:`, data.existing_images);
        formData.append('existing_images', JSON.stringify(data.existing_images));
      }

      if (data.removed_images && data.removed_images.length > 0) {
        console.log(`  Added removed_images:`, data.removed_images);
        formData.append('removed_images', JSON.stringify(data.removed_images));
      }

      console.log('Calling updateProduct function...');
      const success = await updateProduct(Number(id), formData);
      console.log('Update result:', success);

      if (success) {
        toast.success('Product updated successfully!');
        navigate('/vendor/dashboard/products');
      } else {
        toast.error('Failed to update product');
      }
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      toast.error(err.message || 'Failed to update product');
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
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !productData) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
        <Button variant="outline" onClick={handleCancel} className="mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Products
        </Button>
        
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Product</h3>
              <p className="text-red-700">{fetchError || 'Product not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Edit Product
          </h1>
          <p className="text-sm text-muted-foreground">
            Update product information and images
          </p>
        </div>
        <Button variant="outline" onClick={handleCancel} className="hidden sm:flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Products
        </Button>
      </div>

      <ProductForm
        initialData={productData}
        onSubmit={handleSubmit}
        isLoading={mutationLoading}
        mode="edit"
      />
    </div>
  );
}