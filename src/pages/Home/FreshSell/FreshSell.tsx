"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ShoppingCart, Timer } from "lucide-react";
import { Link } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import useModalStore from "@/store/Store";
import { useTranslation } from "react-i18next";
import axios from "axios";

// --- 1. INTERFACE ---
interface Product {
    id: number;
    name_en: string;
    name_bn: string;
    image: string;
    stock: number;
    price: number;
    mrp: number;
    description?: string;
}

const ProductSkeleton = () => {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-2 md:p-3 shadow-sm h-full flex flex-col animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-3 w-full"></div>
            <div className="flex-grow space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="flex gap-2 mt-2">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full w-full mt-3"></div>
            </div>
            <div className="h-8 md:h-10 bg-gray-200 rounded-lg w-full mt-4"></div>
        </div>
    );
};

export default function FreshSell() {
    const { t, i18n } = useTranslation('global');
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getAuthToken = () => {
        const session = localStorage.getItem("student_session");
        if (!session) return null;
        try {
            const parsedSession = JSON.parse(session);
            if (new Date().getTime() > parsedSession.expiry) {
                localStorage.removeItem("student_session");
                return null;
            }
            return parsedSession.token;
        } catch (e) { return null; }
    };

    // Fetch Data
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';
                const token = getAuthToken();
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                };

                const response = await axios.get(`${baseURL}/api/products`, config);

                let rawData = [];
                if (response.data?.data?.products && Array.isArray(response.data.data.products)) {
                    rawData = response.data.data.products;
                }

                const mappedProducts = rawData.map((item: any) => ({
                    id: item.id,
                    name_en: item.product_title_english,
                    name_bn: item.product_title_bangla || item.product_title_english,
                    image: `${baseURL}/uploads/ecommarce/product_image/${item.product_image}`,
                    stock: parseInt(item.stock) || 0,
                    price: parseFloat(item.offer_price || item.regular_price || item.seller_price || 0),
                    mrp: parseFloat(item.regular_price || 0),
                    description: item.short_description_english
                }));

                setProducts(mappedProducts.slice(0, 10));

            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // FIXED: Corrected addToCart logic to handle localization and events
    const addToCart = (product: Product) => {
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingProductIndex = existingCart.findIndex((item: any) => item.id === product.id);
        
        // Ensure name is stored based on the current active language
        const cartProductName = i18n.language === 'bn' ? product.name_bn : product.name_en;

        if (existingProductIndex !== -1) {
            existingCart[existingProductIndex].quantity += 1;
        } else {
            existingCart.push({ 
                ...product, 
                name: cartProductName, // Adding localized name for the cart UI
                quantity: 1 
            });
        }

        localStorage.setItem("cart", JSON.stringify(existingCart));

        // DISPATCH CUSTOM EVENT: Updates the floating pill immediately
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const calculateProgress = (mrp: number, price: number) => {
        if (!mrp || mrp <= price) return 20;
        const discount = ((mrp - price) / mrp) * 100;
        return Math.min(Math.round(discount + 40), 95);
    };

    if (loading) {
        return (
            <section className="py-8 md:py-4 mt-4 w-full container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
                        {Array.from({ length: 5 }).map((_, index) => <ProductSkeleton key={index} />)}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-4 mt-4 w-full container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                {/* Header Bar */}
                <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
                        <div className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wide border border-white/20 text-center">
                            {t('sections.freshSell')}
                        </div>
                        <div className="flex items-center gap-2 text-white bg-black/20 px-3 py-1 rounded-lg">
                            <Timer className="h-4 w-4" />
                            <div className="flex gap-1 font-mono font-bold text-xs md:text-sm">
                                <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
                                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
                                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                    <Link to="/dashboard/allProducts" className="group flex items-center gap-1 text-[11px] md:text-sm font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all">
                        {t('header.allProducts')}
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Content Area */}
                <div className="p-4 md:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
                        {products.length > 0 ? (
                            products.map((product) => {
                                const progress = calculateProgress(product.mrp, product.price);
                                const displayName = i18n.language === 'bn' ? product.name_bn : product.name_en;

                                return (
                                    <div key={product.id} className="group flex flex-col bg-white border border-gray-100 rounded-xl p-2 md:p-3 shadow-sm hover:shadow-2xl hover:border-orange-100 transition-all duration-500 transform hover:-translate-y-1 h-full">

                                        <Link to={`/dashboard/product/${product.id}`} className="block">
                                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 relative">
                                                <img
                                                    src={product.image}
                                                    alt={displayName}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = "/image/products/maggi.webp"; }}
                                                />
                                                <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-red-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full shadow-md uppercase">
                                                    Flash
                                                </div>
                                            </div>

                                            <div className="mt-3 space-y-2 flex-grow flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-[11px] md:text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                                                        {displayName}
                                                    </h3>

                                                    <div className="flex flex-wrap items-baseline gap-2 mt-1">
                                                        <span className="text-sm md:text-lg font-black text-gray-900">
                                                            ৳{product.price}
                                                        </span>
                                                        {product.mrp > product.price && (
                                                            <span className="text-[10px] md:text-xs text-gray-400 line-through">
                                                                ৳{product.mrp}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="mt-2 space-y-1">
                                                        <div className="h-1 md:h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                                                        </div>
                                                        <p className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                            {progress}% SOLD
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="mt-2">
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addToCart(product);
                                                }}
                                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg h-8 md:h-10 text-[10px] md:text-xs transition-all border-none shadow-md active:scale-95 flex items-center justify-center gap-1 md:gap-2"
                                            >
                                                <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                                                <span className="hidden sm:inline">{t('buttons.addToCart')}</span>
                                                <span className="sm:hidden">Add</span>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest italic">
                                <p>No Flash Deals Available.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}