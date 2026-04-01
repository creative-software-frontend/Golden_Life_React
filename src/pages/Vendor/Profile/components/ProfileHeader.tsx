import { Camera, MapPin, Mail, Upload, Trash2, Pen } from 'lucide-react';
import { getFallbackImage } from '@/utils/imageHelpers';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ProfileHeaderProps {
  name: string;
  email: string;
  sellerId?: string;
  imageUrl?: string;
  coverGradient?: string;
  vendorId?: number;
}

export function ProfileHeader({ 
  name, 
  email, 
  sellerId, 
  imageUrl,
  coverGradient = 'from-primary-light/20 via-primary-dark/20 to-primary-light/10'
}: ProfileHeaderProps) {
  const [imageError, setImageError] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';
  
  // Get vendor token
  const getVendorToken = () => {
    const session = sessionStorage.getItem('vendor_session');
    return session ? JSON.parse(session).token : null;
  };
  
  // Debug logging
  console.log(' [ProfileHeader] Props:', {
    name,
    email,
    sellerId,
    imageUrl,
    hasImage: !!imageUrl
  });
  
  // Use image helper to get full URL or fallback
  const displayImageUrl = imageError ? getFallbackImage('vendor') : (imageUrl || getFallbackImage('vendor'));
  const displayName = name || 'User';
  const displayEmail = email || '';
  const displaySellerId = sellerId || '';
  
  console.log('[ProfileHeader] Display image URL:', displayImageUrl);
  console.log('[ProfileHeader] Using fallback:', !imageUrl || imageError);
  
  // Fetch banner image on mount
  const fetchBanner = async () => {
    try {
      const token = getVendorToken();
      if (!token) {
        console.log('No vendor token found for banner fetch');
        return;
      }
      
      console.log('Fetching banner...');
      const response = await axios.get(`${baseURL}/api/vendor/banner`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Banner response:', response.data);
      if (response.data?.banner) {
        setBanner(response.data.banner);
        console.log('Banner set:', response.data.banner);
      } else {
        console.log('No banner found');
      }
    } catch (error) {
      console.error('Failed to fetch banner:', error);
    }
  };
  
  // Fetch banner when component mounts
  useEffect(() => {
    fetchBanner();
  }, []);
  
  const handleBannerUpload = async (file: File) => {
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, and WEBP formats are allowed');
      return;
    }
    
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      
      const token = getVendorToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      console.log('Uploading banner...');
      const response = await axios.post(`${baseURL}/api/vendor/banner`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Upload response:', response.data);
      if (response.data?.vendor?.banner) {
        setBanner(response.data.vendor.banner);
        toast.success('Banner uploaded successfully! 🎉');
        console.log('Banner uploaded:', response.data.vendor.banner);
      } else if (response.data?.message) {
        // If response doesn't have vendor.banner but has message, refetch
        toast.success(response.data.message);
        await fetchBanner();
      } else {
        toast.success('Banner uploaded successfully! 🎉');
        await fetchBanner();
      }
    } catch (error: any) {
      console.error('Banner upload error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to upload banner');
    } finally {
      setUploading(false);
    }
  };
  
  const handleBannerDelete = async () => {
    try {
      setDeleting(true);
      const token = getVendorToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      console.log('Deleting banner...');
      const response = await axios.delete(`${baseURL}/api/vendor/banner`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Delete response:', response.data);
      setBanner(null);
      setShowDeleteConfirm(false);
      toast.success('Banner removed successfully! 🗑️');
    } catch (error: any) {
      console.error('Banner delete error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to delete banner');
    } finally {
      setDeleting(false);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleBannerUpload(file);
    }
  };
  
  const hasBanner = !!banner;
  // Banner URL format: /uploads/vendor/banner/{filename}
  const bannerUrl = banner ? `${baseURL}/uploads/vendor/banner/${banner}` : undefined;
  
  console.log('[ProfileHeader] Banner state:', { hasBanner, banner, bannerUrl });
  return (
    <div className="relative mb-6">
      {/* Cover Background / Banner Image */}
      <div className="relative h-32 md:h-40 rounded-t-2xl overflow-hidden group">
        {hasBanner ? (
          /* Banner Image Display */
          <>
            <img
              src={bannerUrl}
              alt="Cover Banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Banner image failed to load');
                const imgElement = e.currentTarget;
                const parentElement = imgElement.parentElement;
                if (parentElement) {
                  const fallbackElement = parentElement.querySelector('.banner-fallback') as HTMLElement | null;
                  if (fallbackElement) {
                    imgElement.style.display = 'none';
                    fallbackElement.style.display = 'flex';
                  }
                }
              }}
            />
            <div className="banner-fallback hidden absolute inset-0 bg-gradient-to-br from-primary-light/20 via-primary-dark/20 to-primary-light/10">
              <div className="absolute inset-0 backdrop-blur-sm" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute top-20 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            </div>
          </>
        ) : (
          /* Gradient Background (No Banner) */
          <div className={`h-full bg-gradient-to-br ${coverGradient} relative`}>
            <div className="absolute inset-0 backdrop-blur-sm" />
            
            {/* Decorative Circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute top-20 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          </div>
        )}
        
        {/* Dark Overlay - appears on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        {/* Always visible pen icon for cover photo upload */}
        <label className="absolute bottom-3 right-3 cursor-pointer bg-black/60 hover:bg-black/80 p-2 rounded-full transition-all z-10">
          <Pen className="w-4 h-4 text-white" />
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Remove Cover Photo?</h3>
              <p className="text-gray-600">
                Are you sure you want to remove your cover photo? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleBannerDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Trash2 size={18} className="animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    <span>Remove</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Info Section */}
      <div className="relative px-6 pb-6 -mt-20">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
          {/* Avatar with always visible camera icon */}
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
              <img
                src={displayImageUrl}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
            
            {/* Always visible camera icon for profile image upload */}
            <label className="absolute bottom-0 right-0 cursor-pointer bg-primary-light hover:bg-primary-dark p-1.5 rounded-full border-2 border-white transition-all z-10">
              <Camera className="w-3 h-3 md:w-4 md:h-4 text-white" />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Dispatch custom event for profile image upload
                    window.dispatchEvent(new CustomEvent('vendor-profile-image-upload', { detail: { file } }));
                  }
                }}
              />
            </label>
          </div>
          
          {/* Banner Info Tooltip */}
          {hasBanner && (
            <div className="md:pt-20 md:pb-2 text-sm text-gray-500 italic">
              ✓ Cover photo active
            </div>
          )}

          {/* Name & Details */}
          <div className="flex-1 pt-2 md:pt-0 md:pb-4">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
              {displayName}
            </h1>
            
            {displaySellerId && (
              <p className="text-sm font-semibold text-primary-dark mb-2">
                Seller ID: {displaySellerId}
              </p>
            )}

            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Mail size={16} className="text-primary-light" />
                <span>{displayEmail}</span>
              </div>
              
              <div className="hidden md:block w-px h-4 bg-gray-300" />
              
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-primary-light" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 md:pb-4">
            <button className="px-4 py-2 bg-white border-2 border-primary-light text-primary-light font-bold rounded-xl hover:bg-primary-light hover:text-white transition-all duration-300 shadow-md hover:shadow-lg">
              Share Profile
            </button>
            <button className="px-4 py-2 bg-primary-light hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-primary-light/30 hover:shadow-primary-dark/30">
              View Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
