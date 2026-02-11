import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productsData } from "@/data/productsData";
import ProductCard from "./ProductCard"; // 👈 Import Card
import Pagination from "./Pagination";   // 👈 Import Pagination

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
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate Logic
  const totalPages = Math.ceil(productsData.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = productsData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) return;
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(pageNumber);
      setIsLoading(false);
    }, 600);
  };

  return (
    <section className="py-24 bg-[#FFF8DC] min-h-[800px]">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4"
          >
            Our <span className="text-primary">Products</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            We have over 10,000+ products across 60+ categories that you can easily sell online.
          </motion.p>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              // Loading Skeleton
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
              >
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 flex flex-col items-center shadow-sm">
                    <div className="w-full aspect-square mb-3 rounded-lg bg-gray-200 animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </motion.div>
            ) : (
              // Product Grid
              <motion.div 
                key="grid"
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

        {/* Pagination Component */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />

      </div>
    </section>
  );
};

export default Products;