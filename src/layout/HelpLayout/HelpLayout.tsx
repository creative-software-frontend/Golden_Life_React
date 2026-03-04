"use client"

import * as React from "react"
import logo from '../../../public/image/logo/logo.jpg'
import axios from "axios"
import {
    ChevronRight, ShoppingCart, GraduationCap, Package, Truck, Pill, HelpCircleIcon,

    Carrot, Baby, Home, Scissors, Snowflake, Milk, Fish,
    Coffee, Cookie, Tags
    , HelpCircle, Loader2, LogInIcon, XCircle
} from 'lucide-react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import useModalStore from "@/store/Store"
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useTranslation } from "react-i18next"

export default function HelpLayout() {
    const { t, i18n } = useTranslation("global")
    const location = useLocation();
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';
    const navigate = useNavigate();
    // --- STATE ---
    const [activeCategory, setActiveCategory] = React.useState("help")
    const [categories, setCategories] = React.useState<any[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = React.useState(true)
    const [searchTerm, setSearchTerm] = React.useState('')
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
    // --- AUTH HELPER ---
    const getAuthToken = () => {
        const session = localStorage.getItem("student_session");
        if (!session) return null;
        try {
            const parsedSession = JSON.parse(session);
            return parsedSession.token;
        } catch (e) { return null; }
    };

    // --- 1. FIXED: getBannerForPage (Inside Component Body) ---
    const getBannerForPage = () => {
        const titleStyle = "text-2xl md:text-4xl font-black tracking-tight drop-shadow-sm";
        switch (location.pathname) {
            case '/help/our-story': return <h1 className={titleStyle}>{t("Hmenu.story")}</h1>;
            case '/help/career': return <h1 className={titleStyle}>{t("Hmenu.Career")}</h1>;
            case '/help/contact': return <h1 className={titleStyle}>{t("Hmenu.ContactUs")}</h1>;
            case '/help/privacy-policy': return <h1 className={titleStyle}>{t("Hmenu.PrivacyPolicy")}</h1>;
            case '/help/terms': return <h1 className={titleStyle}>{t("Hmenu.TermsofUse")}</h1>;
            default: return <h1 className={titleStyle}>{t("Hmenu.WelcometoHelp")}</h1>;
        }
    };
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

    // --- FETCH API CATEGORIES ---
    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = getAuthToken();
                const config = { headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) } };
                const response = await axios.get(`${baseURL}/api/getProductCategory`, config);
                const rawData = response.data?.data?.categories || response.data?.data || [];

                const mapped = rawData.map((item: any) => ({
                    id: item.id,
                    name_en: item.category_name || "Category",
                    name_bn: item.category_name_bangla || item.category_name || "Category",
                    icon: `${baseURL}/uploads/ecommarce/category_image/${item.category_image}`,
                }));
                setCategories(mapped.slice(0, 10));
            } catch (error) {
                console.error("API Error:", error);
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [baseURL]);

    // --- UI DATA: SERVICE SWITCHER ---
    const mainServices = [
        { id: "shopping", name: t("categories2.title"), icon: ShoppingCart, path: "/dashboard" },
        { id: "courses", name: t("categories2.title1"), icon: GraduationCap, path: "/courses" },
        { id: "percel", name: t("categories2.title2"), icon: Package, path: "/percel" },
        { id: "help", name: t("categories2.title6"), icon: HelpCircle, path: "/help" },
    ];
    return (
        // <div className="flex h-screen">
        <SidebarProvider className=''>
            {/* <div className="w-[20%] min-w-[250px]"> Sidebar container */}
            <Sidebar collapsible="icon">
                <SidebarHeader >
                    <div className="flex items-center justify-between p-2">
                        <img src={logo} alt="logo" className="w-full border-b-2 border-gray pb-2" />
                    </div>
                </SidebarHeader>
                <div className="px-4 py-3 border-b ">
                    <div className="flex flex-row justify-between gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent p-2  ">
                        {mainServices.map((category) => (
                            <Link
                                key={category.id}
                                to={category.path}
                                onClick={() => setActiveCategory(category.id)}
                                className={`h-16 w-24 p-3 flex flex-col items-center justify-center rounded ${activeCategory === category.id
                                    ? "bg-primary-default border border-primary-default text-white"
                                    : "border border-primary-default text-gray-700"
                                    }`}
                                aria-label={category.name}
                            >
                                <category.icon className="h-6 w-6 mb-1" />
                                <span className="text-xs">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <SidebarContent>
                    <SidebarGroup>
                        {/* <SidebarGroupLabel>{data.categories.find(c => c.id === activeCategory)?.name}</SidebarGroupLabel> */}
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
                                                <div className={`absolute left-[-4px] top-[15%] h-[70%] w-1.5 rounded-r-full bg-[#5ca367] transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                                    }`} />

                                                <SidebarMenuButton
                                                    asChild
                                                    className={`group relative w-full h-[52px] px-4 rounded-xl transition-all duration-300 ease-out border ${isActive
                                                        ? "bg-[#5ca367]/10 border-[#5ca367]/20 shadow-sm"
                                                        : "bg-transparent border-transparent hover:bg-slate-50 hover:shadow-sm active:scale-95"
                                                        }`}
                                                >
                                                    <Link to={categoryPath} className="flex items-center justify-between w-full">

                                                        {/* 2. LEFT CONTENT: Icon + Text (Slides slightly on touch) */}
                                                        <div className="flex items-center gap-3.5 transform transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                                                            <div className={`p-1.5 rounded-lg transition-all duration-300 flex items-center justify-center ${isActive ? "bg-white shadow-sm" : "bg-transparent group-hover:bg-white"
                                                                }`}>
                                                                <img
                                                                    src={category.icon}
                                                                    alt={categoryName}
                                                                    className="h-[22px] w-[22px] object-contain"
                                                                    onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/22?text=C'}
                                                                />
                                                            </div>
                                                            <span className={`text-[16px] font-semibold tracking-tight transition-colors duration-300 ${isActive ? "text-[#5ca367]" : "text-slate-600 group-hover:text-slate-900"
                                                                }`}>
                                                                {categoryName}
                                                            </span>
                                                        </div>

                                                        {/* 3. RIGHT CONTENT: Dynamic Arrow (Slides 20px right on touch) */}
                                                        <div className={`flex items-center transition-all duration-500 ease-in-out ${isActive
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
                                        size="lg"
                                        className="h-auto min-h-[68px] w-full p-2.5 pr-2 flex items-stretch justify-between bg-white border-2 border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden"
                                    >
                                        {/* --- HELP SECTION (Priority Focus) --- */}
                                        <Link
                                            to="/help"
                                            className="group flex flex-1 items-center justify-center gap-2 rounded-xl hover:bg-teal-50/50 transition-all duration-300 border-2 border-slate-100 hover:border-teal-200 px-2 py-1 shadow-sm hover:shadow"
                                        >
                                            {/* Shrunk icon box from h-10 to h-8 */}
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                                                <HelpCircleIcon className="h-5 w-5" />
                                            </div>

                                            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                                                {/* Decreased font from 14px to 12px */}
                                                <span className="text-[10px] font-black text-teal-700 uppercase tracking-wider leading-none">
                                                    {t("help")}
                                                </span>
                                                {/* Decreased font from 10px to 9px */}
                                                <span className="text-[8px] font-bold text-teal-600/60 uppercase tracking-widest mt-1">
                                                    Support
                                                </span>
                                            </div>
                                        </Link>

                                        {/* --- BOLD DIVIDER --- */}
                                        <div className="w-[2px] bg-slate-100 my-1 mx-1.5 group-data-[collapsible=icon]:hidden" />

                                        {/* --- LOGOUT SECTION (Secondary Focus) --- */}
                                        <button
                                            onClick={handleLogout}
                                            className="group flex flex-1 items-center justify-end gap-2 rounded-xl hover:bg-rose-50/50 transition-all duration-300 border-2 border-slate-100 hover:border-rose-200 px-2 py-1 outline-none shadow-sm hover:shadow"
                                        >
                                            <div className="flex flex-col items-end group-data-[collapsible=icon]:hidden text-right">
                                                {/* Decreased font from 12px to 11px */}
                                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none transition-all duration-300 group-hover:text-rose-600">
                                                    Logout
                                                </span>
                                                {/* Decreased font from 10px to 8px */}
                                                <span className="text-[8px] font-bold text-rose-400/50 uppercase tracking-tighter mt-1">
                                                    Exit
                                                </span>
                                            </div>

                                            {/* Shrunk icon box from h-9 to h-8 */}
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-rose-50 text-rose-500 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                                                <LogInIcon className="h-5 w-5 rotate-180" />
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
            {/* </div> */}
            {/* <div className="flex-1 overflow-hidden"> Main content area */}
            <SidebarInset >
                <main className="" >
                    <section className="bg-primary-default py-20 ">
                        <div className="text-center text-white">
                            <h2 className="text-3xl font-bold mb-4">{getBannerForPage()}</h2>
                            <div className="relative max-w-md mx-auto">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Type keywords to find an answer"
                                    className="w-full px-4 py-2 rounded-full border-2 border-white text-gray-700 placeholder-gray-400 focus:outline-none"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={handleClear}
                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-green-500"
                                    >
                                        <XCircle size={24} />
                                    </button>
                                )}
                            </div>
                            {/* <button className="mt-4 px-4 py-2 bg-white text-primary-default rounded-full font-semibold hover:bg-gray-100">
                                Your faq here
                            </button> */}
                        </div>
                    </section>

                    {/* <Header /> */}
                    <div className="">
                        <div className="hidden sm:block">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
                                    <Link to="/help/our-story" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                                        {t("Hmenu.1")}
                                    </Link>
                                    <Link to="/help" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                                        {t("Hmenu.2")}
                                    </Link>
                                    <Link to="/help/career" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                                        {t("Hmenu.3")}
                                    </Link>
                                    <Link to="/help/contact" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                                        {t("Hmenu.4")}
                                    </Link>
                                    <Link to="/help/privacy-policy" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                                        {t("Hmenu.5")}
                                    </Link>
                                    <Link to="/help/terms" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                                        {t("Hmenu.6")}
                                    </Link>
                                </nav>
                            </div>
                        </div>
                    </div>


                    <Outlet />
                    {/* <Footer /> */}
                </main>
            </SidebarInset>
            {/* </div> */}

        </SidebarProvider>

        // </div>
    )
}

