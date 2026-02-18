"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ShoppingCart, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useModalStore from "@/store/Store";
import { useTranslation } from "react-i18next";

export default function FreshSell() {
    const [t] = useTranslation('global');
    const [timeLeft, setTimeLeft] = useState({
        hours: 2,
        minutes: 30,
        seconds: 0,
    });

    const { toggleClicked } = useModalStore();

    // Flash Sale Timer Logic
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

    const products = [
        { id: 1, name: t('products.Silk Katan Saree'), image: "../../../../public/image/products/sharee2.jpg", originalPrice: 829, discountedPrice: 813, progress: 75 },
        { id: 2, name: t('products.EidCollection'), image: "../../../../public/image/products/watch.jpg", originalPrice: 1165, discountedPrice: 981, progress: 60 },
        { id: 3, name: t('products.SkatingShoe'), image: "../../../../public/image/products/shoe.jpg", originalPrice: 2820, discountedPrice: 2120, progress: 85 },
        { id: 4, name: t('products.samsungGalaxy'), image: "../../../../public/image/products/sharee3.jpg", originalPrice: 460, discountedPrice: 348, progress: 45 },
        { id: 5, name: t('products.LadisWatchwith'), image: "../../../../public/image/categories/c1.jpg", originalPrice: 480, discountedPrice: 435, progress: 90 },
        { id: 6, name: t('products.pulseOximeter'), image: "../../../../public/image/products/pulseoximeter.jpg", originalPrice: 1180, discountedPrice: 1157, progress: 30 },
    ];

    const addToCart = (product: any) => {
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingProductIndex = existingCart.findIndex((item: any) => item.id === product.id);

        if (existingProductIndex !== -1) {
            existingCart[existingProductIndex].quantity += 1;
        } else {
            existingCart.push({ ...product, price: product.discountedPrice, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(existingCart));
        toggleClicked();
    };

    return (
        <section className="py-8 md:py-12 mt-4 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                
                {/* Header Bar - Responsive Flex */}
                <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
                        <div className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wide border border-white/20 text-center">
                            {t('sections.freshSell')}
                        </div>
                        
                        {/* Countdown Timer */}
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

                {/* Responsive Grid Area */}
                {/* 2 Cols Mobile | 3 Cols Tablet | 6 Cols Desktop */}
                <div className="p-4 md:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group flex flex-col bg-white border border-gray-100 rounded-xl p-2 md:p-3 shadow-sm hover:shadow-2xl hover:border-orange-100 transition-all duration-500 transform hover:-translate-y-1 h-full"
                            >
                                {/* Image Wrap */}
                                <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Flash Badge */}
                                    <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-red-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full shadow-md">
                                        FLASH
                                    </div>
                                </div>

                                {/* Info Area */}
                                <div className="mt-3 space-y-2 flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-[11px] md:text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        
                                        <div className="flex flex-wrap items-baseline gap-1 md:gap-2 mt-1">
                                            <span className="text-sm md:text-lg font-black text-gray-900">৳{product.discountedPrice}</span>
                                            <span className="text-[10px] md:text-xs text-gray-400 line-through">৳{product.originalPrice}</span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-2 space-y-1">
                                            <div className="h-1 md:h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                                                    style={{ width: `${product.progress}%` }}
                                                />
                                            </div>
                                            <p className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase">{product.progress}% SOLD</p>
                                        </div>
                                    </div>

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
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}