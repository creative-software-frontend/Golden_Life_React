'use client'

import Marquee from "react-fast-marquee";
import { ShoppingBag, Bike, Store, Building2, Gift, Car, Smartphone, Package, Plane, Activity, Store as StoreIcon } from "lucide-react"
import { useTranslation } from 'react-i18next'

export default function CompactIconScroll() {
    const { t } = useTranslation("global");

    const items = [
        { icon: ShoppingBag, label: "Shopping", color: "#38bdf8" },
        { icon: Bike, label: "Food", color: "#f97316" },
        { icon: Store, label: "Grocery", color: "#84cc16" },
        { icon: Building2, label: "Pharmacy", color: "#ef4444" },
        { icon: Gift, label: "Gift", color: "#a855f7" },
        { icon: Car, label: "Ride Share", color: "#10b981" },
        { icon: Smartphone, label: "Top Up", color: "#f59e0b" },
        { icon: Package, label: "Parcel", color: "#4b5563" },
        { icon: Plane, label: "Air Ticket", color: "#ec4899" },
        { icon: Activity, label: "Blood Bank", color: "#e11d48" },
        { icon: StoreIcon, label: "Local Outlet", color: "#2563eb" },
    ];

    const IconItem = ({ item }: { item: typeof items[0] }) => (
        <div className="group flex flex-col items-center justify-center w-full cursor-pointer">
            <div className="relative flex items-center justify-center w-11 h-11 md:w-14 md:h-14 lg:w-18 lg:h-18 rounded-2xl transition-transform duration-300 group-hover:-translate-y-1">
                <div 
                    className="absolute inset-0 rounded-2xl opacity-10 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: item.color }}
                />
                <item.icon 
                    className="w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9 relative z-10 transition-colors group-hover:text-white" 
                    style={{ color: item.color }}
                />
            </div>
            <span className="mt-2 text-[10px] md:text-xs font-bold text-gray-500 group-hover:text-gray-900 text-center leading-tight">
                {t(`label.${item.label}`, item.label)}
            </span>
        </div>
    );

    return (
        <section className="w-full py-4 md:py-8 bg-gray-50/30">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white border border-gray-100 rounded-3xl shadow-sm py-6 md:py-8 relative overflow-hidden">
                    
                    {/* --- MOBILE & TABLET: STATIC GRID (No Scroll) --- */}
                    {/* grid-cols-4 ensures exactly 4 items per row */}
                    <div className="grid grid-cols-4 gap-y-6 md:gap-y-8 lg:hidden">
                        {items.map((item, idx) => (
                            <IconItem key={`grid-${idx}`} item={item} />
                        ))}
                    </div>

                    {/* --- DESKTOP: MARQUEE (Infinite Scroll) --- */}
                    <div className="hidden lg:block relative">
                         {/* Gradients only needed for Marquee */}
                        <div className="absolute left-0 inset-y-0 w-24 z-10 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
                        <div className="absolute right-0 inset-y-0 w-24 z-10 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />

                        <Marquee speed={45} gradient={false} pauseOnHover>
                            {items.map((item, idx) => (
                                // Wrapper div for marquee spacing
                                <div key={`marquee-${idx}`} className="mx-8"> 
                                    <IconItem item={item} />
                                </div>
                            ))}
                        </Marquee>
                    </div>

                </div>
            </div>
        </section>
    );
}