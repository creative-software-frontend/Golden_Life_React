import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import VendorFooter from './VendorFooter';

const VendorLayout: React.FC = () => {
    // 1. Master State: Controls the Sidebar for the whole app
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 2. The Toggle Function 
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="flex h-screen bg-muted/40 text-foreground overflow-hidden">
            
            {/* Sidebar receives state and toggle function */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                
                {/* Navbar receives state and toggle function so the custom icon works */}
                <Navbar toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 md:p-8">
                    {/* Your page content renders here */}
                    <Outlet />
                </main>

                <VendorFooter />
            </div>
        </div>
    );
};

export default VendorLayout;