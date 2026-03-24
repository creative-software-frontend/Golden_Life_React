import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    User, Home, MapPin, Calendar, Heart,
    Globe, Users, ShieldCheck, Activity, Loader2, LucideIcon,
    Edit2
} from 'lucide-react';
import EditPersonalInfoModal from '../EditPersonalInfoModal.tsx/EditPersonalInfoModal';
import { PersonalData } from '../types/types';

interface InfoCardProps {
    icon: LucideIcon;
    label: string;
    value: string | null | undefined;
}

const InfoCard = ({ icon: Icon, label, value }: InfoCardProps) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all group">
        <div className="flex-shrink-0 p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-primary/5 group-hover:text-primary transition-colors">
            <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5 break-words">{value || 'Not Provided'}</p>
        </div>
    </div>
);

interface PersonalInfoTabProps {
    personalData?: any | null;
    baseURL?: string;
    token?: string | null;
    onUpdate?: (updatedData: PersonalData) => void;
}

export default function PersonalInfoTab({
    personalData: propData,
    baseURL: propBaseURL,
    token: propToken,
    onUpdate
}: PersonalInfoTabProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [internalData, setInternalData] = useState<PersonalData | null>(null);
    const [loading, setLoading] = useState(false);

    // Get config internally if not provided via props
    const baseURL = propBaseURL || import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    const getActiveToken = () => {
        if (propToken) return propToken;
        const session = sessionStorage.getItem("student_session");
        if (!session) return null;
        try {
            return JSON.parse(session).token;
        } catch (e) { return null; }
    };

    const token = getActiveToken();

    const fetchPersonalInfo = async (signal?: AbortSignal) => {
        if (!token || !baseURL) return;

        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/api/student/personal-info`, {
                signal,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data?.success) {
                // The API returns { data: { ... } }
                setInternalData(response.data.data);
            }
        } catch (error: any) {
            if (error.name !== 'CanceledError') {
                console.error('❌ Personal info fetch failed:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();

        if (propData) {
            // Handle if data is wrapped in {data: ...} or direct
            const dataToSet = propData?.data ? propData.data : propData;
            setInternalData(dataToSet);
        } else {
            fetchPersonalInfo(controller.signal);
        }

        return () => controller.abort();
    }, [propData, token, baseURL]);

    const handleLocalUpdate = (updatedData: PersonalData) => {
        // We update locally first for instant feedback, then re-fetch as requested
        setInternalData(updatedData);
        fetchPersonalInfo();
        if (onUpdate) onUpdate(updatedData);
    };

    // Better empty/loading check
    const isDataEmpty = !internalData || Object.keys(internalData).length <= 2;

    if (loading || isDataEmpty) {
        return (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-4 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
                    <Loader2 className="animate-spin text-emerald-600 relative" size={40} />
                </div>
                <div className="space-y-1">
                    <p className="text-base font-bold text-slate-700">Loading profile details...</p>
                    <p className="text-xs text-slate-400 font-medium">Fetching your personal information from our secure servers</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                <div className="relative">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight italic">Personal Profile</h2>
                    <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest flex items-center gap-2">
                        <Users size={12} className="text-emerald-500" />
                        Identification & Residential Records
                    </p>
                </div>
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="relative flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all group/btn"
                >
                    <Edit2 size={18} className="group-hover/btn:rotate-12 transition-transform" />
                    <span className="uppercase tracking-widest text-xs">Edit Profile</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-1">
                        <Users size={16} className="text-emerald-500" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Family & Identity</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoCard icon={User} label="Father's Name" value={internalData.father_name} />
                        <InfoCard icon={User} label="Mother's Name" value={internalData.mother_name} />
                        <InfoCard icon={Calendar} label="Date of Birth" value={internalData.date_of_birth} />
                        <InfoCard icon={ShieldCheck} label="Religion" value={internalData.religion} />
                        <InfoCard icon={Heart} label="Marital Status" value={internalData.marital_status} />
                        <InfoCard icon={User} label="Gender" value={internalData.gender} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-1">
                        <Home size={16} className="text-emerald-500" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Residential Details</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoCard icon={Globe} label="Living Country" value={internalData.living_country} />
                        <InfoCard icon={MapPin} label="District" value={internalData.district} />
                        <InfoCard icon={MapPin} label="Division" value={internalData.division} />
                        <InfoCard icon={MapPin} label="Upazila/Thana" value={internalData.upazila_thana_name} />
                        <InfoCard icon={MapPin} label="Union/Ward" value={internalData.union_word_name} />
                        <InfoCard icon={Activity} label="Blood Group" value={internalData.blood_group} />
                    </div>
                </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl text-emerald-600 shadow-sm">
                    <MapPin size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Permanent Location</p>
                    <p className="text-sm text-slate-700 font-semibold">{internalData.location || "Not specified"}</p>
                </div>
            </div>

            <EditPersonalInfoModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                data={internalData}
                baseURL={baseURL}
                token={token}
                onSuccess={handleLocalUpdate}
            />
        </div>
    );
}