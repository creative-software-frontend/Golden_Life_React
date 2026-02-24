import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Added Link import
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import useModalStore from "@/store/Store";
import { useTranslation } from "react-i18next";
import axios from "axios";

// 1. INTERFACE
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

export default function AllProduct() {
    const { id } = useParams<{ id: string }>();
    const { toggleClicked } = useModalStore();
    const { t, i18n } = useTranslation("global");

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

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

                const mappedProducts = rawData.map((item: any) => {
                    const imageUrl = `https://api.goldenlife.my/uploads/ecommarce/product_image/${item.product_image}`;

                    return {
                        id: item.id,
                        name_en: item.product_title_english,
                        name_bn: item.product_title_bangla || item.product_title_english, 
                        image: imageUrl,
                        stock: parseInt(item.stock) || 0,
                        price: parseFloat(item.offer_price || item.regular_price || item.seller_price || 0),
                        mrp: parseFloat(item.regular_price || item.seller_price || 0),
                        description: item.short_description_english
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
    }, []);

    const addToCart = (product: Product) => {
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingProductIndex = existingCart.findIndex((item: any) => item.id === product.id);
        const cartProductName = i18n.language === 'bn' ? product.name_bn : product.name_en;

        if (existingProductIndex !== -1) {
            existingCart[existingProductIndex].quantity += 1;
        } else {
            existingCart.push({ ...product, name: cartProductName, price: product.price, quantity: 1 });
        }
        localStorage.setItem("cart", JSON.stringify(existingCart));
        toggleClicked();
    };

    const calculateProgress = (mrp: number, price: number) => {
        if (!mrp || mrp <= price) return 20;
        const discount = ((mrp - price) / mrp) * 100;
        return Math.min(Math.round(discount + 40), 95);
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

    if (loading) {
        return (
            <div className="w-full h-96 flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <section className="w-full py-8 px-4 bg-gray-50/50">
            <div className="container mx-auto">
                <header className="flex justify-between items-end mb-6 px-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t("header.allProducts")}</h1>
                        <p className="text-gray-500 font-medium">Explore our complete collection</p>
                    </div>
                </header>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header Bar */}
                    <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 p-4 md:p-6">
                        <div className="bg-white/20 w-fit backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wide border border-white/20">
                            Total Products: {products.length}
                        </div>
                    </div>

                    {/* Product Grid Area */}
                    <div className="p-4 md:p-6">
                        {currentProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 mb-8">
                                    {currentProducts.map((product) => {
                                        const progress = calculateProgress(product.mrp, product.price);
                                        const displayName = i18n.language === 'bn' ? product.name_bn : product.name_en;

                                        return (
                                            <div key={product.id} className="group flex flex-col bg-white border border-gray-100 rounded-xl p-2 md:p-3 shadow-sm hover:shadow-2xl hover:border-orange-100 transition-all duration-500 transform hover:-translate-y-1 h-full">
                                                
                                                {/* LINK 1: Image Clickable */}
                                                <Link to={`/dashboard/product/${product.id}`}>
                                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 relative">
                                                        <img
                                                            src={product.image}
                                                            alt={displayName}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            onError={(e) => { 
                                                                (e.target as HTMLImageElement).src = "../../../../public/image/products/maggi.webp"; 
                                                            }}
                                                        />
                                                        <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-red-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full shadow-md">
                                                            SALE
                                                        </div>
                                                    </div>
                                                </Link>

                                                {/* Info Area */}
                                                <div className="mt-3 space-y-2 flex-grow flex flex-col justify-between">
                                                    {/* LINK 2: Text Clickable */}
                                                    <Link to={`/product/${product.id}`} className="block">
                                                        <div>
                                                            <h3 className="text-[11px] md:text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                                                                {displayName}
                                                            </h3>
                                                            
                                                            <div className="flex flex-wrap items-baseline gap-2 mt-1">
                                                                <span className="text-sm md:text-lg font-black text-gray-900">
                                                                    ৳{product.price}
                                                                </span>
                                                                {product.mrp > 0 && product.mrp !== product.price && (
                                                                    <span className="text-[10px] md:text-xs text-gray-400 line-through">
                                                                        ৳{product.mrp}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="mt-2 space-y-1">
                                                                <div className="h-1 md:h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" style={{ width: `${progress}%` }} />
                                                                </div>
                                                                <p className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase">{progress}% SOLD</p>
                                                            </div>
                                                        </div>
                                                    </Link>

                                                    {/* Button stays separate to avoid nested links */}
                                                    <Button
                                                        size="sm"
                                                        onClick={(e) => { 
                                                            e.preventDefault(); 
                                                            addToCart(product); 
                                                        }}
                                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg h-8 md:h-10 text-[10px] md:text-xs transition-all border-none shadow-md active:scale-95 flex items-center justify-center gap-1 md:gap-2 mt-2"
                                                    >
                                                        <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                                                        <span className="hidden sm:inline">{t('buttons.addToCart')}</span>
                                                        <span className="sm:hidden">Add</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* --- PAGINATION CONTROLS --- */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                                                    currentPage === page
                                                        ? "bg-orange-600 text-white shadow-md"
                                                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                                        >
                                            <ChevronRight className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                No products found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}