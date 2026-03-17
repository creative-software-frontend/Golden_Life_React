"use client";

import { useEffect, useState, useMemo } from "react";
import {
    ChevronLeft, ChevronRight, SearchX,
    SlidersHorizontal, Search, Plus, Grid3X3, Table as TableIcon,
    Trash2, CheckCircle, XCircle
} from 'lucide-react';
import { useTranslation } from "react-i18next";
import axios from "axios";
import { ProductCard } from "@/pages/common/ProductCard/ProductCard";

export default function AllProduct() {
    const { t, i18n } = useTranslation("global");

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // --- FILTER & VIEW STATES ---
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [stock, setStock] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("grid");

    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number | string>(12);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    const getAuthToken = () => {
        const session = sessionStorage.getItem("student_session");
        if (!session) return null;
        try {
            const parsedSession = JSON.parse(session);
            return (new Date().getTime() > parsedSession.expiry) ? null : parsedSession.token;
        } catch (e) { return null; }
    };

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
                stock_qty: item.stock || item.quantity || 0,
                status: item.status || 'active',
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

    useEffect(() => {
        fetchProducts();
    }, [baseURL]);

    // --- PRODUCT ACTIONS (ACTIVE, INACTIVE, REMOVE) ---
    const handleToggleStatus = async (id: string | number, currentStatus: string) => {
        // Toggle handles both numeric string status ("1"/"0") and words ("active"/"inactive")
        const newStatus = (currentStatus === 'active' || currentStatus === '1') ? 'inactive' : 'active';
        setProducts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
        try {
            // API call logic
        } catch (error) {
            console.error("Failed to update status:", error);
            setProducts(prev => prev.map(p => p.id === id ? { ...p, status: currentStatus } : p));
            alert("Failed to update product status.");
        }
    };

    const handleRemoveProduct = async (id: string | number) => {
        if (!window.confirm("Are you sure you want to completely remove this product?")) return;
        setProducts(prev => prev.filter(p => p.id !== id));
        try {
            // API call logic
        } catch (error) {
            console.error("Failed to delete product:", error);
            fetchProducts();
            alert("Failed to delete the product.");
        }
    };

    // --- FILTERING & SORTING ENGINE ---
    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        // 1. Search Filter
        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter((p) =>
                p.titleEn.toLowerCase().includes(lowerSearch) ||
                p.titleBn.toLowerCase().includes(lowerSearch) ||
                (p.sku && p.sku.toLowerCase().includes(lowerSearch))
            );
        }

        // 3. Stock Filter
        if (stock !== "all") {
            if (stock === "in_stock") result = result.filter((p) => p.stock_qty > 0);
            if (stock === "out_of_stock") result = result.filter((p) => p.stock_qty <= 0);
        }

        // 4. Sorting
        return result.sort((a, b) => {
            if (sortBy === "newest") return b.date - a.date;
            if (sortBy === "oldest") return a.date - b.date;
            if (sortBy === "lowToHigh") return a.offer_price - b.offer_price;
            if (sortBy === "highToLow") return b.offer_price - a.offer_price;
            return 0;
        });
    }, [products, search, status, stock, sortBy]);

    useEffect(() => setCurrentPage(1), [search, status, stock, sortBy]);

    const currentLimit = itemsPerPage === "all" ? filteredAndSortedProducts.length : (itemsPerPage as number);
    const totalPages = currentLimit > 0 ? Math.ceil(filteredAndSortedProducts.length / currentLimit) : 1;
    const indexOfLastItem = currentPage * currentLimit;
    const indexOfFirstItem = indexOfLastItem - currentLimit;
    const currentProducts = filteredAndSortedProducts.slice(indexOfFirstItem, indexOfLastItem);

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

                {/* 1. Header */}
                <div className="bg-gradient-to-br from-[#2d5a35] via-[#4d8b59] to-[#5ca367] p-8 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight mb-1">{t("header.allProducts", "Premium Collection")}</h1>
                            <p className="text-white/70 text-sm font-medium">Displaying {filteredAndSortedProducts.length} items</p>
                        </div>
                    </div>
                </div>

                {/* 2. Control Panel */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by product name or SKU..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 h-10 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8A87C]/40 focus:border-[#E8A87C] text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
                            <div className="flex flex-wrap gap-3 w-full lg:w-auto">

                                <select value={stock} onChange={(e) => setStock(e.target.value)} className="h-10 w-full sm:w-[150px] px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 outline-none focus:ring-2 focus:ring-[#E8A87C]/40">
                                    <option value="all">All Stock</option>
                                    <option value="in_stock">In Stock</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                </select>

                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-10 w-full sm:w-[170px] px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 outline-none focus:ring-2 focus:ring-[#E8A87C]/40">
                                    <option value="all">Show All</option>
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="lowToHigh">Price: Low to High</option>
                                    <option value="highToLow">Price: High to Low</option>
                                </select>

                            </div>

                            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`flex items-center h-8 px-3 rounded-lg text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-[#E8A87C] text-white shadow-sm' : 'text-slate-500 hover:bg-white'
                                        }`}
                                >
                                    <TableIcon className="w-4 h-4 mr-1.5" /> Table
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex items-center h-8 px-3 rounded-lg text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-[#E8A87C] text-white shadow-sm' : 'text-slate-500 hover:bg-white'
                                        }`}
                                >
                                    <Grid3X3 className="w-4 h-4 mr-1.5" /> Grid
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Product Display */}
                <div className="p-8 bg-slate-50/30">
                    {currentProducts.length > 0 ? (
                        <>
                            {viewMode === 'grid' ? (
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
                            ) : (
                                <div className="mb-10 w-full overflow-x-auto bg-white rounded-xl border border-slate-200">
                                    <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                                        <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-3">Image</th>
                                                <th className="px-4 py-3">Product Name & SKU</th>
                                                <th className="px-4 py-3">Regular Price</th>
                                                <th className="px-4 py-3">Offer Price</th>
                                                <th className="px-4 py-3">Discount</th>
                                                <th className="px-4 py-3">Stock</th>
                                            
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentProducts.map((product) => {
                                                // Calculate dynamic discount percentage
                                                let discountText = "-";
                                                if (product.regular_price > 0 && product.offer_price < product.regular_price) {
                                                    const discount = Math.round(((product.regular_price - product.offer_price) / product.regular_price) * 100);
                                                    discountText = `${discount}% OFF`;
                                                }

                                                // Determine active/inactive properly based on "1"/"0" or strings
                                                const isActive = product.status === '1' || product.status === 'active';

                                                return (
                                                    <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                                        <td className="px-4 py-3">
                                                            <img src={product.product_image} alt="product" className="w-12 h-12 rounded object-cover border" />
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="font-medium text-slate-800">{product.titleEn}</div>
                                                            {product.sku && <div className="text-xs text-slate-500">SKU: {product.sku}</div>}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-400 line-through">৳{product.regular_price}</td>
                                                        <td className="px-4 py-3 font-semibold text-slate-800">৳{product.offer_price}</td>
                                                        <td className="px-4 py-3 font-medium text-amber-600">{discountText}</td>
                                                        <td className="px-4 py-3">{product.stock_qty}</td>
                                                     
                                                      
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-3 pt-10 border-t border-slate-200/60">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                                    </button>

                                    <div className="flex items-center gap-2 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/50">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${currentPage === page
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
                                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                                    >
                                        <ChevronRight className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-32 flex flex-col items-center justify-center text-center">
                            <div className="bg-slate-100 p-8 rounded-[3rem] mb-6 shadow-sm">
                                <SearchX className="h-16 w-16 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                We couldn't find any products matching your current filters. Try adjusting your search or clearing the filters.
                            </p>
                            <button
                                onClick={() => { setSearch(''); setStatus('all'); setStock('all'); }}
                                className="mt-6 px-6 py-2 bg-white border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}