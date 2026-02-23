import React from "react";
import { motion } from "framer-motion";
import { ProductCategory } from "@/data/productsData";

interface ProductCardProps {
  product: ProductCategory;
  bgColorClass: string; // New prop to receive the dynamic color class
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 }
  },
};

const ProductCard: React.FC<ProductCardProps> = ({ product, bgColorClass }) => {
  return (
    <motion.div
      variants={itemVariants}
      // y: -5 gives that "lift" effect, we remove fixed borderColor 
      // to let the dynamic border from bgColorClass show or override on hover
      whileHover={{ y: -8 }} 
      className={`${bgColorClass} rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer shadow-sm hover:shadow-xl border transition-all duration-300 group h-full`}
    >
      {/* Image Container - White circle style as seen in your reference images */}
      <div className="w-16 h-16 md:w-20 md:h-20 mb-4 overflow-hidden rounded-full bg-white flex items-center justify-center shadow-inner p-3">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Category Name */}
      <h3 className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
        {product.name}
      </h3>
      
      {/* Optional: subtle arrow or indicator that appears on hover */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="mt-2 text-orange-500 text-xs font-bold"
      >
        Explore →
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;