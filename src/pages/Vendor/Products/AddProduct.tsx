import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddProductForm } from './components/AddProductForm';
import { useProductMutation } from './hooks/useProductMutation';
import { ProductFormData } from './types/product.types';

export default function AddProduct() {
  const navigate = useNavigate();
  const { createProduct, isLoading } = useProductMutation();

  console.log('🟢 [ADD PAGE] AddProduct component rendered');

  const handleSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      console.log('📊 === SUBMITTING PRODUCT (ADD MODE) ===');
      console.log('📋 Full form data received:', data);
      console.log('🖼️ Main images array:', data.images);
      console.log('📸 Gallery images array:', data.gallery_images);

      // Append all text fields
      Object.keys(data).forEach((key) => {
        if (key !== 'images' && key !== 'gallery_images') {
          const value = data[key as keyof ProductFormData];
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        }
      });

      // Handle main image - API expects 'product_image' for main image
      if (data.images && data.images.length > 0) {
        formData.append('product_image', data.images[0]);
        console.log('✅ Added main product_image:', data.images[0].name);
      }

      // Handle gallery images - API expects 'gal_img[]'
      const galleryImages = data.gallery_images || [];
      console.log('📸 Processing gallery images:', galleryImages.length, 'files');
      
      if (galleryImages && galleryImages.length > 0) {
        console.log('📸 Gallery images to send:', galleryImages.map((g: File) => g.name));
        for (let i = 0; i < galleryImages.length; i++) {
          formData.append('gal_img[]', galleryImages[i]);
          console.log(`  ➕ Added gallery image ${i + 1} with field name 'gal_img[]':`, galleryImages[i].name);
        }
      } else {
        console.warn('⚠️ No gallery images found in form data!');
      }

      console.log('\n📦 === FORMDATA CONTENTS ===');
      console.log('Total keys:', Array.from(formData.keys()).length);
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1] instanceof File ? `📁 File: ${pair[1].name}` : pair[1]);
      }
      console.log('=========================\n');

      const success = await createProduct(formData);

      if (success) {
        toast.success('Product created successfully!');
        navigate('/vendor/dashboard/products');
      } else {
        toast.error('Failed to create product');
      }
    } catch (err: any) {
      console.error('❌ Create product error:', err);
      console.error('Error response:', err.response?.data);
      // Error is already shown by useProductMutation
    }
  };

  const handleCancel = () => {
    navigate('/vendor/dashboard/products');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Add New Product
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new product listing for your store
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
      <AddProductForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
