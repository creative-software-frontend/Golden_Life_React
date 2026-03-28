import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddProductForm } from './components/AddProductForm';
import { useProductMutation } from './hooks/useProductMutation';
import { ProductFormData } from './types/product.types';
import { useProfile } from '../Profile/hooks/useProfile';
import { useProfileCompletion } from '../../../hooks/useProfileCompletion';

export default function AddProduct() {
  const navigate = useNavigate();
  const { createProduct, isLoading } = useProductMutation();
  const { data: profileData } = useProfile();
  const { percentage, missingFields, isComplete } = useProfileCompletion(profileData?.vendor);

  console.log('🟢 [ADD PAGE] AddProduct component rendered');

  // Check if profile is complete
  if (!isComplete) {
    const handleBlockedSubmit = () => {
      toast.error(
        <div>
          <p className="font-bold mb-1">⚠️ Profile Incomplete</p>
          <p className="text-sm">Please complete your profile first. Missing fields: {missingFields.join(', ')}</p>
        </div>
      );
      navigate('/vendor/dashboard/profile');
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
              Complete your profile to add products
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

        {/* Blocked State */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-900 mb-2">
            Profile Completion Required
          </h2>
          <p className="text-amber-700 mb-6">
            You need to complete your profile before adding products. Your profile is currently 
            <span className="font-bold"> {percentage}% complete</span>.
          </p>
          
          <div className="bg-white rounded-xl p-4 mb-6 border border-amber-200">
            <h3 className="font-bold text-amber-900 mb-3 text-left">Missing Required Fields:</h3>
            <ul className="space-y-2 text-left">
              {missingFields.map((field, index) => (
                <li key={index} className="flex items-start gap-2 text-amber-800">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                  {field}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleBlockedSubmit}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-amber-600/30"
            >
              Complete Profile Now
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/vendor/dashboard/products')}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
