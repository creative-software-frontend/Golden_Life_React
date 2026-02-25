import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ProductCard from "./ProductCard"; // Ensure you have this component

// --- Interfaces ---

// Updated based on your JSON snippet
interface Category {
  id: number;
  category_name: string;
  category_slug?: string;
  category_icon?: string;
  category_image?: string;
}

interface Product {
  id: number;
  product_title_english: string;
  product_title_bangla: string;
  product_image: string;
  seller_price: string;
  regular_price: string;
  offer_price: string;
  category_id: string;
  stock: string;
}

const Products: React.FC = () => {
  // --- State ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0); // 0 = "All"
  const [isProductLoading, setIsProductLoading] = useState(true);

  // --- Configuration ---
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';
  const cardColors = ["bg-blue-50 border-blue-100", "bg-green-50 border-green-100", "bg-orange-50 border-orange-100"];

  // --- Auth Helper ---
  const getAuthToken = () => {
    const session = localStorage.getItem("student_session");
    if (!session) return null;
    try {
      const parsedSession = JSON.parse(session);
      return parsedSession.token;
    } catch (e) { return null; }
  };

  // ---------------------------------------------------------
  // 1. Fetch Categories (Runs once on mount)
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getAuthToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // HIT THE API
        const response = await axios.get(`${baseURL}/api/getProductCategory`, config);
        
        // LOGIC: Access the 'categories' array specifically
        // Handling: response.data.categories OR response.data.data.categories
        const fetchedCats = response.data?.categories || response.data?.data?.categories || [];

        // Manually add "All" button at the beginning
        const allOption: Category = { 
            id: 0, 
            category_name: "All" 
        };
        
        setCategories([allOption, ...fetchedCats]);

      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to just "All" if API fails
        setCategories([{ id: 0, category_name: "All" }]);
      }
    };

    fetchCategories();
  }, []);

  // ---------------------------------------------------------
  // 2. Fetch Products (Runs when selectedCategoryId changes)
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      setIsProductLoading(true);
      try {
        const token = getAuthToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };

        let url = "";

        // If ID is 0, fetch ALL products. Otherwise, fetch by ID.
        if (selectedCategoryId === 0) {
          url = `${baseURL}/api/products`;
        } else {
          url = `${baseURL}/api/student/products/category?id=${selectedCategoryId}`;
        }

        const response = await axios.get(url, config);
        const data = response.data?.data?.products || response.data?.data || [];
        
        setProducts(Array.isArray(data) ? data : []);

      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsProductLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryId]);

  const getCardColorClass = (index: number) => cardColors[index % cardColors.length];

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } }
  };

  return (
    <section className="py-24 bg-[#FFF8DC] min-h-[800px]">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            Our <span className="text-orange-500">Inventory</span>
          </h2>
        </div>

        {/* --- DYNAMIC CATEGORY BUTTONS --- */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`
                px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 border shadow-sm capitalize
                ${selectedCategoryId === cat.id 
                  ? "bg-orange-500 text-white border-orange-600 scale-105 shadow-md" 
                  : "bg-white text-gray-600 border-gray-100 hover:bg-orange-50 hover:border-orange-200"
                }
              `}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        {/* --- PRODUCTS GRID --- */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {isProductLoading ? (
              // Loading State
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-white border rounded-3xl p-4 h-72 animate-pulse" />
                ))}
              </div>
            ) : (
              // Data State
              <motion.div 
                key={selectedCategoryId}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      bgColorClass={getCardColorClass(index)} 
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 text-gray-400">
                    No products found in this category.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default Products;