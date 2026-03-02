'use client'

import * as React from "react"
import { useNavigate, Outlet, Link } from "react-router-dom"
import logo from "/image/logo/logo.jpg" // Corrected path
import { ChevronRight, LogInIcon, SquareTerminal, ShoppingCart, Pill, ChefHat, HelpCircleIcon, GraduationCap, type LucideIcon } from 'lucide-react'
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