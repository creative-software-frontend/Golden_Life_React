'use client'

import Marquee from "react-fast-marquee";
import { 
    ShoppingBag, Bike, Store, Building2, Gift, 
    Car, Smartphone, Package, Plane, Activity, Store as StoreIcon 
} from "lucide-react"
import { useTranslation } from 'react-i18next'

export default function CompactIconScroll() {
    const { t } = useTranslation("global");

    const items = [
        { icon: ShoppingBag, label: "Shopping", color: "#0ea5e9" },
        { icon: Bike, label: "Food", color: "#f97316" },
        { icon: Store, label: "Grocery", color: "#65a30d" },
        { icon: Building2, label: "Pharmacy", color: "#dc2626" },
        { icon: Gift, label: "Gift", color: "#9333ea" },
        { icon: Car, label: "Ride Share", color: "#059669" },
        { icon: Smartphone, label: "Top Up", color: "#d97706" },
        { icon: Package, label: "Parcel", color: "#374151" },
        { icon: Plane, label: "Air Ticket", color: "#db2777" },
        { icon: Activity, label: "Blood Bank", color: "#be123c" },
        { icon: StoreIcon, label: "Local Outlet", color: "#1d4ed8" },
    ];

    const IconItem = ({ item }: { item: typeof items[0] }) => (
        <div className="group relative flex flex-col items-center justify-center w-full cursor-pointer px-1">
            
            <div 
                className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 
                           rounded-[20px] overflow-hidden isolate shadow-sm border border-slate-100/50
                           transition-all duration-300 ease-out 
                           group-hover:shadow-lg group-hover:shadow-black/5 group-hover:-translate-y-1" 
                style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }} 
            >
                {/* 1. Background Layer: Full opacity on hover for maximum visibility */}
                <div 
                    className="absolute inset-0 opacity-[0.18] transition-all duration-500 
                               group-hover:opacity-100 group-hover:scale-100" // Fully visible background
                    style={{ backgroundColor: item.color }}
                />

                {/* 2. Glassmorphism Highlight: Makes the solid color look "polished" on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* 3. Icon: High contrast White on hover with slightly larger scale */}
                <item.icon 
                    className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 relative z-10 transition-all duration-300 
                               group-hover:text-white group-hover:scale-110 will-change-transform drop-shadow-sm" 
                    style={{ color: item.color, transform: 'translateZ(0)' }} 
                />
            </div>

            {/* Label: Darkens and bolds on hover */}
            <span className="mt-2.5 text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-tighter 
                             group-hover:text-slate-900 transition-colors duration-300 text-center leading-tight">
                {t(`label.${item.label}`, item.label)}
            </span>

            {/* Enhanced Bottom Glow */}
            <div 
                className="w-1/2 h-1 blur-md opacity-0 group-hover:opacity-60 transition-all duration-500 mt-1"
                style={{ backgroundColor: item.color }}
            />
        </div>
    );

    return (
        <section className="w-full py-6 md:py-10 bg-white">
            <div className="container mx-auto px-4 max-w-[1440px]">
                <div className="bg-slate-50/50 rounded-[32px] p-5 md:p-8 border border-slate-100 shadow-inner">
                    
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-y-8 lg:hidden">
                        {items.map((item, idx) => (
                            <IconItem key={`grid-${idx}`} item={item} />
                        ))}
                    </div>

                    <div className="hidden lg:block relative">
                        <div className="absolute left-0 inset-y-0 w-20 z-20 bg-gradient-to-r from-slate-50 via-slate-50/20 to-transparent pointer-events-none" />
                        <div className="absolute right-0 inset-y-0 w-20 z-20 bg-gradient-to-l from-slate-50 via-slate-50/20 to-transparent pointer-events-none" />

                        <Marquee speed={35} gradient={false} pauseOnHover className="overflow-visible">
                            {items.map((item, idx) => (
                                <div key={`marquee-${idx}`} className="mx-6 py-2"> 
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