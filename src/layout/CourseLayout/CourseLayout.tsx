'use client'

import * as React from "react"
import { Link, Outlet } from "react-router-dom"
import logo from '../../../public/image/logo/logo.jpg'
import { ChevronRight, SquareTerminal, Pill, ChefHat, HelpCircleIcon, LogInIcon, ShoppingBag, ShoppingCart, GraduationCap, Package, Truck, Lightbulb, Book, Zap, Users, DollarSign, Leaf, Microscope, Heart, Calculator, Globe, Camera, Briefcase, Palette, Code } from 'lucide-react'
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
import Header from "@/pages/common/Header/Header"
import Footer from "@/pages/common/Footer/Footer"
import useModalStore from "@/store/Store"
import Cart from "@/pages/Home/Cart/Cart"
import LiveChat from "@/pages/Home/LiveChat/Livechat"
import CourseHeader from "@/pages/common/CourseHeader/CourseHeader"

const data = {
    categories: [
        { id: "shopping", name: "Shopping", icon: ShoppingCart, path: "/" },
        { id: "courses", name: "Courses", icon: GraduationCap, path: "/courses" },
        { id: "percel", name: "Percel", icon: Package, path: "/percel" },
        { id: "topup", name: "Topup", icon: Package, path: "/topup" },
        { id: "drive", name: "Drive", icon: Truck, path: "/drive" },
        { id: "cookups", name: "Outlet", icon: ChefHat, path: "/outlet" },
    ],
    navMain: {
        courses: [
            {
                title: "Programming",
                url: "/courses/programming",
                icon: SquareTerminal,
                isActive: true,
                items: [
                    { title: "Web Development", url: "" },
                    { title: "Mobile App Development", url: "" },
                    // { title: "Data Science", url: "/courses/programming/data-science" },
                    // { title: "Machine Learning", url: "/courses/programming/machine-learning" },
                    // { title: "Game Development", url: "/courses/programming/game-development" },
                    // { title: "Cloud Computing", url: "/courses/programming/cloud-computing" },
                ],
            },
            {
                title: "Business",
                url: "/courses/business",
                icon: Pill,
                items: [
                    // { title: "Entrepreneurship", url: "/courses/business/entrepreneurship" },
                    // { title: "Marketing", url: "/courses/business/marketing" },
                    // { title: "Finance", url: "/courses/business/finance" },
                    // { title: "Project Management", url: "/courses/business/project-management" },
                    // { title: "Leadership", url: "/courses/business/leadership" },
                ],
            },
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
            {
                title: "Technology",
                url: "",
                icon: Code,
                isActive: true,
                items: [
                    { title: "Web Development", url: "" },
                    { title: "Mobile App Development", url: "" },
                    { title: "Data Science", url: "" },
                    { title: "Machine Learning", url: "" },
                    { title: "Cloud Computing", url: "" },
                    { title: "Cybersecurity", url: "" },
                ],
            },
            {
                title: "Design",
                url: "",
                icon: Palette,
                items: [
                    { title: "Graphic Design", url: "" },
                    { title: "UX/UI Design", url: "" },
                    { title: "3D Modeling", url: "" },
                    { title: "Animation", url: "" },
                    { title: "Illustration", url: "" },
                ],
            },
            {
                title: "Business",
                url: "",
                icon: Briefcase,
                items: [
                    { title: "Entrepreneurship", url: "" },
                    { title: "Marketing", url: "" },
                    { title: "Finance", url: "" },
                    { title: "Project Management", url: "" },
                    { title: "Leadership", url: "" },
                ],
            },
            {
                title: "Photography",
                url: "",
                icon: Camera,
                items: [
                    { title: "Digital Photography", url: "" },
                    { title: "Portrait Photography", url: "" },
                    { title: "Landscape Photography", url: "" },
                    { title: "Photo Editing", url: "" },
                ],
            },
            
            {
                title: "Language",
                url: "",
                icon: Globe,
                items: [
                    { title: "English", url: "" },
                    { title: "Spanish", url: "" },
                    { title: "Mandarin", url: "" },
                    { title: "French", url: "" },
                    { title: "German", url: "" },
                ],
            },
            {
                title: "Mathematics",
                url: "",
                icon: Calculator,
                items: [
                    { title: "Algebra", url: "" },
                    { title: "Calculus", url: "" },
                    { title: "Statistics", url: "" },
                    { title: "Geometry", url: "" },
                ],
            },
            {
                title: "Health & Fitness",
                url: "",
                icon: Heart,
                items: [
                    { title: "Nutrition", url: "" },
                    { title: "Yoga", url: "" },
                    { title: "Personal Training", url: "" },
                    { title: "Mental Health", url: "" },
                ],
            },
            {
                title: "Science",
                url: "",
                icon: Microscope,
                items: [
                    { title: "Physics", url: "" },
                    { title: "Chemistry", url: "" },
                    { title: "Biology", url: "" },
                    { title: "Astronomy", url: "" },
                ],
            },
            {
                title: "Environmental Studies",
                url: "",
                icon: Leaf,
                items: [
                    { title: "Climate Change", url: "" },
                    { title: "Sustainability", url: "" },
                    { title: "Conservation", url: "" },
                    { title: "Renewable Energy", url: "" },
                ],
            },
            {
                title: "Personal Finance",
                url: "",
                icon: DollarSign,
                items: [
                    { title: "Investing", url: "" },
                    { title: "Budgeting", url: "" },
                    { title: "Retirement Planning", url: "" },
                    { title: "Tax Planning", url: "" },
                ],
            },
            {
                title: "Social Sciences",
                url: "",
                icon: Users,
                items: [
                    { title: "Psychology", url: "" },
                    { title: "Sociology", url: "" },
                    { title: "Anthropology", url: "" },
                    { title: "Political Science", url: "" },
                ],
            },
            {
                title: "Engineering",
                url: "",
                icon: Zap,
                items: [
                    { title: "Electrical Engineering", url: "" },
                    { title: "Mechanical Engineering", url: "" },
                    { title: "Civil Engineering", url: "" },
                    { title: "Chemical Engineering", url: "" },
                ],
            },
            {
                title: "Writing",
                url: "",
                icon: Book,
                items: [
                    { title: "Creative Writing", url: "" },
                    { title: "Technical Writing", url: "" },
                    { title: "Journalism", url: "" },
                    { title: "Copywriting", url: "" },
                ],
            },
            {
                title: "Personal Development",
                url: "",
                icon: Lightbulb,
                items: [
                    { title: "Time Management", url: "" },
                    { title: "Public Speaking", url: "" },
                    { title: "Critical Thinking", url: "" },
                    { title: "Emotional Intelligence", url: "" },
                ],
            },
        ],
    }
}

export default function CourseLayout() {
    const [activeCategory, setActiveCategory] = React.useState("courses")
    const { openLoginModal, toggleClicked, changeCheckoutModal } = useModalStore();

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
                            {activeCategory === "courses" && data.navMain.courses.map((item) => (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    defaultOpen={item.isActive}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}>
                                                {item.icon && <item.icon className="mr-2" />}
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="flex justify-between items-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground shadow-inner px-4 py-2"
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
                                            <button className="flex items-center gap-2" onClick={openLoginModal}>
                                                <div className="bg-blue-400 rounded-full p-1">
                                                    <LogInIcon className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-blue-400">Login</span>
                                            </button>
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
                <main className="pt-8 ms-4">
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
                    {/* <CourseHeader /> */}
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