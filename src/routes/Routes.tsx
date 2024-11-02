import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home/Home";
import ErrorPage from "../pages/errorpage/Errorpage";
import Help from "@/pages/Home/Help/Help/Help";
import OrderDetails from "@/pages/Home/Home/OrderDetails/OrderDetails";
// import HeroSection from "@/pages/Home/HeroSection/HeroSection";
// import BannerSection from "@/pages/Home/BannerSection/BannerSection";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <Home />,


        children: [

            // {
            //     path: '/',
            //     element: <Home />
            // },
            // {
            //     path: '/',
            //     element: <HeroSection />
            // },
            // {
            //     path: '/',
            //     element: <BannerSection />
            // },

        ]

    },
    {
        path: '/help',  // Separate route for Help page
        element: <Help />,
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
