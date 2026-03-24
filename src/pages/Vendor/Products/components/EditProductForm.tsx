import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchemaWithValidation, ProductFormData } from '../validation/product.validation';
import { CategorySelect } from './CategorySelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Sparkles, TrendingUp, Percent, Loader2, Upload, X, Youtube, Link2 } from 'lucide-react';
import { generateSKU, calculateProfitMargin, calculateDiscount } from '../utils/helpers';

interface EditProductFormProps {
  initialData: ProductFormData;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function EditProductForm({ initialData, onSubmit, isLoading }: EditProductFormProps) {
  // State for tracking images
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>(
    initialData?.existing_images?.slice(1) || []
  );
  const [removedGalleryImages, setRemovedGalleryImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'short-en' | 'short-bn' | 'long-en' | 'long-bn'>('short-en');
  const [isEbook, setIsEbook] = useState(initialData?.ebook === '1');

  console.log('🔵 [EDIT FORM] EditProductForm rendered');
  console.log('📊 [EDIT FORM] Initial data received:', initialData);
  console.log('🖼️ [EDIT FORM] Existing gallery images:', existingGalleryImages.length);

  // Update state when initialData changes
  useEffect(() => {
    if (initialData?.existing_images) {
      const galleryImgs = initialData.existing_images.slice(1);
      setExistingGalleryImages(galleryImgs);
    }
    if (initialData?.ebook) {
      setIsEbook(initialData.ebook === '1');
    }
  }, [initialData]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchemaWithValidation) as any, 
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
      ebook: initialData?.ebook || '0', 
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

  // Handle main image change
  const handleMainImageChange = (file: File | null) => {
    setMainImage(file);
    if (file) {
      setValue('images', [file]);
    } else {
      setValue('images', []);
    }
  };

  // Handle gallery images change
  const handleGalleryImagesChange = (files: File[]) => {
    setGalleryImages(files);
  };

  // Handle existing gallery image removal
  const handleExistingGalleryImageRemove = (index: number) => {
    const imageUrl = existingGalleryImages[index];
    const newExistingImages = existingGalleryImages.filter((_, i) => i !== index);
    setExistingGalleryImages(newExistingImages);
    const newRemovedImages = [...removedGalleryImages, imageUrl];
    setRemovedGalleryImages(newRemovedImages);
    setValue('removed_images', newRemovedImages);
  };

  // Submit handler
  const onFormSubmit = async (data: ProductFormData) => {
    console.log('🔴 [EDIT FORM] onFormSubmit CALLED');
    
    // Prepare submit data for EDIT mode
    const submitData: any = {
      ...data,
      images: mainImage ? [mainImage] : [],
      gallery_images: galleryImages,
      existing_gallery_images: existingGalleryImages,
      removed_gallery_images: removedGalleryImages,
    };

    console.log('📦 [EDIT FORM] Submit data prepared:');
    console.log('  - Main images:', submitData.images?.length || 0);
    console.log('  - New gallery images:', submitData.gallery_images?.length || 0);
    console.log('  - Existing gallery images:', submitData.existing_gallery_images?.length || 0);
    console.log('  - Removed gallery images:', submitData.removed_gallery_images?.length || 0);
    
    await onSubmit(submitData);
  };

  // Reset form to initial values
  const handleReset = () => {
    setMainImage(null);
    setGalleryImages([]);
    setExistingGalleryImages(initialData?.existing_images?.slice(1) || []);
    setRemovedGalleryImages([]);
    setActiveTab('short-en');
    setIsEbook(initialData?.ebook === '1');
    
    setValue('product_title_english', initialData?.product_title_english || '');
    setValue('product_title_bangla', initialData?.product_title_bangla || '');
    setValue('category_id', initialData?.category_id || 0);
    setValue('subcategory_id', initialData?.subcategory_id || 0);
    setValue('short_description_english', initialData?.short_description_english || '');
    setValue('short_description_bangla', initialData?.short_description_bangla || '');
    setValue('long_description_english', initialData?.long_description_english || '');
    setValue('long_description_bangla', initialData?.long_description_bangla || '');
    setValue('seller_price', initialData?.seller_price || 0);
    setValue('regular_price', initialData?.regular_price || 0);
    setValue('offer_price', initialData?.offer_price || 0);
    setValue('sku', initialData?.sku || '');
    setValue('stock', initialData?.stock || 0);
    setValue('video_link', initialData?.video_link || '');
    setValue('ebook', initialData?.ebook || '0'); 
    setValue('images', []);
    setValue('existing_images', initialData?.existing_images || []);
    setValue('removed_images', []);
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

          <div>
            <Label htmlFor="sku" className="font-semibold">SKU *</Label>
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
            {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Descriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="short-en">Short EN</TabsTrigger>
              <TabsTrigger value="short-bn">Short BN</TabsTrigger>
              <TabsTrigger value="long-en">Long EN</TabsTrigger>
              <TabsTrigger value="long-bn">Long BN</TabsTrigger>
            </TabsList>

            <TabsContent value="short-en" className="space-y-2">
              <Label htmlFor="short_description_english">Short Description (English)</Label>
              <Textarea
                id="short_description_english"
                {...register('short_description_english')}
                placeholder="Brief product description in English"
                rows={4}
                className={errors.short_description_english ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500">
                {watch('short_description_english')?.length || 0}/200 characters
              </p>
            </TabsContent>

            <TabsContent value="short-bn" className="space-y-2">
              <Label htmlFor="short_description_bangla">Short Description (Bangla)</Label>
              <Textarea
                id="short_description_bangla"
                {...register('short_description_bangla')}
                placeholder="সংক্ষিপ্ত পণ্য বিবরণ বাংলায়"
                rows={4}
                className={errors.short_description_bangla ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500">
                {watch('short_description_bangla')?.length || 0}/200 characters
              </p>
            </TabsContent>

            <TabsContent value="long-en" className="space-y-2">
              <Label htmlFor="long_description_english">Long Description (English)</Label>
              <Textarea
                id="long_description_english"
                {...register('long_description_english')}
                placeholder="Detailed product description in English"
                rows={6}
                className={errors.long_description_english ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500">
                {watch('long_description_english')?.length || 0}/1000 characters
              </p>
            </TabsContent>

            <TabsContent value="long-bn" className="space-y-2">
              <Label htmlFor="long_description_bangla">Long Description (Bangla)</Label>
              <Textarea
                id="long_description_bangla"
                {...register('long_description_bangla')}
                placeholder="বিস্তারিত পণ্য বিবরণ বাংলায়"
                rows={6}
                className={errors.long_description_bangla ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500">
                {watch('long_description_bangla')?.length || 0}/1000 characters
              </p>
            </TabsContent>
          </Tabs>
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
            <div>
              <Label htmlFor="seller_price">Seller Price (Cost) *</Label>
              <Input
                id="seller_price"
                type="number"
                step="0.01"
                {...register('seller_price', { valueAsNumber: true })}
                placeholder="৳"
                className={errors.seller_price ? 'border-red-500' : ''}
              />
            </div>

            <div>
              <Label htmlFor="regular_price">Regular Price (MRP) *</Label>
              <Input
                id="regular_price"
                type="number"
                step="0.01"
                {...register('regular_price', { valueAsNumber: true })}
                placeholder="৳"
                className={errors.regular_price ? 'border-red-500' : ''}
              />
            </div>

            <div>
              <Label htmlFor="offer_price">Offer Price (Selling) *</Label>
              <Input
                id="offer_price"
                type="number"
                step="0.01"
                {...register('offer_price', { valueAsNumber: true })}
                placeholder="৳"
                className={errors.offer_price ? 'border-red-500' : ''}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Percent size={18} className="text-primary-light" />
              <div>
                <p className="text-xs text-gray-600">Discount</p>
                <p className="text-sm font-bold text-gray-900">{discount}% OFF</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-primary-dark" />
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
            <div>
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                {...register('stock', { valueAsNumber: true })}
                placeholder="Available quantity"
                className={errors.stock ? 'border-red-500' : ''}
              />
              {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* E-Book Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">E-Book Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <Label htmlFor="ebook-toggle" className="font-semibold cursor-pointer">
                  This is an E-Book
                </Label>
                <p className="text-xs text-gray-500">
                  Enable this if the product is a digital e-book
                </p>
              </div>
            </div>
            <Switch
              id="ebook-toggle"
              checked={isEbook}
              onCheckedChange={(checked) => {
                setIsEbook(checked);
                setValue('ebook', checked ? '1' : '0');
                if (!checked) setValue('video_link', '');
              }}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          {isEbook && (
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/50 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Youtube className="w-4 h-4 text-blue-600" />
                <Link2 className="w-4 h-4 text-blue-600" />
                <Label htmlFor="video_link" className="font-semibold text-blue-900">
                  Video Link / Download URL
                </Label>
              </div>
              <Input
                id="video_link"
                {...register('video_link')}
                placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
                className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-blue-700">
                Add YouTube video link or Google Drive download URL for the e-book
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Media Upload */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Main Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Upload size={20} />
              Main Product Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 flex-shrink-0">
                {mainImage ? (
                  <img src={URL.createObjectURL(mainImage)} alt="Main product" className="w-full h-full object-cover" />
                ) : initialData?.existing_images?.[0] ? (
                  <img
                    src={`https://api.goldenlife.my/uploads/ecommarce/product_image/${initialData.existing_images[0]}`}
                    alt="Current main image"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Upload size={32} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <Label className="font-semibold mb-2 block">Upload New Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleMainImageChange(file);
                  }}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: 800x800px minimum. Square format preferred.
                </p>
                {mainImage && (
                  <Button type="button" variant="outline" size="sm" onClick={() => handleMainImageChange(null)} className="mt-2">
                    <X size={14} className="mr-1" /> Remove
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Images Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Upload size={20} />
              Gallery Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="font-semibold mb-2 block">Add Gallery Images</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) handleGalleryImagesChange([...galleryImages, ...files]);
                  }}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Add up to 5 additional images for product gallery
                </p>
              </div>

              {(galleryImages.length > 0 || existingGalleryImages.length > 0) && (
                <div className="grid grid-cols-4 gap-2">
                  {existingGalleryImages.map((imgUrl, index) => (
                    <div key={`existing-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={`https://api.goldenlife.my/uploads/ecommarce/gal_img/${imgUrl}`}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleExistingGalleryImageRemove(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {galleryImages.map((file, index) => (
                    <div key={`new-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newGallery = galleryImages.filter((_, i) => i !== index);
                          setGalleryImages(newGallery);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isLoading}
          className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          Reset Form
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-primary-light text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Update Product'
          )}
        </Button>
      </div>
    </form>
  );
}