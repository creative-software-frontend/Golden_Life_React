'use client'

import * as React from "react"
import { Link, Outlet } from "react-router-dom"
import logo from '../../../public/image/logo/logo.jpg'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
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
// Update this line in your imports
import {
    X, ChevronRight, SquareTerminal, Pill, ChefHat, HelpCircleIcon,
    LogInIcon, ShoppingBag, ShoppingCart, GraduationCap, Package, Truck,
    Carrot, Dumbbell, Baby, Home, Scissors, Snowflake, Milk, Fish,
    Coffee, Cookie, Menu, Search, Camera
} from 'lucide-react'


export default function UserLayout() {
    const { changeCheckoutModal, isLoginModalOpen, openLoginModal, closeLoginModal } = useModalStore();
    const [activeCategory, setActiveCategory] = React.useState("shopping")
    const [t] = useTranslation("global")



    // --- CLEAN CODE HERE ---
    // Instead of 200 lines of data, just call the function!
    const data = React.useMemo(() => getNavData(t), [t]);
    return (
        <SidebarProvider className=''>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <div className="flex items-center justify-between p-2">
                        <img src={logo} alt="logo" className="w-full border-b-2 border-gray pb-2" />
                    </div>
                </SidebarHeader>
                <div className="px-2 py-3 border-b ">
                    <div className="flex flex-row justify-between gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent p-2  ">
                        {data.categories.map((category) => (
                            <Link
                                key={category.id}
                                to={category.path}
                                onClick={() => setActiveCategory(category.id)}
                                className={`h-20 w-32 p-3 flex flex-col items-center justify-center rounded ${activeCategory === category.id
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
                            {data.navMain[activeCategory as keyof typeof data.navMain]?.map((item) => (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    defaultOpen={item.isActive}
                                    className="group/collapsible "
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}>
                                                {item.icon && <item.icon />}
                                                <Link to={item.url}>{item.title}</Link>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton asChild>
                                                            <Link to={subItem.url}>
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}
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
                                        className="flex justify-between items-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground shadow-inner px-4 py-2 "
                                    >
                                        <div className="flex items-center gap-2">
                                            <Link to="/help" className="flex items-center gap-2">
                                                <div className="bg-teal-500 rounded-full p-1">
                                                    <HelpCircleIcon className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-teal-600">{t("help")}</span>
                                            </Link>
                                        </div>
                                        <div className="h-6 w-[1px] bg-gray-300 mx-4"></div>
                                        <div className="flex items-center gap-2">
                                            <Link className="flex items-center gap-2">
                                                <div className="bg-blue-400 rounded-full p-1">
                                                    <LogInIcon className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-blue-400">logout</span>
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
                {/* --- RESPONSIVE MOBILE/TABLET HEADER --- */}
                {/* UPDATED: Changed md:hidden to lg:hidden so it shows on tablets */}
                <header className="flex flex-col sticky top-0 z-40 border-b bg-white lg:hidden">

                    {/* ROW 1: Logo, Menu, Login & Language */}
                    <div className="flex h-14 sm:h-16 shrink-0 items-center justify-between px-2 sm:px-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <SidebarTrigger className="-ml-1 sm:-ml-2 text-gray-600">
                                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                            </SidebarTrigger>
                            <Separator orientation="vertical" className="mr-1 sm:mr-2 h-4" />
                            <img src={logo} alt="logo" className="h-6 sm:h-8 w-auto" />
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Login Button (Green Pill) */}
                            <button className="flex items-center gap-1 bg-[#5ca367] hover:bg-[#4a8a54] text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full transition-colors">
                                <span className="text-[10px] sm:text-xs font-bold">Dashboard</span>
                            </button>

                            {/* Language Switcher (Green Pill) */}
                            <div className="flex items-center bg-[#5ca367] text-white rounded-full px-1 py-1 sm:px-2 sm:py-1.5">
                                <button className="text-[9px] sm:text-[10px] font-bold px-0.5 sm:px-1 hover:opacity-80">EN</button>
                                <div className="h-2.5 sm:h-3 w-[1px] bg-white/40 mx-0.5"></div>
                                <button className="text-[9px] sm:text-[10px] font-bold px-0.5 sm:px-1 hover:opacity-80 opacity-70">BN</button>
                            </div>
                        </div>
                    </div>

                    {/* ROW 2: Search Bar (Full Width) */}
                    <div className="px-2 sm:px-4 pb-2 sm:pb-3">
                        <div className="relative flex items-center w-full">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full h-9 sm:h-10 pl-3 pr-16 sm:pr-20 text-xs sm:text-sm bg-gray-50 border border-[#5ca367] rounded-md outline-none focus:ring-1 focus:ring-[#5ca367] transition-all placeholder:text-gray-400"
                            />

                            {/* Icons inside Input (Camera | Search) */}
                            <div className="absolute right-1 sm:right-2 flex items-center gap-1 sm:gap-2 text-gray-500">
                                <button className="p-1 hover:text-[#5ca367] transition-colors">
                                    <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                                <div className="h-4 sm:h-5 w-[1px] bg-gray-300"></div>
                                <button className="p-1 hover:text-[#5ca367] transition-colors">
                                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                {/* UPDATED: Changed md:pt-6 to lg:pt-6 for consistent spacing */}
                <main className="relative flex-1 p-4 lg:pt-6">
                    {/* --- FLOATING CART BUTTON --- */}
                    <button
                        onClick={changeCheckoutModal}
                        className="fixed right-0 top-[55%] -translate-y-1/2 bg-white border-2 border-primary-light rounded-l-full px-3 py-2 md:px-4 md:py-2 shadow-lg z-50 transition-all hover:scale-105 active:scale-95"
                    >
                        <div className="flex items-center">
                            <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
                            <div className="border-l border-gray-300 h-6 md:h-8 mx-2" />
                            <div className="hidden sm:block">
                                <div className="font-semibold text-xs md:text-sm"> ITEMS</div>
                                <div className="text-[10px] md:text-xs">৳ </div>
                            </div>
                            <div className="sm:hidden font-bold text-red-500 text-xs">
                                0
                            </div>
                        </div>
                    </button>

                    {/* Note: Ensure your main desktop <Header /> also has 'hidden lg:block' so you don't get two headers on tablet */}
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

