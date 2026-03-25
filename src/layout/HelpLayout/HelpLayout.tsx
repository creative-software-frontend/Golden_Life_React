"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import axios from "axios"
import { 
    Link, Outlet, useLocation, useNavigate 
} from "react-router-dom"
import {
    ChevronRight, ShoppingCart, GraduationCap, Package, 
    Truck, Pill, HelpCircleIcon, Carrot, Baby, Home, 
    Scissors, Snowflake, Milk, Fish, Coffee, Cookie, 
    Tags, HelpCircle, Loader2, LogInIcon, XCircle, ChefHat
} from 'lucide-react'

import { useTranslation } from "react-i18next"
import { 
    SidebarProvider, 
    SidebarInset 
} from "@/components/ui/sidebar"

export default function HelpLayout() {
    const { t } = useTranslation("global")
    const location = useLocation()
    const navigate = useNavigate()
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my'

    // --- STATE ---
    const [searchTerm, setSearchTerm] = React.useState('')
    const [categories, setCategories] = React.useState<any[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = React.useState(true)

    const handleClear = () => setSearchTerm('')

    // --- BANNER LOGIC ---
    const getBannerForPage = () => {
        const titleStyle = "text-2xl md:text-4xl font-black tracking-tight drop-shadow-sm"
        // Updated paths to match /dashboard/help structure
        switch (location.pathname) {
            case '/dashboard/help/our-story': return <h1 className={titleStyle}>{t("Hmenu.story")}</h1>;
            case '/dashboard/help/career': return <h1 className={titleStyle}>{t("Hmenu.Career")}</h1>;
            case '/dashboard/help/contact': return <h1 className={titleStyle}>{t("Hmenu.ContactUs")}</h1>;
            case '/dashboard/help/privacy-policy': return <h1 className={titleStyle}>{t("Hmenu.PrivacyPolicy")}</h1>;
            case '/dashboard/help/terms': return <h1 className={titleStyle}>{t("Hmenu.TermsofUse")}</h1>;
            case '/dashboard/help/profile/settings': return <h1 className={titleStyle}>Profile Settings</h1>;
            default: return <h1 className={titleStyle}>{t("Hmenu.WelcometoHelp")}</h1>;
        }
    }

    // --- HELPER: Active Tab Styling ---
    const getTabClass = (path: string) => {
        const isActive = location.pathname === path;
        return cn(
            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
            isActive 
                ? "border-secondary text-secondary" 
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
        );
    }

    return (
        <SidebarProvider>
            <SidebarInset>
                <main className="min-h-screen bg-white">
                    {/* Header Section: Using Secondary Green */}
                    <section className="bg-secondary py-16 md:py-20 transition-all">
                        <div className="text-center text-white px-4">
                            <div className="mb-6">{getBannerForPage()}</div>
                            
                            <div className="relative max-w-md mx-auto">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Type keywords to find an answer..."
                                    className="w-full px-6 py-3 rounded-full border-none text-gray-800 shadow-lg focus:ring-4 focus:ring-white/20 outline-none"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={handleClear}
                                        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-secondary"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Navigation Tabs */}
                    <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
                        <div className="hidden sm:block">
                            <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
                                <Link to="/dashboard/help/our-story" className={getTabClass("/dashboard/help/our-story")}>
                                    {t("Hmenu.1")}
                                </Link>
                                <Link to="/dashboard/help" className={getTabClass("/dashboard/help")}>
                                    {t("Hmenu.2")}
                                </Link>
                                <Link to="/dashboard/help/profile/settings" className={getTabClass("/dashboard/help/profile/settings")}>
                                    Settings
                                </Link>
                                <Link to="/dashboard/help/contact" className={getTabClass("/dashboard/help/contact")}>
                                    {t("Hmenu.4")}
                                </Link>
                                <Link to="/dashboard/help/privacy-policy" className={getTabClass("/dashboard/help/privacy-policy")}>
                                    {t("Hmenu.5")}
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Content Area: This is where sub-routes like FAQ or ProfileSettings render */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <Outlet />
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}