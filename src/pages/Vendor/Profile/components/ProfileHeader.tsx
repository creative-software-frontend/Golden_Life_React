import { Camera, MapPin, Mail, Phone, Link as LinkIcon } from 'lucide-react';
import { getVendorImageUrl, getFallbackImage } from '@/utils/imageHelpers';
import { useState } from 'react';

interface ProfileHeaderProps {
  name: string;
  email: string;
  sellerId?: string;
  imageUrl?: string;
  coverGradient?: string;
}

export function ProfileHeader({ 
  name, 
  email, 
  sellerId, 
  imageUrl,
  coverGradient = 'from-[#E8A87C]/20 via-[#C38D9E]/20 to-[#E8A87C]/10'
}: ProfileHeaderProps) {
  const [imageError, setImageError] = useState(false);
  
  // Debug logging
  console.log('🖼️ [ProfileHeader] Props:', {
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
  return (
    <div className="relative mb-6">
      {/* Cover Background */}
      <div className={`h-48 md:h-64 rounded-t-2xl bg-gradient-to-br ${coverGradient} relative overflow-hidden`}>
        <div className="absolute inset-0 backdrop-blur-sm" />
        
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-20 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      </div>

      {/* Profile Info Section */}
      <div className="relative px-6 pb-6 -mt-20">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
              <img
                src={displayImageUrl}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
            
            {/* Edit Badge */}
            <div className="absolute -bottom-2 -right-2 bg-[#E8A87C] text-white p-2.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-[#C38D9E]">
              <Camera size={18} />
            </div>
          </div>

          {/* Name & Details */}
          <div className="flex-1 pt-2 md:pt-0 md:pb-4">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
              {displayName}
            </h1>
            
            {displaySellerId && (
              <p className="text-sm font-semibold text-[#C38D9E] mb-2">
                Seller ID: {displaySellerId}
              </p>
            )}

            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Mail size={16} className="text-[#E8A87C]" />
                <span>{displayEmail}</span>
              </div>
              
              <div className="hidden md:block w-px h-4 bg-gray-300" />
              
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-[#E8A87C]" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 md:pb-4">
            <button className="px-4 py-2 bg-white border-2 border-[#E8A87C] text-[#E8A87C] font-bold rounded-xl hover:bg-[#E8A87C] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg">
              Share Profile
            </button>
            <button className="px-4 py-2 bg-[#E8A87C] text-white font-bold rounded-xl hover:bg-[#C38D9E] transition-all duration-300 shadow-lg shadow-[#E8A87C]/30 hover:shadow-[#C38D9E]/30">
              View Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
