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
    const [walletBalance, setWalletBalance] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchWalletBalance = async () => {
            setIsLoading(true);
            try {
                const token = getAuthToken();
                const response = await axios.get(`${baseURL}/api/wallet-balance`, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                });
                if (response.data?.success && response.data?.data) {
                    setWalletBalance(parseFloat(response.data.data.balance).toFixed(2));
                }
            } catch (error) {
                console.error("Wallet Fetch Error:", error);
                setWalletBalance("0.00");
            } finally {
                setIsLoading(false);
            }
        };
        fetchWalletBalance();
    }, [baseURL]);


    // 2. Define the handleLogout function
    const handleLogout = () => {
        // Clear the session data
        localStorage.removeItem("student_session");

        // Optional: Clear other app data like cart or preferences if necessary
        // localStorage.removeItem("cart"); 

        // Redirect to login or home
        navigate("/login");

        // Force a reload if you need to reset all React states immediately
        window.location.reload();
    };
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
                    <div className="flex items-center justify-center py-6 border-b h-24">
                        {/* Increased h-17 to h-24 to provide more room for a bigger logo */}
                        <Link to="/dashboard">
                            <img
                                src={logo}
                                alt="logo"
                                className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-95"
                            /* Increased h-12 to h-16. Added a subtle hover scale for a premium feel. */
                            />
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
                                <div className="flex justify-center py-10">
                                    <Loader2 className="h-6 w-6 animate-spin text-[#5ca367]" />
                                </div>
                            ) : categories.length > 0 ? (
                                /* 1. WRAPPER SPACING: 
                                   Using px-6 (24px) creates a substantial gutter on both sides for mobile. 
                                */
                                <div className="flex flex-col gap-1 px-1 md:px-3 py-4">
                                    {/* Reduced gap for a tighter, cleaner list view */}
                                    {categories.map((category) => {
                                        const categoryName = i18n.language === 'bn' ? category.name_bn : category.name_en;
                                        const categoryPath = `/dashboard/category/${category.id}`;
                                        const isActive = location.pathname === categoryPath;

                                        return (
                                            <SidebarMenuItem key={category.id} className="list-none relative group mx-0">

                                                {/* 1. INDICATOR LINE: 
                    Remains the primary visual cue for the active item 
                */}
                                                <div className={cn(
                                                    "absolute left-[-12px] top-[30%] h-[40%] w-1 rounded-r-full bg-[#5ca367] transition-all duration-300 z-20",
                                                    isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100"
                                                )} />

                                                <SidebarMenuButton
                                                    asChild
                                                    className={cn(
                                                        "group relative w-full h-[48px] px-2 rounded-lg transition-all duration-300 ease-out border-none bg-transparent shadow-none",
                                                        /* --- 1. THE COLORFUL HOVER (Gradient + Shadow) --- */
                                                        "hover:bg-gradient-to-r hover:from-[#5ca367]/20 hover:to-transparent",
                                                        "hover:border-[#5ca367]/10 hover:shadow-lg hover:shadow-[#5ca367]/10",
                                                        isActive ? "translate-x-1" : "hover:translate-x-1"
                                                    )}
                                                >
                                                    <Link to={categoryPath} className="flex items-center justify-between w-full">

                                                        {/* LEFT CONTENT: Icon + Text */}
                                                        <div className="flex items-center gap-3">
                                                            {/* Icon container background removed */}
                                                            <div className="p-1 transition-all duration-300 flex items-center justify-center bg-transparent">
                                                                <img
                                                                    src={category.icon}
                                                                    alt={categoryName}
                                                                    className={cn(
                                                                        "h-[17px] w-[17px] object-contain transition-transform duration-300",
                                                                        isActive ? "scale-110" : "group-hover:scale-110"
                                                                    )}
                                                                    onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/22?text=C'}
                                                                />
                                                            </div>
                                                            <span className={cn(
                                                                "text-[14px] font-medium tracking-tight transition-colors duration-300",
                                                                /* Text color is the main indicator of the active state */
                                                                isActive ? "text-[#5ca367] font-bold" : "text-slate-600 group-hover:text-slate-900"
                                                            )}>
                                                                {categoryName}
                                                            </span>
                                                        </div>

                                                        {/* RIGHT CONTENT: Arrow (Visible only on hover or active) */}
                                                        <div className={cn(
                                                            "flex items-center justify-center transition-all duration-500 ease-in-out",
                                                            /* 1. POSITIONING: Pushes the arrow slightly right on hover */
                                                            isActive ? "opacity-100 translate-x-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5"
                                                        )}>
                                                            {/* 2. THE ICON CONTAINER: Adds a colorful background glow */}
                                                            <div className={cn(
                                                                "flex items-center justify-center p-1.5 rounded-full transition-all duration-300",
                                                                isActive ? "bg-[#5ca367]/20" : "group-hover:bg-slate-100"
                                                            )}>
                                                                <ChevronRight
                                                                    /* 3. SIZE & THICKNESS: Increased to h-5 and strokeWidth 3 for that 'big' feel */
                                                                    className={cn(
                                                                        "h-4 w-4 transition-transform duration-300",
                                                                        isActive ? "text-[#5ca367] scale-110" : "text-slate-400"
                                                                    )}
                                                                    strokeWidth={3}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-10 text-center text-sm font-medium text-slate-400 italic">
                                    No categories found
                                </div>
                            )}
                        </SidebarMenu>     </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="h-14 w-full p-1.5 flex items-stretch justify-between bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                                    >
                                        {/* --- HELP SECTION (Priority Focus) --- */}
                                        <Link
                                            to="/help"
                                            className="group flex flex-shrink-0 items-center justify-center gap-2.5 rounded-lg hover:bg-teal-50/50 transition-all duration-300 border border-transparent hover:border-teal-200"
                                        >
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                                <HelpCircleIcon className="h-4.5 w-4.5" />
                                            </div>

                                            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                                                <span className="text-[13px] font-black text-teal-700 uppercase tracking-wider leading-none">
                                                    {t("help")}
                                                </span>
                                                <span className="text-[9px] font-bold text-teal-600/60 uppercase tracking-widest mt-1">
                                                    Support
                                                </span>
                                            </div>
                                        </Link>

                                        {/* --- MINIMAL DIVIDER --- */}
                                        <div className="w-[1px] bg-slate-100 my-2 group-data-[collapsible=icon]:hidden" />

                                        {/* --- LOGOUT SECTION (Secondary Focus) --- */}
                                        <button
                                            onClick={handleLogout}
                                            className="group flex flex-1 items-center justify-center gap-2 rounded-lg hover:bg-rose-50/50 transition-all duration-300 border border-transparent hover:border-rose-100 outline-none"
                                        >
                                            <div className="flex flex-col items-end group-data-[collapsible=icon]:hidden text-right">
                                                <span className="text-[11px] font-bold text-rose-500 uppercase tracking-widest leading-none transition-all duration-300 group-hover:text-rose-600">
                                                    Logout
                                                </span>
                                                <span className="text-[9px] font-bold text-rose-400/50 uppercase tracking-tighter mt-1">
                                                    Exit
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-center h-7 w-7 rounded-md bg-rose-50 text-rose-500 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                                {/* Added rotate-180 to make the LogIn icon look like a LogOut icon */}
                                                <LogInIcon className="h-4 w-4 rotate-180" />
                                            </div>
                                        </button>
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

                    {/* --- ROW 1: Identity & Language --- */}
                    {/* --- ROW 1: Identity & Language --- */}
                    <div className="flex h-14 items-center justify-between px-4 border-b border-slate-50">
                        <div className="flex items-center ">
                            {/* Increased gap from 2 to 4 for better breathing room */}

                            <SidebarTrigger className=" text-gray-600">
                                <Menu className="h-5.5 w-5.5" />
                            </SidebarTrigger>

                            <Separator orientation="vertical" className="h-4 bg-slate-200" />

                            <Link to="/dashboard" className="flex items-center ml-4 ">
                                <img
                                    src={logo}
                                    alt="logo"
                                    className="h-6 w-auto object-contain transition-opacity hover:opacity-80"
                                /* Decreased height from h-8 to h-6.5 for a sleeker look */
                                />
                            </Link>
                        </div>

                        {/* Compact Language Toggle */}
                        <div className="flex items-center bg-gray-100/80 rounded-lg p-1 border border-slate-200">
                            <button
                                onClick={() => handleChangeLanguage('en')}
                                className={cn(
                                    "text-[10px] font-black px-3 py-1 rounded-md transition-all",
                                    i18n.language === 'en' ? "bg-white text-[#5ca367] shadow-sm" : "text-gray-400"
                                )}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => handleChangeLanguage('bn')}
                                className={cn(
                                    "text-[10px] font-black px-3 py-1 rounded-md transition-all",
                                    i18n.language === 'bn' ? "bg-white text-[#5ca367] shadow-sm" : "text-gray-400"
                                )}
                            >
                                BN
                            </button>
                        </div>
                    </div>
                    <div className="px-4 pb-3 pt-1" ref={mobileSearchRef}>
                        <div className="relative flex items-center w-full group">
                            <input
                                type="text"
                                value={searchText}
                                placeholder={t('header.search') || "Search products..."}
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => searchText.trim() && setShowSuggestions(true)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full h-11 pl-4 pr-24 text-sm bg-gray-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-[#5ca367] focus:ring-4 focus:ring-[#5ca367]/5 transition-all shadow-inner"
                            />

                            <div className="absolute right-2 flex items-center gap-1 text-gray-400">
                                {isSearching && <Loader2 className="w-4 h-4 animate-spin" />}
                                <label htmlFor="mobileImageInput" className="p-2 hover:text-[#5ca367] cursor-pointer">
                                    <Camera className="h-5 w-5" />
                                    <input type="file" id="mobileImageInput" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                                <div className="h-5 w-[1px] bg-slate-200 mx-0.5"></div>
                                <button className="p-2 hover:text-[#5ca367]" onClick={handleSearch}>
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Mobile Suggestions Dropdown (Floating) */}
                            {showSuggestions && (
                                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 overflow-hidden max-h-[50vh] overflow-y-auto">
                                    {suggestions.length > 0 ? (
                                        suggestions.map(p => (
                                            <Link
                                                key={p.id}
                                                to={`/dashboard?q=${encodeURIComponent(getProductTitle(p))}`}
                                                className="flex items-center p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 gap-4"
                                                onClick={() => handleSelectSuggestion(getProductTitle(p))}
                                            >
                                                <img src={p.product_image ? `${baseURL}/uploads/ecommarce/product_image/${p.product_image}` : '/placeholder.jpg'} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-slate-800 text-sm truncate">{getProductTitle(p)}</span>
                                                    <span className="text-xs font-black text-[#5ca367] mt-0.5">৳{p.offer_price}</span>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center text-slate-400 text-sm italic">No results matching "{searchText}"</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- ROW 2: Wallet (Full Width Prominence) --- */}
                    <div className="px-4 py-2 border-b border-slate-50 bg-slate-50/30">
                        <div className="flex items-center justify-between bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "flex items-center justify-center h-9 w-9 rounded-xl transition-all",
                                    isLoading ? "bg-slate-100 animate-pulse" : "bg-[#5ca367] text-white shadow-md shadow-green-100"
                                )}>
                                    {!isLoading && <Tags className="h-4.5 w-4.5" />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">My Balance</span>
                                    {isLoading ? (
                                        <div className="h-3 w-20 bg-slate-100 animate-pulse rounded-full mt-1" />
                                    ) : (
                                        <span className="text-[15px] font-black text-slate-900 leading-none mt-0.5">৳{walletBalance}</span>
                                    )}
                                </div>
                            </div>

                            {/* Quick action for wallet if needed */}
                            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>



                    {/* --- ROW 4: Utility Search --- */}

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