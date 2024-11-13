'use client'

import { useRef, useEffect } from 'react'
import { ShoppingBag, Bike, Store, Building2, Gift, Car, Smartphone, Package, Newspaper, Plane, Tv, Activity, Globe, Store as StoreIcon } from "lucide-react"

export default function AutoScrollIcons() {
    const scrollRef = useRef<HTMLDivElement>(null)

    const items = [
        { icon: ShoppingBag, label: "Shopping" },
        { icon: Bike, label: "Food" },
        { icon: Store, label: "Grocery" },
        { icon: Building2, label: "Pharmacy" },
        { icon: Gift, label: "Gift" },
        { icon: Car, label: "Ride Share" },
        { icon: Smartphone, label: "Top Up" },
        { icon: Package, label: "Parcel" },
        { icon: Smartphone, label: "Mobile" },
        { icon: Bike, label: "Drive Offer" },
        { icon: Plane, label: "Air Ticket" },
        { icon: Newspaper, label: "News Paper" },
        { icon: Tv, label: "Live TV" },
        { icon: Activity, label: "Blood Bank" },
        { icon: Globe, label: "STU Product" },
        { icon: Package, label: "Online Shop" },
        { icon: Smartphone, label: "Covid Business" },
        { icon: StoreIcon, label: "Local Outlet" },
    ]

    useEffect(() => {
        const scrollContainer = scrollRef.current
        if (scrollContainer) {
            const scrollWidth = scrollContainer.scrollWidth
            const clientWidth = scrollContainer.clientWidth

            if (scrollWidth > clientWidth) {
                const animationDuration = scrollWidth / 28 // Reduced speed (increased duration)

                scrollContainer.style.setProperty('--scroll-width', `${scrollWidth}px`)
                scrollContainer.style.setProperty('--animation-duration', `${animationDuration}s`)
                scrollContainer.classList.add('auto-scroll')
            }
        }
    }, [])

    return (
        <div className="w-full md:max-w-[1040px] bg-white ">
            <div className="border border-gray-200 rounded-lg overflow-hidden w-full md:max-w-[1040px]">
                <div
                    ref={scrollRef}
                    className="flex gap-4 p-4 overflow-x-hidden auto-scroll"
                    style={{ width: '100%', whiteSpace: 'nowrap' }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center flex-shrink-0"
                        >
                            <div className="p-1 border-2 border-gray-100 bg-white rounded-full shadow-sm ">
                                <button
                                    className="h-12 w-12 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity color-changing-icon"
                                    aria-label={item.label}
                                >
                                    <item.icon className="h-6 w-6" strokeWidth={1.5} />
                                </button>
                            </div>
                            <span className="mt-2 text-xs text-gray-600 whitespace-nowrap">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                @keyframes colorChange {
                    0% { background: linear-gradient(90deg, #38bdf8 0%, #0ea5e9 0%, #0284c7 0%); }
                    33% { background: linear-gradient(90deg, #38bdf8 100%, #0ea5e9 0%, #0284c7 0%); }
                    66% { background: linear-gradient(90deg, #38bdf8 100%, #0ea5e9 100%, #0284c7 0%); }
                    100% { background: linear-gradient(90deg, #38bdf8 100%, #0ea5e9 100%, #0284c7 100%); }
                }
                .color-changing-icon {
                    animation: colorChange 12s infinite; /* Increased duration to 12 seconds */
                    background-size: 300% 100%;
                    background-position: 0% 0%;
                }
                .auto-scroll {
                    --scroll-width: 0px;
                    --animation-duration: 0s;
                    animation: scroll var(--animation-duration) linear infinite;
                }
                @keyframes scroll {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(calc(var(--scroll-width) + 100%)); }
                }
            `}</style>
        </div>
    )
}
