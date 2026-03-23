import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import {
    LayoutDashboard,
    User,
    FileText,
    FileBadge,
    Users,
    Info,
    Settings,
    ShieldCheck,
    UserCircle2,
    Facebook,
    Send,
    Twitter,
    Youtube,
    Linkedin
} from 'lucide-react';
import useModalStore from '@/store/Store';
import { AdditionalInfoData } from '@/components/profile/types/types';

interface StudentProfile {
    id?: number;
    name: string;
    email?: string;
    image: string | null;
    status?: string;
}

interface DashboardStats {
    boucher: string | number;
    earning: string | number;
    recharge: string | number;
}

const SocialIcon = ({ icon: Icon, url, color }: { icon: any, url: string | null, color: string }) => {
    if (!url) return null;
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            style={{ backgroundColor: color, color: 'white' }}
        >
            <Icon size={16} strokeWidth={2.5} />
        </a>
    );
};

export default function ProfileSidebar() {
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoData | null>(null);
    const [stats, setStats] = useState<DashboardStats>({ boucher: 0, earning: 0, recharge: 0 });

    const profileUpdateTrigger = useModalStore((s) => s.profileUpdateTrigger);
    const storedProfile = useModalStore((s) => s.studentProfile);
    const profileBlobPreview = useModalStore((s) => s.profileBlobPreview);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    const getAuthToken = () => {
        const session = sessionStorage.getItem("student_session");
        if (!session) return null;
        try {
            const parsedSession = JSON.parse(session);
            return parsedSession.token;
        } catch (e) { return null; }
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = getAuthToken();
            if (!token) return;

            try {
                // Fetch Dashboard for basic profile and stats
                const dashboardRes = await axios.get(`${baseURL}/api/student/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (dashboardRes.data?.success) {
                    const data = dashboardRes.data.data;
                    const s = data.student;
                    setProfile({
                        id: s.id,
                        name: s.name,
                        email: s.email,
                        image: s.image || null,
                        status: s.status,
                    });

                    // Attempt to extract stats from dashboard
                    setStats({
                        boucher: data.boucher_balance || 0,
                        earning: data.earning_balance || 0,
                        recharge: data.recharge_balance || 0
                    });
                }

                // Fetch Additional Info for social links
                const additionalRes = await axios.get(`${baseURL}/api/student/additional-info`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (additionalRes.data?.success) {
                    setAdditionalInfo(additionalRes.data.data);
                }

            } catch (err) {
                console.error('ProfileSidebar: Data fetch failed:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [baseURL, profileUpdateTrigger]);

    const displayProfile = storedProfile ?? profile;
    const serverImageUrl = displayProfile?.image
        ? `${baseURL}/uploads/student/image/${displayProfile.image}?t=${profileUpdateTrigger}`
        : null;
    const avatarUrl = profileBlobPreview ?? serverImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayProfile?.name || 'Student')}&background=FF8A00&color=fff&bold=true`;

    const links = [
        { path: 'project-overview-info', label: 'Project Overview', icon: LayoutDashboard },
        { path: 'basic-info', label: 'Basic Information', icon: User },
        { path: 'personal-info', label: 'Personal Information', icon: FileText },
        { path: 'document-info', label: 'Document Information', icon: FileBadge },
        { path: 'nominee-info', label: 'Nominee Information', icon: UserCircle2 },
        { path: 'Additional-info', label: 'Additional Information', icon: Info },
        { path: 'settings', label: 'Account Settings', icon: Settings },
    ];

    return (
        <div className="w-full md:w-80 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 shrink-0 h-fit sticky top-24">
            {/* Header section with photo and name */}
            <div className="flex flex-col items-center pb-6 border-b border-slate-50">
                <div className="relative mb-4 group">
                    <div className="absolute inset-0 bg-primary/20 rounded-full scale-110 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="relative w-28 h-28 rounded-full p-1.5 bg-white shadow-xl ring-1 ring-slate-100 overflow-hidden">
                        <img
                            src={avatarUrl}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover z-10"
                        />
                        <div className="absolute bottom-2 right-4 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full shadow-sm z-20" />
                    </div>
                </div>

                <div className="text-center space-y-1">
                    <h3 className="font-black text-xl text-slate-800 tracking-tight capitalize">
                        {displayProfile?.name || 'Student User'}
                    </h3>
                </div>

                {/* Social Icons - UI like requested */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                    <SocialIcon icon={Facebook} url={additionalInfo?.facebook_url || null} color="#1877F2" />
                    <SocialIcon icon={Send} url={additionalInfo?.telegram || null} color="#26A5E4" />
                    <SocialIcon icon={Twitter} url={additionalInfo?.x_url || null} color="#1DA1F2" />
                    <SocialIcon icon={Youtube} url={additionalInfo?.youtube_url || null} color="#FF0000" />
                    <SocialIcon icon={Linkedin} url={additionalInfo?.linkedin_url || null} color="#0A66C2" />
                    {additionalInfo?.tiktok_url && (
                        <a
                            href={additionalInfo.tiktok_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-xl shadow-sm bg-slate-900 text-white transition-all hover:-translate-y-1 hover:shadow-md"
                        >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" /></svg>
                        </a>
                    )}
                </div>

                {/* Stats row - UI like requested */}
                <div className="grid grid-cols-3 gap-0 w-full mt-8 pt-6 border-t border-slate-50 text-center">
                    <div className="space-y-1.5 border-r border-slate-100">
                        <p className="text-sm font-black text-slate-800">${stats.boucher}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Boucher</p>
                    </div>
                    <div className="space-y-1.5 border-r border-slate-100">
                        <p className="text-sm font-black text-slate-800">${stats.earning}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Earning</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-sm font-black text-slate-800">${stats.recharge}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Recharge</p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1.5 mt-6 px-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 text-sm font-bold relative overflow-hidden ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-full" />
                                    )}
                                    <Icon
                                        size={20}
                                        className={`transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-slate-300 group-hover:text-primary group-hover:scale-110'
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
    );
}