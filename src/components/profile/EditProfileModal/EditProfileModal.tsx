import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, User as UserIcon, X, Loader2, Hash, Image as ImageIcon, Camera, ChevronRight, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { StudentData } from '../BasicInfoTab/BasicInfoTab';
import useModalStore from '@/store/Store';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: StudentData | null;
    baseURL: string;
    token: string | null;
    onSuccess: (updatedData: StudentData) => void;
}

interface FormDataState {
    name: string;
    email: string;
    mobile: string;
    affiliate_id: string;
    refer_code: string;
    image: File | null;
}

export default function EditProfileModal({ isOpen, onClose, student, baseURL, token, onSuccess }: EditProfileModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const setProfileBlobPreview = useModalStore((s) => s.setProfileBlobPreview);
    const [formData, setFormData] = useState<FormDataState>({
        name: '',
        email: '',
        mobile: '',
        affiliate_id: '',
        refer_code: '',
        image: null
    });

    useEffect(() => {
        if (student && isOpen) {
            setFormData({
                name: student.name || '',
                email: student.email || '',
                mobile: student.mobile || '',
                affiliate_id: student.affiliate_id || '',
                refer_code: student.refer_code || '',
                image: null
            });
            // Show existing image as preview if available
            setPreviewUrl(student.image ? `${baseURL}/uploads/student/image/${student.image}` : null);
        }
    }, [student, isOpen, baseURL]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                const url = reader.result as string;
                setPreviewUrl(url);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = new FormData();
            if (student?.id) {
                submitData.append('student_id', student.id.toString());
            }
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('mobile', formData.mobile);
            submitData.append('affiliate_id', formData.affiliate_id || '');
            submitData.append('refer_code', formData.refer_code || '');

            if (formData.image) {
                submitData.append('image', formData.image);
            }

            const response = await axios.post(`${baseURL}/api/student/basic-info?id=${student?.id}`, submitData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            if (response.data?.status === true || response.data?.status === "success" || response.data?.data) {
                if (previewUrl && (previewUrl.startsWith('data:') || previewUrl.startsWith('blob:'))) {
                    setProfileBlobPreview(previewUrl);
                }
                onSuccess(response.data.data);
                toast.success(response.data.message || "Profile successfully updated");
                onClose();
            } else {
                toast.error(response.data.message || "Failed to update profile.");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => !isSubmitting && onClose()}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Basic Profile</h3>
                                <p className="text-xs text-slate-400 font-medium">Manage your identity and contact methods</p>
                            </div>
                            <button onClick={onClose} disabled={isSubmitting} className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-8 space-y-8 overflow-y-auto">
                            {/* Image Preview & Upload */}
                            <div className="flex flex-col items-center pb-6 border-b border-slate-50 relative">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-white bg-slate-100 shadow-xl relative transition-transform group-hover:scale-[1.02]">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <ImageIcon size={36} />
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <Camera size={24} className="text-white" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                                        <Camera size={14} />
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">Profile Avatar</p>
                                    <p className="text-xs text-slate-500 font-medium mt-1">Recommended: Square image, max 2MB</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Info Banner */}
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                                    <div className="p-2 bg-white rounded-xl text-slate-400 shadow-sm mt-0.5">
                                        <Check size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Account Security</p>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Name and Email are verified items and can only be changed by contacting support.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5">
                                    {/* Read-Only Section */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-70">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                                            <div className="relative">
                                                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input type="text" value={formData.name} readOnly className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed outline-none font-medium" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input type="email" value={formData.email} readOnly className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed outline-none font-medium" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Editable Section */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Mobile Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                type="tel"
                                                value={formData.mobile}
                                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-slate-700"
                                                placeholder="01xxxxxxxxx"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Affiliate ID</label>
                                            <div className="relative group">
                                                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                                                <input type="text" value={formData.affiliate_id} onChange={(e) => setFormData({ ...formData, affiliate_id: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-700" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Refer Code</label>
                                            <div className="relative group">
                                                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                                                <input type="text" value={formData.refer_code} onChange={(e) => setFormData({ ...formData, refer_code: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-700" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4 sticky bottom-0 bg-white">
                                <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 py-4 px-6 border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 px-6 bg-primary text-white font-bold rounded-full shadow-[0_10px_30px_-10px_rgba(var(--primary-rgb),0.5)] hover:shadow-[0_15px_40px_-10px_rgba(var(--primary-rgb),0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:translate-y-0">
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                                        <>
                                            <span>Save Changes</span>
                                            <div className="p-1 bg-white/20 rounded-lg">
                                                <ChevronRight size={16} />
                                            </div>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
