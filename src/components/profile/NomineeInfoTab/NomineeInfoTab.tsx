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
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all group">
        <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-primary/5 group-hover:text-primary transition-colors">
            <Icon size={20} />
        </div>
        <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{label}</p>
            <p className="text-sm font-bold text-slate-700 mt-1">{value || 'Not Provided'}</p>
        </div>
    </div>
);

export default function NomineeInfoTab() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [nomineeData, setNomineeData] = useState<NomineeData | null>(null);
    const [loading, setLoading] = useState(false);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';
    const imageBaseUrl = `${baseURL}/uploads/student/image/`;

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
                    <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                    <Loader2 className="animate-spin text-primary relative" size={40} />
                </div>
                <div className="space-y-1">
                    <p className="text-base font-bold text-slate-700">Loading nominee details...</p>
                    <p className="text-xs text-slate-400">Syncing record for verification</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                
                <div className="flex items-center gap-6 relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-slate-50 bg-slate-100 shadow-sm">
                        {nomineeData.nominee_image ? (
                            <img src={`${imageBaseUrl}${nomineeData.nominee_image}`} className="w-full h-full object-cover" alt="Nominee" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <User size={32} />
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{nomineeData.nominee_name || 'Nominee Name'}</h2>
                        <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                             <Heart size={12} className="text-rose-400" />
                             {nomineeData.relation_with || 'Relation'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="relative flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all group/btn"
                >
                    <Edit2 size={18} className="group-hover/btn:rotate-12 transition-transform" />
                    <span>Manage Nominee</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 ml-1">
                        <ShieldCheck size={16} className="text-primary" />
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Contact & Identification</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <InfoCard icon={User} label="Full Name" value={nomineeData.nominee_name} />
                        </div>
                        <InfoCard icon={Phone} label="Mobile Number" value={nomineeData.nominee_mobile} />
                        <InfoCard icon={Heart} label="Relation Profile" value={nomineeData.relation_with} />
                        <div className="sm:col-span-2">
                            <InfoCard icon={CheckCircle2} label="Nominee NID Number" value={nomineeData.nominee_nid_number} />
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg text-blue-500 shadow-sm mt-0.5">
                            <ShieldCheck size={16} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-blue-900 tracking-tight">Security Notice</p>
                            <p className="text-[10px] leading-relaxed text-blue-700/80 font-medium font-inter">
                                Nominee information is required for account security and inheritance purposes. Ensure these details match official identification documents.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2 ml-1">
                        <ImageIcon size={16} className="text-primary" />
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Document Previews</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">NID Front</p>
                          <div className="relative aspect-[3/2] rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 group/img">
                            {nomineeData.nominee_nid_front_page ? (
                                <>
                                    <img src={`${imageBaseUrl}${nomineeData.nominee_nid_front_page}`} className="w-full h-full object-cover" alt="NID Front" />
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
                          <div className="relative aspect-[3/2] rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 group/img">
                            {nomineeData.nominee_nid_back_page ? (
                                <>
                                    <img src={`${imageBaseUrl}${nomineeData.nominee_nid_back_page}`} className="w-full h-full object-cover" alt="NID Back" />
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
