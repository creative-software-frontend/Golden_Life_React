import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import VendorFooter from './VendorFooter';
import { useProfile } from '../../pages/Vendor/Profile/hooks/useProfile';
import { useProfileCompletion } from '../../hooks/useProfileCompletion';
import { ProfileCompletionPopup } from '../../pages/Vendor/Profile/components/ProfileCompletionPopup';

const VendorLayout: React.FC = () => {
    // 1. Master State: Controls the Sidebar for the whole app
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Profile completion states
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [hasDismissedPopup, setHasDismissedPopup] = useState(false);
    const navigate = useNavigate();
    const { data: profileData } = useProfile();
    const { percentage, missingFields, isComplete } = useProfileCompletion(profileData?.vendor);

    // 2. The Toggle Function 
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    // Check profile completion on mount and route change
    useEffect(() => {
        if (profileData?.vendor && !isComplete && !hasDismissedPopup) {
            // Show popup after a short delay
            const timer = setTimeout(() => {
                setShowProfilePopup(true);
            }, 1000);
            
            return () => clearTimeout(timer);
        }
    }, [profileData, isComplete, hasDismissedPopup]);

    const handleCompleteProfile = () => {
        setShowProfilePopup(false);
        navigate('/vendor/dashboard/profile');
    };

    const handleDismissPopup = () => {
        setShowProfilePopup(false);
        setHasDismissedPopup(true);
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
            
            {/* Profile Completion Popup */}
            <ProfileCompletionPopup
              isOpen={showProfilePopup}
              percentage={percentage}
              missingFields={missingFields}
              onCompleteProfile={handleCompleteProfile}
              onDismiss={handleDismissPopup}
            />
        </div>
    );
};

export default VendorLayout;