import React, { useState, useRef, useEffect } from 'react';
import { Camera, User, Phone, Mail, Lock, Shield, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

// Helper to get Token
const getAuthToken = () => {
    const session = sessionStorage.getItem("student_session");
    if (!session) return null;
    try {
        const parsedSession = JSON.parse(session);
        if (new Date().getTime() > parsedSession.expiry) {
            sessionStorage.removeItem("student_session");
            return null;
        }
        return parsedSession.token;
    } catch (e) {
        return null;
    }
};

export default function ProfileSettings() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    // UI States
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

    // Form Data State
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // --- 1. FETCH PROFILE DATA ON LOAD ---
    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const token = getAuthToken();
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${baseURL}/api/student/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data?.success) {
                    const user = response.data.data;  
                    console.log(user);
                    
                    setFormData(prev => ({
                        ...prev,
                        fullName: user.name || '',
                        phone: user.phone || '',
                        email: user.email || ''
                    }));

                    // Assuming API returns an image path
                    if (user.image) {
                        setProfileImage(`${baseURL}/uploads/student/${user.image}`);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                toast.error("Could not load profile data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [baseURL, navigate]);

    // Handle Input Changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle Image Selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImageFile(file); // Save file for the API payload
            const imageUrl = URL.createObjectURL(file); // Show local preview immediately
            setProfileImage(imageUrl);
        }
    };

    // --- 2. HANDLE FORM SUBMISSION (SAVE) ---
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Password validation
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }

        setIsSaving(true);

        try {
            const token = getAuthToken();
            
            // Using FormData because we might be uploading an image file
            const payload = new FormData();
            payload.append('name', formData.fullName);
            payload.append('phone', formData.phone);
            payload.append('email', formData.email);
            
            if (formData.currentPassword && formData.newPassword) {
                payload.append('current_password', formData.currentPassword);
                payload.append('new_password', formData.newPassword);
            }

            if (selectedImageFile) {
                payload.append('image', selectedImageFile);
            }

            // Replace '/api/student/profile/update' with your actual update endpoint
            const response = await axios.post(`${baseURL}/api/student/profile/update`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data?.success) {
                toast.success("Profile updated successfully!");
                // Clear password fields after successful save
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            } else {
                toast.error(response.data?.message || "Failed to update profile.");
            }
        } catch (error: any) {
            console.error("Profile update error:", error);
            toast.error(error.response?.data?.message || "An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- LOADING SKELETON ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-[#5ca367]">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <span className="font-bold text-sm tracking-widest uppercase">Loading Profile...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-6 md:py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* --- HEADER --- */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profile Settings</h1>
                        <p className="text-sm font-medium text-slate-500 mt-0.5">Manage your account details and security.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                    
                    {/* --- LEFT COLUMN: PROFILE PICTURE --- */}
                    <div className="w-full md:w-1/3 shrink-0">
                        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                            
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex items-center justify-center">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-slate-300" />
                                    )}
                                </div>
                                
                                {/* Camera Overlay Button */}
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-1 right-1 bg-[#5ca367] text-white p-2.5 rounded-full shadow-md hover:bg-[#4a855d] hover:scale-105 transition-all duration-200"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                />
                            </div>

                            <h3 className="mt-4 text-lg font-bold text-slate-900">{formData.fullName || "User"}</h3>
                            <span className="text-xs font-bold text-[#5ca367] bg-[#5ca367]/10 px-3 py-1 rounded-full mt-1.5 uppercase tracking-wide">Verified User</span>
                            
                            <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                                Update your photo and personal details here. Keep your profile secure.
                            </p>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: FORMS --- */}
                    <div className="w-full md:flex-1 space-y-6">
                        
                        <form onSubmit={handleSave} className="space-y-6">
                            
                            {/* Personal Information Card */}
                            <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <User className="w-5 h-5 text-[#5ca367]" />
                                    <h2 className="text-lg font-black text-slate-800">Personal Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Full Name */}
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 pl-1">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input 
                                                type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5ca367]/20 focus:border-[#5ca367] transition-all"
                                                placeholder="Enter your full name" required
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 pl-1">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input 
                                                type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5ca367]/20 focus:border-[#5ca367] transition-all"
                                                placeholder="Enter phone number" required
                                            />
                                        </div>
                                    </div>

                                    {/* Email Address */}
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 pl-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input 
                                                type="email" name="email" value={formData.email} onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5ca367]/20 focus:border-[#5ca367] transition-all"
                                                placeholder="Enter email address" required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security / Password Card */}
                            <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <Shield className="w-5 h-5 text-rose-500" />
                                    <h2 className="text-lg font-black text-slate-800">Security & Password</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Current Password */}
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 pl-1">Current Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input 
                                                type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                                                placeholder="Enter current password (if changing)"
                                            />
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 pl-1">New Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input 
                                                type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                    </div>

                                    {/* Confirm New Password */}
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 pl-1">Confirm Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input 
                                                type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* --- ACTION BUTTONS --- */}
                            <div className="flex items-center justify-end gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-3.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-[#5ca367] hover:bg-[#4a855d] shadow-lg shadow-[#5ca367]/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}