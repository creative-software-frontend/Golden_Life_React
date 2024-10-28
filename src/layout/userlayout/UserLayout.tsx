import Footer from '@/pages/common/Footer/Footer';
import React from 'react';
import { Outlet } from 'react-router-dom';

const UserLayout: React.FC = () => {
    return (

        <div className="-ms-32 mx-auto">
            {/* // <div className="flex flex-col min-h-screen bg-gray-100"> */}
            {/* Header */}
            {/* <header className="bg-[#FAC12B] p-4">
                <h1 className="text-2xl font-bold text-white">MyApp</h1>
            </header> */}

            {/* Main Content Area */}
            <main className="flex-grow">
                <Outlet /> {/* Renders child routes */}
            </main>

            {/* Footer */}
            {/* <Footer /> */}
            {/* // </div> */}
        </div>
    );
};

export default UserLayout;
