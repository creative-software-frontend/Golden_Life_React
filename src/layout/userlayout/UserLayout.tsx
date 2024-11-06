'use client'

import * as React from "react"
import { Link, Outlet} from "react-router-dom"
import logo from '../../../public/image/logo/logo.jpg'
import {
  
    ChevronRight,
    SquareTerminal,
    ShoppingCart,
    Pill,
    ChefHat,
    HelpCircleIcon,
    LogInIcon,
} from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/sidebar"
import Footer from "@/pages/common/Footer/Footer"
import Header from "@/pages/common/Footer/Header/Header"
// import Header from "@/pages/common/Footer/Header/Header"
// import HeroSection from "@/pages/Home/HeroSection/HeroSection"
// import BannerSection from '@/pages/Home/BannerSection/BannerSection'
// import Categories from "@/pages/Home/Categories/Categories"
// import ProductCategories from "@/pages/Home/ProductCategories/ProductCategories"
// import FreshSell from "@/pages/Home/FreshSell/FreshSell"
// import Footer from "@/pages/common/Footer/Footer"
// import Cart from "@/pages/Home/Cart/Cart"
// import LiveChat from "@/pages/LiveChat/Livechat"

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    categories: [
        { id: "shopping", name: "shopping", icon: ShoppingCart },
        { id: "pharmacy", name: "Pharmacy", icon: Pill },
        { id: "cookups", name: "Cookups", icon: ChefHat },
        { id: "cookups2", name: "Cookups", icon: ChefHat },
        { id: "cookups3", name: "Cookups", icon: ChefHat },
    ],
    navMain: {
        shopping: [
            {
                title: "Fruits & Vegetables",
                url: "/",
                icon: SquareTerminal,
                isActive: true,
                items: [
                    { title: "Fresh Fruits", url: "/shopping/fruits-vegetables/fresh-fruits" },
                    { title: "Fresh Vegetables", url: "/shopping/fruits-vegetables/fresh-vegetables" },
                    { title: "Herbs & Seasonings", url: "/shopping/fruits-vegetables/herbs-seasonings" },
                    { title: "Organic Produce", url: "/shopping/fruits-vegetables/organic-produce" },
                    { title: "Exotic Fruits", url: "/shopping/fruits-vegetables/exotic-fruits" },
                    { title: "Sprouts", url: "/shopping/fruits-vegetables/sprouts" },
                    { title: "Cut Vegetables", url: "/shopping/fruits-vegetables/cut-vegetables" },
                    { title: "Leafy Greens", url: "/shopping/fruits-vegetables/leafy-greens" },
                ],
            },
            // ... other shopping categories
        ],
        pharmacy: [
            {
                title: "Medicines",
                url: "/pharmacy/medicines",
                icon: Pill,
                isActive: true,
                items: [
                    { title: "Prescription Drugs", url: "/pharmacy/medicines/prescription-drugs" },
                    { title: "Over-the-Counter", url: "/pharmacy/medicines/over-the-counter" },
                    { title: "Vitamins & Supplements", url: "/pharmacy/medicines/vitamins-supplements" },
                    { title: "Pain Relief", url: "/pharmacy/medicines/pain-relief" },
                    { title: "Cold & Flu", url: "/pharmacy/medicines/cold-flu" },
                    { title: "Antibiotics", url: "/pharmacy/medicines/antibiotics" },
                    { title: "Allergy Medication", url: "/pharmacy/medicines/allergy-medication" },
                    { title: "Digestive Health", url: "/pharmacy/medicines/digestive-health" },
                ],
            },
            // ... other pharmacy categories
        ],
        cookups: [
            {
                title: "Ready Meals",
                url: "/cookups/ready-meals",
                icon: ChefHat,
                isActive: true,
                items: [
                    { title: "Breakfast", url: "/cookups/ready-meals/breakfast" },
                    { title: "Lunch", url: "/cookups/ready-meals/lunch" },
                    { title: "Dinner", url: "/cookups/ready-meals/dinner" },
                    { title: "Appetizers", url: "/cookups/ready-meals/appetizers" },
                    { title: "Soups", url: "/cookups/ready-meals/soups" },
                    { title: "Salads", url: "/cookups/ready-meals/salads" },
                    { title: "Desserts", url: "/cookups/ready-meals/desserts" },
                    { title: "Snacks", url: "/cookups/ready-meals/snacks" },
                ],
            },
            // ... other cookups categories
        ],
    }
}

export default function UserLayout() {
    const [activeCategory, setActiveCategory] = React.useState("shopping")

    return (
        <SidebarProvider className=''>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <div className="flex items-center justify-between p-2">
                        <img src={logo} alt="logo" className="w-full border-b-2 border-gray pb-2" />
                    </div>
                </SidebarHeader>
                <div className="px-4 py-3 border-b ">
                    <div className="flex flex-row justify-between gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent p-2  ">
                        {data.categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`h-16 w-24 p-3 flex flex-col items-center justify-center rounded ${activeCategory === category.id
                                    ? "bg-primary-default border border-primary-default text-white"
                                    : "border border-primary-default text-gray-700"
                                    }`}
                                aria-label={category.name}
                            >
                                <category.icon className="h-6 w-6 mb-1" />
                                <span className="text-xs">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>{data.categories.find(c => c.id === activeCategory)?.name}</SidebarGroupLabel>
                        <SidebarMenu>
                            {data.navMain[activeCategory].map((item) => (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    defaultOpen={item.isActive}
                                    className="group/collapsible"
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
                                            <Link to="/login" className="flex items-center gap-2">
                                                <div className="bg-blue-400 rounded-full p-1">
                                                    <LogInIcon className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-blue-400">Login</span>
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
                <main className="pt-6 -ms-20">
                    
                        
                                
                          
                    <Header />
                        
                    <Outlet />
                    <Footer />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}