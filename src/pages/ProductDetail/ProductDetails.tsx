import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Heart, ArrowLeft, Minus, Plus, Check, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import useModalStore from "@/store/Store";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { motion } from "framer-motion";

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
    const [activeTab, setActiveTab] = useState("description");

    // --- API & IMAGE PATHS ---
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';
    // Path for the main product image
    const mainImgBase = `${baseURL}/uploads/ecommarce/product_image/`;
    // Path for gallery images (Adjust if your server uses a different folder like 'product_gallery')
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
                    // Set initial main image
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
        window.scrollTo(0, 0); // Scroll to top on load
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
            quantity: quantity
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
                
                {/* Breadcrumb Navigation */}
                <nav className="flex mb-6 text-sm text-gray-500">
                    <Link to="/dashboard" className="hover:text-orange-600 transition-colors">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/dashboard/allProducts" className="hover:text-orange-600 transition-colors">Products</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{title}</span>
                </nav>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
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
                                    {/* Main Product Image Thumb */}
                                    <button 
                                        onClick={() => setMainImage(`${mainImgBase}${product.product_image}`)}
                                        className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 ${mainImage.includes(product.product_image) ? "ring-2 ring-orange-500 ring-offset-2 opacity-100" : "opacity-70 hover:opacity-100 border border-gray-200"}`}
                                    >
                                        <img src={`${mainImgBase}${product.product_image}`} className="w-full h-full object-cover" alt="Main" />
                                    </button>

                                    {/* Gallery Images Thumbs */}
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
                            <div className="flex-grow">
                                {/* Meta Header */}
                                <div className="flex justify-between items-center mb-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${currentStock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        <div className={`w-2 h-2 rounded-full ${currentStock > 0 ? "bg-green-600" : "bg-red-600"}`}></div>
                                        {currentStock > 0 ? "In Stock" : "Out of Stock"}
                                    </span>
                                    {product.sku && <span className="text-gray-400 text-xs font-mono bg-gray-50 px-2 py-1 rounded">SKU: {product.sku}</span>}
                                </div>

                                {/* Title */}
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-6 leading-tight">
                                    {title}
                                </h1>

                                {/* Price */}
                                <div className="flex items-end gap-3 mb-8 pb-8 border-b border-dashed border-gray-200">
                                    <span className="text-4xl font-extrabold text-orange-600 tracking-tight">৳{currentPrice}</span>
                                    {hasDiscount && (
                                        <div className="flex flex-col mb-1">
                                            <span className="text-lg text-gray-400 line-through decoration-2">৳{regularPrice}</span>
                                            <span className="text-xs text-red-500 font-bold">Save ৳{regularPrice - currentPrice}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Short Description */}
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Quick Overview</h3>
                                    <div 
                                        className="prose prose-sm text-gray-600 max-w-none leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: shortDesc || "No description available." }}
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                    {/* Quantity */}
                                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden w-fit shadow-sm">
                                        <button 
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                                            className="p-3.5 hover:bg-gray-100 transition-colors active:bg-gray-200"
                                        >
                                            <Minus className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <span className="w-14 text-center font-bold text-lg text-gray-900">{quantity}</span>
                                        <button 
                                            onClick={() => setQuantity(q => (currentStock > quantity ? q + 1 : q))} 
                                            className="p-3.5 hover:bg-gray-100 transition-colors active:bg-gray-200"
                                        >
                                            <Plus className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>

                                    {/* Add Button */}
                                    <Button 
                                        onClick={addToCart}
                                        disabled={currentStock === 0}
                                        className="flex-1 py-7 text-lg bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg shadow-orange-200 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ShoppingCart className="mr-2 w-5 h-5" /> 
                                        {currentStock > 0 ? t('buttons.addToCart') : "Unavailable"}
                                    </Button>
                                    
                                    <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-blue-600 transition-colors shadow-sm">
                                        <Share2 className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 text-green-800">
                                    <div className="bg-white p-1.5 rounded-full shadow-sm"><Check className="w-4 h-4 text-green-600" /></div>
                                    <span className="text-xs font-bold">100% Authentic</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 text-blue-800">
                                    <div className="bg-white p-1.5 rounded-full shadow-sm"><Check className="w-4 h-4 text-blue-600" /></div>
                                    <span className="text-xs font-bold">Safe Payment</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- BOTTOM SECTION: TABS --- */}
                    <div className="border-t border-gray-200 bg-gray-50">
                        <div className="container mx-auto px-6 md:px-12 py-10">
                            <div className="flex gap-8 border-b border-gray-200 mb-8">
                                <button 
                                    onClick={() => setActiveTab("description")}
                                    className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === "description" ? "text-orange-600" : "text-gray-500 hover:text-gray-800"}`}
                                >
                                    Description
                                    {activeTab === "description" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-t-full" />}
                                </button>
                                {product.video_link && (
                                    <button 
                                        onClick={() => setActiveTab("video")}
                                        className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === "video" ? "text-orange-600" : "text-gray-500 hover:text-gray-800"}`}
                                    >
                                        Video Review
                                        {activeTab === "video" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-t-full" />}
                                    </button>
                                )}
                            </div>

                            <motion.div 
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
                            >
                                {activeTab === "description" && (
                                    <div className="prose max-w-none text-gray-700 leading-8">
                                        <div dangerouslySetInnerHTML={{ __html: longDesc || "<p>No detailed description available.</p>" }} />
                                    </div>
                                )}
                                {activeTab === "video" && product.video_link && (
                                    <div className="aspect-video w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg bg-black">
                                        <iframe 
                                            width="100%" 
                                            height="100%" 
                                            src={product.video_link.includes("watch?v=") ? product.video_link.replace("watch?v=", "embed/") : product.video_link} 
                                            title="Product Video"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </motion.div>
    );
}