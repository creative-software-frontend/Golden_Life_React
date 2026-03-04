"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import useModalStore from "@/store/Store";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { ProductCard } from "@/pages/common/ProductCard/ProductCard"; // Adjust path if necessary

export default function AllProduct() {
    const { id } = useParams<{ id: string }>();
    const { toggleClicked } = useModalStore();
    const { t, i18n } = useTranslation("global");

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
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
        } catch (e) { return null; }
    };

    // Fetch ALL Products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
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
                } else if (Array.isArray(response.data?.data)) {
                    rawData = response.data.data;
                }

                // --- IDENTICAL MAPPING LOGIC TO PRODUCTLIST ---
                const mappedProducts = rawData.map((item: any) => {
                    let imgUrl = item.product_image || item.image;
                    
                    if (!imgUrl) {
                        imgUrl = "/placeholder.svg";
                    } else if (!imgUrl.startsWith("http")) {
                        if (!imgUrl.includes("/")) {
                            imgUrl = `${baseURL}/uploads/ecommarce/product_image/${imgUrl}`;
                        } else {
                            imgUrl = `${baseURL}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;
                        }
                    }

                    return {
                        ...item,
                        id: item.id,
                        product_title_english: item.product_title_english || item.name_en || "Product",
                        product_title_bangla: item.product_title_bangla || item.name_bn || "",
                        offer_price: item.offer_price || item.price || item.seller_price || 0,
                        regular_price: item.regular_price || item.mrp || 0,
                        product_image: imgUrl
                    };
                });

                setProducts(mappedProducts);

            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [baseURL]);

    // --- IDENTICAL CART LOGIC TO PRODUCTLIST ---
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


    // --- PAGINATION LOGIC ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- SKELETON LOADER (Matched to ProductList) ---
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
                
                {/* Header matching ProductList design */}
                <div className="bg-gradient-to-r from-[#5ca367] via-[#4a8a54] to-[#3d7044] p-5 md:p-7 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                            {t("header.allProducts", "All Products")}
                        </h1>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-bold tracking-wide border border-white/20">
                        Total Products: {products.length}
                    </div>
                </div>

                <div className="p-4 md:p-8">
                    {currentProducts.length > 0 ? (
                        <>
                            {/* Reusable ProductCard Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4  gap-6 mb-8">
                                {currentProducts.map((product) => (
                                    <ProductCard
                                        key={product.id} 
                                        product={product} 
                                        baseURL={baseURL} 
                                        onAddToCart={() => handleAddToCart(product)} 
                                    />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                                                currentPage === page
                                                    ? "bg-[#5ca367] text-white shadow-md shadow-green-100 border-none"
                                                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-24 flex flex-col items-center justify-center text-slate-300">
                            <SearchX className="h-16 w-16 mb-4 opacity-20" />
                            <p className="font-black uppercase tracking-[0.2em] text-sm text-slate-400">No Products Found</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}