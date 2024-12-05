"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useModalStore from "@/store/Store";

export default function FreshSell() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 2,
        minutes: 30,
        seconds: 0,
    });

    const scrollRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);
    const [cart, setCart] = useState<any[]>([])
    const { toggleClicked } = useModalStore();

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const products = [
        {
            id: 1,
            name: "সিল্ক কাতান শাড়ি",
            image: "../../../../public/image/products/sharee2.jpg",
            originalPrice: 829,
            discountedPrice: 813,
            progress: 75,
        },
        {
            id: 2,
            name: "Eid Collection",
            image: "../../../../public/image/products/watch.jpg",
            originalPrice: 1165,
            discountedPrice: 981,
            progress: 60,
        },
        {
            id: 3,
            name: "Skating Shoe",
            image: "../../../../public/image/products/shoe.jpg",
            originalPrice: 2820,
            discountedPrice: 2120,
            progress: 85,
        },
        {
            id: 4,
            name: "D166 Smart Watch",
            image: "../../../../public/image/products/sharee3.jpg",
            originalPrice: 460,
            discountedPrice: 348,
            progress: 45,
        },
        {
            id: 5,
            name: "Ladis Watch with",
            image: "../../../../public/image/categories/c1.jpg",
            originalPrice: 480,
            discountedPrice: 435,
            progress: 90,
        },
        {
            id: 6,
            name: "Pulse Oximeter A",
            image: "../../../../public/image/products/pulseoximeter.jpg",

            originalPrice: 1180,
            discountedPrice: 1157,
            progress: 30,
        },
    ];

    const handleMouseDown = (e: React.MouseEvent) => {
        
        if (scrollRef.current) {
            isDraggingRef.current = true;
            startXRef.current = e.clientX - scrollRef.current.offsetLeft;
            scrollLeftRef.current = scrollRef.current.scrollLeft;

            scrollRef.current.style.cursor = "grabbing";

            scrollRef.current.addEventListener("mousemove", handleMouseMove);
            scrollRef.current.addEventListener("mouseup", handleMouseUp);
            scrollRef.current.addEventListener("mouseleave", handleMouseUp);
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current || !scrollRef.current) return;

        const x = e.clientX - scrollRef.current.offsetLeft;
        const walk = (x - startXRef.current) * 1.5; // Adjust the speed here
        scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
        if (scrollRef.current) {
            scrollRef.current.removeEventListener("mousemove", handleMouseMove);
            scrollRef.current.removeEventListener("mouseup", handleMouseUp);
            scrollRef.current.removeEventListener("mouseleave", handleMouseUp);
            scrollRef.current.style.cursor = "grab"; // Reset cursor
        }
    };

    // const addToCart = (product: any) => {
    //     const updatedCart = [...cart, product];
    //     setCart(updatedCart);
    //     localStorage.setItem("cart", JSON.stringify(updatedCart));
    //     toggleClicked(); // trigger to update cart on other components
    // }
    const addToCart = (product: any) => {
        // Retrieve existing cart items from localStorage
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

        // Add the product to the cart array
        const updatedCart = [...existingCart, product];

        // Update state and localStorage
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toggleClicked(); // Trigger update in other components
    };

    return (
        <div className="  md:max-w-[1040px]  w-[370px]   sm:w-full">
            <div className="bg-orange-500 text-white px-4 py-3 flex items-center justify-between">
                <span className="font-medium">Fresh Sell</span>
                <div className="flex gap-1">
                    <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span>:</span>
                    <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span>:</span>
                    <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
                <Link to="/allProducts" className="flex items-center hover:underline">
                    All Products
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            <div
                className="flex gap-4 overflow-x-auto cursor-grab"
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                style={{ scrollbarWidth: 'none' }} // For Firefox
            >
                {products.map((product) => (
                    <Link
                        key={product.id}
                        to="#"
                        className="flex-none  w-[200px] md:w-[200px] bg-white  overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <div className="aspect-square">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105"
                            />
                        </div>
                        <div className="p-3">
                            <h3 className="text-sm font-medium line-clamp-2 mb-2">
                                {product.name}
                            </h3>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-lg font-bold">৳ {product.discountedPrice}</span>
                                <span className="text-sm text-gray-500 line-through">৳ {product.originalPrice}</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-ful overflow-hidden">
                                <div
                                    className="h-full bg-orange-500 rounded-full"
                                    style={{ width: `${product.progress}%` }}
                                />
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    addToCart(product); // Add product to the cart
                                }}
                                className="w-full mt-2"
                            >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add
                            </Button>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
}
