import React from "react";
import { motion } from "framer-motion";
import { ProductCategory } from "@/data/productsData";

interface ProductCardProps {
  product: ProductCategory;
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 }
  },
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, borderColor: "#F97316" }}
      className="bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer shadow-sm hover:shadow-lg border border-transparent transition-all duration-300 group"
    >
      {/* Image Container */}
      <div className="w-full aspect-square mb-3 overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Category Name */}
      <h3 className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors line-clamp-1">
        {product.name}
      </h3>
    </motion.div>
  );
};

export default ProductCard;