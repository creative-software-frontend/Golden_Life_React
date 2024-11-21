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
import CheckoutModal from "@/pages/Home/CheckoutModal/CheckoutModal";
import TrendingCategory from "@/pages/Home/TrendingCategory/TrendingCategory";
import Trending from "@/pages/Home/TrendingCategory/Trending";
import AdminLayout from "@/layout/AdminLAyout/AdminLayout";
import Overview from "@/pages/Dashboard/Overview/Overview";
import AutoScrollIcons from "@/pages/Home/ScrollCategories/ScrollCategories";
import AllCourses from "@/pages/Home/AllCourses/AllCourses";
import CourseViewPage from "@/pages/Home/CourseViewPage/CourseViewPage";
import CourseLayout from "@/layout/CourseLayout/CourseLayout";
// import PhoneNumberInput from "@/pages/phonenumberinput/phonenumberinput";
// import CheckoutModal from "@/pages/Home/CheckoutModal/CheckoutModal";
// import CheckoutModal from "@/pages/Home/CheckoutModal/CheckoutModal";
// import HeroSection from "@/pages/Home/HeroSection/HeroSection";
// import BannerSection from "@/pages/Home/BannerSection/BannerSection";
import Courses from "@/pages/Home/CoursesCategory/CoursesCategory";
import Coursecatagory2 from "@/pages/Home/Coursecatagory2/Coursecatagory2";
// import Courses from './../pages/Home/CoursesCategory/CoursesCategory';
import CourseCategories from "../pages/Home/CoursesCategory/CoursesCategory";
import Hsc from "@/pages/Home/HSC/Hsc";
import Ssc from "@/pages/Home/SSC/Ssc";



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
            
     


        ]

    },
    {
        path: '/courses',
        element: <CourseLayout />,


        children: [

            {
                path: '/courses',
                element: < CourseCategories />
            },
            {
                path: 'allcourses',  // Separate route for Help page
                element: <AllCourses />,
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
    // {
    //     path: '/trending',  // Separate route for Help page
    //     element: <TrendingCategory />,
    // },


    {
        path: '*',
        element: <ErrorPage />, // Error page for undefined routes
    },

])
