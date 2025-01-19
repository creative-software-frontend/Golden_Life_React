'use client'

import { useRef, useEffect, useState } from 'react'
import { ShoppingBag, Bike, Store, Building2, Gift, Car, Smartphone, Package, Newspaper, Plane, Tv, Activity, Globe, Store as StoreIcon } from "lucide-react"
import { useTranslation } from 'react-i18next'

export default function RightToLeftIconScroll() {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [itemWidth, setItemWidth] = useState(80) // Default width, will be updated
const [t] = useTranslation("global");
    const items = [
        { icon: ShoppingBag, label: t("label.Shopping") },
        { icon: Bike, label: t("label.Food") },
        { icon: Store, label: t("label.Grocery") },
        { icon: Building2, label: t("label.Pharmacy") },
        { icon: Gift, label: t("label.Gift") },
        { icon: Car, label: t("label.Ride Share") },
        { icon: Smartphone, label: t("label.Top Up") },
        { icon: Package, label: t("label.Parcel") },
        { icon: Smartphone, label: t("label.Mobile") },
        { icon: Bike, label: t("label.Drive Offer") },
        { icon: Plane, label: t("label.Air Ticket") },
        { icon: Newspaper, label: t("label.News Paper") },
        { icon: Tv, label: t("label.Live TV") },
        { icon: Activity, label: t("label.Blood Bank") },
        { icon: Globe, label: t("label.STU Product") },
        { icon: Package, label: t("label.Online Shop") },
        { icon: Smartphone, label: t("label.Covid Business") },
        { icon: StoreIcon, label: t("label.Local Outlet") },
    ];

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
        return colorMap[label] || "#000"
    }

    useEffect(() => {
        const scrollContainer = scrollRef.current
        if (scrollContainer) {
            const updateDimensions = () => {
                const containerWidth = scrollContainer.offsetWidth
                const newItemWidth = Math.floor(containerWidth / Math.floor(containerWidth / 80))
                setItemWidth(newItemWidth)

                const totalWidth = items.length * newItemWidth
                scrollContainer.style.setProperty('--total-width', `${totalWidth}px`)
                scrollContainer.style.setProperty('--item-width', `${newItemWidth}px`)

                // Adjust animation duration based on the number of items
                const animationDuration = items.length * 2 // 2 seconds per item
                scrollContainer.style.setProperty('--animation-duration', `${animationDuration}s`)
            }

            updateDimensions()
            window.addEventListener('resize', updateDimensions)

            return () => window.removeEventListener('resize', updateDimensions)
        }
    }, [items])

    return (
        <div className="  md:max-w-[1100px] w-[370px] sm:w-full bg-white overflow-hidden">
            <div className="border border-gray-200 rounded-lg w-full md:max-w-[1040px] relative py-2 ">
                <div
                    ref={scrollRef}
                    className="flex overflow-hidden right-to-left-scroll "
                    style={{ direction: 'rtl' }} // This makes the content flow from right to left
                >
                    {items.concat(items).map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-start flex-shrink-0"
                            style={{ width: `${itemWidth}px`, direction: 'ltr' }} // Reset direction for icon and text
                        >
                            <div className="p-1 border-2 rounded-full bg-white">
                                <button
                                    className="h-16 w-16 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                                    aria-label={item.label}
                                    style={{ backgroundColor: getColor(item.label) }}
                                >
                                    <item.icon className="h-8 w-8" strokeWidth={1.5} />
                                </button>
                            </div>
                            <span className="mt-1 text-xs text-gray-600 whitespace-nowrap">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                .right-to-left-scroll {
                    --total-width: 0px;
                    --item-width: 0px;
                    --animation-duration: 0s;
                    width: calc(var(--total-width) * 2);
                    animation: rightToLeftScroll var(--animation-duration) linear infinite;
                }
                @keyframes rightToLeftScroll {
                    0% {
                        transform: translateX(calc(-1 * var(--total-width)));
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    )
}