import { createBrowserRouter } from "react-router-dom";
import AdminPanel from "../adminpanel/AdminPanel";
import ErrorPage from "../errorpage/Errorpage";
import UserLayout from "@/layout/userlayout/UserLayout";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <AdminPanel />,

        // children: [

        //     {
        //         path: '/',
        //         element: <AdminPanel />
        //     },

        // ]

    },
    {
        path: '*',
        element: <ErrorPage />, // Error page for undefined routes
    },
])
