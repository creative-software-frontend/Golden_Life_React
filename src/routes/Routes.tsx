import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home/Home";
import ErrorPage from "../pages/errorpage/Errorpage";
import Help from "@/pages/Home/Help/Help/Help";
import OrderDetails from "@/pages/Home/Home/OrderDetails/OrderDetails";
import Story from "@/pages/Home/Story/Story";
import Career from "@/pages/Home/Home/Career/Career";
import Contact from "@/pages/Home/Home/Contact/Contact";
import PrivacyPolicy from "@/pages/Home/Home/PrivacyPolicy/PrivacyPolicy";
import TermsOfUse from "@/pages/Home/Home/BabyProducts/TermsOfUse/TermsOfUse";
// import HeroSection from "@/pages/Home/HeroSection/HeroSection";
// import BannerSection from "@/pages/Home/BannerSection/BannerSection";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <Home />,


        children: [

            {
                path: '/help',
                element: <Help />
            },


        ]

    },
    // {
    //     path: '/help',
    //     element: <Help />,


    //     children: [

    //         {
    //             path: '/help',
    //             element: <Help />
    //         },


    //     ]

    // },
    // {
    //     path: '/help',  // Separate route for Help page
    //     element: <Help />,
    // },
    {
        path: '/our-story',  // Separate route for Help page
        element: <Story />,
    },
    {
        path: '/career',  // Separate route for Help page
        element: <Career />,
    },
    {
        path: '/contact',  // Separate route for Help page
        element: <Contact />,
    },
    {
        path: '/privacy-policy',  // Separate route for Help page
        element: <PrivacyPolicy />,
    },
    {
        path: '/terms',  // Separate route for Help page
        element: <TermsOfUse />,
    },
    {
        path: '/orderdetails',  // Separate route for Help page
        element: <OrderDetails />,
    },
    {
        path: '*',
        element: <ErrorPage />, // Error page for undefined routes
    },
])
