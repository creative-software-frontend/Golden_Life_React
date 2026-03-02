'use client'

import * as React from "react"
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"
import logo from '../../../public/image/logo/logo.jpg'
import axios from "axios"

import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Separator } from "@/components/ui/separator"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarInset,
    SidebarTrigger,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
} from "@/components/ui/sidebar"
import Footer from "@/pages/common/Footer/Footer"
import Header from "@/pages/common/Header/Header"
import useModalStore from "@/store/Store"
import Cart from "@/pages/Home/Cart/Cart"
import LiveChat from "@/pages/Home/LiveChat/Livechat"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { getNavData } from "@/data/navData"

import {
    ChevronRight, Pill, ChefHat, HelpCircleIcon,
    LogInIcon, ShoppingCart, Package,
    Carrot, Baby, Home, Scissors, Snowflake, Milk, Fish,
    Coffee, Cookie, Menu, Search, Camera, Loader2, Tags
} from 'lucide-react'

// Helper function to assign icons based on category name
const getCategoryIcon = (categoryName: string) => {
    const name = categoryName?.toLowerCase() || "";
    if (name.includes('fruit') || name.includes('vegetable')) return Carrot;
    if (name.includes('snack') || name.includes('confectionery')) return ShoppingCart;
    if (name.includes('dairy') || name.includes('egg')) return Pill;
    if (name.includes('seafood') && !name.includes('meat')) return Milk;
    if (name.includes('beverage')) return Fish;
    if (name.includes('meat') && !name.includes('seafood')) return Coffee;
    if (name.includes('pantry')) return Cookie;
    if (name.includes('frozen')) return Package;
    if (name.includes('personal')) return Snowflake;
    if (name.includes('household')) return Scissors;
    if (name.includes('baby')) return Home;
    if (name.includes('health')) return Baby;
    if (name.includes('meatseafood')) return ChefHat;
    if (name.includes('milk')) return ChefHat;
    return Tags; // Default fallback icon
};

// 1. Helper to get Token
const getAuthToken = () => {
    const session = localStorage.getItem("student_session");
    if (!session) return null;
    try {
        const parsedSession = JSON.parse(session);
        if (new Date().getTime() > parsedSession.expiry) {
            localStorage.removeItem("student_session");
            return null;
        }
        return parsedSession.token;
    } catch (e) {
        return null;
    }
};

