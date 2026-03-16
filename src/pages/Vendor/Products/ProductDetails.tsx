import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Loader2, Package, Tag, DollarSign, Hash, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { getMockProduct } from './utils/mockData';

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
  gallery_images?: string[];
  category_name?: string;
  subcategory_name?: string;
  short_description_english?: string;
  short_description_bangla?: string;
  long_description_english?: string;
  long_description_bangla?: string;
  video_link?: string;
  created_at: string;
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  // Helper functions for safe formatting
  const formatPrice = (price: number | undefined | null): string => {
    if (price === undefined || price === null) return '0.00';
    return `৳ ${price.toFixed(2)}`;
  };

  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null) return '0';
    return num.toString();
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

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
        console.log('🔄 Fetching product details for ID:', id);
        console.log('Product ID from URL:', id);
        
        const token = getAuthToken();
        
        // Use query parameter format instead of URL segment
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

        console.log('✅ Product details fetched successfully');
        console.log('Response data:', response.data);
        
        // Handle different response structures
        let productData = response.data?.data || response.data?.product || response.data;
        
        // Check if status field exists in response
        if (response.data?.status === true || response.data?.success === true) {
          productData = response.data?.data || response.data?.product || productData;
        }
        
        setProduct(productData);
        setIsDemoMode(false); // Real data loaded
        console.log('ℹ️ Using real API data');
      } catch (err: any) {
        console.error('❌ Fetch product details error:', err);
        console.error('Error response:', err.response?.data);
        
        // Instead of showing error and redirecting, use mock data
        console.warn('⚠️ API failed - switching to demo mode with mock data');
        
        const mockProduct = getMockProduct(Number(id));
        setProduct(mockProduct);
        setIsDemoMode(true);
        
        toast.warning('API unavailable - showing demo data', {
          autoClose: 5000,
          position: 'top-right'
        });
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

  // Always show product (real or mock)
  if (!product) {
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
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="font-bold text-amber-800 dark:text-amber-400">
                  🎭 Demo Mode Active
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-500">
                  API is unavailable. Showing <strong>mock product data</strong> for demonstration purposes. All information displayed is sample data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
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
                  src={product.product_image && (product.product_image.startsWith('http') 
                    ? product.product_image 
                    : `${baseURL}/uploads/ecommarce/product_image/${product.product_image}`)
                  }
                  alt={product.product_title_english}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load product image');
                    e.currentTarget.src = '/assets/default-vendor.png'; // Fallback image
                  }}
                />
              </div>
              
              {/* Gallery Images */}
              {product.gallery_images && product.gallery_images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Gallery Images</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {product.gallery_images.filter(Boolean).map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden border border-gray-200"
                      >
                        <img
                          src={image && (image.startsWith('http')
                            ? image
                            : `${baseURL}/uploads/ecommarce/product_image/${image}`)
                          }
                          alt={`${product.product_title_english} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Failed to load gallery image');
                            e.currentTarget.src = '/assets/default-vendor.png'; // Fallback image
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                  {formatPrice(product.seller_price)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Regular Price (MRP)</label>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(product.regular_price)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Offer Price</label>
                <p className="text-lg font-bold text-green-600">
                  {formatPrice(product.offer_price)}
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
                <p className="text-2xl font-bold">{formatNumber(product.stock)}</p>
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

          {/* Descriptions */}
          {(product.short_description_english || product.long_description_english || 
            product.short_description_bangla || product.long_description_bangla) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Product Descriptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.short_description_english && (
                  <div>
                    <label className="text-xs text-gray-500">Short Description (English)</label>
                    <p className="text-sm text-gray-700 mt-1">{product.short_description_english}</p>
                  </div>
                )}
                {product.short_description_bangla && (
                  <div>
                    <label className="text-xs text-gray-500">Short Description (Bangla)</label>
                    <p className="text-sm text-gray-700 mt-1">{product.short_description_bangla}</p>
                  </div>
                )}
                {product.long_description_english && (
                  <div>
                    <label className="text-xs text-gray-500">Long Description (English)</label>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{product.long_description_english}</p>
                  </div>
                )}
                {product.long_description_bangla && (
                  <div>
                    <label className="text-xs text-gray-500">Long Description (Bangla)</label>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{product.long_description_bangla}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Video Link */}
          {product.video_link && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Product Video</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={product.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Product Video
                </a>
              </CardContent>
            </Card>
          )}

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
                  {formatDate(product.created_at)}
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
