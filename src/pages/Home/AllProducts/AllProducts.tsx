"use client";

import { useEffect, useState, useMemo } from "react";
import { 
    ChevronLeft, ChevronRight, SearchX, 
    Tag, ArrowUpDown, SlidersHorizontal 
} from 'lucide-react';
import useModalStore from "@/store/Store";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { ProductCard } from "@/pages/common/ProductCard/ProductCard";

export default function AllProduct() {
    const { t, i18n } = useTranslation("global");

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // --- FILTER & SORT STATE ---
    const [maxPrice, setMaxPrice] = useState<number>(5000); 
    const [sortBy, setSortBy] = useState("newest"); 

    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    const getAuthToken = () => {
        const session = sessionStorage.getItem("student_session");
        if (!session) return null;
        try {
            const parsedSession = JSON.parse(session);
            return (new Date().getTime() > parsedSession.expiry) ? null : parsedSession.token;
        } catch (e) { return null; }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const token = getAuthToken();
                const config = {
                    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }
                };

                const response = await axios.get(`${baseURL}/api/products`, config);
                let rawData = response.data?.data?.products || response.data?.data || [];

                const mappedProducts = rawData.map((item: any) => ({
                    ...item,
                    id: item.id,
                    date: item.created_at ? new Date(item.created_at).getTime() : item.id,
                    titleEn: item.product_title_english || item.name_en || "Product",
                    titleBn: item.product_title_bangla || item.name_bn || "",
                    offer_price: parseFloat(item.offer_price) || parseFloat(item.price) || 0,
                    regular_price: parseFloat(item.regular_price) || parseFloat(item.mrp) || 0,
                    product_image: item.product_image?.startsWith("http") 
                        ? item.product_image 
                        : `${baseURL}/uploads/ecommarce/product_image/${item.product_image}`
                }));

                setProducts(mappedProducts);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [baseURL]);

    // --- FILTERING & SORTING ENGINE ---
    const filteredProducts = useMemo(() => {
        return products
            .filter(product => product.offer_price <= maxPrice)
            .sort((a, b) => {
                if (sortBy === "newest") return b.date - a.date;
                if (sortBy === "oldest") return a.date - b.date;
                if (sortBy === "lowToHigh") return a.offer_price - b.offer_price;
                if (sortBy === "highToLow") return b.offer_price - a.offer_price;
                return 0;
            });
    }, [products, maxPrice, sortBy]);

    // Reset pagination on filter change
    useEffect(() => setCurrentPage(1), [maxPrice, sortBy]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddToCart = (product: any) => {
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingIndex = existingCart.findIndex((item: any) => item.id === product.id);
        const name = i18n.language === 'bn' ? (product.titleBn || product.titleEn) : product.titleEn;

        if (existingIndex !== -1) {
            existingCart[existingIndex].quantity += 1;
        } else {
            existingCart.push({ ...product, name, image: product.product_image, quantity: 1 });
        }
        localStorage.setItem("cart", JSON.stringify(existingCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    if (loading) {
        return (
            <section className="py-12 container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => <ProductCard key={i} isSkeleton={true} />)}
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 w-full container mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                
                {/* 1. Simplified Header */}
                <div className="bg-gradient-to-br from-[#2d5a35] via-[#4d8b59] to-[#5ca367] p-8 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight mb-1">{t("header.allProducts", "Premium Collection")}</h1>
                            <p className="text-white/70 text-sm font-medium">Browsing {filteredProducts.length} items within your budget</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-white/80" />
                            <span className="text-xs font-bold uppercase tracking-wider">Active Filters</span>
                        </div>
                    </div>
                </div>

                {/* 2. Control Panel */}
                <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-6 items-center justify-between">
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
                            <ArrowUpDown className="w-4 h-4 text-[#4d8b59]" />
                            <select 
                                className="text-xs font-bold text-slate-600 bg-transparent outline-none cursor-pointer"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="lowToHigh">Price: Low to High</option>
                                <option value="highToLow">Price: High to Low</option>
                            </select>
                        </div>

                        {/* Price Badge */}
                        <div className="flex items-center gap-2 bg-green-50 px-4 py-2.5 rounded-2xl border border-green-100">
                            <Tag className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-[11px] font-black text-green-700 uppercase tracking-wider">Under ৳{maxPrice}</span>
                        </div>
                    </div>

                    {/* Price Slider */}
                    <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm min-w-[280px]">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Max Price</span>
                        <input 
                            type="range" min="100" max="10000" step="100"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="accent-[#4d8b59] h-1.5 flex-1 cursor-pointer"
                        />
                        <span className="text-sm font-bold text-slate-700 min-w-[60px] text-right">৳{maxPrice}</span>
                    </div>
                </div>

                {/* 3. Product Grid */}
                <div className="p-8">
                    {currentProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
                                {currentProducts.map((product) => (
                                    <div key={product.id} className="transition-transform duration-300 hover:-translate-y-2">
                                        <ProductCard
                                            product={product} 
                                            baseURL={baseURL} 
                                            onAddToCart={() => handleAddToCart(product)} 
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-3 pt-10 border-t border-slate-50">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-20 transition-all shadow-sm"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                                    </button>
                                    
                                    <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                                                    currentPage === page 
                                                    ? "bg-[#4d8b59] text-white shadow-md shadow-green-200" 
                                                    : "hover:bg-white text-slate-500"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-20 transition-all shadow-sm"
                                    >
                                        <ChevronRight className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-40 flex flex-col items-center justify-center text-center">
                            <div className="bg-slate-50 p-8 rounded-[3rem] mb-6">
                                <SearchX className="h-20 w-20 text-slate-200" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No items in this range</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">Try increasing your budget filter to see more products.</p>
                            <button 
                                onClick={() => {setMaxPrice(10000); setSortBy("newest");}}
                                className="px-8 py-3 bg-[#4d8b59] text-white rounded-2xl font-bold text-sm hover:bg-[#3d7044] transition-all shadow-lg shadow-green-100"
                            >
                                Reset Price Filter
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}