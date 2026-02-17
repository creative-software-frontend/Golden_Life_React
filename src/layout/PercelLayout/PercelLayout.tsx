'use client'

import * as React from "react";
import { Link, Outlet } from "react-router-dom";
import logo from '../../../public/image/logo/logo.jpg';
import { ChevronRight, SquareTerminal, HelpCircleIcon, LogInIcon, ShoppingBag, ShoppingCart, GraduationCap, Pill, ChefHat, Package, Truck } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
} from "@/components/ui/sidebar";
import Footer from "@/pages/common/Footer/Footer";
import Header from "@/pages/common/Header/Header";
import useModalStore from "@/store/Store";
import Cart from "@/pages/Home/Cart/Cart";
import LiveChat from "@/pages/Home/LiveChat/Livechat";
import { useTranslation } from "react-i18next";



export default function PercelLayout() {
    const { changeCheckoutModal, isLoginModalOpen, openLoginModal, closeLoginModal } = useModalStore();
    const [activeCategory, setActiveCategory] = React.useState("percel");
    const [t] = useTranslation("global")
    const data = {
        user: {
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        categories: [
            { id: "shopping", name: t("categories2.title"), icon: ShoppingCart, path: "/dashboard"},
            { id: "courses", name: t("categories2.title1"), icon: GraduationCap, path: "/courses" },
            { id: "percel", name: t("categories2.title2"), icon: Package, path: "/percel" },
            { id: "topup", name: t("categories2.title3"), icon: Package, path: "/topup" },
            { id: "drive", name: t("categories2.title4"), icon: Truck, path: "/drive" },
            { id: "outlet", name: t("categories2.title5"), icon: ChefHat, path: "/outlet" },
        ],
        navMain: {
            percel: [
                {
                    title: t("navMain.title31"),
                    url: "/percel/services",
                    icon: SquareTerminal,
                    isActive: true,
                    items: [
                        // { title: "Web Development", url: "" },
                        // { title: "Mobile App Development", url: "" },
                        // { title: "Local Delivery", url: "/percel/services/local-delivery" },
                        // { title: "International Shipping", url: "/percel/services/international-shipping" },
                        // { title: "Express Services", url: "/percel/services/express" },
                        // { title: "Tracking", url: "/percel/services/tracking" },
                    ],
                },
            ],
        }
    };
    return (
        <SidebarProvider className=''>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <div className="flex items-center justify-between p-2">
                        <img src={logo} alt="logo" className="w-full border-b-2 border-gray pb-2" />
                    </div>
                </SidebarHeader>
                <div className="px-4 py-3 border-b">
                    <div className="flex flex-row justify-between gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent p-2">
                        {data.categories.map((category) => (
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
                                                <span className="text-teal-600">Help</span>
                                            </Link>
                                        </div>
                                        <div className="h-6 w-[1px] bg-gray-300 mx-4"></div>
                                        <div className="flex items-center gap-2">
                                            <Link to='' onClick={openLoginModal} className="flex items-center gap-2">
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
                <main className="pt-6 ">
                    <button
                        onClick={changeCheckoutModal}
                        className="fixed right-0 top-[55%] -translate-y-1/2 bg-white border-2 border-primary-light rounded-l-full px-4 py-2 shadow-lg z-50"
                    >
                        <div className="flex items-center">
                            <ShoppingBag className="h-6 w-6 text-red-500" />
                            <div className="border-l border-gray-300 h-8 mx-2" />
                            <div>
                                <div className="font-semibold">{ } ITEMS</div>
                                <div className="text-sm">৳ { }</div>
                            </div>
                        </div>
                    </button>

                    <Header />
                    <Cart />
                    <LiveChat />

                    <Outlet />
                    <Footer />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
