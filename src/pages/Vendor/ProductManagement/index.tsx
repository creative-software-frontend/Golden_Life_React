import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductFilters } from './components/ProductFilters';
import { ProductTable } from './components/ProductTable';
import { ProductGrid } from './components/ProductGrid';
import { BulkActionsBar } from './components/BulkActionsBar';
import { Pagination } from './components/Pagination';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { useProducts } from './hooks/useProducts';
import { Product, ProductFilters as ProductFiltersType, ViewMode, PaginationState } from './types';

const Products: React.FC = () => {
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState<ProductFiltersType>({
    search: '',
    status: 'all',
    stock: 'all',
    sort: 'date_desc',
  });

  // Custom hook
  const {
    products,
    isLoading,
    error,
    pagination,
    fetchProducts,
    deleteProduct,
    toggleProductStatus,
    bulkDeleteProducts,
    bulkToggleStatus,
    applyFilters,
    updatePageSize,
    setPagination,
  } = useProducts();

  // Handle filters change
  const handleFiltersChange = useCallback((newFilters: ProductFiltersType) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  }, [applyFilters]);

  // Handle view mode change
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  // Handle product selection
  const handleSelectionChange = useCallback((ids: number[]) => {
    setSelectedProducts(ids);
  }, []);

  // Handle individual product actions
  const handleViewProduct = useCallback((product: Product) => {
    toast.info(`Viewing product: ${product.product_title_english}`);
    // TODO: Navigate to product detail page or open modal
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    toast.info(`Editing product: ${product.product_title_english}`);
    // TODO: Navigate to product edit page or open modal
  }, []);

  const handleToggleProductStatus = useCallback(async (product: Product) => {
    const success = await toggleProductStatus(product.id, product.status);
    if (!success) {
      toast.error('Failed to update product status');
    }
  }, [toggleProductStatus]);

  const handleDeleteProduct = useCallback((product: Product) => {
    setProductToDelete(product);
  }, []);

  const confirmDeleteProduct = useCallback(async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    const success = await deleteProduct(productToDelete.id);
    setIsDeleting(false);
    
    if (success) {
      setProductToDelete(null);
      setSelectedProducts([]); // Clear selection
    }
  }, [productToDelete, deleteProduct]);

  // Handle bulk actions
  const handleBulkActivate = useCallback(async () => {
    if (selectedProducts.length === 0) return;
    
    const success = await bulkToggleStatus(selectedProducts, 1);
    if (success) {
      setSelectedProducts([]);
    }
  }, [selectedProducts, bulkToggleStatus]);

  const handleBulkDeactivate = useCallback(async () => {
    if (selectedProducts.length === 0) return;
    
    const success = await bulkToggleStatus(selectedProducts, 0);
    if (success) {
      setSelectedProducts([]);
    }
  }, [selectedProducts, bulkToggleStatus]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedProducts.length === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedProducts.length} products? This action cannot be undone.`
    );
    
    if (confirmed) {
      setIsDeleting(true);
      const success = await bulkDeleteProducts(selectedProducts);
      setIsDeleting(false);
      
      if (success) {
        setSelectedProducts([]);
      }
    }
  }, [selectedProducts, bulkDeleteProducts]);

  const handleClearSelection = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setPagination((prev: PaginationState) => ({ ...prev, currentPage: page }));
  }, [setPagination]);

  const handlePageSizeChange = useCallback((size: number) => {
    updatePageSize(size);
  }, [updatePageSize]);

  // Handle add product
  const handleAddProduct = useCallback(() => {
    toast.info('Add product feature coming soon!');
    // TODO: Navigate to product creation page or open modal
  }, []);

  // Handle retry on error
  const handleRetry = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1920px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Product Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your product catalog, inventory, and pricing
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-destructive mb-1">Failed to load products</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRetry}
            className="shrink-0"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {/* Filters and Search */}
      <ProductFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onAddProduct={handleAddProduct}
      />

      {/* Products Content */}
      {!error && (
        <>
          {/* View Component based on mode */}
          {viewMode === 'table' ? (
            <ProductTable
              products={products}
              isLoading={isLoading}
              selectedProducts={selectedProducts}
              onSelectionChange={handleSelectionChange}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onToggleStatus={handleToggleProductStatus}
              onDelete={handleDeleteProduct}
            />
          ) : (
            <ProductGrid
              products={products}
              isLoading={isLoading}
              selectedProducts={selectedProducts}
              onSelectionChange={handleSelectionChange}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onToggleStatus={handleToggleProductStatus}
              onDelete={handleDeleteProduct}
            />
          )}

          {/* Pagination */}
          {!isLoading && products.length > 0 && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}

      {/* Bulk Actions Bar */}
      {selectedProducts.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedProducts.length}
          onActivateAll={handleBulkActivate}
          onDeactivateAll={handleBulkDeactivate}
          onDeleteAll={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDeleteProduct}
        productName={productToDelete?.product_title_english || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Products;
