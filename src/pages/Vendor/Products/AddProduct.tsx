import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductForm } from './components/ProductForm';
import { useProductMutation } from './hooks/useProductMutation';
import { ProductFormData } from './types/product.types';

export default function AddProduct() {
  const navigate = useNavigate();
  const { createProduct, isLoading } = useProductMutation();

  const handleSubmit = async (data: ProductFormData) => {
    try {
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

      console.log('Submitting product data...');
      console.log('Form data keys:', Array.from(formData.keys()));
      console.log('Number of images:', data.images.length);
      console.log('Has product_image:', formData.has('product_image'));

      const success = await createProduct(formData);

      if (success) {
        toast.success('Product created successfully!');
        navigate('/vendor/dashboard/products');
      } else {
        toast.error('Failed to create product');
      }
    } catch (err: any) {
      console.error('Create product error:', err);
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
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        mode="add"
      />
    </div>
  );
}
