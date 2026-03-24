import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    User,
    ShieldCheck,
    Loader2,
    TrendingUp,
    Wallet,
    BadgeDollarSign,
    Facebook,
    Youtube,
    Linkedin,
    Send,
    Twitter,
    Briefcase,
    Globe,
    Calendar,
    Heart,
    MapPin,
    Activity,
    Users
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FullProfileData {
    student: {
        id: number;
        name: string;
        email: string;
        affiliate_id: string;
        mobile: string;
        image: string;
        refer_code: string;
        status: string;
        created_at: string;
        updated_at: string;
        user_id: string;
    };
    personal_info: any;
    document_info: any;
    nominee_info: any;
    additional_info: any;
}

interface DashboardStats {
    boucher_balance: number | string;
    earning_balance: number | string;
    recharge_balance: number | string;
}

const SectionHeader = ({ icon: Icon, title, badge }: any) => (
    <div className="flex items-center justify-between mb-8 group/header">
        <div className="flex items-center gap-4">
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl group-hover/header:bg-emerald-600 group-hover/header:text-white group-hover/header:rotate-3 transition-all duration-500 shadow-sm">
                <Icon size={20} />
            </div>
            <div className="space-y-0.5">
                <h3 className="font-black text-lg text-slate-800 tracking-tight uppercase">{title}</h3>
                <div className="h-1 w-8 bg-emerald-500 rounded-full scale-x-0 group-hover/header:scale-x-100 transition-transform origin-left duration-500" />
            </div>
        </div>
        {badge && (
            <span className="px-4 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-slate-100 shadow-inner">
                {badge}
            </span>
        )}
    </div>
);

const InfoCard = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-300 group">
        <div className="flex items-center gap-4">
            {Icon && (
                <div className="flex-shrink-0 p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors duration-300">
                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                </div>
            )}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        </div>
        <p className="text-base font-medium text-gray-800 break-words text-right">{value || 'Not Provided'}</p>
    </div>
);

