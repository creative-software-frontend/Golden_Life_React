'use client'

import * as React from "react"
import { Link, Outlet } from "react-router-dom"
import logo from '../../../public/image/logo/logo.jpg'
import { ChevronRight, SquareTerminal, Pill, ChefHat, HelpCircleIcon, LogInIcon, ShoppingBag, ShoppingCart, GraduationCap, Package, Truck, Carrot, Dumbbell, Baby, Home, Scissors, Snowflake, Milk, Fish, Coffee, Cookie } from 'lucide-react'
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




export default function UserLayout() {
    const { changeCheckoutModal, isLoginModalOpen, openLoginModal, closeLoginModal } = useModalStore();
    const [activeCategory, setActiveCategory] = React.useState("shopping")
    const [t] = useTranslation("global")



    const data = {
        user: {
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        categories: [
            { id: "shopping", name: t("categories2.title"), icon: ShoppingCart, path: "/" },
            { id: "courses", name: t("categories2.title1"), icon: GraduationCap, path: "/courses" },
            { id: "percel", name: t("categories2.title2"), icon: Package, path: "/percel" },
            { id: "topup", name: t("categories2.title3"), icon: Package, path: "/topup" },
            { id: "drive", name: t("categories2.title4"), icon: Truck, path: "/drive" },
            { id: "cookups", name: t("categories2.title5"), icon: ChefHat, path: "/outlet" },
        ],
        navMain: {
            shopping: [
                {
                    title: t("navMain.title1"),
                    url: "/",
                    icon: Carrot,
                    isActive: true,
                    items: [
                        // { title: "Fresh Fruits", url: "" },
                        // { title: "Fresh Vegetables", url: "" },

                    ],
                },
                {
                    title: t("navMain.title2"),
                    url: "",
                    icon: ShoppingCart,
                    items: [
                        // { title: "Chips & Crisps", url: "" },
                        // { title: "Chocolates", url: "" },
                        // { title: "Candies", url: "" },
                        // { title: "Nuts & Dried Fruits", url: "" },
                    ],
                },
                {
                    title: t("navMain.title3"),
                    url: "",
                    icon: Pill,
                    items: [
                        // { title: "Milk", url: "" },
                        // { title: "Butter & Cream", url: "" },
                        // { title: "Cheese", url: "" },
                        // { title: "Eggs", url: "" },
                        // { title: "Yogurt", url: "" },
                    ],
                },
                {
                    title: t("navMain.title4"),
                    url: "",
                    icon: Milk,
                    items: [
                        // { title: "Milk", url: "" },
                        // { title: "Butter & Cream", url: "" },
                        // { title: "Cheese", url: "" },
                        // { title: "Eggs", url: "" },
                        // { title: "Yogurt", url: "" },
                        // { title: "Plant-based Alternatives", url: "" },
                    ],
                },

                {
                    title: t("navMain.title5"),
                    url: "",
                    icon: Fish,
                    items: [
                        // { title: "Chicken", url: "" },
                        // { title: "Beef", url: "" },
                        // { title: "Pork", url: "" },
                        // { title: "Fish", url: "" },
                        // { title: "Shellfish", url: "" },
                        // { title: "Plant-based Proteins", url: "" },
                    ],
                },
                {
                    title: t("navMain.title6"),                    url: "",
                    icon: Coffee,
                    items: [
                        // { title: "Water", url: "" },
                        // { title: "Soft Drinks", url: "" },
                        // { title: "Juices", url: "" },
                        // { title: "Tea & Coffee", url: "" },
                        // { title: "Energy Drinks", url: "" },
                        // { title: "Alcoholic Beverages", url: "" },
                    ],
                },
                {
                    title: t("navMain.title7"),                    url: "",
                    icon: Cookie,
                    items: [
                        // { title: "Chips & Crisps", url: "" },
                        // { title: "Chocolates", url: "" },
                        // { title: "Candies", url: "" },
                        // { title: "Nuts & Dried Fruits", url: "" },
                        // { title: "Popcorn & Pretzels", url: "" },
                        // { title: "Energy Bars", url: "" },
                    ],
                },
                {
                    title: t("navMain.title8"),                    url: "",
                    icon: Package,
                    items: [
                        // { title: "Rice & Grains", url: "" },
                        // { title: "Pasta & Noodles", url: "" },
                        // { title: "Canned Goods", url: "" },
                        // { title: "Oils & Vinegars", url: "" },
                        // { title: "Spices & Seasonings", url: "" },
                        // { title: "Baking Essentials", url: "" },
                    ],
                },
                {
                    title: t("navMain.title9"),                    url: "",
                    icon: Snowflake,
                    items: [
                        // { title: "Frozen Vegetables", url: "" },
                        // { title: "Frozen Fruits", url: "" },
                        // { title: "Ice Cream & Desserts", url: "" },
                        // { title: "Frozen Meals", url: "" },
                        // { title: "Frozen Pizza", url: "" },
                        // { title: "Frozen Seafood", url: "" },
                    ],
                },
                {
                    title: t("navMain.title10"),                    url: "",
                    icon: Scissors,
                    items: [
                        // { title: "Skincare", url: "" },
                        // { title: "Hair Care", url: "" },
                        // { title: "Oral Care", url: "" },
                        // { title: "Body Care", url: "" },
                        // { title: "Cosmetics", url: "" },
                        // { title: "Men's Grooming", url: "" },
                    ],
                },
                {
                    title: t("navMain.title11"),                    url: "",
                    icon: Home,
                    items: [
                        // { title: "Cleaning Supplies", url: "" },
                        // { title: "Laundry Products", url: "" },
                        // { title: "Paper & Plastic", url: "" },
                        // { title: "Home Decor", url: "" },
                        // { title: "Kitchen Essentials", url: "" },
                        // { title: "Pet Supplies", url: "" },
                    ],
                },
                {
                    title: t("navMain.title12"),                    url: "",
                    icon: Baby,
                    items: [
                        // { title: "Baby Food", url: "" },
                        // { title: "Diapers & Wipes", url: "" },
                        // { title: "Baby Care", url: "" },
                        // { title: "Baby Gear", url: "" },
                        // { title: "Kids' Snacks", url: "" },
                        // { title: "Kids' Health", url: "" },
                    ],
                },
                {
                    title: t("navMain.title13"),                    url: "",
                    icon: Dumbbell,
                    items: [
                        // { title: "Vitamins & Supplements", url: "" },
                        // { title: "Protein & Fitness", url: "" },
                        // { title: "Herbal Remedies", url: "" },
                        // { title: "First Aid", url: "" },
                        // { title: "Pharmacy", url: "" },
                        // { title: "Personal Care", url: "" },
                    ],
                },
                {
                    title: t("navMain.title14"),                    url: "",
                    icon: ChefHat,
                    items: [
                        // { title: "Bread", url: "" },
                        // { title: "Cakes & Pastries", url: "" },
                        // { title: "Cookies", url: "" },
                        // { title: "Buns & Rolls", url: "" },
                    ],
                },
                {
                    title: t("navMain.title15"),                    url: "",
                    icon: Package,
                    items: [
                        // { title: "Chicken", url: "" },
                        // { title: "Beef", url: "" },
                        // { title: "Pork", url: "" },
                        // { title: "Fish", url: "" },
                        // { title: "Shellfish", url: "" },
                    ],
                },
                {
                    title: t("navMain.title1"),                    url: "",
                    icon: ShoppingBag,
                    items: [
                        // { title: "Water", url: "" },
                        // { title: "Soft Drinks", url: "" },
                        // { title: "Juices", url: "" },
                        // { title: "Tea & Coffee", url: "" },
                    ],
                },
            ],
            Clothes: [
                {
                    title: t("navMain.title1"),                    url: "/",
                    icon: SquareTerminal,
                    isActive: true,
                    items: [
                        // { title: "Web Development", url: "" },
                        // { title: "Mobile App Development", url: "" },
                        // { title: "Fresh Fruits", url: "/shopping/fruits-vegetables/fresh-fruits" },
                        // { title: "Fresh Vegetables", url: "/shopping/fruits-vegetables/fresh-vegetables" },
                        // { title: "Herbs & Seasonings", url: "/shopping/fruits-vegetables/herbs-seasonings" },
                        // { title: "Organic Produce", url: "/shopping/fruits-vegetables/organic-produce" },
                        // { title: "Exotic Fruits", url: "/shopping/fruits-vegetables/exotic-fruits" },
                        // { title: "Sprouts", url: "/shopping/fruits-vegetables/sprouts" },
                        // { title: "Cut Vegetables", url: "/shopping/fruits-vegetables/cut-vegetables" },
                        // { title: "Leafy Greens", url: "/shopping/fruits-vegetables/leafy-greens" },
                    ],
                },
            ],
            course: [
                {
                    title: "Course",
                    url: "/course/medicines",
                },
            ],
            percel: [],
            topup: [],
            drive: [],
            cookups: [
                {
                    title: "Design",
                    url: "/courses/design",
                    icon: ShoppingBag,
                    items: [
                        // { title: "Graphic Design", url: "/courses/design/graphic-design" },
                        // { title: "UX/UI Design", url: "/courses/design/ux-ui-design" },
                        // { title: "3D Modeling", url: "/courses/design/3d-modeling" },
                        // { title: "Animation", url: "/courses/design/animation" },
                        // { title: "Illustration", url: "/courses/design/illustration" },
                    ],
                },
            ],
            outlet: [],
        }
    }
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
                <main className="pt-6">
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

