import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchemaWithValidation, ProductFormData } from '../validation/product.validation';
import { ImageUpload } from './ImageUpload';
import { CategorySelect } from './CategorySelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, Percent, Loader2 } from 'lucide-react';
import { generateSKU, calculateProfitMargin, calculateDiscount } from '../utils/helpers';
import { FormMode } from '../types/product.types';

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: FormMode;
}

export function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  mode
}: ProductFormProps) {
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.existing_images || []
  );
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchemaWithValidation),
    defaultValues: {
      product_title_english: initialData?.product_title_english || '',
      product_title_bangla: initialData?.product_title_bangla || '',
      category_id: initialData?.category_id || 0,
      subcategory_id: initialData?.subcategory_id || 0,
      short_description_english: initialData?.short_description_english || '',
      short_description_bangla: initialData?.short_description_bangla || '',
      long_description_english: initialData?.long_description_english || '',
      long_description_bangla: initialData?.long_description_bangla || '',
      seller_price: initialData?.seller_price || 0,
      regular_price: initialData?.regular_price || 0,
      offer_price: initialData?.offer_price || 0,
      sku: initialData?.sku || '',
      stock: initialData?.stock || 0,
      video_link: initialData?.video_link || '',
      status: initialData?.status !== undefined ? initialData.status : 1,
      images: [],
      existing_images: initialData?.existing_images || [],
      removed_images: [],
    },
  });

  // Watch price fields for calculations
  const sellerPrice = watch('seller_price');
  const regularPrice = watch('regular_price');
  const offerPrice = watch('offer_price');
  const productTitleEnglish = watch('product_title_english');

  // Calculate profit margin and discount
  const profitMargin = calculateProfitMargin(sellerPrice, offerPrice);
  const discount = calculateDiscount(regularPrice, offerPrice);

  // Auto-generate SKU handler
  const handleAutoGenerateSKU = () => {
    if (productTitleEnglish) {
      const sku = generateSKU(productTitleEnglish);
      setValue('sku', sku);
    }
  };

  // Handle image changes
  const handleImagesChange = (files: File[]) => {
    setNewImages(files);
    setValue('images', files);
  };

  // Handle existing image removal
  const handleExistingImageRemove = (index: number) => {
    const imageUrl = existingImages[index];
    const newExistingImages = existingImages.filter((_: any, i: number) => i !== index);
    setExistingImages(newExistingImages);
    setRemovedImages([...removedImages, imageUrl]);
    setValue('existing_images', newExistingImages);
    setValue('removed_images', [...removedImages, imageUrl]);
  };

  // Submit handler
  const onFormSubmit = async (data: ProductFormData) => {
    // Combine new and existing images
    const submitData = {
      ...data,
      images: newImages,
      existing_images: mode === 'edit' ? existingImages : undefined,
      removed_images: mode === 'edit' ? removedImages : undefined,
    };
    
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Product Title English */}
            <div>
              <Label htmlFor="product_title_english" className="font-semibold">
                Product Title (English) *
              </Label>
              <Input
                id="product_title_english"
                {...register('product_title_english')}
                placeholder="Enter product name in English"
                className={errors.product_title_english ? 'border-red-500' : ''}
              />
              {errors.product_title_english && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.product_title_english.message}
                </p>
              )}
            </div>

            {/* Product Title Bangla */}
            <div>
              <Label htmlFor="product_title_bangla" className="font-semibold">
                Product Title (Bangla) *
              </Label>
              <Input
                id="product_title_bangla"
                {...register('product_title_bangla')}
                placeholder="পণ্যের নাম বাংলায় লিখুন"
                className={errors.product_title_bangla ? 'border-red-500' : ''}
              />
              {errors.product_title_bangla && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.product_title_bangla.message}
                </p>
              )}
            </div>
          </div>

          {/* Category Selection */}
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <Controller
                name="subcategory_id"
                control={control}
                render={({ field: subField }) => (
                  <CategorySelect
                    categoryId={field.value}
                    subcategoryId={subField.value}
                    onCategoryChange={(value) => {
                      field.onChange(value);
                      subField.onChange(0);
                    }}
                    onSubcategoryChange={subField.onChange}
                    errors={{ category_id: errors.category_id, subcategory_id: errors.subcategory_id }}
                  />
                )}
              />
            )}
          />

          {/* SKU */}
          <div>
            <Label htmlFor="sku" className="font-semibold">
              SKU *
            </Label>
            <div className="flex gap-2">
              <Input
                id="sku"
                {...register('sku')}
                placeholder="Product SKU"
                className={errors.sku ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAutoGenerateSKU}
                disabled={!productTitleEnglish}
                className="shrink-0"
              >
                <Sparkles size={16} className="mr-2" />
                Auto
              </Button>
            </div>
            {errors.sku && (
              <p className="mt-1 text-xs text-red-500">{errors.sku.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Descriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Short Description English */}
            <div>
              <Label htmlFor="short_description_english" className="font-semibold">
                Short Description (English)
              </Label>
              <Textarea
                id="short_description_english"
                {...register('short_description_english')}
                placeholder="Brief product description in English"
                rows={3}
                className={errors.short_description_english ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500 mt-1">
                {watch('short_description_english')?.length || 0}/200 characters
              </p>
              {errors.short_description_english && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.short_description_english.message}
                </p>
              )}
            </div>

            {/* Short Description Bangla */}
            <div>
              <Label htmlFor="short_description_bangla" className="font-semibold">
                Short Description (Bangla)
              </Label>
              <Textarea
                id="short_description_bangla"
                {...register('short_description_bangla')}
                placeholder="সংক্ষিপ্ত পণ্য বিবরণ বাংলায়"
                rows={3}
                className={errors.short_description_bangla ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500 mt-1">
                {watch('short_description_bangla')?.length || 0}/200 characters
              </p>
              {errors.short_description_bangla && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.short_description_bangla.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Long Description English */}
            <div>
              <Label htmlFor="long_description_english" className="font-semibold">
                Long Description (English)
              </Label>
              <Textarea
                id="long_description_english"
                {...register('long_description_english')}
                placeholder="Detailed product description in English"
                rows={5}
                className={errors.long_description_english ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500 mt-1">
                {watch('long_description_english')?.length || 0}/1000 characters
              </p>
              {errors.long_description_english && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.long_description_english.message}
                </p>
              )}
            </div>

            {/* Long Description Bangla */}
            <div>
              <Label htmlFor="long_description_bangla" className="font-semibold">
                Long Description (Bangla)
              </Label>
              <Textarea
                id="long_description_bangla"
                {...register('long_description_bangla')}
                placeholder="বিস্তারিত পণ্য বিবরণ বাংলায়"
                rows={5}
                className={errors.long_description_bangla ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500 mt-1">
                {watch('long_description_bangla')?.length || 0}/1000 characters
              </p>
              {errors.long_description_bangla && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.long_description_bangla.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <TrendingUp size={20} />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Seller Price */}
            <div>
              <Label htmlFor="seller_price" className="font-semibold">
                Seller Price (Cost) *
              </Label>
              <Input
                id="seller_price"
                type="number"
                step="0.01"
                {...register('seller_price', { valueAsNumber: true })}
                placeholder="৳"
                className={errors.seller_price ? 'border-red-500' : ''}
              />
              {errors.seller_price && (
                <p className="mt-1 text-xs text-red-500">{errors.seller_price.message}</p>
              )}
            </div>

            {/* Regular Price */}
            <div>
              <Label htmlFor="regular_price" className="font-semibold">
                Regular Price (MRP) *
              </Label>
              <Input
                id="regular_price"
                type="number"
                step="0.01"
                {...register('regular_price', { valueAsNumber: true })}
                placeholder="৳"
                className={errors.regular_price ? 'border-red-500' : ''}
              />
              {errors.regular_price && (
                <p className="mt-1 text-xs text-red-500">{errors.regular_price.message}</p>
              )}
            </div>

            {/* Offer Price */}
            <div>
              <Label htmlFor="offer_price" className="font-semibold">
                Offer Price (Selling) *
              </Label>
              <Input
                id="offer_price"
                type="number"
                step="0.01"
                {...register('offer_price', { valueAsNumber: true })}
                placeholder="৳"
                className={errors.offer_price ? 'border-red-500' : ''}
              />
              {errors.offer_price && (
                <p className="mt-1 text-xs text-red-500">{errors.offer_price.message}</p>
              )}
            </div>
          </div>

          {/* Price Calculations Display */}
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Percent size={18} className="text-[#E8A87C]" />
              <div>
                <p className="text-xs text-gray-600">Discount</p>
                <p className="text-sm font-bold text-gray-900">{discount}% OFF</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[#C38D9E]" />
              <div>
                <p className="text-xs text-gray-600">Profit Margin</p>
                <p className="text-sm font-bold text-gray-900">
                  {profitMargin >= 0 ? '+' : ''}{profitMargin.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Stock */}
            <div>
              <Label htmlFor="stock" className="font-semibold">
                Stock Quantity *
              </Label>
              <Input
                id="stock"
                type="number"
                {...register('stock', { valueAsNumber: true })}
                placeholder="Available quantity"
                className={errors.stock ? 'border-red-500' : ''}
              />
              {errors.stock && (
                <p className="mt-1 text-xs text-red-500">{errors.stock.message}</p>
              )}
            </div>

            {/* Video Link */}
            <div>
              <Label htmlFor="video_link" className="font-semibold">
                Video Link (Optional)
              </Label>
              <Input
                id="video_link"
                {...register('video_link')}
                placeholder="https://youtube.com/watch?v=..."
                className={errors.video_link ? 'border-red-500' : ''}
              />
              {errors.video_link && (
                <p className="mt-1 text-xs text-red-500">{errors.video_link.message}</p>
              )}
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="status" className="font-semibold">
                Product Status
              </Label>
              <p className="text-xs text-gray-500">
                {watch('status') === 1 ? 'Active - Visible to customers' : 'Inactive - Hidden from customers'}
              </p>
            </div>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value === 1}
                  onCheckedChange={(checked: boolean) => field.onChange(checked ? 1 : 0)}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Media Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Product Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            images={newImages}
            existingImages={existingImages}
            onImagesChange={handleImagesChange}
            onExistingImagesRemove={mode === 'edit' ? handleExistingImageRemove : undefined}
            maxImages={5}
          />
          {errors.images && (
            <p className="mt-2 text-sm text-red-500">{errors.images.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 sm:flex-none px-8 py-3 bg-[#E8A87C] hover:bg-[#C38D9E] text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#E8A87C]/30 hover:shadow-[#C38D9E]/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : mode === 'add' ? (
            'Add Product'
          ) : (
            'Update Product'
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
