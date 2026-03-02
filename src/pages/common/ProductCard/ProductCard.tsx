import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
    product?: any;
    baseURL?: string;
    onAddToCart?: (product: any) => void;
    isSkeleton?: boolean;
}

export const ProductCard = ({ product, baseURL, onAddToCart, isSkeleton = false }: ProductCardProps) => {
    // --- SKELETON STATE ---
    if (isSkeleton) {
        return (
            <div className="flex flex-col bg-white rounded-2xl p-3 border border-slate-100 h-full animate-pulse">
                <div className="aspect-[4/3] w-full rounded-xl bg-slate-100 mb-4" />
                <div className="space-y-2 px-1">
                    <div className="h-2 bg-slate-100 rounded-full w-1/4" />
                    <div className="h-4 bg-slate-100 rounded-full w-full" />
                    <div className="h-10 bg-slate-100 rounded-lg w-full" />
                </div>
            </div>
        );
    }

    const discount = product.regular_price > product.offer_price
        ? Math.round(((product.regular_price - product.offer_price) / product.regular_price) * 100)
        : 0;

    return (
        /* The 'group' class here allows the image inside to react when this div is hovered */
        <div className="group relative flex flex-col bg-white rounded-[20px] p-3 border border-slate-100 h-full overflow-hidden transition-all duration-500 ease-out hover:bg-emerald-50/50 hover:border-emerald-500/20 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.12)]">

            {/* 1. IMAGE SECTION (Scaler Effect applied via group-hover) */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] bg-white">
                <img
                    src={product.product_image?.startsWith('http') ? product.product_image : `${baseURL}/uploads/ecommarce/product_image/${product.product_image}`}
                    alt={product.product_title_english}
                    /* group-hover:scale-110 triggers when the parent card is touched */
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-110"
                    style={{ willChange: 'transform' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=No+Image"; }}
                />

                {/* Minimalist Discount Badge */}
                {discount > 0 && (
                    <div className="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm z-10">
                        -{discount}%
                    </div>
                )}
            </div>

            {/* 2. INFO SECTION */}
            <div className="flex flex-col pt-4 pb-1 px-1 flex-grow">

                {/* Subheading (Small & black/80) */}
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-semibold text-black/80 uppercase tracking-widest">
                        Clothing
                    </span>
                    {parseInt(product.stock) <= 10 && (
                        <span className="text-[9px] font-bold text-rose-500">Low Stock</span>
                    )}
                </div>

                {/* Title */}
                <h3 className="line-clamp-2 text-[14px] font-bold text-slate-800 leading-snug min-h-[40px]">
                    {product.product_title_english}
                </h3>

                {/* Pricing (Emerald Primary) */}
                <div className="flex items-baseline gap-2 mt-2 mb-4">
                    <span className="text-[18px] font-black text-emerald-600">৳{product.offer_price}</span>
                    {product.regular_price && parseFloat(product.regular_price) > parseFloat(product.offer_price) && (
                        <span className="text-[12px] font-medium text-slate-300 line-through tracking-tight">
                            ৳{product.regular_price}
                        </span>
                    )}
                </div>

                {/* 3. EQUAL WIDTH BUTTONS */}
                <div className="mt-auto grid grid-cols-2 gap-2.5 w-full">
                    <button
                        onClick={() => onAddToCart?.(product)}
                        /* Mobile: h-12 (48px), Tablet/MD: h-10 (40px) */
                        className="flex items-center justify-center gap-2 h-12 md:h-10 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] md:text-[12px] transition-all active:scale-95 shadow-sm shadow-emerald-200"
                    >
                        <ShoppingCart className="w-4 h-4 md:w-3.5 md:h-3.5" />
                        Cart
                    </button>

                    <Link
                        to={`/dashboard/product/${product.id}`}
                        /* Mobile: h-12, Tablet/MD: h-10 */
                        className="flex items-center justify-center h-12 md:h-10 w-full rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-[13px] md:text-[12px] hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                    >
                        Details
                    </Link>
                </div>
            </div>
        </div>
    );
};