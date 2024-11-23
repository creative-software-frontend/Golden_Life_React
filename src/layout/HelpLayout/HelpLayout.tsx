"use client"

import * as React from "react"
import logo from '../../../public/image/logo/logo.jpg'

import {
    BookOpen,
    Bot,
    ChevronRight,
    SquareTerminal,
    ShoppingCart,
    Pill,
    ChefHat,
    HelpCircleIcon,
    LogInIcon,
    XCircle,
    GraduationCap
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
import { Link, Outlet, useLocation } from "react-router-dom"
import useModalStore from "@/store/Store"



// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    categories: [
        { id: "shopping", name: "Shopping", icon: ShoppingCart, path: "/" },
        { id: "courses", name: "Courses", icon: GraduationCap, path: "/courses" },

        { id: "pharmacy", name: "Pharmacy", icon: Pill, path: "/pharmacy" },
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
const faqs = [
    {
        question: "What's the best thing about Switzerland?",
        answer:
            "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
        question: "What's the capital of Switzerland?",
        answer:
            "The capital of Switzerland is Bern. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
        question: "What languages are spoken in Switzerland?",
        answer:
            "Switzerland has four official languages: German, French, Italian, and Romansh.",
    },
    {
        question: "What is the currency of Switzerland?",
        answer:
            "The currency of Switzerland is the Swiss Franc (CHF).",
    },
    {
        question: "What is Swiss cheese?",
        answer:
            "Swiss cheese is a generic term for several cheese varieties that are produced in Switzerland.",
    },
    {
        question: "What is the Swiss Alps?",
        answer:
            "The Swiss Alps are a mountain range located in Switzerland known for their stunning beauty and skiing opportunities.",
    },
];

const tabs = [
    { name: 'My Account', href: '#', current: false },
    { name: 'Company', href: '#', current: false },
    { name: 'Team Members', href: '#', current: true },
    { name: 'Billing', href: '#', current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}


export default function HelpLayout() {
    const [activeCategory, setActiveCategory] = React.useState("shopping")
    const location = useLocation();
    const { changeCheckoutModal, isLoginModalOpen, openLoginModal, closeLoginModal } = useModalStore();


    // Function to render the banner based on the current path
    const getBannerForPage = () => {
        switch (location.pathname) {
            case '/help/our-story':
                return (
                    <div className="banner our-story-banner">
                        <h1>Our Story</h1>
                    </div>
                );
            case '/help/career':
                return (
                    <div className="banner career-banner">
                        <h1>Career</h1>
                    </div>
                );
            case '/help/contact':
                return (
                    <div className="banner contact-banner">
                        <h1>Contact Us</h1>
                    </div>
                );
            case '/help/privacy-policy':
                return (
                    <div className="banner privacy-policy-banner">
                        <h1>Privacy Policy</h1>
                    </div>
                );
            case '/help/terms':
                return (
                    <div className="banner terms-banner">
                        <h1>Terms of Use</h1>
                    </div>
                );
            default:
                return (
                    <div className="banner default-banner">
                        <h1>Welcome to Help</h1>
                    </div>
                );
        }
    };
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleClear = () => {
        setSearchTerm('');
    };

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        // <div className="flex h-screen">
        <SidebarProvider className=''>
            {/* <div className="w-[20%] min-w-[250px]"> Sidebar container */}
            <Sidebar collapsible="icon">
                <SidebarHeader >
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
                                        className="flex justify-between items-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground shadow-inner px-4 py-2 "
                                    >
                                        {/* Left Side: Help Button */}
                                        <div className="flex items-center gap-2">
                                            <Link to="/help" className="flex items-center gap-2">
                                                <div className="bg-teal-500 rounded-full p-1">
                                                    <HelpCircleIcon className="h-4 w-4 text-white" /> {/* Icon with teal background and white color */}
                                                </div>
                                                <span className="text-teal-600">Help</span>
                                            </Link>
                                        </div>

                                        {/* Separator */}
                                        <div className="h-6 w-[1px] bg-gray-300 mx-4"></div>

                                        {/* Right Side: Login Button */}
                                        <div className="flex items-center gap-2">
                                            <button className="flex items-center gap-2" onClick={openLoginModal}>
                                                <div className="bg-blue-400 rounded-full p-1">
                                                    <LogInIcon className="h-4 w-4 text-white" /> {/* Icon with blue background and white color */}
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
            {/* </div> */}
            {/* <div className="flex-1 overflow-hidden"> Main content area */}
            <SidebarInset >
                <main className="" >
                    <section className="bg-primary-default py-20 ">
                        <div className="text-center text-white">
                            <h2 className="text-3xl font-bold mb-4">{getBannerForPage()}</h2>
                            <div className="relative max-w-md mx-auto">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Type keywords to find an answer"
                                    className="w-full px-4 py-2 rounded-full border-2 border-white text-gray-700 placeholder-gray-400 focus:outline-none"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={handleClear}
                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-green-500"
                                    >
                                        <XCircle size={24} />
                                    </button>
                                )}
                            </div>
                            {/* <button className="mt-4 px-4 py-2 bg-white text-primary-default rounded-full font-semibold hover:bg-gray-100">
                                Your faq here
                            </button> */}
                        </div>
                    </section>

                    {/* <Header /> */}
                    <div className="">
                        <div className="hidden sm:block">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
                                    <Link to="/help/our-story" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                                        Our Story
                                    </Link>
                                    <Link to="/help" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                                        FAQ
                                    </Link>
                                    <Link to="/help/career" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                                        Career
                                    </Link>
                                    <Link to="/help/contact" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                                        Contact
                                    </Link>
                                    <Link to="/help/privacy-policy" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                                        Privacy Policy
                                    </Link>
                                    <Link to="/help/terms" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                                        Terms of Use
                                    </Link>
                                </nav>
                            </div>
                        </div>
                    </div>

                   
                    <Outlet />
                    {/* <Footer /> */}
                </main>
            </SidebarInset>
            {/* </div> */}

        </SidebarProvider>

        // </div>
    )
}