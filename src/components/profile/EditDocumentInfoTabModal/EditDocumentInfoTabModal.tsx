import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Loader2,
  FileText,
  Upload,
  Image as ImageIcon,
  Check,
  ChevronRight,
  Info,
  Camera
} from 'lucide-react';
import { toast } from 'react-toastify';
import { DocumentData } from '../types/types';

interface EditDocumentInfoTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DocumentData | null;
  baseURL: string;
  token: string | null;
  onSuccess: (updatedData: DocumentData) => void;
}

export default function EditDocumentInfoTabModal({
  isOpen,
  onClose,
  data,
  baseURL,
  token,
  onSuccess
}: EditDocumentInfoTabModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nidNumber, setNidNumber] = useState('');
  const [frontPage, setFrontPage] = useState<File | null>(null);
  const [backPage, setBackPage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const effectiveBaseURL = baseURL || import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  useEffect(() => {
    if (data && isOpen) {
      setNidNumber(data.nid_number || '');

      // Correct preview paths for NID documents
      const frontUrl = data.nid_front_page ? `${effectiveBaseURL}/uploads/student/nid_front_page/${data.nid_front_page}` : null;
      const backUrl = data.nid_back_page ? `${effectiveBaseURL}/uploads/student/nid_back_page/${data.nid_back_page}` : null;

      setFrontPreview(frontUrl);
      setBackPreview(backUrl);
      setFrontPage(null);
      setBackPage(null);
    }
  }, [data, isOpen, baseURL]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'front') {
        setFrontPage(file);
        setFrontPreview(URL.createObjectURL(file));
      } else {
        setBackPage(file);
        setBackPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.student_id) {
      toast.error("Student ID is missing. Cannot update.");
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('student_id', data.student_id);
    formData.append('nid_number', nidNumber);
    if (frontPage) formData.append('nid_front_page', frontPage);
    if (backPage) formData.append('nid_back_page', backPage);

    try {
      const response = await axios.post(
        `${baseURL}/api/student/document-info?id=${data.student_id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      );

      if (response.data?.status === "success" || response.data?.success) {
        toast.success(response.data.message || "Document information updated successfully!");
        onSuccess(response.data.data);
        onClose();
      } else {
        toast.error(response.data?.message || "Failed to update documents.");
      }
    } catch (error: any) {
      console.error("Update Error:", error.response?.data);
      toast.error(error.response?.data?.message || "An error occurred while saving.");
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
            className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-600/10 rounded-2xl text-emerald-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Document Verification</h3>
                  <p className="text-xs text-slate-400 font-medium">Update your identification documents</p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto">
              <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100 flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg text-blue-500 shadow-sm mt-0.5">
                  <Info size={16} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-blue-900 tracking-tight">Verification Notice</p>
                  <p className="text-[11px] leading-relaxed text-blue-700/80 font-medium">
                    Please ensure your NID number matches the image provided. Files should be clear and readable for faster verification. Maximum file size: 2MB.
                  </p>
                </div>
              </div>

              {/* NID Number Field */}
              <div className="space-y-1.5 px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">NID Number</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg text-slate-400 group-focus-within:bg-emerald-600/10 group-focus-within:text-emerald-600 transition-all">
                    <FileText size={16} />
                  </div>
                  <input
                    type="text"
                    value={nidNumber}
                    onChange={(e) => setNidNumber(e.target.value)}
                    className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                    placeholder="Enter your National ID Number"
                    required
                  />
                </div>
              </div>

              {/* Document Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                {/* Front Page */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">NID Front Page</label>
                  <div
                    onClick={() => !isSubmitting && frontInputRef.current?.click()}
                    className="relative aspect-[3/2] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-600/30 transition-all cursor-pointer overflow-hidden group/upload"
                  >
                    {frontPreview ? (
                      <>
                        <img src={frontPreview} className="w-full h-full object-cover" alt="Front Preview" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-emerald-600 font-bold text-xs shadow-lg">
                            <Camera size={14} />
                            Change Photo
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400">
                        <div className="p-4 bg-white rounded-2xl shadow-sm group-hover/upload:scale-110 group-hover/upload:text-emerald-600 transition-all duration-300">
                          <Upload size={24} />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-slate-700">Upload Front Page</p>
                          <p className="text-[10px] uppercase tracking-tighter mt-1">Click to browse files</p>
                        </div>
                      </div>
                    )}
                    <input type="file" ref={frontInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'front')} accept="image/*" />
                  </div>
                </div>

                {/* Back Page */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">NID Back Page</label>
                  <div
                    onClick={() => !isSubmitting && backInputRef.current?.click()}
                    className="relative aspect-[3/2] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-600/30 transition-all cursor-pointer overflow-hidden group/upload"
                  >
                    {backPreview ? (
                      <>
                        <img src={backPreview} className="w-full h-full object-cover" alt="Back Preview" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-emerald-600 font-bold text-xs shadow-lg">
                            <Camera size={14} />
                            Change Photo
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400">
                        <div className="p-4 bg-white rounded-2xl shadow-sm group-hover/upload:scale-110 group-hover/upload:text-emerald-600 transition-all duration-300">
                          <Upload size={24} />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-slate-700">Upload Back Page</p>
                          <p className="text-[10px] uppercase tracking-tighter mt-1">Click to browse files</p>
                        </div>
                      </div>
                    )}
                    <input type="file" ref={backInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'back')} accept="image/*" />
                  </div>
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-slate-50 bg-slate-50/30">
              <button
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e as any)}
                className="w-full h-14 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:grayscale transition-all flex items-center justify-center gap-4 group/btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span className="uppercase tracking-widest text-xs">Securing Documents...</span>
                  </>
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-xs">Confirm Identification</span>
                    <div className="p-1 bg-white/20 rounded-lg group-hover/btn:bg-white/30 transition-colors">
                      <ChevronRight size={18} />
                    </div>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
