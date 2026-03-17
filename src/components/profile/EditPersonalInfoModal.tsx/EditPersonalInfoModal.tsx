import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  User as UserIcon,
  X,
  Loader2,
  Hash,
  Image as ImageIcon,
  Camera
} from 'lucide-react';
import { toast } from 'react-toastify';
import { StudentData } from '../BasicInfoTab/BasicInfoTab';
import useModalStore from '@/store/Store';

// Helper function to compress images using canvas
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Max width for profile picture
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              reject(new Error('Canvas to Blob failed'));
            }
          },
          'image/jpeg',
          0.8 // 80% quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

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

export default function EditProfileModal({
  isOpen,
  onClose,
  student,
  baseURL,
  token,
  onSuccess
}: EditProfileModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const setProfileBlobPreview = useModalStore((s) => s.setProfileBlobPreview);
  
  // Track the student that was loaded when the modal opened — prevents wiping preview mid-submission
  const loadedStudentRef = useRef<StudentData | null>(null);

  const [formData, setFormData] = useState<FormDataState>({
    name: '',
    email: '',
    mobile: '',
    affiliate_id: '',
    refer_code: '',
    image: null
  });

  useEffect(() => {
    if (isOpen) {
      if (student && student.id !== loadedStudentRef.current?.id) {
        loadedStudentRef.current = student;
        setFormData({
          name: student.name || '',
          email: student.email || '',
          mobile: student.mobile || '',
          affiliate_id: student.affiliate_id || '',
          refer_code: student.refer_code || '',
          image: null
        });
        
        // Only set previewUrl to server path if no new image has been selected
        if (!formData.image) {
            setPreviewUrl(
              student.image
                ? `${baseURL}/storage/${student.image}?t=${Date.now()}`
                : null
            );
        }
      }
    } else {
       // Reset when closed
       loadedStudentRef.current = null;
       setPreviewUrl(null);
       setFormData(prev => ({...prev, image: null}));
    }
  }, [isOpen, student, baseURL, formData.image]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    try {
      // Immediately show local preview
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Compress large images
      const compressedFile = await compressImage(file);
      
      setFormData((prev) => ({ ...prev, image: compressedFile }));
      
      // Update preview with compressed image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);

    } catch (error) {
       console.error("Image compression failed", error);
       toast.error("Failed to process image. Please try another one.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student?.id) return;

    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('_method', 'PUT'); // For Laravel
    submitData.append('name', formData.name.trim());
    submitData.append('email', formData.email.trim());
    submitData.append('mobile', formData.mobile.trim());
    submitData.append('affiliate_id', formData.affiliate_id.trim());
    submitData.append('refer_code', formData.refer_code.trim());

    if (formData.image instanceof File) {
      submitData.append('image', formData.image);
    }

    try {
      const response = await axios.post(
        `${baseURL}/api/student/basic-info?id=${student.id}`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      );

      // Support both `status: true` and generic truthy checks depending on API format
      if (response.data?.status === true || response.data?.status === "success" || response.data?.data) {
        toast.success(response.data.message || "Profile updated!");
        
        // Save preview for immediate UI update in sidebar
        if (previewUrl && (previewUrl.startsWith('data:') || previewUrl.startsWith('blob:'))) {
          setProfileBlobPreview(previewUrl);
        }
        
        setFileInputKey((k) => k + 1);
        onSuccess(response.data.data);
        onClose();
      } else {
          toast.error(response.data?.message || "Failed to update profile.");
      }
    } catch (error: any) {
      console.error("Upload Error:", error.response?.data);
      const msg = error.response?.data?.message || "Failed to save profile.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSubmitting && onClose()}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Update Profile</h3>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-slate-200/50 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-6 overflow-y-auto">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center pb-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 bg-slate-100 shadow-sm relative">
                    {previewUrl ? (
                      <img
                        key={previewUrl /* Force re-render if URL changes */}
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Suppress broken image icon if path is invalid
                           (e.target as HTMLImageElement).style.display = 'none';
                        }}
                        onLoad={(e) => {
                           (e.target as HTMLImageElement).style.display = 'block';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon size={32} />
                      </div>
                    )}
                  </div>

                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera size={16} />
                    <input
                      key={fileInputKey}
                      id="profile-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-wider">
                  Click camera to change photo
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                {/* Read-only fields */}
                <div className="space-y-4 opacity-75 pointer-events-none">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={formData.name}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email"
                        value={formData.email}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Editable fields */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, mobile: e.target.value }))
                      }
                      placeholder="01xxxxxxxxx"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                      Affiliate ID
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        value={formData.affiliate_id}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, affiliate_id: e.target.value }))
                        }
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                      Refer Code
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        value={formData.refer_code}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, refer_code: e.target.value }))
                        }
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-5 border border-slate-300 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-5 bg-primary text-white font-semibold rounded-2xl shadow-md hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
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