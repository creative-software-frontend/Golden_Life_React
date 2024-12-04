'use client'

import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import { useRef } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Button } from "@/components/ui/button"

const products = [
    { name: "Koss KPH7 Portable", price: "£60.00", discount: "-10%", oldPrice: "£86.00", image: "../../../../public/image/products/airpods.jpg" },
    { name: "Beats Solo2 Solo 2", price: "£60.00", image: "../../../../public/image/products/beats.jpg" },
    { name: "Beats EP Wired", price: "£60.00", oldPrice: "£86.00", discount: "-7%", image: "../../../../public/image/products/headphone.jpg" },
    { name: "Bose SoundLink Bluetooth", price: "£60.00", image: "../../../../public/image/products/sony.jpg" },
    { name: "Sony WH-1000XM4", price: "£299.00", image: "../../../../public/image/products/watch.jpg" },
    { name: "AirPods Pro", price: "£249.00", discount: "-5%", oldPrice: "£262.00", image: "../../../../public/image/products/pulseoximeter.jpg" }
]

export default function TrendingCategory() {
    const sliderRef = useRef<Slider>(null)

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    }

    return (
        <section className="py-4 px-4 overflow-hidden md:max-w-[1040px] w-full">
            <div className="container mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-4">Trending Products</h2>
                    <p className="text-muted-foreground">
                        Contemporary, minimal and modern designs embody the Lavish Alice handwriting
                    </p>
                </div>

                <div className="relative">
                    <Slider ref={sliderRef} {...settings}>
                        {products.map((product, index) => (
                            <div key={index} className="px-3">
                                <div className="bg-background rounded-lg shadow-md overflow-hidden">
                                    <div className="p-4">
                                        <div className="relative aspect-square mb-4">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="rounded-md object-cover w-full h-full"
                                            />
                                            {product.discount && (
                                                <span className="absolute top-2 right-2 bg-orange-500 text-white text-sm px-2 py-1 rounded">
                                                    {product.discount}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-medium mb-2 text-start">{product.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold">{product.price}</p>
                                                {product.oldPrice && (
                                                    <p className="text-sm text-muted-foreground line-through">{product.oldPrice}</p>
                                                )}
                                            </div>
                                            <Button size="sm" variant="outline">
                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>

                    <button
                        className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background shadow-md flex items-center justify-center z-10"
                        onClick={() => sliderRef.current?.slickPrev()}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background shadow-md flex items-center justify-center z-10"
                        onClick={() => sliderRef.current?.slickNext()}
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </section>
    )
}

