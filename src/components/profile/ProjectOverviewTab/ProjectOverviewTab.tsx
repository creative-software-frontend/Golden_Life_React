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
    Globe
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

const StatCard = ({ icon: Icon, label, value, color, description }: any) => {
    const colors: any = {
        blue: 'text-blue-600 bg-blue-50 group-hover:bg-blue-600',
        emerald: 'text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600',
        amber: 'text-amber-600 bg-amber-50 group-hover:bg-amber-600'
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
        >
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`p-4 rounded-2xl ${colors[color] || colors.blue} group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm`}>
                    <Icon size={24} />
                </div>
                <div className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    Active
                </div>
            </div>
            <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors">{label}</p>
                <h4 className="text-2xl font-black text-slate-800 tracking-tight group-hover:scale-[1.02] transition-transform origin-left">${value}</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
};

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

const InfoGridItem = ({ label, value }: any) => (
    <motion.div 
        whileHover={{ x: 4 }}
        className="p-5 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-white transition-all group"
    >
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-hover:text-primary transition-colors">{label}</p>
        <p className="text-sm font-bold text-slate-700 break-words leading-relaxed">{value || 'Not Set'}</p>
    </motion.div>
);

export default function ProjectOverviewTab() {
    const [profile, setProfile] = useState<FullProfileData | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
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
                const [profileRes, dashRes] = await Promise.all([
                    axios.get(`${baseURL}/api/student/profile`, { headers }).catch(() => null),
                    axios.get(`${baseURL}/api/student/dashboard`, { headers }).catch(() => null)
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

    const { student, personal_info, document_info, nominee_info, additional_info } = profile;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10">
            {/* Header Hero */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 text-white border border-slate-800 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] -mr-48 -mt-48 rounded-full opacity-50" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="relative">
                        <img
                            src={`${baseURL}/uploads/student/image/${student.image}`}
                            alt={student.name}
                            className="w-32 h-32 rounded-[2.5rem] object-cover ring-4 ring-white/10 shadow-2xl"
                        />
                        <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 rounded-2xl border-4 border-slate-900 shadow-lg text-white">
                            <ShieldCheck size={20} />
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <span className="px-3 py-1 bg-primary/20 text-primary-light border border-primary/30 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Official Student</span>
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">{student.status}</span>
                            </div>
                            <h2 className="text-4xl font-black tracking-tight capitalize leading-none">Hello, {student.name}</h2>
                            <p className="text-slate-400 font-medium max-w-xl text-sm">Welcome back to your project command center. All systems are online.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right border-r border-white/10 pr-6 hidden lg:block">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Referral Code</p>
                            <p className="text-lg font-black text-primary">{student.refer_code}</p>
                        </div>
                        <div className="text-right hidden lg:block">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Affiliate ID</p>
                            <p className="text-lg font-black text-emerald-400">{student.affiliate_id}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Overview (Previous Design Keep) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={Wallet} label="Boucher Balance" value={stats?.boucher_balance || "0.00"} color="blue" description="Project credits available" />
                <StatCard icon={TrendingUp} label="Total Earnings" value={stats?.earning_balance || "0.00"} color="emerald" description="Net profit accumulated" />
                <StatCard icon={BadgeDollarSign} label="Recharge Total" value={stats?.recharge_balance || "0.00"} color="amber" description="Total lifetime funding" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Personal & Family */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <SectionHeader icon={User} title="Personal & Family" badge="Identity Proof" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoGridItem label="Father's Name" value={personal_info?.father_name} />
                        <InfoGridItem label="Mother's Name" value={personal_info?.mother_name} />
                        <InfoGridItem label="Date of Birth" value={personal_info?.date_of_birth} />
                        <InfoGridItem label="Religion" value={personal_info?.religion} />
                        <InfoGridItem label="Marital Status" value={personal_info?.marital_status} />
                        <InfoGridItem label="Blood Group" value={personal_info?.blood_group} />
                    </div>
                </div>

                {/* Professional & Lifestyle */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <SectionHeader icon={Briefcase} title="Professional & Lifestyle" badge="Engagement" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoGridItem label="Profession" value={additional_info?.profession} />
                        <InfoGridItem label="Monthly Income" value={additional_info?.monthly_income} />
                        <InfoGridItem label="Hobby" value={additional_info?.hobby} />
                        <InfoGridItem label="Interests" value={additional_info?.interest} />
                        <div className="sm:col-span-2">
                            <InfoGridItem label="Current Location" value={personal_info?.location} />
                        </div>
                    </div>
                </div>

                {/* Nominee details */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <SectionHeader icon={ShieldCheck} title="Nominee details" badge="Verified" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoGridItem label="Nominee Name" value={nominee_info?.nominee_name} />
                        <InfoGridItem label="Nominee Mobile" value={nominee_info?.nominee_mobile} />
                        <InfoGridItem label="NID Number" value={nominee_info?.nominee_nid_number} />
                        <InfoGridItem label="Relation" value={nominee_info?.relation_with} />
                    </div>
                </div>

                {/* Digital Presence */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
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
