'use client'

import * as React from "react"
import { useNavigate, Outlet, Link } from "react-router-dom"
import logo from "/image/logo/logo.jpg" // Corrected path
import { ChevronRight, SquareTerminal, ShoppingCart, Pill, ChefHat, HelpCircleIcon, GraduationCap, type LucideIcon } from 'lucide-react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
import Header from "@/pages/common/Header/Header"
import Footer from "@/pages/common/Footer/Footer"

interface Category {
    id: string
    name: string
    icon: LucideIcon
    path: string
}

interface SubItem {
    title: string
    url: string
}

interface NavItem {
    title: string
    url: string
    icon: LucideIcon
    isActive: boolean
    items: SubItem[]
}

interface NavMain {
    [key: string]: NavItem[]
}

const data: {
    categories: Category[]
    navMain: NavMain
} = {
    categories: [
        { id: "shoppingg", name: "Shopping", icon: ShoppingCart, path: "/dashboard" },
        { id: "Course", name: "Course", icon: GraduationCap, path: "/Course" },
        { id: "pharmacy", name: "Pharmacy", icon: Pill, path: "/Percel" },
        { id: "cookups", name: "Cookups", icon: ChefHat, path: "/cookups" },
        { id: "cookups", name: "Cookups", icon: ChefHat, path: "/cookups" },
    ],
    navMain: {
        shopping: [
            {
                title: "Fruits & Vegetables",
                url: "#",
                icon: SquareTerminal,
                isActive: true,
                items: [
                    { title: "Fresh Fruits", url: "#" },
                    { title: "Fresh Vegetables", url: "#" },
                    { title: "Herbs & Seasonings", url: "#" },
                ],
            },
        ],
    },
}

export default function ShoppingLayout() {
    const [activeCategory, setActiveCategory] = React.useState<string>("shopping")
    const navigate = useNavigate()

    const handleCategoryChange = (categoryId: string) => {
        setActiveCategory(categoryId)
        const category = data.categories.find((c) => c.id === categoryId)
        if (category?.path) {
            navigate(category.path)
        } else {
            console.warn("Invalid category path.")
        }
    }

    return (
        <SidebarProvider>
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
                                onClick={() => handleCategoryChange(category.id)}
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
                        <SidebarGroupLabel>{data.categories.find((c) => c.id === activeCategory)?.name}</SidebarGroupLabel>
                        <SidebarMenu>
                            {data.navMain[activeCategory]?.map((item) => (
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
                                                <span>{item.title}</span>
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
                            <button className="flex items-center gap-2 px-4 py-2">
                                <HelpCircleIcon />
                                <span>Help</span>
                            </button>
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