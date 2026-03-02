'use client'

import * as React from "react"
import { Link, Outlet,useNavigate } from "react-router-dom"
import logo from '../../../public/image/logo/logo.jpg'
import { ChevronRight, SquareTerminal, ChefHat, HelpCircleIcon, LogInIcon, ShoppingBag, ShoppingCart, GraduationCap, Package, Truck } from 'lucide-react'
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
import Header from "@/pages/common/Header/Header"
import useModalStore from "@/store/Store"
import Cart from "@/pages/Home/Cart/Cart"
import LiveChat from "@/pages/Home/LiveChat/Livechat"
import { useTranslation } from "react-i18next"



export default function OutletLayout() {
    const { changeCheckoutModal, openLoginModal } = useModalStore();
    const [activeCategory, setActiveCategory] = React.useState("outlet")
    const [t] = useTranslation("global");
   const navigate = useNavigate();

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

    const data = {
        user: {
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        categories: [
            { id: "shopping", name: t("categories2.title"), icon: ShoppingCart, path: "/dashborad" },
            { id: "courses", name: t("categories2.title1"), icon: GraduationCap, path: "/courses" },
            { id: "percel", name: t("categories2.title2"), icon: Package, path: "/percel" },
            { id: "topup", name: t("categories2.title3"), icon: Package, path: "/topup" },
            { id: "drive", name: t("categories2.title4"), icon: Truck, path: "/drive" },
            { id: "outlet", name: t("categories2.title5"), icon: ChefHat, path: "/outlet" },
        ],
        navMain: {
            shopping: [
                {
                    title: t("navMain.title13"),
                    url: "/",
                    icon: SquareTerminal,
                    isActive: true,
                    items: [
                        // { title: "Web Development", url: "" },
                        // { title: "Mobile App Development", url: "" },
                    ],
                },
            ],
            course: [
                {
                    title: "Medicines",
                    url: "/course/medicines",
                },
            ],
            percel: [],
            topup: [],
            drive: [],
            cookups: [
                {
                    title: t("navMain.title13"),
                    url: "/cookups/ready-meals",
                    icon: ChefHat,
                    isActive: true,
                    items: [],
                },
            ],
            outlet: [],
        },
    };
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
    )
}

