import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Edit2, Mail, Phone, User as UserIcon, Hash, Fingerprint, Activity } from 'lucide-react';
import DataRow from '@/components/ui/DataRow';
import EditProfileModal from '../EditProfileModal/EditProfileModal';

// Exporting the interface so the modal can use it
export interface StudentData {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    affiliate_id: string;
    mobile: string;
    image: string;
    refer_code: string | null;   // ← Changed to allow null (backend sometimes returns null)
    status: string;
    created_at: string;
    updated_at: string;
    user_id: string;
}

export default function BasicInfoTab() {
    const [student, setStudent] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    const getAuthToken = () => {
        const session = sessionStorage.getItem("student_session");
        if (!session) return null;
        try {
            return JSON.parse(session).token;
        } catch (e) { return null; }
    };

    const fetchDashboardData = async () => {
        const token = getAuthToken();
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${baseURL}/api/student/dashboard`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data?.success) {
                const fetchedStudent = response.data.data.student;
                console.log(fetchedStudent.refer_code );
                
                // Force refer_code fallback in case backend returns null/undefined
                const safeStudent: StudentData = {
                    ...fetchedStudent,
                    refer_code: fetchedStudent.refer_code ?? null
                };

                setStudent(safeStudent);

                // Debug log (you can remove this later)
                console.log("✅ Fetched Student Data:", {
                    name: fetchedStudent.name,
                    refer_code: fetchedStudent.refer_code,
                    affiliate_id: fetchedStudent.affiliate_id
                });
            }
        } catch (error) {
            console.error('❌ Dashboard fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) return <LoadingSkeleton />;

    // Safe display values
    const displayReferCode = student?.refer_code
        ? student.refer_code
        : 'Not generated yet';

    return (
        <div className="w-full max-w-5xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                {/* Header Section */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Basic Information</h2>
                        <p className="text-slate-500 text-sm mt-1">Manage your account identity and contact details.</p>
                    </div>

                    <motion.button
                        onClick={() => setIsEditModalOpen(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                    >
                        <Edit2 size={16} />
                        Edit Profile
                    </motion.button>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Personal Identity" icon={<UserIcon size={20} />} color="primary">
                        <DataRow label="Full Name" value={student?.name || '—'} icon={<UserIcon size={14} />} />
                        <DataRow label="Email Address" value={student?.email || '—'} icon={<Mail size={14} />} />
                        <DataRow label="Mobile" value={student?.mobile || '—'} icon={<Phone size={14} />} isLast />
                    </Card>

                    <Card title="Account Affiliation" icon={<Fingerprint size={20} />} color="secondary">
                        <DataRow
                            label="Referral Code"
                            value={displayReferCode}
                            icon={<Hash size={14} />}
                            // Optional: different style when not generated
                            className={student?.refer_code ? '' : 'text-amber-600 font-medium'}
                        />
                        <DataRow label="Affiliate ID" value={student?.affiliate_id || '—'} icon={<Fingerprint size={14} />} />
                        <DataRow label="Status" icon={<Activity size={14} />} value={<StatusBadge status={student?.status} />} isLast />
                    </Card>
                </div>
            </motion.div>

            {/* IMPORTED EDIT MODAL */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                student={student}
                baseURL={baseURL}
                token={getAuthToken()}
                onSuccess={(updatedData) => setStudent(updatedData)}
            />
        </div>
    );
}

// --- UI SUB-COMPONENTS (unchanged except small improvement) ---

const Card = ({ title, icon, children, color }: any) => (
    <motion.div
        variants={itemVariants}
        whileHover={{ y: -4 }}
        className="group bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
    >
        <div className="flex items-center gap-3 mb-6">
            <div className={`p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300 ${color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                {icon}
            </div>
            <h3 className="font-bold text-slate-800">{title}</h3>
        </div>
        <div className="space-y-1">{children}</div>
    </motion.div>
);

const StatusBadge = ({ status }: { status?: string }) => {
    const isActive = status?.toLowerCase() === 'active';
    return (
        <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
                {isActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className={`${isActive ? 'text-emerald-600' : 'text-rose-600'} font-bold text-[11px] uppercase tracking-widest`}>
                {isActive ? 'Active Account' : 'Inactive Account'}
            </span>
        </div>
    );
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

function LoadingSkeleton() {
    return (
        <div className="w-full animate-pulse space-y-8">
            <div className="flex justify-between items-center">
                <div className="h-10 bg-slate-200 rounded-lg w-1/3" />
                <div className="h-10 bg-slate-200 rounded-lg w-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-slate-100 rounded-2xl" />
                <div className="h-64 bg-slate-100 rounded-2xl" />
            </div>
        </div>
    );
}