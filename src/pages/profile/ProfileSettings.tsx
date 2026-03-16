import { Outlet } from 'react-router-dom';
import ProfileSidebar from '../../layout/ProfileSidebar/ProfileSidebar'; // Make sure this path matches where your file is!

export default function ProfileSettings() {
    return (
        <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Max-width container to keep things centered and neat */}
            <div className="max-w-6xl mx-auto">
                
                {/* Header (Optional, but looks great for context) */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Account Settings
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Manage your profile, documents, and security preferences.
                    </p>
                </div>

                {/* Main Layout Grid */}
                <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
                    
                    {/* Left Side: Your beautiful custom Sidebar */}
                    <div className="w-full md:w-auto">
                        <ProfileSidebar />
                    </div>

                    {/* Right Side: The Content Area */}
                    <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8 min-h-[500px]">
                        {/* <Outlet /> is where React Router injects the components for 
                            /basic-info, /personal-info, /security, etc., based on the URL!
                        */}
                        <Outlet />
                    </div>
                    
                </div>
            </div>
        </div>
    );
}