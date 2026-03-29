import { z } from 'zod';

export const productSchema = z.object({
  product_title_english: z.string().min(3, 'English title must be at least 3 characters'),
  product_title_bangla: z.string().min(3, 'Bangla title must be at least 3 characters'),
  category_id: z.union([
    z.number().min(1, 'Category is required'),
    z.string().min(1, 'Category is required')
  ]),
  subcategory_id: z.union([
    z.number().min(1, 'Subcategory is required'),
    z.string().min(1, 'Subcategory is required')
  ]),
  short_description_english: z.string()
    .max(200, 'Short description (English) must not exceed 200 characters')
    .optional()
    .or(z.literal('')),
  short_description_bangla: z.string()
    .max(200, 'Short description (Bangla) must not exceed 200 characters')
    .optional()
    .or(z.literal('')),
  long_description_english: z.string()
    .max(1000, 'Long description (English) must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  long_description_bangla: z.string()
    .max(1000, 'Long description (Bangla) must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  seller_price: z.number().positive('Seller price must be greater than 0'),
  regular_price: z.number().positive('Regular price must be greater than 0'),
  offer_price: z.number().positive('Offer price must be greater than 0'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  video_link: z.string()
    .url('Invalid URL format')
    .optional()
    .or(z.literal('')),
  ebook: z.string().default('0'), // Default value '0' for regular products
  images: z.array(z.instanceof(File)).optional(),
  existing_images: z.array(z.string()).optional(),
  removed_images: z.array(z.string()).optional(),
});

// Refine to check that offer price is strictly less than regular price
export const productSchemaWithValidation = productSchema.refine((data) => data.offer_price < data.regular_price, {
  message: "Offer Price (Selling) must be strictly less than Regular Price (MRP)",
  path: ["offer_price"],
});

export type ProductFormData = z.infer<typeof productSchema>;
