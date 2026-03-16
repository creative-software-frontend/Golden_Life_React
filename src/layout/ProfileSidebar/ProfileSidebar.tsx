import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed
import { User, FileText, FileBadge, Users, Settings, ShieldCheck } from 'lucide-react';

interface StudentProfile {
    id?: number;
    name: string;
    email?: string;
    image: string | null;
    status?: string;
}

export default function ProfileSidebar() {
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    const links = [
        { path: 'basic-info', label: 'Basic Information', icon: User },
        { path: 'personal-info', label: 'Personal Information', icon: FileText },
        { path: 'document-info', label: 'Document Information', icon: FileBadge },
        { path: 'nominee-info', label: 'Nominee Information', icon: Users },
        { path: 'security', label: 'Password & Security', icon: ShieldCheck },
        { path: 'settings', label: 'Account Settings', icon: Settings },
    ];

    // Helper to safely get and parse the token
    const getAuthToken = () => {
        const session = sessionStorage.getItem("student_session");
        if (!session) return null;
        try {
            const parsedSession = JSON.parse(session);
            // Check expiry if your session object includes it
            if (parsedSession.expiry && new Date().getTime() > parsedSession.expiry) {
                sessionStorage.removeItem("student_session");
                return null;
            }
            return parsedSession.token;
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const token = getAuthToken();

            if (!token) {
                setProfile({
                    name: "Guest",
                    image: null,
                    status: 'guest'
                });
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${baseURL}/api/student/profile`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                // Matches the logic that worked in your previous snippet
                if (response.data?.status === "success" || response.data?.status === true) {
                    setProfile(response.data.student);
                } else {
                    throw new Error('Invalid response');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError(true);
                // Fallback to Guest on error so the UI doesn't break
                setProfile({ name: "Guest", image: null });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [baseURL]);

    // Construct Avatar URL with dynamic fallback
    const avatarUrl = profile?.image
        ? `${baseURL}/uploads/profiles/${profile.image}`.replace(/([^:]\/)\/+/g, "$1")
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'Student')}&background=FF8A00&color=fff&bold=true`;

    return (
        <div className="w-full md:w-80 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 shrink-0">
            {/* User Profile Header */}
            <div className="flex flex-col items-center pb-6 mb-5 border-b border-slate-100">
                {loading ? (
                    <div className="animate-pulse flex flex-col items-center w-full">
                        <div className="w-24 h-24 bg-slate-200 rounded-full mb-4" />
                        <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                    </div>
                ) : (
                    <>
                        <div className="relative mb-4 group cursor-pointer">
                            <div className="absolute inset-0 bg-primary/20 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                            <img
                                src={avatarUrl}
                                alt={profile?.name}
                                className="relative w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md z-10 bg-slate-50"
                            />
                            <div className={`absolute bottom-1 right-2 w-4 h-4 ${profile?.status === 'active' ? 'bg-green-500' : 'bg-slate-300'} border-2 border-white rounded-full z-20`} />
                        </div>

                        <h3 className="font-bold text-xl text-slate-800 tracking-tight capitalize">
                            {profile?.name || 'Student User'}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 mt-0.5">
                            {profile?.email || 'Guest Session'}
                        </p>

                        {profile?.status === 'active' && (
                            <div className="mt-3 px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 text-xs font-semibold rounded-full">
                                Active Student
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Navigation Links */}
            <div className="px-1">
                <h4 className="text-[11px] font-bold text-slate-400 tracking-wider mb-3 px-3 uppercase">
                    PROFILE MANAGEMENT
                </h4>

                <nav className="flex flex-col gap-1.5">
                    {links.map((link) => {
                        const Icon = link.icon;
                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative overflow-hidden ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                                        )}
                                        <Icon
                                            size={18}
                                            className={`transition-colors duration-200 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary/80'
                                                }`}
                                        />
                                        {link.label}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}