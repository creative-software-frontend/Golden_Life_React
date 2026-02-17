import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productsData } from "@/data/productsData";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 16;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const Products: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Get unique categories dynamically
  const categories = useMemo(() => 
    ["All", ...new Set(productsData.map((p) => p.category))], 
    []
  );

  // 2. Filter data based on category
  const filteredProducts = useMemo(() => {
    return selectedCategory === "All"
      ? productsData
      : productsData.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // 3. Calculate Pagination based on filtered data
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to page 1 on filter
    setTimeout(() => setIsLoading(false), 500);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) return;
    setIsLoading(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
    setTimeout(() => {
      setCurrentPage(pageNumber);
      setIsLoading(false);
    }, 400);
  };

  return (
    <section className="py-24 bg-[#FFF8DC] min-h-[800px]">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4"
          >
            Our <span className="text-primary text-orange-500">Products</span>
          </motion.h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We have over 10,000+ products across 60+ categories that you can easily sell online.
          </p>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm
                ${selectedCategory === cat 
                  ? "bg-orange-500 text-white" 
                  : "bg-white text-gray-600 hover:bg-orange-100"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
              >
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 flex flex-col items-center shadow-sm">
                    <div className="w-full aspect-square mb-3 rounded-lg bg-gray-200 animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key={selectedCategory + currentPage} // Unique key to trigger animation on change
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {currentItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              isLoading={isLoading}
              onPageChange={handlePageChange}
            />
          </div>
        )}

      </div>
    </section>
  );
};

export default Products;