import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ProductCard from "./ProductCard";

const cardColors = [
  "bg-blue-50 border-blue-100",
  "bg-green-50 border-green-100",
  "bg-orange-50 border-orange-100"
];

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

interface Category {
  id: number;
  category_name: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { staggerChildren: 0.05, duration: 0.4 } 
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  const getAuthToken = () => {
    const session = localStorage.getItem("student_session");
    if (!session) return null;
    try {
      const parsedSession = JSON.parse(session);
      return parsedSession.token;
    } catch (e) { return null; }
  };

  // 1. Initial Load: Fetch All Products and Build Category Bar
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = getAuthToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch All Products
        const prodRes = await axios.get(`${baseURL}/api/products`, config);
        const allProds = prodRes.data?.data?.products || prodRes.data?.data || [];
        setProducts(allProds);

        // Generate Category Bar (IDs 1, 2, 3, 4, 5)
        const allowedIds = [1, 2, 3, 4, 5];
        const dynamicIds = Array.from(new Set(allProds.map((p: any) => Number(p.category_id))))
          .filter(id => allowedIds.includes(id))
          .sort((a, b) => a - b);

        const serializedCats = dynamicIds.map(id => ({
          id: id,
          category_name: id.toString()
        }));

        // Manually add "All" (ID 0)
        setCategories([{ id: 0, category_name: "All" }, ...serializedCats]);
        setSelectedCategoryId(0);

      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 2. Dynamic Fetching on Category Change
  useEffect(() => {
    if (selectedCategoryId === null) return;

    const fetchFilteredData = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        const url = selectedCategoryId === 0 
          ? `${baseURL}/api/products`
          : `${baseURL}/api/student/products/category?id=${selectedCategoryId}`;

        const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = response.data?.data?.products || response.data?.data || [];
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Filter error:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredData();
  }, [selectedCategoryId]);

  const getCardColorClass = (index: number) => cardColors[index % cardColors.length];

  return (
    <section className="py-24 bg-[#FFF8DC] min-h-[800px]">
      <div className="container mx-auto px-4">
        
        {/* Title Section */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-gray-900 mb-4"
          >
            Our <span className="text-orange-500">Inventory</span>
          </motion.h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Browse our curated collection by categories or view all products.
          </p>
        </div>

        {/* --- CATEGORY BAR --- */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`w-12 h-12 rounded-full font-bold transition-all duration-300 border shadow-sm flex items-center justify-center text-sm
                ${selectedCategoryId === cat.id 
                  ? "bg-orange-500 text-white border-orange-600 scale-110 shadow-lg" 
                  : "bg-white text-gray-600 border-gray-100 hover:bg-orange-50"}`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        {/* --- PRODUCT GRID (No Pagination) --- */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-white border rounded-3xl p-4 h-72 animate-pulse" />
                ))}
              </div>
            ) : (
              <motion.div 
                key={selectedCategoryId}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {products.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    bgColorClass={getCardColorClass(index)} 
                  />
                ))}
                {products.length === 0 && (
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