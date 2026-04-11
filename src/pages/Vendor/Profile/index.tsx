import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from './hooks/useProfile';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileInfo } from './components/ProfileInfo';
import { ProfileForm } from './components/ProfileForm';
import { StatsCard } from './components/StatsCard';
import { SocialLinks } from './components/SocialLinks';
import { toast } from 'react-toastify';
import { Edit2, Loader2, AlertCircle, UserX } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function VendorProfile() {
  const navigate = useNavigate();
  const { data, isLoading, error, updateProfile } = useProfile();
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  // Debug logging for data changes
  console.log('📄 [VendorProfile] Component render:', {
    isLoading,
    hasError: !!error,
    hasData: !!data,
    isEdit: isEditMode,
    dataKeys: data ? Object.keys(data) : 'N/A'
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light/10 via-primary-dark/10 to-white">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary-light mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light/10 via-primary-dark/10 to-white">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || 'Failed to load profile'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary-light hover:bg-primary-dark text-white font-bold rounded-xl transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { user, vendor, districts, countries } = data || {};

  // Safety check for required data
  if (!user || !vendor) {
    console.error('❌ [VendorProfile] Missing required data:', { user, vendor });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light/10 via-primary-dark/10 to-white">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserX className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Error</h2>
          <p className="text-gray-600 mb-6">Invalid profile data received</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary-light hover:bg-primary-dark text-white font-bold rounded-xl transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  console.log('✅ [VendorProfile] Data validated:', {
    userName: user.name,
    businessName: vendor.business_name || (vendor as any).businee_name,
    districtsCount: districts?.length || 0,
    countriesCount: countries?.length || 0
  });

  const handleImageChange = (file: File) => {
    setProfileImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  // Helper function to get full image URL with better debugging
  const getImageUrl = (imagePath: string | undefined): string => {
    console.log('🖼️ [getImageUrl] Called with:', imagePath);

    if (!imagePath) {
      console.log('[getImageUrl] No image path provided, returning empty');
      return '';
    }

    // If already a full URL, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('[getImageUrl] Already full URL:', imagePath);
      return imagePath;
    }

    // If it's a relative path starting with /, prepend API base URL
    if (imagePath.startsWith('/')) {
      const fullUrl = `${baseURL}${imagePath}`;
      console.log('[getImageUrl] Relative path constructed:', fullUrl);
      return fullUrl;
    }

    // Otherwise, assume it's just a filename and construct full URL
    // Pattern: https://api.goldenlife.my/uploads/vendor/image/{filename}
    const fullUrl = `${baseURL}/uploads/vendor/image/${imagePath}`;
    console.log('[getImageUrl] Filename path constructed:', fullUrl);
    return fullUrl;
  };

  const handleSubmit = async (formData: any) => {
    try {
      const dataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          dataToSend.append(key, formData[key]);
        }
      });

      // Append image if selected
      if (profileImage) {
        dataToSend.append('image', profileImage);
      }

      console.log('Submitting form data...');
      console.log('Form data keys:', Object.keys(formData));
      console.log('Has image:', !!profileImage);

      const success = await updateProfile(dataToSend);

      if (success) {
        toast.success('Profile updated successfully! ');
        setIsEditMode(false);
        handleImageRemove();
        
        // Refresh navbar data to reflect changes immediately
        useAppStore.getState().fetchNavbarData(true);
        
        console.log('Profile updated successfully, data refreshed');
      } else {
        toast.error('Failed to update profile');
        console.error('Update returned false');
      }
    } catch (err: any) {
      console.error('Update error:', err);
      toast.error(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/10 via-primary-dark/10 to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <ProfileHeader
          name={user.name}
          email={user.email}
          sellerId={vendor.seller_id}
          imageUrl={getImageUrl(vendor.image || vendor.profile_image || user.image || user.profile_image)}
          onEditToggle={() => setIsEditMode(true)}
        />

        {/* Stats Cards */}
        <StatsCard
          balance={user.balance || 0}
          totalProducts={5} // You can get this from API
          totalOrders={12} // You can get this from API
          rating={4.5} // You can get this from API
        />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info / Form */}
          <div className="lg:col-span-2 space-y-6">


            {isEditMode ? (
              <div id="edit-profile-form" className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 scroll-mt-20">
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-primary-light/20">
                  <h2 className="text-2xl font-black text-gray-900">Edit Profile</h2>
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <span className="text-sm font-bold text-gray-600">Exit Edit</span>
                  </button>
                </div>

                <ProfileForm
                  user={user}
                  vendor={vendor}
                  districts={districts}
                  countries={countries}
                  onSubmit={handleSubmit}
                  onCancel={() => setIsEditMode(false)}
                  imagePreview={imagePreview}
                  onImageChange={handleImageChange}
                  onImageRemove={handleImageRemove}
                />
              </div>
            ) : (
              <ProfileInfo user={user} vendor={vendor} />
            )}

            <div className="">
              <SocialLinks
                website={vendor.website}
                facebook={vendor.facebook}
                telegram={vendor.telegram}
                whatsapp={vendor.whatsapp}
              />
            </div>
          </div>

          {/* Right Column - Actions & Social */}
          <div className="space-y-6">
            {/* Profile Actions Card */}
            {!isEditMode && (
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Actions</h3>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/vendor/dashboard/change-password')}
                    className="w-full px-6 py-3.5 bg-white border-2 border-primary-light text-primary-light font-bold rounded-xl hover:bg-primary-light hover:text-white transition-all duration-300"
                  >
                    Change Password
                  </button>

                  <button className="w-full px-6 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-300">
                    Help & Support
                  </button>
                </div>

                {/* Verification Status */}
                <div className="mt-6 pt-6 border-t-2 border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-600">Email Verified</span>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                      ✓ Verified
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">Mobile Verified</span>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${user.mobile_verify
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                      }`}>
                      {user.mobile_verify ? '✓ Verified' : '⚠ Not Verified'}
                    </span>
                  </div>
                </div>
              </div>
            )}



          </div>
        </div>
      </div>
    </div>
  );
}
