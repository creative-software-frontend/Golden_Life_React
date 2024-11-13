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

    const getColor = (label: string) => {
        const colorMap: { [key: string]: string } = {
            "Shopping": "#38bdf8",
            "Food": "#f97316",
            "Grocery": "#84cc16",
            "Pharmacy": "#ef4444",
            "Gift": "#a855f7",
            "Ride Share": "#10b981",
            "Top Up": "#f59e0b",
            "Parcel": "#4b5563",
            "Mobile": "#3b82f6",
            "Drive Offer": "#8b5cf6",
            "Air Ticket": "#ec4899",
            "News Paper": "#10b981",
            "Live TV": "#0ea5e9",
            "Blood Bank": "#e11d48",
            "STU Product": "#14b8a6",
            "Online Shop": "#d97706",
            "Covid Business": "#db2777",
            "Local Outlet": "#2563eb",
        }
        return colorMap[label] || "#000"; // Default to black if no match
    }

    useEffect(() => {
        const scrollContainer = scrollRef.current
        if (scrollContainer) {
            const scrollWidth = scrollContainer.scrollWidth
            const clientWidth = scrollContainer.clientWidth

            if (scrollWidth > clientWidth) {
                const animationDuration = scrollWidth / 28

                scrollContainer.style.setProperty('--scroll-width', `${scrollWidth}px`)
                scrollContainer.style.setProperty('--animation-duration', `${animationDuration * 2}s`) // Increase time here
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
                            <div className="p-1 border-2 border-gray-100 bg-white rounded-full shadow-sm">
                                <button
                                    className="h-12 w-12 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                                    aria-label={item.label}
                                    style={{ backgroundColor: getColor(item.label) }}
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
