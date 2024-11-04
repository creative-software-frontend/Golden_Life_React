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
                element: <AllCategories />
            },


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
            {
                path: 'orderdetails',  // Separate route for Help page
                element: <OrderDetails />,
            },


        ]

    },
    {
        path: '/orderdetails',  // Separate route for Help page
        element: <OrderDetails />,
    },


    // {
    //     path: '/checkout',
    //     element: <CheckoutModal />, // Error page for undefined routes
    // },
    // {
    //     path: '/all-categories',
    //     element: <AllCategories />, // Error page for undefined routes
    // },
    {
        path: '*',
        element: <ErrorPage />, // Error page for undefined routes
    },
])
