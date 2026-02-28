import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Heart, Minus, Plus, Star, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// --- INTERFACES ---
interface GalleryItem {
    id: number;
    product_id: string;
    gal_img: string;
}

interface Product {
    id: number;
    product_title_english: string;
    product_title_bangla: string;
    product_image: string; 
    stock: string;
    seller_price: string;
    regular_price: string;
    offer_price: string;
    short_description_english: string;
    short_description_bangla: string;
    long_description_english: string;
    long_description_bangla: string;
    sku: string;
    video_link?: string;
}

const TABS = [
    { id: "features", label: "Features" },
    { id: "price", label: "Price" },
    { id: "short_desc", label: "Short Description" },
    { id: "long_desc", label: "Long Description" },
    { id: "reviews", label: "Reviews", badge: 275 }
];

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation("global");
    
    // --- STATE ---
    const [product, setProduct] = useState<Product | null>(null);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [mainImage, setMainImage] = useState<string>(""); 
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("long_desc");

    // --- API & IMAGE PATHS ---
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';
    const mainImgBase = `${baseURL}/uploads/ecommarce/product_image/`;
    const galleryImgBase = `${baseURL}/uploads/ecommarce/gal_img/`; 

    const getAuthToken = () => {
        const session = localStorage.getItem("student_session");
        if (!session) return null;
        try { return JSON.parse(session).token; } catch (e) { return null; }
    };

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = getAuthToken();
                const config = { headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }};

                const response = await axios.get(`${baseURL}/api/products/${id}`, config);
                const data = response.data?.data;
                
                if (data?.product) {
                    setProduct(data.product);
                    setMainImage(`${mainImgBase}${data.product.product_image}`);
                }

                if (data?.gallery && Array.isArray(data.gallery)) {
                    setGallery(data.gallery);
                }

            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0); 
    }, [id]);

    // --- HANDLER ---
    const addToCart = () => {
        if (!product) return;

        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingProductIndex = existingCart.findIndex((item: any) => item.id === product.id);
        
        const displayName = i18n.language === 'bn' ? product.product_title_bangla : product.product_title_english;
        const price = parseFloat(product.offer_price || product.regular_price || product.seller_price);

        const cartItem = {
            id: product.id,
            name: displayName,
            image: `${mainImgBase}${product.product_image}`,
            price: price,
            quantity: quantity
        };

        if (existingProductIndex !== -1) {
            existingCart[existingProductIndex].quantity += quantity;
        } else {
            existingCart.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(existingCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <Link to="/dashboard/allProducts" className="text-orange-600 hover:underline">Return to Shop</Link>
        </div>
    );

    const isBangla = i18n.language === 'bn';
    const title = isBangla ? product.product_title_bangla : product.product_title_english;
    const shortDesc = isBangla ? product.short_description_bangla : product.short_description_english;
    const longDesc = isBangla ? product.long_description_bangla : product.long_description_english;
    
    const currentPrice = parseFloat(product.offer_price || product.regular_price || product.seller_price);
    const regularPrice = parseFloat(product.regular_price);
    const hasDiscount = regularPrice > currentPrice;
    const discountPercent = hasDiscount ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100) : 0;
    const currentStock = parseInt(product.stock);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bg-gray-50 min-h-screen pt-4 pb-8"
        >
            <div className="mx-4 md:mx-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <nav className="flex mb-2 text-sm text-gray-500">
                        <Link to="/dashboard" className="hover:text-orange-600">Home</Link>
                        <span className="mx-2">/</span>
                        <Link to="/dashboard/allProducts" className="hover:text-orange-600">Products</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium truncate max-w-[200px]">{title}</span>
                    </nav>

                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6">
                        <div className="grid lg:grid-cols-2 gap-0">
                            
                            {/* --- IMAGES --- */}
                            <div className="p-4 md:p-6 bg-gray-50/50 flex flex-col items-center lg:border-r border-gray-100">
                                <div className="relative w-full aspect-square flex items-center justify-center mb-4 bg-white rounded-2xl border border-gray-200 p-4 group overflow-hidden">
                                    <img 
                                        src={mainImage} alt={title} 
                                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {hasDiscount && (
                                        <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                                            -{discountPercent}% OFF
                                        </span>
                                    )}
                                    <button className="absolute top-4 right-4 p-2.5 bg-white/80 rounded-full text-gray-400 hover:text-red-500 shadow-sm">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="w-full flex gap-3 overflow-x-auto pb-2 justify-center">
                                    <button 
                                        onClick={() => setMainImage(`${mainImgBase}${product.product_image}`)}
                                        className={`w-16 h-16 rounded-xl overflow-hidden border ${mainImage.includes(product.product_image) ? "ring-2 ring-orange-500" : "opacity-70"}`}
                                    >
                                        <img src={`${mainImgBase}${product.product_image}`} className="w-full h-full object-cover" />
                                    </button>
                                    {gallery.map((img) => (
                                        <button 
                                            key={img.id}
                                            onClick={() => setMainImage(`${galleryImgBase}${img.gal_img}`)}
                                            className={`w-16 h-16 rounded-xl overflow-hidden border ${mainImage.includes(img.gal_img) ? "ring-2 ring-orange-500" : "opacity-70"}`}
                                        >
                                            <img src={`${galleryImgBase}${img.gal_img}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* --- DETAILS --- */}
                            <div className="p-5 md:p-8 flex flex-col">
                                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">{title}</h1>
                                
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex text-yellow-400">
                                        {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                        <Star className="w-4 h-4 text-gray-300 fill-current" />
                                    </div>
                                    <span className="text-sm text-gray-500">(4.0) 275 Reviews</span>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">About this item</h3>
                                    <div 
                                        className="prose prose-sm text-gray-600 leading-snug"
                                        dangerouslySetInnerHTML={{ __html: shortDesc || "<li>No features listed.</li>" }}
                                    />
                                </div>

                                <div className="flex items-end gap-3 mb-8">
                                    <span className="text-3xl font-extrabold text-gray-900">৳{currentPrice}</span>
                                    {hasDiscount && <span className="text-lg text-gray-400 line-through">৳{regularPrice}</span>}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit h-12">
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
                                        <span className="w-12 text-center font-bold">{quantity}</span>
                                        <button onClick={() => setQuantity(q => (currentStock > quantity ? q + 1 : q))} className="px-4 hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
                                    </div>
                                    <Button 
                                        onClick={addToCart} disabled={currentStock === 0}
                                        className="flex-1 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold"
                                    >
                                        <ShoppingCart className="mr-2 w-5 h-5" /> {currentStock > 0 ? t('buttons.addToCart') : "Unavailable"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- TABS --- */}
                    <div className="bg-white border-t border-gray-200">
                        <div className="container mx-auto px-6 pt-6 pb-16">
                            <div className="flex flex-wrap gap-6 border-b border-gray-200 mb-6">
                                {TABS.map((tab) => (
                                    <button 
                                        key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === tab.id ? "text-sky-500" : "text-gray-500"}`}
                                    >
                                        {tab.label} {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500" />}
                                    </button>
                                ))}
                            </div>
                            
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={activeTab} 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0, y: -10 }}
                                    className="prose prose-sm max-w-none text-gray-600"
                                >
                                    {activeTab === "long_desc" && (
                                        <div dangerouslySetInnerHTML={{ __html: longDesc || "<p>No detailed description available.</p>" }} />
                                    )}

                                    {activeTab === "short_desc" && (
                                        <div dangerouslySetInnerHTML={{ __html: shortDesc || "<p>No short description available.</p>" }} />
                                    )}

                                    {activeTab === "features" && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                <span className="font-medium text-gray-900">SKU:</span>
                                                <span>{product.sku}</span>
                                            </div>
                                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                <span className="font-medium text-gray-900">Stock Status:</span>
                                                <span className={currentStock > 0 ? "text-green-600" : "text-red-600"}>
                                                    {currentStock > 0 ? "In Stock" : "Out of Stock"} ({currentStock} available)
                                                </span>
                                            </div>
                                            {/* Since 'features' aren't explicitly in the JSON, we display key specs */}
                                        </div>
                                    )}

                                    {activeTab === "price" && (
                                        <div className="bg-white p-6 rounded-xl border border-gray-100 max-w-md">
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-500">Regular Price</span>
                                                <span className="font-medium line-through">৳{regularPrice}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 pt-4">
                                                <span className="text-gray-900 font-bold">Offer Price</span>
                                                <span className="text-xl font-bold text-orange-600">৳{currentPrice}</span>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "reviews" && (
                                        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl">
                                            <Star className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                            <p>No reviews yet for this product.</p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}