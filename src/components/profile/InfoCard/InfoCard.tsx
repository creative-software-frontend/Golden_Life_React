import { LucideIcon, Globe, MapPin, Activity, User, Calendar, ShieldCheck, Heart } from 'lucide-react';

// 1. Define the interface for the InfoCard props
interface InfoCardProps {
    icon: LucideIcon; // Use LucideIcon type specifically
    label: string;
    value: string | null | undefined;
}

// 2. Move InfoCard OUTSIDE the main component to avoid re-creation on every render
export const InfoCard = ({ icon: Icon, label, value }: InfoCardProps) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all group">
        <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-primary/5 group-hover:text-primary transition-colors">
            <Icon size={18} />
        </div>
        <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5 break-words">
                {value || '—'}
            </p>
        </div>
    </div>
);

// 3. In your main PersonalInfoTab component:
export default function PersonalInfoTab({ personalData, studentName, ...props }: any) {

    // SAFETY CHECK: If personalData is null, show loading or empty state
    if (!personalData) {
        return <div className="p-10 text-center text-slate-500 font-medium">Loading details...</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard icon={Globe} label="Living Country" value={personalData.living_country} />
            <InfoCard icon={MapPin} label="District" value={personalData.district} />
            <InfoCard icon={MapPin} label="Division" value={personalData.division} />
            <InfoCard icon={MapPin} label="Upazila/Thana" value={personalData.upazila_thana_name} />
            <InfoCard icon={MapPin} label="Union/Ward" value={personalData.union_word_name} />
            <InfoCard icon={Activity} label="Blood Group" value={personalData.blood_group} />
        </div>
    );
}