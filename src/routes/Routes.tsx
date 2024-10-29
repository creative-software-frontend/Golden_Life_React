import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home/Home";
import ErrorPage from "../pages/errorpage/Errorpage";
import Help from "@/pages/Home/Help/Help/Help";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <Home />,

        children: [

            // {
            //     path: '/',
            //     element: <Home />
            // },
            {
                path: 'help',
                element: <Help />
            },

        ]

    },
    {
        path: '*',
        element: <ErrorPage />, // Error page for undefined routes
    },
])