export default function ProjectOverviewTab() {
    const [profile, setProfile] = useState<FullProfileData | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [walletBalance, setWalletBalance] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    useEffect(() => {
        const fetchData = async () => {
            const session = sessionStorage.getItem("student_session");
            if (!session) {
                setLoading(false);
                return;
            }
            const token = JSON.parse(session).token;
            const headers = { Authorization: `Bearer ${token}` };

            try {
                const [profileRes, dashRes, walletRes] = await Promise.all([
                    axios.get(`${baseURL}/api/student/profile`, { headers }).catch(() => null),
                    axios.get(`${baseURL}/api/student/dashboard`, { headers }).catch(() => null),
                    axios.get(`${baseURL}/api/wallet-balance`, { headers }).catch(() => null)
                ]);

                if (profileRes?.data?.status === "success") {
                    setProfile(profileRes.data);
                }
                if (dashRes?.data?.success) {
                    setStats({
                        boucher_balance: dashRes.data.data.boucher_balance || 0,
                        earning_balance: dashRes.data.data.earning_balance || 0,
                        recharge_balance: dashRes.data.data.recharge_balance || 0
                    });
                }
                if (walletRes?.data?.success) {
                    setWalletBalance(walletRes.data.data.balance);
                }
            } catch (err) {
                console.error("ProjectOverview: Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [baseURL]);

    if (loading || !profile) {
        return (
            <div className="p-20 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                <p className="text-slate-500 font-bold animate-pulse">Assembling premium dashboard view...</p>
            </div>
        );
    }

    const { student, personal_info, nominee_info, additional_info } = profile;

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10">
            {/* Header Hero */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 text-white border border-slate-800 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] -mr-48 -mt-48 rounded-full opacity-50" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-10">
                    {/* Upper Left Side - Big */}
                    <div className="flex-1 flex flex-col md:flex-row items-center gap-6 sm:gap-8 w-full md:w-auto">
                        <div className="relative shrink-0">
                            <img
                                src={`${baseURL}/uploads/student/image/${student.image}`}
                                alt={student.name}
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[2.5rem] object-cover ring-4 ring-white/10 shadow-2xl"
                            />
                            <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 p-1.5 sm:p-2 bg-emerald-500 rounded-xl sm:rounded-2xl border-4 border-slate-900 shadow-lg text-white">
                                <ShieldCheck size={16} className="sm:w-5 sm:h-5" />
                            </div>
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h2 className="text-2xl sm:text-4xl font-black tracking-tight capitalize leading-tight">Hello, {student.name}</h2>
                            <p className="text-slate-400 font-medium max-w-xl text-xs sm:text-sm">Welcome back to your project command center.</p>
                        </div>
                    </div>

                    {/* Right Side - Small with Badges */}
                    <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-6 md:border-l md:border-white/10 md:pl-10">
                        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-3">
                            <span className="px-2.5 py-1 bg-primary/20 text-primary-light border border-primary/30 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Official Student</span>
                            <span className={`px-2.5 py-1 ${student.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} border text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] rounded-full`}>{student.status || 'Inactive'}</span>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-center md:text-right">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Wallet Balance</p>
                                <p className="text-base sm:text-xl font-black text-primary">৳{walletBalance || '0.00'}</p>
                            </div>
                            <div className="text-center md:text-right">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Affiliate ID</p>
                                <p className="text-base sm:text-xl font-black text-emerald-400">{student.affiliate_id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="space-y-4">
                <SectionHeader icon={TrendingUp} title="Account Statistics" />
                <div className="grid grid-cols-1 gap-4">
                    <InfoCard icon={Wallet} label="Boucher Balance" value={`৳${stats?.boucher_balance || "0.00"}`} />
                    <InfoCard icon={TrendingUp} label="Total Earnings" value={`৳${stats?.earning_balance || "0.00"}`} />
                    <InfoCard icon={BadgeDollarSign} label="Recharge Total" value={`৳${stats?.recharge_balance || "0.00"}`} />
                </div>
            </div>

            <div className="space-y-8">
                {/* Personal & Family */}
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm">
                    <SectionHeader icon={User} title="Personal & Family" badge="Identity Proof" />
                    <div className="grid grid-cols-1 gap-4">
                        <InfoCard icon={User} label="Father's Name" value={personal_info?.father_name} />
                        <InfoCard icon={User} label="Mother's Name" value={personal_info?.mother_name} />
                        <InfoCard icon={Calendar} label="Date of Birth" value={personal_info?.date_of_birth} />
                        <InfoCard icon={ShieldCheck} label="Religion" value={personal_info?.religion} />
                        <InfoCard icon={Heart} label="Marital Status" value={personal_info?.marital_status} />
                        <InfoCard icon={Activity} label="Blood Group" value={personal_info?.blood_group} />
                    </div>
                </div>

                {/* Professional & Lifestyle */}
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm">
                    <SectionHeader icon={Briefcase} title="Professional & Lifestyle" badge="Engagement" />
                    <div className="grid grid-cols-1 gap-4">
                        <InfoCard icon={Briefcase} label="Profession" value={additional_info?.profession} />
                        <InfoCard icon={Wallet} label="Monthly Income" value={additional_info?.monthly_income} />
                        <InfoCard icon={Heart} label="Hobby" value={additional_info?.hobby} />
                        <InfoCard icon={TrendingUp} label="Interests" value={additional_info?.interest} />
                        <InfoCard icon={MapPin} label="Current Location" value={personal_info?.location} />
                    </div>
                </div>

                {/* Nominee details */}
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm">
                    <SectionHeader icon={ShieldCheck} title="Nominee details" badge="Verified" />
                    <div className="grid grid-cols-1 gap-4">
                        <InfoCard icon={User} label="Nominee Name" value={nominee_info?.nominee_name} />
                        <InfoCard icon={Activity} label="Nominee Mobile" value={nominee_info?.nominee_mobile} />
                        <InfoCard icon={ShieldCheck} label="NID Number" value={nominee_info?.nominee_nid_number} />
                        <InfoCard icon={Users} label="Relation" value={nominee_info?.relation_with} />
                    </div>
                </div>

                {/* Digital Presence */}
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                    <SectionHeader icon={Globe} title="Digital Presence" badge="Social" />
                    <div className="flex flex-wrap gap-2">
                        {additional_info?.facebook_url && <a href={additional_info.facebook_url} target="_blank" rel="noreferrer" className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Facebook size={20} /></a>}
                        {additional_info?.youtube_url && <a href={additional_info.youtube_url} target="_blank" rel="noreferrer" className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Youtube size={20} /></a>}
                        {additional_info?.linkedin_url && <a href={additional_info.linkedin_url} target="_blank" rel="noreferrer" className="p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-700 hover:text-white transition-all"><Linkedin size={20} /></a>}
                        {additional_info?.telegram && <a href={additional_info.telegram} target="_blank" rel="noreferrer" className="p-3 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-600 hover:text-white transition-all"><Send size={20} /></a>}
                        {additional_info?.x_url && <a href={additional_info.x_url} target="_blank" rel="noreferrer" className="p-3 bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Twitter size={20} /></a>}
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Master synchronization active</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
