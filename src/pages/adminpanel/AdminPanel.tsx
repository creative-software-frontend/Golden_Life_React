"use client"

import * as React from "react"
import logo from '../../../public/image/logo.jpg'

import {
    AudioWaveform,
    BadgeCheck,
    Bell,
    BookOpen,
    Bot,
    ChevronRight,
    ChevronsUpDown,
    Command,
    CreditCard,
    Folder,
    Forward,
    Frame,
    GalleryVerticalEnd,
    LogOut,
    Map,
    MoreHorizontal,
    PieChart,
    Plus,
    Settings2,
    Sparkles,
    SquareTerminal,
    Trash2,
    ShoppingCart,
    Pill,
    ChefHat,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    categories: [
        { id: "grocery", name: "Grocery", icon: ShoppingCart },
        { id: "pharmacy", name: "Pharmacy", icon: Pill },
        { id: "cookups", name: "Cookups", icon: ChefHat },
    ],
    navMain: {
        grocery: [
            {
                title: "Fruits & Vegetables",
                url: "#",
                icon: SquareTerminal,
                isActive: true,
                items: [
                    { title: "Fresh Fruits", url: "#" },
                    { title: "Fresh Vegetables", url: "#" },
                    { title: "Herbs & Seasonings", url: "#" },
                    { title: "Organic Produce", url: "#" },
                    { title: "Exotic Fruits", url: "#" },
                    { title: "Sprouts", url: "#" },
                    { title: "Cut Vegetables", url: "#" },
                    { title: "Leafy Greens", url: "#" },
                ],
            },
            {
                title: "Dairy & Eggs",
                url: "#",
                icon: Bot,
                items: [
                    { title: "Milk", url: "#" },
                    { title: "Cheese", url: "#" },
                    { title: "Eggs", url: "#" },
                    { title: "Yogurt", url: "#" },
                    { title: "Butter", url: "#" },
                    { title: "Cream", url: "#" },
                    { title: "Paneer", url: "#" },
                    { title: "Ghee", url: "#" },
                ],
            },
            {
                title: "Bakery",
                url: "#",
                icon: BookOpen,
                items: [
                    { title: "Bread", url: "#" },
                    { title: "Cakes", url: "#" },
                    { title: "Pastries", url: "#" },
                    { title: "Cookies", url: "#" },
                    { title: "Bagels", url: "#" },
                    { title: "Muffins", url: "#" },
                    { title: "Croissants", url: "#" },
                    { title: "Donuts", url: "#" },
                ],
            },
        ],
        pharmacy: [
            {
                title: "Medicines",
                url: "#",
                icon: Pill,
                isActive: true,
                items: [
                    { title: "Prescription Drugs", url: "#" },
                    { title: "Over-the-Counter", url: "#" },
                    { title: "Vitamins & Supplements", url: "#" },
                    { title: "Pain Relief", url: "#" },
                    { title: "Cold & Flu", url: "#" },
                    { title: "Antibiotics", url: "#" },
                    { title: "Allergy Medication", url: "#" },
                    { title: "Digestive Health", url: "#" },
                ],
            },
            {
                title: "Personal Care",
                url: "#",
                icon: Bot,
                items: [
                    { title: "Skincare", url: "#" },
                    { title: "Haircare", url: "#" },
                    { title: "Oral Care", url: "#" },
                    { title: "Deodorants", url: "#" },
                    { title: "Bath & Body", url: "#" },
                    { title: "Men's Grooming", url: "#" },
                    { title: "Feminine Hygiene", url: "#" },
                    { title: "Hand Sanitizers", url: "#" },
                ],
            },
            {
                title: "Health Devices",
                url: "#",
                icon: BookOpen,
                items: [
                    { title: "Blood Pressure Monitors", url: "#" },
                    { title: "Thermometers", url: "#" },
                    { title: "First Aid Kits", url: "#" },
                    { title: "Oximeters", url: "#" },
                    { title: "Glucose Meters", url: "#" },
                    { title: "Weighing Scales", url: "#" },
                    { title: "Nebulizers", url: "#" },
                    { title: "Pulse Oximeters", url: "#" },
                ],
            },
        ],
        cookups: [
            {
                title: "Ready Meals",
                url: "#",
                icon: ChefHat,
                isActive: true,
                items: [
                    { title: "Breakfast", url: "#" },
                    { title: "Lunch", url: "#" },
                    { title: "Dinner", url: "#" },
                    { title: "Appetizers", url: "#" },
                    { title: "Soups", url: "#" },
                    { title: "Salads", url: "#" },
                    { title: "Desserts", url: "#" },
                    { title: "Snacks", url: "#" },
                ],
            },
            {
                title: "Meal Kits",
                url: "#",
                icon: Bot,
                items: [
                    { title: "Family Meals", url: "#" },
                    { title: "Vegetarian", url: "#" },
                    { title: "Gourmet", url: "#" },
                    { title: "Low-Calorie", url: "#" },
                    { title: "Quick & Easy", url: "#" },
                    { title: "Asian Cuisine", url: "#" },
                    { title: "Italian Cuisine", url: "#" },
                    { title: "Mexican Cuisine", url: "#" },
                ],
            },
            {
                title: "Catering",
                url: "#",
                icon: BookOpen,
                items: [
                    { title: "Corporate Events", url: "#" },
                    { title: "Weddings", url: "#" },
                    { title: "Parties", url: "#" },
                    { title: "Birthday Parties", url: "#" },
                    { title: "Baby Showers", url: "#" },
                    { title: "Holiday Events", url: "#" },
                    { title: "Anniversary Dinners", url: "#" },
                    { title: "Private Chefs", url: "#" },
                ],
            },
        ],
    }

}

