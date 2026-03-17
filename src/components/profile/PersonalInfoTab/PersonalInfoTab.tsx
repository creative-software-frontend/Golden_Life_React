import { useState } from 'react';
import { 
    Edit2, User, Home, MapPin, Calendar, Heart, 
    Globe, Users, ShieldCheck, Activity, Loader2, LucideIcon 
} from 'lucide-react';
import EditPersonalInfoModal from '../EditPersonalInfoModal.tsx/EditPersonalInfoModal';
import { PersonalData } from '../types/types';


interface InfoCardProps {
    icon: LucideIcon;
    label: string;
    value: string | null | undefined;
}

// 1. Fixed InfoCard with proper LucideIcon typing
const InfoCard = ({ icon: Icon, label, value }: InfoCardProps) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all group">
        <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-primary/5 group-hover:text-primary transition-colors">
            <Icon size={18} />
        </div>
        <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">{label}</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5 truncate">{value || 'Not Provided'}</p>
        </div>
    </div>
);

interface PersonalInfoTabProps {
    personalData: PersonalData | null;
    studentName: string;
    baseURL: string;
    token: string | null;
    onUpdate: (updatedData: PersonalData) => void;
}
export default function PersonalInfoTab({ personalData, studentName, baseURL, token, onUpdate }: PersonalInfoTabProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // FIX: Access the inner 'data' property if the API returns it wrapped
    // If your parent passes the whole JSON, use: const actualData = personalData?.data;
    const actualData = personalData; 

    if (!actualData) return (
        <div className="p-10 text-center text-slate-400 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-primary" size={30} />
            <p className="text-sm font-medium">Loading personal profile...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* ... Header remains the same ... */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-1">
                        <Users size={16} className="text-primary" />
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Family & Identity</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Use actualData instead of personalData */}
                        <InfoCard icon={User} label="Father's Name" value={actualData.father_name} />
                        <InfoCard icon={User} label="Mother's Name" value={actualData.mother_name} />
                        <InfoCard icon={Calendar} label="Date of Birth" value={actualData.date_of_birth} />
                        <InfoCard icon={ShieldCheck} label="Religion" value={actualData.religion} />
                        <InfoCard icon={Heart} label="Marital Status" value={actualData.marital_status} />
                        <InfoCard icon={User} label="Gender" value={actualData.gender} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-1">
                        <Home size={16} className="text-primary" />
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Residential Details</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoCard icon={Globe} label="Living Country" value={actualData.living_country} />
                        <InfoCard icon={MapPin} label="District" value={actualData.district} />
                        <InfoCard icon={MapPin} label="Division" value={actualData.division} />
                        <InfoCard icon={MapPin} label="Upazila/Thana" value={actualData.upazila_thana_name} />
                        <InfoCard icon={MapPin} label="Union/Ward" value={actualData.union_word_name} />
                        <InfoCard icon={Activity} label="Blood Group" value={actualData.blood_group} />
                    </div>
                </div>
            </div>

            {/* ... Bottom location section ... */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl text-primary shadow-sm">
                    <MapPin size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Permanent Location</p>
                    <p className="text-sm text-slate-700 font-semibold">{actualData.location || "Not specified"}</p>
                </div>
            </div>

            <EditPersonalInfoModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                data={actualData} // Pass the unwrapped data to the modal
                baseURL={baseURL}
                token={token}
                onSuccess={onUpdate}
            />
        </div>
    );
}