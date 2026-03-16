import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductStatusBadge } from './ProductStatusBadge';
import { ProductActions } from './ProductActions';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductTableProps } from '../types';
import { LOW_STOCK_THRESHOLD } from '../constants';
import { getProductImageUrl, handleImageError } from '@/utils/imageHelpers';

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  selectedProducts,
  onSelectionChange,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(products.map(p => p.id));
    } else {
      onSelectionChange([]);
    }
  };

  // Handle individual product selection
  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedProducts, productId]);
    } else {
      onSelectionChange(selectedProducts.filter(id => id !== productId));
    }
  };

  // Format price with BDT symbol
  const formatPrice = (price: number) => {
    return `৳${price.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"><Checkbox disabled /></TableHead>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Product Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Checkbox disabled /></TableCell>
                <TableCell><Skeleton className="h-12 w-12 rounded-lg" /></TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground">No products found</h3>
          <p className="text-muted-foreground">
            Start by adding your first product to your catalog.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50">
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedProducts.length === products.length && products.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Product Details</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              className={`
                transition-colors duration-200
                ${selectedProducts.includes(product.id) ? 'bg-muted/50' : 'hover:bg-muted/30'}
              `}
            >
              <TableCell>
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>
                <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-border">
                  <img
                    src={getProductImageUrl(product.product_image)}
                    alt={product.product_title_english}
                    className="h-full w-full object-cover"
                    onError={(e) => handleImageError(e, 'product')}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium text-foreground line-clamp-1">
                    {product.product_title_english}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    SKU: {product.sku}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  ID: {product.category_id}
                </span>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-semibold text-primary">
                    {formatPrice(product.offer_price)}
                  </p>
                  {product.regular_price > product.offer_price && (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatPrice(product.regular_price)}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className={`text-sm font-medium ${
                    product.stock === 0 
                      ? 'text-red-600' 
                      : product.stock <= LOW_STOCK_THRESHOLD
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}>
                    {product.stock}
                  </span>
                  {product.stock === 0 ? (
                    <span className="text-[10px] text-red-600 font-medium">Out of Stock</span>
                  ) : product.stock <= LOW_STOCK_THRESHOLD ? (
                    <span className="text-[10px] text-amber-600 font-medium">Low Stock</span>
                  ) : null}
                </div>
              </TableCell>
              <TableCell>
                <ProductStatusBadge status={product.status} />
              </TableCell>
              <TableCell className="text-right">
                <ProductActions
                  product={product}
                  onView={onView}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
