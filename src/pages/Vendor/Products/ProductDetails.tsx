import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Loader2, Package, Tag, DollarSign, Hash, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

interface ProductDetailsData {
  id: number;
  product_title_english: string;
  product_title_bangla: string;
  sku: string;
  seller_price: number;
  regular_price: number;
  offer_price: number;
  stock: number;
  status: 0 | 1;
  product_image: string;
  category_name?: string;
  subcategory_name?: string;
  created_at: string;
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  // Get auth token
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

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        toast.error('Product ID is required');
        navigate('/vendor/dashboard/products');
        return;
      }

      try {
        const token = getAuthToken();
        const response = await axios.get(
          `${baseURL}/api/vendor/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Product details response:', response.data);
        const productData = response.data?.data || response.data;
        setProduct(productData);
      } catch (err: any) {
        console.error('Fetch product error:', err);
        toast.error(err.response?.data?.message || 'Failed to load product details');
        navigate('/vendor/dashboard/products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, baseURL, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 size={48} className="animate-spin text-[#E8A87C] mx-auto" />
          <p className="text-gray-600 font-semibold">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
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
            Product Details
          </h1>
          <p className="text-sm text-muted-foreground">
            View complete information about this product
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/vendor/dashboard/products')}
          className="hidden sm:flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Button>
      </div>

      {/* Product Details Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Image & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Product Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                <img
                  src={product.product_image.startsWith('http') 
                    ? product.product_image 
                    : `${baseURL}/uploads/ecommarce/product_image/${product.product_image}`
                  }
                  alt={product.product_title_english}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {/* Status & SKU */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Basic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Status</span>
                <Badge variant={product.status === 1 ? 'default' : 'secondary'}>
                  {product.status === 1 ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Hash size={16} className="text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">SKU</p>
                  <p className="text-sm font-semibold">{product.sku}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Titles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Product Names</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">English Name</label>
                <p className="text-base font-semibold">{product.product_title_english}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Bangla Name</label>
                <p className="text-base font-semibold">{product.product_title_bangla}</p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <DollarSign size={20} />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Seller Price (Cost)</label>
                <p className="text-lg font-bold text-[#E8A87C]">
                  ৳ {product.seller_price.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Regular Price (MRP)</label>
                <p className="text-lg font-bold text-gray-900">
                  ৳ {product.regular_price.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Offer Price</label>
                <p className="text-lg font-bold text-green-600">
                  ৳ {product.offer_price.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stock & Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Inventory & Category</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-gray-500" />
                  <label className="text-xs text-gray-500">Stock Available</label>
                </div>
                <p className="text-2xl font-bold">{product.stock}</p>
                <p className="text-xs text-gray-500">units</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-gray-500" />
                  <label className="text-xs text-gray-500">Category</label>
                </div>
                <p className="text-sm font-semibold">
                  {product.category_name || 'N/A'}
                </p>
                {product.subcategory_name && (
                  <p className="text-xs text-gray-500">
                    → {product.subcategory_name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Created Date */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar size={20} />
                Listing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Created At</label>
                <p className="text-sm font-semibold">
                  {new Date(product.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={() => navigate(`/vendor/dashboard/products/edit/${id}`)}
              className="flex-1 sm:flex-none px-6 py-3 bg-[#E8A87C] hover:bg-[#C38D9E] text-white font-bold rounded-xl transition-all duration-300"
            >
              Edit This Product
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/vendor/dashboard/products')}
              className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold rounded-xl transition-all duration-300"
            >
              Back to List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