export default function UserLayout() {
    const { changeCheckoutModal, isLoginModalOpen, openLoginModal, closeLoginModal } = useModalStore();
    const [activeCategory, setActiveCategory] = React.useState("shopping")
    const { t, i18n } = useTranslation("global")
    const navigate = useNavigate();
    const location = useLocation(); // <-- ADD THIS LINE

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    // --- CATEGORY API STATE ---
    const [categories, setCategories] = React.useState<any[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = React.useState(true);

    // 2. Fetch Categories from API
    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = getAuthToken();
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                };

                const response = await axios.get(`${baseURL}/api/getProductCategory`, config);

                let rawData = [];

                if (response.data?.data?.categories && Array.isArray(response.data.data.categories)) {
                    rawData = response.data.data.categories;
                } else if (response.data?.data && Array.isArray(response.data.data)) {
                    rawData = response.data.data;
                }

                const mappedCategories = rawData.map((item: any) => {
                    const imageUrl = `${baseURL}/uploads/ecommarce/category_image/${item.category_image}`;

                    return {
                        id: item.id,
                        name_en: item.category_name_english || item.category_name || "Category",
                        name_bn: item.category_name_bangla || item.category_name || "Category",
                        icon: imageUrl,
                        slug: item.category_slug
                    };
                });

                setCategories(mappedCategories.slice(0, 10));

            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, [baseURL]);

    // --- LANGUAGE HANDLER ---
    const handleChangeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    };

    // --- SEARCH FUNCTIONALITY STATE ---
    const [searchText, setSearchText] = React.useState('');
    const [suggestions, setSuggestions] = React.useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [isSearching, setIsSearching] = React.useState(false);

    const mobileSearchRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    React.useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchText.trim().length > 0) {
                setIsSearching(true);
                try {
                    const token = getAuthToken();
                    const config = { headers: { ...(token && { Authorization: `Bearer ${token}` }) } };

                    const response = await axios.get(`${baseURL}/api/products/search?keyword=${searchText}`, config);
                    const results = response.data?.data || response.data?.products || [];
                    setSuggestions(results);
                } catch (error) {
                    console.error("Search API Error:", error);
                    setSuggestions([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchText, baseURL]);

    const handleSearch = () => {
        if (searchText) {
            setShowSuggestions(false);
            navigate(`/dashboard?q=${encodeURIComponent(searchText)}`);
        }
    };

    const getProductTitle = (product: any) => {
        if (i18n.language === 'bn' && product.product_title_bangla) {
            return product.product_title_bangla;
        }
        return product.product_title_english || product.name || 'Unknown Product';
    };

    const handleSelectSuggestion = (productTitle: string) => {
        setSearchText(productTitle);
        setShowSuggestions(false);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Image selected for search:", file);
        }
    };

    const data = React.useMemo(() => getNavData(t), [t]);

    return (
        <SidebarProvider className=''>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <div className="flex items-center justify-center py-4 border-b h-16">
                        <Link to="/dashboard">
                            <img src={logo} alt="logo" className="h-12 w-auto object-contain" />
                        </Link>
                    </div>
                </SidebarHeader>

                <div className="px-2 py-2 border-b">
                    <div className="flex flex-row justify-between gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent p-1">
                        {data.categories.map((category) => (
                            <Link
                                key={category.id}
                                to={category.path}
                                onClick={() => setActiveCategory(category.id)}
                                className={`h-16 min-w-20 p-2 flex flex-col items-center justify-center rounded transition-colors ${activeCategory === category.id
                                    ? "bg-primary-default border border-primary-default text-white"
                                    : "border border-primary-default text-gray-700 hover:bg-gray-50"
                                    }`}
                                aria-label={category.name}
                            >
                                <category.icon className="h-4 w-4 mb-1" />
                                <span className="text-[12px] leading-tight text-center">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
    {isLoadingCategories ? (
        <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#5ca367]" />
        </div>
    ) : categories.length > 0 ? (
        <div className="flex flex-col gap-1.5 px-3 py-3">
            {categories.map((category) => {
                const categoryName = i18n.language === 'bn' ? category.name_bn : category.name_en;
                const IconComponent = getCategoryIcon(category.name_en);
                const categoryPath = `/dashboard/category/${category.id}`;
                const isActive = location.pathname === categoryPath;

                return (
                    <SidebarMenuItem key={category.id} className="list-none relative">
                        {/* 1. HOVER/ACTIVE INDICATOR LINE */}
                        <div className={`absolute left-[-4px] top-[15%] h-[70%] w-1.5 rounded-r-full bg-[#5ca367] transition-all duration-300 ${
                            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`} />

                        <SidebarMenuButton
                            asChild
                            className={`group relative w-full h-[52px] px-4 rounded-xl transition-all duration-300 ease-out border ${
                                isActive
                                    ? "bg-[#5ca367]/10 border-[#5ca367]/20 shadow-sm" 
                                    : "bg-transparent border-transparent hover:bg-slate-50 hover:shadow-sm active:scale-95"
                            }`}
                        >
                            <Link to={categoryPath} className="flex items-center justify-between w-full">

                                {/* 2. LEFT CONTENT: Icon + Text (Slides slightly on touch) */}
                                <div className="flex items-center gap-3.5 transform transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                                    <div className={`p-1.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
                                        isActive ? "bg-white shadow-sm" : "bg-transparent group-hover:bg-white"
                                    }`}>
                                        <img
                                            src={category.icon}
                                            alt={categoryName}
                                            className="h-[22px] w-[22px] object-contain"
                                            onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/22?text=C'}
                                        />
                                    </div>
                                    <span className={`text-[16px] font-semibold tracking-tight transition-colors duration-300 ${
                                        isActive ? "text-[#5ca367]" : "text-slate-600 group-hover:text-slate-900"
                                    }`}>
                                        {categoryName}
                                    </span>
                                </div>

                                {/* 3. RIGHT CONTENT: Dynamic Arrow (Slides 20px right on touch) */}
                                <div className={`flex items-center transition-all duration-500 ease-in-out ${
                                    isActive 
                                        ? "opacity-100 translate-x-0" 
                                        : "opacity-0 group-hover:opacity-100 group-hover:translate-x-5"
                                }`}>
                                    <ChevronRight className={`h-5 w-5 ${isActive ? "text-[#5ca367]" : "text-slate-400 group-hover:text-[#5ca367]"}`} />
                                </div>

                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </div>
    ) : (
        <div className="p-4 text-center text-sm font-medium text-slate-500">No categories found</div>
    )}
</SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="sm"
                                        className="flex justify-between items-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground shadow-inner px-2 py-1.5"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Link to="/help" className="flex items-center gap-1.5">
                                                <div className="bg-teal-500 rounded-full p-1">
                                                    <HelpCircleIcon className="h-3.5 w-3.5 text-white" />
                                                </div>
                                                <span className="text-teal-600 text-xs">{t("help")}</span>
                                            </Link>
                                        </div>
                                        <div className="h-4 w-[1px] bg-gray-300 mx-2"></div>
                                        <div className="flex items-center gap-2">
                                            <Link to="/logout" className="flex items-center gap-1.5">
                                                <div className="bg-blue-400 rounded-full p-1">
                                                    <LogInIcon className="h-3.5 w-3.5 text-white" />
                                                </div>
                                                <span className="text-blue-400 text-xs">logout</span>
                                            </Link>
                                        </div>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>

            <SidebarInset>
                <header className="flex flex-col sticky top-0 z-40 border-b bg-white lg:hidden">
                    <div className="flex h-14 sm:h-16 shrink-0 items-center justify-between px-2 sm:px-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <SidebarTrigger className="-ml-1 sm:-ml-2 text-gray-600">
                                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                            </SidebarTrigger>
                            <Separator orientation="vertical" className="mr-1 sm:mr-2 h-4" />
                            <Link to="/dashboard">
                                <img src={logo} alt="logo" className="h-6 sm:h-8 w-auto" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                            <Link to="/dashboard" className="flex items-center gap-1 bg-[#5ca367] hover:bg-[#4a8a54] text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full transition-colors">
                                <span className="text-[10px] sm:text-xs font-bold">Dashboard</span>
                            </Link>

                            <div className="flex items-center bg-[#5ca367] text-white rounded-full px-1 py-1 sm:px-2 sm:py-1.5">
                                <button
                                    onClick={() => handleChangeLanguage('en')}
                                    className={`text-[9px] sm:text-[10px] font-bold px-0.5 sm:px-1 transition-opacity ${i18n.language === 'en' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                                >
                                    EN
                                </button>
                                <div className="h-2.5 sm:h-3 w-[1px] bg-white/40 mx-0.5"></div>
                                <button
                                    onClick={() => handleChangeLanguage('bn')}
                                    className={`text-[9px] sm:text-[10px] font-bold px-0.5 sm:px-1 transition-opacity ${i18n.language === 'bn' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                                >
                                    BN
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="px-2 sm:px-4 pb-2 sm:pb-3" ref={mobileSearchRef}>
                        <div className="relative flex items-center w-full group">
                            <input
                                type="text"
                                placeholder={t('header.search') || "Search products..."}
                                className="w-full h-9 sm:h-10 pl-3 pr-20 sm:pr-24 text-xs sm:text-sm bg-gray-50 border border-[#5ca367] rounded-md outline-none focus:ring-1 focus:ring-[#5ca367] transition-all placeholder:text-gray-400"
                                value={searchText}
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => searchText.trim() && setShowSuggestions(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSearch();
                                }}
                            />

                            <div className="absolute right-1 sm:right-2 flex items-center gap-1 sm:gap-2 text-gray-500">
                                {isSearching && <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 animate-spin" />}

                                <label htmlFor="mobileImageInput" className="p-1 hover:text-[#5ca367] transition-colors cursor-pointer m-0 flex items-center">
                                    <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <input type="file" id="mobileImageInput" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>

                                <div className="h-4 sm:h-5 w-[1px] bg-gray-300"></div>

                                <button className="p-1 hover:text-[#5ca367] transition-colors flex items-center" onClick={handleSearch}>
                                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            </div>

                            {showSuggestions && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#5ca367] rounded-md shadow-2xl z-50 overflow-hidden max-h-[300px] overflow-y-auto">
                                    {isSearching ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
                                    ) : suggestions.length > 0 ? (
                                        suggestions.map(p => {
                                            const productTitle = getProductTitle(p);
                                            return (
                                                <Link
                                                    key={p.id}
                                                    to={`/dashboard?q=${encodeURIComponent(productTitle)}`}
                                                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 gap-3 transition-colors"
                                                    onClick={() => handleSelectSuggestion(productTitle)}
                                                >
                                                    <img
                                                        src={p.product_image ? `${baseURL}/uploads/ecommarce/product_image/${p.product_image}` : '/placeholder-image.jpg'}
                                                        className="w-10 h-10 rounded object-cover border border-gray-100"
                                                        alt={productTitle}
                                                        onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/40'}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-800 text-sm line-clamp-1">{productTitle}</span>
                                                        {p.offer_price && <span className="text-xs font-bold text-[#5ca367]">৳{p.offer_price}</span>}
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <div className="p-4 text-center text-gray-500 text-sm">No products found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="relative flex-1 w-full min-w-0 transition-all duration-200 ease-in-out peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] lg:peer-data-[variant=inset]:m-2 lg:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 lg:peer-data-[variant=inset]:ml-0 lg:peer-data-[variant=inset]:rounded-xl lg:peer-data-[variant=inset]:shadow flex flex-col min-h-screen bg-gray-50/30">
                    <div className="hidden lg:block">
                        <Header />
                    </div>

                    <Cart />
                    <LiveChat />
                    <Outlet />
                    <Footer />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}