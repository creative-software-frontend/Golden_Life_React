import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/errorpage/Errorpage";
import OrderDetails from "@/pages/Home/Home/OrderDetails/OrderDetails";
import Story from "@/pages/Home/Story/Story";
import Career from "@/pages/Home/Home/Career/Career";
import Contact from "@/pages/Home/Home/Contact/Contact";
import PrivacyPolicy from "@/pages/Home/Home/PrivacyPolicy/PrivacyPolicy";
import UserLayout from "@/layout/userlayout/UserLayout";
import HelpLayout from "@/layout/HelpLayout/HelpLayout";
import Faq from "@/pages/Home/Faq/Faq";
import TermsOfUse from "@/pages/Home/Home/TermsOfUse/TermsOfUse";
import AllCategories from "@/pages/Home/AllCategories/AllCategories";
import ProductPage from "@/pages/ProductPage/ProductPage";
import Home from "@/pages/Home/Home/Home";
import AllProduct from "@/pages/AllProducts/AllProducts";
import CheckoutModal from "@/pages/Home/CheckoutModal/CheckoutModal";
import TrendingCategory from "@/pages/TrendingCategory/TrendingCategory";
import Trending from "@/pages/TrendingCategory/Trending";
import AdminLayout from "@/layout/AdminLAyout/AdminLayout";
import Overview from "@/pages/Dashboard/Overview/Overview";
import AutoScrollIcons from "@/pages/Home/ScrollCategories/ScrollCategories";
// import PhoneNumberInput from "@/pages/phonenumberinput/phonenumberinput";
// import CheckoutModal from "@/pages/Home/CheckoutModal/CheckoutModal";
// import CheckoutModal from "@/pages/Home/CheckoutModal/CheckoutModal";
// import HeroSection from "@/pages/Home/HeroSection/HeroSection";
// import BannerSection from "@/pages/Home/BannerSection/BannerSection";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <UserLayout />,


        children: [

            {
                path: '/',
                element: <Home />
            },
            {
                path: 'allcategories',
                element: <AllCategories />
            },
            {
                path: 'productpage',  // Separate route for Help page
                element: <ProductPage />,
            },
            {
                path: 'allProducts',  // Separate route for Help page
                element: <AllProduct />,
            },
            // {
            //     path: 'allProducts',  // Separate route for Help page
            //     element: <TrendingCategory />,
            // },


        ]

    },
    {
        path: '/help',
        element: <HelpLayout />,


        children: [

            {
                path: '',
                element: <Faq />
            },
            {
                path: 'our-story',  // Separate route for Help page
                element: <Story />,
            },
            {
                path: 'career',  // Separate route for Help page
                element: <Career />,
            },
            {
                path: 'contact',  // Separate route for Help page
                element: <Contact />,
            },
            {
                path: 'privacy-policy',  // Separate route for Help page
                element: <PrivacyPolicy />,
            },
            {
                path: 'terms',  // Separate route for Help page
                element: <TermsOfUse />,
            },



        ]

    },
    {
        path: '/admin',
        element: <AdminLayout />, // Layout for admin panel
        children: [
            {
                path: '/admin',
                element: <Overview />,
            },
            // {
            //     path: 'merchants',
            //     element: <MerchantList />,
            // },
            // {
            //     path: 'riders',
            //     element: <RiderList />,
            // },
            // {
            //     path: 'districts',
            //     element: <Districts />,
            // },
            // {
            //     path: 'setting',
            //     element: <Setting />,
            // },
            
        ],
    },
    {
        path: '/scrollcategories',  // Separate route for Help page
        element: <AutoScrollIcons />,
    },
    {
        path: '/orderdetails',  // Separate route for Help page
        element: <OrderDetails />,
    },
    {
        path: '/trending',  // Separate route for Help page
        element: <Trending />,
    },
    // {
    //     path: '/trending',  // Separate route for Help page
    //     element: <TrendingCategory />,
    // },


    {
        path: '*',
        element: <ErrorPage />, // Error page for undefined routes
    },
    
])
