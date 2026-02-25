import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Heart, ArrowLeft, Minus, Plus, Check, Share2, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import useModalStore from "@/store/Store";
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

// --- MOCK DATA FOR UI (Since API doesn't provide these yet) ---
const MOCK_COLORS = [
    { name: "Light Blue", hex: "#60a5fa" },
    { name: "Dark Blue", hex: "#1e3a8a" },
    { name: "Red", hex: "#ef4444" },
    { name: "Black", hex: "#111827" }
];

const MOCK_SIZES = ["Small", "Medium", "Large"];

const TABS = [
    { id: "features", label: "Features" },
    { id: "price", label: "Price" },
    { id: "short_desc", label: "Short Description" },
    { id: "long_desc", label: "Long Description" },
    { id: "reviews", label: "Reviews", badge: 275 }
];

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const { toggleClicked } = useModalStore();
    const { t, i18n } = useTranslation("global");
    
    // --- STATE ---
    const [product, setProduct] = useState<Product | null>(null);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [mainImage, setMainImage] = useState<string>(""); 
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    
    // New UI State
    const [activeTab, setActiveTab] = useState("long_desc");
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState("Small");

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

    // --- HANDLERS ---
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
            quantity: quantity,
            // You can add size/color here if your cart supports it
            size: selectedSize, 
            color: MOCK_COLORS[selectedColorIndex].name
        };

        if (existingProductIndex !== -1) {
            existingCart[existingProductIndex].quantity += quantity;
        } else {
            existingCart.push(cartItem);
        }
        localStorage.setItem("cart", JSON.stringify(existingCart));
        toggleClicked();
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

    // --- DISPLAY LOGIC ---
    const isBangla = i18n.language === 'bn';
    const title = isBangla ? product.product_title_bangla : product.product_title_english;
    const shortDesc = isBangla ? product.short_description_bangla : product.short_description_english;
    const longDesc = isBangla ? product.long_description_bangla : product.long_description_english;
    
    // Price Calculation
    const currentPrice = parseFloat(product.offer_price || product.regular_price || product.seller_price);
    const regularPrice = parseFloat(product.regular_price);
    const hasDiscount = regularPrice > currentPrice;
    const discountPercent = hasDiscount ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100) : 0;
    const currentStock = parseInt(product.stock);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="bg-gray-50 min-h-screen py-6 md:py-10"
        >
        <div className="mx-4 md:mx-8">

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumb */}
                <nav className="flex mb-6 text-sm text-gray-500">
                    <Link to="/dashboard" className="hover:text-orange-600 transition-colors">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/dashboard/allProducts" className="hover:text-orange-600 transition-colors">Products</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{title}</span>
                </nav>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-10">
                    <div className="grid lg:grid-cols-2 gap-0">
                        
                        {/* --- LEFT COLUMN: IMAGES --- */}
                        <div className="p-6 md:p-10 bg-gray-50/50 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-gray-100">
                            
                            {/* Main Image Stage */}
                            <div className="relative w-full aspect-square flex items-center justify-center mb-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 group overflow-hidden">
                                <img 
                                    src={mainImage} 
                                    alt={title} 
                                    className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => (e.target as HTMLImageElement).src = "https://placehold.co/600?text=Image+Not+Found"}
                                />
                                {hasDiscount && (
                                    <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg animate-pulse">
                                        -{discountPercent}% OFF
                                    </span>
                                )}
                                <button className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Gallery Thumbnails */}
                            <div className="w-full">
                                <div className="flex gap-3 overflow-x-auto pb-4 px-1 no-scrollbar items-center justify-start lg:justify-center">
                                    <button 
                                        onClick={() => setMainImage(`${mainImgBase}${product.product_image}`)}
                                        className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 ${mainImage.includes(product.product_image) ? "ring-2 ring-orange-500 ring-offset-2 opacity-100" : "opacity-70 hover:opacity-100 border border-gray-200"}`}
                                    >
                                        <img src={`${mainImgBase}${product.product_image}`} className="w-full h-full object-cover" alt="Main" />
                                    </button>

                                    {gallery.map((img) => (
                                        <button 
                                            key={img.id}
                                            onClick={() => setMainImage(`${galleryImgBase}${img.gal_img}`)}
                                            className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 ${mainImage.includes(img.gal_img) ? "ring-2 ring-orange-500 ring-offset-2 opacity-100" : "opacity-70 hover:opacity-100 border border-gray-200"}`}
                                        >
                                            <img 
                                                src={`${galleryImgBase}${img.gal_img}`} 
                                                className="w-full h-full object-cover" 
                                                alt="Gallery"
                                                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* --- RIGHT COLUMN: DETAILS --- */}
                        <div className="p-6 md:p-10 lg:p-12 flex flex-col h-full">
                            
                            {/* Title & Reviews */}
                            <div className="mb-2">
                                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">
                                    {title}
                                </h1>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex text-yellow-400">
                                        {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                        <Star className="w-4 h-4 text-gray-300 fill-current" />
                                    </div>
                                    <span className="text-sm text-gray-500">(4.0) 275 Reviews</span>
                                </div>
                            </div>

                            {/* About this item (Short Desc) */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">About this item</h3>
                                <div 
                                    className="prose prose-sm text-gray-600 max-w-none leading-snug ul:list-disc ul:pl-4"
                                    dangerouslySetInnerHTML={{ __html: shortDesc || "<li>No specific features listed.</li>" }}
                                />
                            </div>

                            {/* Colors */}
                            <div className="mb-6">
                                <div className="flex items-center gap-1 mb-2">
                                    <span className="text-sm font-medium text-gray-900">Colors</span>
                                    <span className="text-red-500">*</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {MOCK_COLORS.map((color, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedColorIndex(idx)}
                                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedColorIndex === idx ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent"}`}
                                        >
                                            <span 
                                                className="w-6 h-6 rounded-full block border border-black/10" 
                                                style={{ backgroundColor: color.hex }} 
                                            />
                                            {selectedColorIndex === idx && (
                                                <Check className="w-4 h-4 text-white absolute" strokeWidth={3} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className="mb-8">
                                <div className="mb-2">
                                    <span className="text-sm font-medium text-gray-900">Size</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {MOCK_SIZES.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all 
                                            ${selectedSize === size 
                                                ? "bg-sky-500 text-white border-sky-600 shadow-md" 
                                                : "bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-100"}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-end gap-3 mb-6">
                                <span className="text-3xl font-extrabold text-gray-900">৳{currentPrice}</span>
                                {hasDiscount && (
                                    <span className="text-lg text-gray-400 line-through mb-1">৳{regularPrice}</span>
                                )}
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit h-12">
                                    <button 
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                                        className="px-4 h-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center"
                                    >
                                        <Minus className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(q => (currentStock > quantity ? q + 1 : q))} 
                                        className="px-4 h-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center"
                                    >
                                        <Plus className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>

                                <Button 
                                    onClick={addToCart}
                                    disabled={currentStock === 0}
                                    className="flex-1 h-12 text-base bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md transition-all disabled:opacity-50"
                                >
                                    <ShoppingCart className="mr-2 w-5 h-5" /> 
                                    {currentStock > 0 ? t('buttons.addToCart') : "Unavailable"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* --- BOTTOM SECTION: TABS --- */}
                    <div className="border-t border-gray-200 bg-white">
                        <div className="container mx-auto px-6 md:px-12 pt-8 pb-16">
                            
                            {/* Tab Headers */}
                            <div className="flex flex-wrap gap-6 md:gap-8 border-b border-gray-200 mb-8">
                                {TABS.map((tab) => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`pb-3 text-sm font-semibold transition-all relative whitespace-nowrap flex items-center gap-2 
                                        ${activeTab === tab.id ? "text-sky-500" : "text-gray-500 hover:text-gray-800"}`}
                                    >
                                        {tab.label}
                                        {tab.badge && (
                                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] rounded-full">
                                                {tab.badge}
                                            </span>
                                        )}
                                        {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500 rounded-t-full" />}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="min-h-[200px]"
                                >
                                    {/* MAPPING CONTENT BASED ON TAB */}
                                    {activeTab === "long_desc" && (
                                        <div>
                                            <h4 className="text-sky-500 font-medium mb-2">Long Description {isBangla ? 'Bangla' : 'English'}</h4>
                                            <div className="prose max-w-none text-gray-600">
                                                <div dangerouslySetInnerHTML={{ __html: longDesc || "<p>No detailed description available.</p>" }} />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "short_desc" && (
                                        <div>
                                            <h4 className="text-sky-500 font-medium mb-2">Summary</h4>
                                            <div className="prose max-w-none text-gray-600">
                                                <div dangerouslySetInnerHTML={{ __html: shortDesc || "<p>No summary available.</p>" }} />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "features" && (
                                        <div className="text-gray-600">
                                            <p className="mb-2">Product Specific Features:</p>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>Original Product</li>
                                                <li>High Quality Material</li>
                                                <li>SKU: {product.sku || 'N/A'}</li>
                                                <li>Stock Status: {currentStock > 0 ? 'In Stock' : 'Out of Stock'}</li>
                                            </ul>
                                        </div>
                                    )}

                                    {activeTab === "price" && (
                                        <div className="bg-gray-50 p-6 rounded-lg max-w-md">
                                            <div className="flex justify-between py-2 border-b">
                                                <span>Regular Price</span>
                                                <span className="line-through text-gray-400">৳{regularPrice}</span>
                                            </div>
                                            <div className="flex justify-between py-2 font-bold text-gray-900">
                                                <span>Current Price</span>
                                                <span className="text-orange-600">৳{currentPrice}</span>
                                            </div>
                                            {hasDiscount && (
                                                <div className="mt-2 text-green-600 text-sm">
                                                    You save ৳{regularPrice - currentPrice} ({discountPercent}%)
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === "reviews" && (
                                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                                            <Star className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                                            <p>No reviews yet.</p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        </motion.div>
    );
}