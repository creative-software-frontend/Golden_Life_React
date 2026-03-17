import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Mail, Phone, User as UserIcon, X, Loader2, Hash, Image as ImageIcon, Camera } from 'lucide-react';
import { toast } from 'react-toastify'; 
import { StudentData } from '../BasicInfoTab/BasicInfoTab';

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
            setPreviewUrl(student.image ? `${baseURL}/storage/${student.image}` : null);
        }
    }, [student, isOpen, baseURL]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setFormData({ ...formData, image: file });
            // Create local URL for preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = new FormData();
            // Note: Sending Name/Email as they may be required by the backend even if read-only in UI
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('mobile', formData.mobile);
            submitData.append('affiliate_id', formData.affiliate_id);
            submitData.append('refer_code', formData.refer_code);
            
            if (formData.image) {
                submitData.append('image', formData.image);
            }

            const response = await axios.post(`${baseURL}/api/student/basic-info?id=${student?.id}`, submitData, {
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Accept': 'application/json',
                    // REMOVED Content-Type: browser handles it for FormData
                }
            });

            if (response.data?.status) {
                onSuccess(response.data.data); 
                toast.success(response.data.message || "Successfully Updated");
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
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
                    >
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-800">Update Profile</h3>
                            <button onClick={onClose} disabled={isSubmitting} className="p-2 hover:bg-slate-200/50 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-4 overflow-y-auto">
                            {/* Image Preview & Upload */}
                            <div className="flex flex-col items-center pb-4">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 bg-slate-100">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <ImageIcon size={32} />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                                        <Camera size={16} />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-wider">Click camera to change photo</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {/* Read-Only Section */}
                                <div className="space-y-4 opacity-70">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name (Read Only)</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input type="text" value={formData.name} readOnly className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address (Read Only)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input type="email" value={formData.email} readOnly className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed outline-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Editable Section */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mobile Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="tel" 
                                            value={formData.mobile} 
                                            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="01xxxxxxxxx"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Affiliate ID</label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input type="text" value={formData.affiliate_id} onChange={(e) => setFormData({...formData, affiliate_id: e.target.value})} className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary outline-none text-sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Refer Code</label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input type="text" value={formData.refer_code} onChange={(e) => setFormData({...formData, refer_code: e.target.value})} className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary outline-none text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 disabled:opacity-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 px-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/40 disabled:opacity-70 flex items-center justify-center gap-2 transition-all">
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}