export default function AdminPanel() {
    const [activeCategory, setActiveCategory] = React.useState("grocery")
    // const [activeCategory, setActiveCategory] = useState<number | null>(null);

    const [isClosed, setIsClosed] = React.useState(false)

    return (
        <SidebarProvider >
            <Sidebar collapsible="icon">
                <SidebarHeader >
                    <div className="flex items-center justify-between p-2">
                        <img src={logo} alt="logo" className="w-full " />

                        <Avatar className="h-6 w-6 rounded-lg">
                            {/* <Image src={logo} alt="shadcn" /> */}
                            {/* <AvatarImage
                                src={data.user.avatar}
                                alt={data.user.name}
                            /> */}
                            {/* <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
                        </Avatar>
                        {/* <h1 className="text-base font-semibold">BoogleMeds</h1> */}
                        {/* <div className="w-8" /> Spacer for alignment */}
                    </div>
                </SidebarHeader>
                <div className="px-4 py-3 border-b ">
                    <div className={`flex ${isClosed ? 'flex-col' : "flex-row"}  justify-between gap-4`}>
                        {data.categories.map((category) => (
                            <button
                                key={category.id}
                                // variant="ghost"
                                size="icon"
                                onClick={() => setActiveCategory(category.id)}
                                className={`h-16 w-20 flex flex-col items-center justify-center rounded ${activeCategory === category.id
                                    ? "bg-red-400 border border-red-400 text-white"
                                    : "border border-red-300 text-gray-700"
                                    }`}
                                aria-label={category.name}
                            >
                                <category.icon className="h-6 w-6 mb-1" />
                                <span className={` ${isClosed ? 'hidden' : "text-sm"}`}>{category.name}</span>
                            </button>
                        //    <button>
                        //         <category.icon className="h-6 w-6 mb-1" />

                        //         <span className="text-xs">{category.name}</span>
                        //    </button>
                        ))}
                    </div>
                    {/* 
                    <div className={`hidden md:flex ${isClosed ? "flex-row gap-2 p-2" : "flex-row gap-4 p-4"} justify-between`}>
                        {data.categories.map((category) => (
                            <Button
                                key={category.id}
                                variant="ghost"
                                size="icon"
                                onClick={() => setActiveCategory(category.id)}
                                className={`h-16 ${isClosed ? "w-10" : "w-20"} flex items-center justify-center rounded ${activeCategory === category.id
                                    ? "bg-red-400 border border-red-400 text-white"
                                    : "border border-red-300 text-gray-700"
                                    }`}
                                aria-label={category.name}
                            >
                                <category.icon className="h-6 w-6 mb-1" />
                                {!isClosed && <span className="text-xs">{category.name}</span>}
                            </Button>
                        ))}
                    </div> */}

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
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton asChild>
                                                            <a href={subItem.url}>
                                                                <span>{subItem.title}</span>
                                                            </a>
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
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage
                                                src={data.user.avatar}
                                                alt={data.user.name}
                                            />
                                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">
                                                {data.user.name}
                                            </span>
                                            <span className="truncate text-xs">
                                                {data.user.email}
                                            </span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    side="bottom"
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <Avatar className="h-8 w-8 rounded-lg">
                                                <AvatarImage
                                                    src={data.user.avatar}
                                                    alt={data.user.name}
                                                />
                                                <AvatarFallback className="rounded-lg">
                                                    CN
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold">
                                                    {data.user.name}
                                                </span>
                                                <span className="truncate text-xs">
                                                    {data.user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            <span>Upgrade to Pro</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <BadgeCheck className="mr-2 h-4 w-4" />
                                            <span>Account</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            <span>Billing</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Bell className="mr-2 h-4 w-4" />
                                            <span>Notifications</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
            <SidebarInset className="-ms-32">
                <header className="  flex h-16 shrink-0 items-center  transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4 w-full ">
                        <SidebarTrigger
                            onClick={() => setIsClosed(!isClosed)}


                            className="-ml-1" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-4 py-2 text-gray-800 rounded-md focus:outline"
                        />

                        {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
                        {/* <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        {data.categories.find(c => c.id === activeCategory)?.name}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Menu</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb> */}
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />

                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}