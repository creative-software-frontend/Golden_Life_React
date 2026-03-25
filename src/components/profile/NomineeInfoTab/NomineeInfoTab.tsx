import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    User,
    ShieldCheck,
    Loader2,
    LucideIcon,
    Edit2,
    CheckCircle2,
    Image as ImageIcon,
    Phone,
    Heart,
    Eye
} from 'lucide-react';
import EditNomineeInfoTabModal from '../EditNomineeInfoTabModal/EditNomineeInfoTabModal';
import { NomineeData } from '../types/types';

interface InfoCardProps {
    icon: LucideIcon;
    label: string;
    value: string | null | undefined;
}

const InfoCard = ({ icon: Icon, label, value }: InfoCardProps) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-300 group">
        <div className="flex-shrink-0 p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors duration-300">
            <Icon size={18} className="group-hover:scale-110 transition-transform" />
        </div>
        <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-base font-medium text-gray-800 mt-0.5 break-words tracking-tight">{value || 'Not Provided'}</p>
        </div>
    </div>
);

export default function NomineeInfoTab() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [nomineeData, setNomineeData] = useState<NomineeData | null>(null);
    const [loading, setLoading] = useState(false);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    // Helper to get correct path for nominee documents
    const getNomineeDocUrl = (fileName: string, type: 'nominee_image' | 'nominee_nid_front_page' | 'nominee_nid_back_page') => {
        if (!fileName) return null;
        return `${baseURL}/uploads/student/${type}/${fileName}`;
    };

    const getActiveToken = () => {
        const session = sessionStorage.getItem("student_session");
        if (!session) return null;
        try {
            return JSON.parse(session).token;
        } catch (e) { return null; }
    };

    const token = getActiveToken();

    const fetchNomineeInfo = async (signal?: AbortSignal) => {
        if (!token || !baseURL) return;

        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/api/student/nominee-info`, {
                signal,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data?.success) {
                setNomineeData(response.data.data);
            }
        } catch (error: any) {
            if (error.name !== 'CanceledError') {
                console.error('❌ Nominee info fetch failed:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchNomineeInfo(controller.signal);
        return () => controller.abort();
    }, [token, baseURL]);

    const handleLocalUpdate = (updatedData: NomineeData) => {
        setNomineeData(updatedData);
        fetchNomineeInfo();
    };

    const isDataEmpty = !nomineeData || Object.keys(nomineeData).length <= 2;

    if (loading || isDataEmpty) {
        return (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-4 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
                    <Loader2 className="animate-spin text-emerald-600 relative" size={40} />
                </div>
                <div className="space-y-1">
                    <p className="text-base font-bold text-slate-700">Loading nominee details...</p>
                    <p className="text-xs text-slate-400 font-medium">Syncing record for verification</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

                <div className="flex items-center gap-5 relative">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white bg-slate-50 shadow-xl relative group/avatar">
                        {nomineeData.nominee_image ? (
                            <img src={getNomineeDocUrl(nomineeData.nominee_image, 'nominee_image') || ''} className="w-full h-full object-cover" alt="Nominee" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <User size={28} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-emerald-600/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                    </div>
                    <div className="relative">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight italic">{nomineeData.nominee_name || 'Nominee Name'}</h2>
                        <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest flex items-center gap-2">
                            <Heart size={12} className="text-emerald-500" />
                            {nomineeData.relation_with || 'Relation'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="relative flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all group/btn"
                >
                    <Edit2 size={18} className="group-hover/btn:rotate-12 transition-transform" />
                    <span className="uppercase tracking-widest text-xs">Manage Nominee</span>
                </button>
            </div>

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-1">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact & Identification</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoCard icon={User} label="Full Name" value={nomineeData.nominee_name} />
                        <InfoCard icon={Phone} label="Mobile Number" value={nomineeData.nominee_mobile} />
                        <InfoCard icon={Heart} label="Relation Profile" value={nomineeData.relation_with} />
                        <InfoCard icon={CheckCircle2} label="Nominee NID Number" value={nomineeData.nominee_nid_number} />
                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg text-emerald-500 shadow-sm mt-0.5">
                            <ShieldCheck size={16} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-emerald-900 tracking-widest uppercase">Security Notice</p>
                            <p className="text-[11px] leading-relaxed text-emerald-700/80 font-medium italic">
                                Nominee information is required for account security and inheritance purposes. Ensure these details match official identification documents.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-1">
                        <ImageIcon size={16} className="text-emerald-500" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Previews</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">NID Front</p>
                            <div className="relative aspect-[3/2] rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 group/img shadow-sm hover:shadow-md transition-shadow">
                                {nomineeData.nominee_nid_front_page ? (
                                    <>
                                        <img src={getNomineeDocUrl(nomineeData.nominee_nid_front_page, 'nominee_nid_front_page') || ''} className="w-full h-full object-cover" alt="NID Front" />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                            <Eye className="text-white" size={20} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                        <ImageIcon size={24} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">NID Back</p>
                            <div className="relative aspect-[3/2] rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 group/img shadow-sm hover:shadow-md transition-shadow">
                                {nomineeData.nominee_nid_back_page ? (
                                    <>
                                        <img src={getNomineeDocUrl(nomineeData.nominee_nid_back_page, 'nominee_nid_back_page') || ''} className="w-full h-full object-cover" alt="NID Back" />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                            <Eye className="text-white" size={20} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                        <ImageIcon size={24} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EditNomineeInfoTabModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                data={nomineeData}
                baseURL={baseURL}
                token={token}
                onSuccess={handleLocalUpdate}
            />
        </div>
    );
}
