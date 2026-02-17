'use client'

import * as React from "react"
import { Link, Outlet } from "react-router-dom"
import logo from '../../../public/image/logo/logo.jpg' // Adjust path if needed
import {
    ChevronRight, ShoppingBag, ShoppingCart, GraduationCap, Package, Truck,
    ChefHat, HelpCircleIcon, LogInIcon, Code, Palette, Briefcase, Camera,
    Globe, Calculator, Heart, Microscope, Leaf, DollarSign, Zap, Users, Book, Lightbulb, Grid, Home
} from 'lucide-react'
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader,
    SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
    SidebarProvider, SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent } from "@/components/ui/sheet" // Import Sheet for Mobile Drawer
import { Separator } from "@/components/ui/separator"
import Footer from "@/pages/common/Footer/Footer"
import useModalStore from "@/store/Store"
import Cart from "@/pages/Home/Cart/Cart"
import LiveChat from "@/pages/Home/LiveChat/Livechat"
import CourseHeader from "@/pages/common/CourseHeader/CourseHeader"
import { useTranslation } from "react-i18next"

export default function CourseLayout() {
    const [activeCategory, setActiveCategory] = React.useState("courses")
    const [isMobileOpen, setIsMobileOpen] = React.useState(false) // State for Mobile Drawer
    const { openLoginModal, changeCheckoutModal } = useModalStore();
    const { t } = useTranslation("global")

    // --- Data Configuration ---
    const data = {
        categories: [
            { id: "shopping", name: t("categories2.title"), icon: ShoppingCart, path: "/dashboard" },
            { id: "courses", name: t("categories2.title1"), icon: GraduationCap, path: "/courses" },
            { id: "percel", name: t("categories2.title2"), icon: Package, path: "/percel" },
            { id: "topup", name: t("categories2.title3"), icon: Package, path: "/topup" },
            { id: "drive", name: t("categories2.title4"), icon: Truck, path: "/drive" },
            { id: "cookups", name: t("categories2.title5"), icon: ChefHat, path: "/outlet" },
        ],
        navMain: {
            courses: [
                { title: t("navMain.title16"), url: "/courses/design", icon: ShoppingBag, items: [] },
                { title: t("navMain.title17"), url: "", icon: Code, isActive: true, items: [] },
                { title: t("navMain.title18"), url: "", icon: Palette, items: [] },
                { title: t("navMain.title19"), url: "", icon: Briefcase, items: [] },
                { title: t("navMain.title20"), url: "", icon: Camera, items: [] },
                { title: t("navMain.title21"), url: "", icon: Globe, items: [] },
                { title: t("navMain.title22"), url: "", icon: Calculator, items: [] },
                { title: t("navMain.title23"), url: "", icon: Heart, items: [] },
                { title: t("navMain.title24"), url: "", icon: Microscope, items: [] },
                { title: t("navMain.title25"), url: "", icon: Leaf, items: [] },
                { title: t("navMain.title26"), url: "", icon: DollarSign, items: [] },
                { title: t("navMain.title27"), url: "", icon: Users, items: [] },
                { title: t("navMain.title28"), url: "", icon: Zap, items: [] },
                { title: t("navMain.title29"), url: "", icon: Book, items: [] },
                { title: t("navMain.title30"), url: "", icon: Lightbulb, items: [] },
            ],
        }
    }

    // --- Reusable Sidebar Content (Used in both Desktop Sidebar & Mobile Sheet) ---
    const SidebarContentComponent = () => (
        <>
            {/* Category Icons (Top Row) */}
            <div className="px-4 py-3 border-b bg-gray-50/50">
                <div className="flex flex-row justify-between gap-3 overflow-x-auto scrollbar-none p-1">
                    {data.categories.map((category) => (
                        <Link
                            key={category.id}
                            to={category.path}
                            onClick={() => { setActiveCategory(category.id); setIsMobileOpen(false); }}
                            className={`shrink-0 h-16 w-20 flex flex-col items-center justify-center rounded-lg border transition-all ${activeCategory === category.id
                                    ? "bg-primary-default border-primary-default text-white shadow-md"
                                    : "bg-white border-gray-200 text-gray-500 hover:border-primary-default/50"
                                }`}
                        >
                            <category.icon className="h-5 w-5 mb-1" />
                            <span className="text-[10px] font-medium">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Navigation Menu (Accordion) */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {activeCategory === "courses" && data.navMain.courses.map((item) => (
                            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title}>
                                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                            <span className="font-medium">{item.title}</span>
                                            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link to={subItem.url} onClick={() => setIsMobileOpen(false)}>
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
        </>
    );

    return (
        <SidebarProvider>

            {/* 1. DESKTOP SIDEBAR (Hidden on Mobile/Tablet) */}
            <Sidebar collapsible="icon" className="hidden lg:flex border-r bg-white z-40">
                <SidebarHeader>
                    <div className="flex items-center justify-center py-4 border-b h-16">
                        <img src={logo} alt="logo" className="h-8 w-auto object-contain" />
                    </div>
                </SidebarHeader>

                <SidebarContentComponent />

                <SidebarFooter className="p-2 border-t">
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <Link to="/help" className="flex items-center gap-2 text-gray-600 hover:text-primary-default transition-colors">
                            <div className="bg-white p-1.5 rounded-full shadow-sm">
                                <HelpCircleIcon className="h-4 w-4 text-teal-600" />
                            </div>
                            <span className="text-xs font-bold text-teal-600 group-data-[collapsible=icon]:hidden">Help</span>
                        </Link>
                        <Separator orientation="vertical" className="h-6 mx-1" />
                        <button  className="flex items-center gap-2 text-gray-600 hover:text-primary-default transition-colors">
                            <span className="text-xs font-bold text-blue-500 group-data-[collapsible=icon]:hidden">logout</span>
                            <div className="bg-white p-1.5 rounded-full shadow-sm">
                                <LogInIcon className="h-4 w-4 text-blue-500" />
                            </div>
                        </button>
                    </div>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>

            {/* 2. MOBILE DRAWER (Sheet) - Visible when hamburger is clicked */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetContent side="left" className="w-[300px] p-0 flex flex-col z-[100]">
                    <div className="p-4 border-b flex items-center gap-3 bg-gray-50 h-16">
                        <img src={logo} alt="logo" className="h-8 w-auto" />
                        <span className="font-bold text-lg text-primary-default">Menu</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <SidebarContentComponent />
                    </div>
                    {/* Mobile Drawer Footer */}
                    <div className="p-4 border-t bg-gray-50">
                        <button onClick={openLoginModal} className="w-full flex items-center justify-center gap-2 bg-primary-default text-white py-2.5 rounded-lg font-semibold">
                            <LogInIcon className="h-4 w-4" />
                            Login / Sign Up
                        </button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* 3. MAIN CONTENT AREA */}
            <SidebarInset className="flex flex-col min-h-screen bg-gray-50/30">

                {/* Header: Passing the callback to open mobile menu */}
                <CourseHeader onMenuClick={() => setIsMobileOpen(true)} />

                <main className="flex-1 p-4 lg:p-6 relative w-full max-w-full mx-auto">
{/* Floating Cart Button */}
<button
    onClick={changeCheckoutModal}
    className="fixed z-50 bg-white border-2 border-primary-default/20 shadow-xl flex items-center gap-2 hover:bg-gray-50 transition-all 
    bottom-24 right-4 rounded-full p-3 
    lg:bottom-auto lg:top-[50%] lg:right-0 lg:rounded-l-xl lg:rounded-r-none lg:px-4 lg:py-3 lg:-translate-y-1/2"
>
    <div className="relative">
        <ShoppingBag className="h-6 w-6 text-red-500" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
            4
        </span>
    </div>
    {/* Only show text on Desktop to prevent mobile overlapping */}
    <div className="hidden lg:block text-left border-l border-gray-200 pl-3 h-8">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">MY CART</div>
        <div className="text-xs font-bold text-gray-800">৳ 2369</div>
    </div>
</button>
                    <Outlet />

                    <div className="mt-12">
                        <Footer />
                    </div>
                </main>
            </SidebarInset>

            {/* Global Overlays */}
            <Cart />
            <LiveChat />
        </SidebarProvider>
    )
}