import { useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, ShoppingCart, Eye, X, Info } from 'lucide-react';
import useModalStore from "@/store/Store";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
    id: number;
    name: string;
    image: string;
    weight: string;
    price: number;
    mrp: number;
    description?: string;
}

const products: Product[] = [
    { id: 1, name: "Potato", image: "../../../../public/image/products/maggi.webp", weight: "600 gm", price: 39, mrp: 45, description: "Regular potatoes, suitable for home cooking. Rich in carbohydrates and minerals." },
    { id: 2, name: "Red Potato (Cardinal)", image: "../../../../public/image/products/maggi.webp", weight: "1 kg", price: 50, mrp: 60, description: "Red Cardinal potatoes, suitable for home cooking. Rich in vitamins and minerals." },
    { id: 3, name: "Garlic (Imported)", image: "../../../../public/image/products/maggi.webp", weight: "200 gm", price: 30, mrp: 35, description: "Imported garlic, known for its strong flavor and health benefits." },
    { id: 4, name: "Onion", image: "../../../../public/image/products/maggi.webp", weight: "500 gm", price: 25, mrp: 30, description: "Fresh onions, a staple in many dishes. Adds flavor and aroma to meals." },
    { id: 5, name: "Tomato", image: "../../../../public/image/products/maggi.webp", weight: "1 kg", price: 40, mrp: 45, description: "Juicy tomatoes, perfect for salads, sauces, and cooking." },
    { id: 6, name: "Cucumber", image: "../../../../public/image/products/maggi.webp", weight: "400 gm", price: 15, mrp: 20, description: "Fresh cucumbers, crisp and refreshing. Ideal for salads and snacks." },
];

export default function AllProduct() {
    const { id } = useParams<{ id: string }>();
    const { toggleClicked } = useModalStore();
    const { t } = useTranslation("global");

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantities, setQuantities] = useState<Record<number, number>>(
        Object.fromEntries(products.map((p) => [p.id, 1]))
    );

    const updateQuantity = (productId: number, delta: number) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + delta),
        }));
    };

    const discount = (mrp: number, price: number) => Math.round(((mrp - price) / mrp) * 100);

    const addToCart = (product: Product) => {
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const updatedCart = [...existingCart, { ...product, quantity: quantities[product.id] || 1 }];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toggleClicked();
    };

    return (
        <section className="w-full py-12 px-4 bg-gray-50/50">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t("labels.freshVegetables")}</h1>
                        <p className="text-gray-500 font-medium">Hand-picked daily for your kitchen</p>
                    </div>
                </header>

                {/* Staggered Grid Animation */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
                >
                    {products.map((product) => (
                        <motion.div 
                            key={product.id}
                            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                            className="bg-white group rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 overflow-hidden"
                        >
                            <div className="relative aspect-[4/3] bg-gray-100 p-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                                />
                                {/* Action Bar */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                                    <button className="p-2.5 rounded-full bg-white shadow-lg text-red-500 hover:bg-red-50 transition-colors">
                                        <Heart className="w-5 h-5" fill="currentColor" />
                                    </button>
                                    <button 
                                        onClick={() => setSelectedProduct(product)}
                                        className="p-2.5 rounded-full bg-white shadow-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                                    {discount(product.mrp, product.price)}% OFF
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{product.weight}</span>
                                </div>

                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-2xl font-black text-gray-900">৳{product.price}</span>
                                    <span className="text-sm text-gray-400 line-through font-medium">৳{product.mrp}</span>
                                </div>

                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {t("buttons2.addToCart")}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Quick View Modal with AnimatePresence */}
                <AnimatePresence>
                    {selectedProduct && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            <motion.div 
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-white rounded-[2rem] max-w-4xl w-full overflow-hidden shadow-2xl relative"
                            >
                                <button 
                                    onClick={() => setSelectedProduct(null)}
                                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>

                                <div className="grid md:grid-cols-2">
                                    <div className="bg-gray-50 p-12 flex items-center justify-center">
                                        <img src={selectedProduct.image} className="max-h-80 object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="p-10 flex flex-col justify-center">
                                        <span className="text-emerald-600 font-black text-sm uppercase tracking-widest mb-2">{selectedProduct.weight} Package</span>
                                        <h2 className="text-4xl font-black text-gray-900 mb-4">{selectedProduct.name}</h2>
                                        
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="text-3xl font-black">৳{selectedProduct.price}</span>
                                            <span className="text-lg text-gray-400 line-through">৳{selectedProduct.mrp}</span>
                                        </div>

                                        <p className="text-gray-500 leading-relaxed mb-8 font-medium">
                                            {selectedProduct.description}
                                        </p>

                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="flex items-center border-2 border-gray-100 rounded-2xl p-1">
                                                <button onClick={() => updateQuantity(selectedProduct.id, -1)} className="w-10 h-10 flex items-center justify-center font-bold text-xl hover:bg-gray-50 rounded-xl">-</button>
                                                <span className="w-12 text-center font-black">{quantities[selectedProduct.id]}</span>
                                                <button onClick={() => updateQuantity(selectedProduct.id, 1)} className="w-10 h-10 flex items-center justify-center font-bold text-xl hover:bg-gray-50 rounded-xl">+</button>
                                            </div>
                                            <button onClick={() => addToCart(selectedProduct)} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 transition-all">
                                                Add to Cart
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">🚚</div>
                                                <p className="text-xs font-bold text-gray-600">Fast Local Delivery</p>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">🛡️</div>
                                                <p className="text-xs font-bold text-gray-600">Organic Certified</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}