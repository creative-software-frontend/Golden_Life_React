import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/errorpage/Errorpage";
import OrderDetails from "@/pages/Home/OrderDetails/OrderDetails";
import Story from "@/pages/Help/Story/Story";
import Career from "@/pages/Help/Career/Career";
import Contact from "@/pages/Help/Contact/Contact";
import PrivacyPolicy from "@/pages/Help/PrivacyPolicy/PrivacyPolicy";
import UserLayout from "@/layout/userlayout/UserLayout";
import HelpLayout from "@/layout/HelpLayout/HelpLayout";
import Faq from "@/pages/Home/Faq/Faq";
import TermsOfUse from "@/pages/Help/TermsOfUse/TermsOfUse";
import AllCategories from "@/pages/Home/AllCategories/AllCategories";
import ProductPage from "@/pages/Home/ProductPage/ProductPage";
import Home from "@/pages/Home/Home/Home";
import AllProduct from "@/pages/Home/AllProducts/AllProducts";
import Trending from "@/pages/Home/TrendingCategory/Trending";
// import AdminLayout from "@/layout/AdminLAyout/AdminLayout";
// import Overview from "@/pages/Dashboard/Overview/Overview";
import AllCourses from "@/pages/Home/AllCourses/AllCourses";
import CourseViewPage from "@/pages/Home/CourseViewPage/CourseViewPage";
import CourseLayout from "@/layout/CourseLayout/CourseLayout";
import Hsc from "@/pages/Home/HSC/Hsc";
import Ssc from "@/pages/Home/SSC/Ssc";
import Course from "@/pages/Home/Course/Course";
import PercelLayout from "@/layout/PercelLayout/PercelLayout";
import TopupLayout from "@/layout/TopUplayout/TopUplayout";
import CommingSoon from "./../pages/commingSoon";
import OutletLayout from "@/layout/OutletLayout/OutletLayout";
import DriveLayout from "@/layout/DriveLayout/DriveLayout";

import LandingLayout from "@/layout/LandingLayout/LandingLayout";

import AllCourses2 from "@/pages/Home/AllCourses2/AllCourses2";
import AddMoney from "@/pages/Dashboard/AddMoney/AddMoney";
import History from "@/pages/Dashboard/History/History";
import SendMoney from "@/pages/Dashboard/SendMoney/SendMoney";
// import PaymentMethod from "@/pages/Dashboard/PaymentMethod/PaymentMethod";
import SendMoneyAmount from "@/pages/Dashboard/SendMoneyAmount/SendMoneyAmount";
import SendMoneyConfirm from "@/pages/Dashboard/SendMoneyConfirm/SendMoneyConfirm";
import Cookies from "@/pages/legal/Cookies";
import Payments from "@/pages/legal/Payments";
import TermsConditions from "@/pages/legal/TermsConditions";
import Login from "@/pages/common/Login/Login";
import Register from "@/pages/common/Register/Register";
import Landing from "@/pages/Landing/Landing";
// import SendMoney from './../pages/Dashboard/SendMoney/SendMoney';



