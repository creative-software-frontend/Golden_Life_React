"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Timer, SearchX, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { ProductCard } from "@/pages/common/ProductCard/ProductCard";

export default function ProductList() {
    const { t, i18n } = useTranslation('global');
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("q");
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

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
        } catch (e) {
            return null;
        }
    };

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

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const token = getAuthToken();
                const endpoint = keyword
                    ? `${baseURL}/api/products/search?keyword=${keyword}`
                    : `${baseURL}/api/products`;

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                };

                const response = await axios.get(endpoint, config);

                let rawData = [];
                if (keyword && response.data?.products) {
                    rawData = response.data.products;
                } else if (response.data?.data?.products) {
                    rawData = response.data.data.products;
                } else if (Array.isArray(response.data?.data)) {
                    rawData = response.data.data;
                }

                // --- CENTRALIZED URL CLEANUP ---
                const mappedData = rawData.map((item: any) => {
                    let imgUrl = item.product_image || item.image;

                    if (!imgUrl) {
                        imgUrl = "/placeholder.svg";
                    } else if (!imgUrl.startsWith("http")) {
                        // If the API only returns a raw filename (no slashes), add the backend folder path
                        if (!imgUrl.includes("/")) {
                            imgUrl = `${baseURL}/uploads/ecommarce/product_image/${imgUrl}`;
                        } else {
                            // If it already has folders (e.g., "/uploads/..."), just prepend the baseURL
                            imgUrl = `${baseURL}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;
                        }
                    }

                    return {
                        ...item,
                        product_title_english: item.product_title_english || item.name_en || "Product",
                        offer_price: item.offer_price || item.price || 0,
                        regular_price: item.regular_price || item.mrp || 0,
                        product_image: imgUrl // Now guaranteed to be a working, absolute URL
                    };
                });

                setProducts(keyword ? mappedData : mappedData.slice(0, 10));
            } catch (error) {
                console.error("Fetch error:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword, baseURL]);

    // --- NORMALIZED CART SAVE LOGIC ---
    const handleAddToCart = (product: any) => {
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingIndex = existingCart.findIndex((item: any) => item.id === product.id);

        // Safely handle name based on language
        const name = i18n.language === 'bn'
            ? (product.product_title_bangla || product.product_title_english)
            : product.product_title_english;

        // --- 1. Clean and parse BOTH prices ---
        const rawRegularPrice = product.regular_price || product.price || 0;
        const regularPrice = parseFloat(String(rawRegularPrice).replace(/[^0-9.-]+/g, "")) || 0;

        const rawOfferPrice = product.offer_price || 0;
        const offerPrice = parseFloat(String(rawOfferPrice).replace(/[^0-9.-]+/g, "")) || 0;

        // --- 2. Format Image URL ---
        let imageUrl = product.product_image || product.image || "/placeholder.svg";
        if (imageUrl.startsWith("/") && imageUrl !== "/placeholder.svg") {
            imageUrl = `${baseURL}${imageUrl}`;
        }

        if (existingIndex !== -1) {
            existingCart[existingIndex].quantity += 1;
        } else {
            // --- 3. Save all required data to the cart ---
            existingCart.push({
                id: product.id,
                name: name,
                product_title_english: product.product_title_english, // Allows Cart to handle language swaps
                regular_price: regularPrice,  // Store the original price
                offer_price: offerPrice,      // Store the discount price
                price: regularPrice,          // Safety fallback
                image: imageUrl,
                quantity: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(existingCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    if (loading) {
        return (
            <section className="py-6 w-full container mx-auto px-4 sm:px-6">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="h-20 w-full bg-slate-50 animate-pulse border-b border-gray-100" />
                    <div className="p-4 md:p-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <ProductCard key={index} isSkeleton={true} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-6 w-full container mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#5ca367] via-[#4a8a54] to-[#3d7044] p-5 md:p-7 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-bold tracking-wide border border-white/20">
                            {keyword ? `Search Results: ${keyword}` : t('sections.freshSell')}
                        </div>

                        {!keyword && (
                            <div className="flex items-center gap-2 text-white bg-black/20 px-4 py-1.5 rounded-xl border border-white/10">
                                <Timer className="h-4 w-4" />
                                <div className="flex gap-1 font-mono font-black text-sm md:text-base">
                                    <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
                                    <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
                                    <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {!keyword && (
                        <Link to="/dashboard/allProducts" className="group flex items-center gap-1.5 text-sm font-black text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl transition-all border border-white/10">
                            {t('header.allProducts')}
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    )}
                </div>

                <div className="p-4 md:p-8">
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4  gap-6">
                            {products.map((product: any) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    baseURL={baseURL}
                                    onAddToCart={() => handleAddToCart(product)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 flex flex-col items-center justify-center text-slate-300">
                            <SearchX className="h-16 w-16 mb-4 opacity-20" />
                            <p className="font-black uppercase tracking-[0.2em] text-sm text-slate-400">No Results Found</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}