export const routes = createBrowserRouter([
    // PUBLIC ROUTES (No Layout - Full Screen Pages)
   {
        path: '/login',
        element: <Login />, // Full screen login page
   },
   {
        path: '/register',
        element: <Register />, // Full screen register page
   },
   {
        path: '/',
        // REMOVE 'element: <LandingLayout/>' from here to stop it applying to everything
        children: [
            // 1. LANDING PAGE (Stays separate, assumes it has its own Header)
            {
                path: '/', 
                element: <Landing/> 
            },

            // 2. LEGAL PAGES GROUP (Apply LandingLayout ONLY to these)
            {
                element: <LandingLayout />, // This adds Header/Footer to children below
                children: [
                    {
                        path: 'cookies',
                        element: <Cookies />
                    },
                    {
                        path: 'payments',
                        element: <Payments />
                    },
                    {
                        path: 'terms', 
                        element: <TermsConditions />
                    },
                    // {
                    //     path: 'privacy', 
                    //     element: <PrivacyPolicyLegal />
                    // },
                    // {
                    //     path: 'security', 
                    //     element: <Security />
                    // },
                ]
            }
        ]
    },
    {
        path: '/dashboard',
        element: <UserLayout />,


        children: [

            {
                path: '',
                element: <Home />
            },
            {
                path: 'allcategories',
                element: <AllCategories />
            },
            {
                path: 'all-courses',
                element: < AllCourses2 />
            },
            {
                path: 'productpage',  // Separate route for Help page
                element: <ProductPage />,
            },
            {
                path: 'allProducts',  // Separate route for Help page
                element: <AllProduct />,
            },




        ]

    },
    {
        path: '/courses',
        element: <CourseLayout />,


        children: [

            {
                path: '/courses',
                element: < Course />
            },


            {
                path: 'hsc',
                element: < Hsc />
            },

            {
                path: 'ssc',
                element: < Ssc />
            },




        ]

    },


    {
        path: '/percel',
        element: <PercelLayout />, // Layout for percel page
        children: [
            {
                path: '/percel',
                element: <CommingSoon />,
            },
        ]

    },
    {
        path: '/topup',
        element: <TopupLayout />, // Layout for percel page
        children: [
            {
                path: '/topup',
                element: <CommingSoon />,
            },
        ]

    },
    {
        path: '/drive',
        element: <DriveLayout />, // Layout for percel page
        children: [
            {
                path: '/drive',
                element: <CommingSoon />,
            },
        ]

    },
    {
        path: '/outlet',
        element: <OutletLayout />, // Layout for percel page
        children: [
            {
                path: '/outlet',
                element: <CommingSoon />,
            },
        ]

    },


    {
        path: '/help',
        element: <HelpLayout />,


        children: [

            {
                path: '/help',
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
    // {
    //     path: '/dashboard',
    //     element: <AdminLayout />, // Layout for dashboard panel
    //     children: [
    //         {
    //             path: '/dashboard',
    //             element: <Overview />,
    //         },
    //         // {
    //         //     path: 'merchants',
    //         //     element: <MerchantList />,
    //         // },
    //         // {
    //         //     path: 'riders',
    //         //     element: <RiderList />,
    //         // },
    //         // {
    //         //     path: 'districts',
    //         //     element: <Districts />,
    //         // },
    //         // {
    //         //     path: 'setting',
    //         //     element: <Setting />,
    //         // },
    //         {
    //             path: 'addmoney',  // Separate route for Help page
    //             element: <AddMoney />,
    //         },
    //         {
    //             path: 'history',  // Separate route for Help page
    //             element: <History />,
    //         },
    //         {
    //             path: 'sendmoney',  // Separate route for Help page
    //             element: <SendMoney />,
    //         },
    //         {
    //             path: 'paymentmethod',  // Separate route for Help page
    //             element: <PaymentMethod />,
    //         },
           

    //     ],
    // },
    {
        path: '/allcourses',  // Separate route for Help page
        element: <AllCourses />,
    },
    {
        path: '/orderdetails',  // Separate route for Help page
        element: <OrderDetails />,
    },
    {
        path: '/trending',  // Separate route for Help page
        element: <Trending />,
    },
    {
        path: '/productviewpage',  // Separate route for Help page
        element: <CourseViewPage />,
    },
    {
        path: '/addmoney',  // Separate route for Help page
        element: <AddMoney />,
    },
    {
        path: '/history',  // Separate route for Help page
        element: <History />,
    },
    {
        path: '/sendmoney',  // Separate route for Help page
        element: <SendMoney />,
    },
    {
        path: '/payamount',  // Separate route for Help page
        element: <SendMoneyAmount />,
    },
    {
        path: '/sendmoneyconfirm',  // Separate route for Help page
        element: <SendMoneyConfirm />,
    },

    {
        path: '*',
        element: <ErrorPage />, // Error page for undefined routes
    },

])
