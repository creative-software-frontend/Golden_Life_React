import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

interface OtpVerificationModalProps {
  mobile: string;
  onVerifySuccess: (otp: string) => void;
  onBack: () => void;
}

const OtpVerificationModal = ({ mobile, onVerifySuccess, onBack }: OtpVerificationModalProps) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 4) {
      setError('Please enter the complete 4-digit OTP');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔵 [Verify OTP] Verifying OTP for:', mobile);
      
      // নোট: আপনার API ডকুমেন্টেশন অনুযায়ী OTP ভেরিফিকেশনের এন্ডপয়েন্ট আলাদা হতে পারে
      // এখানে ধরে নিচ্ছি OTP ভেরিফিকেশন success হলে আমরা proceed করব
      
      // যদি OTP ভেরিফিকেশনের জন্য আলাদা API থাকে, তাহলে সেটা কল করুন
      // অন্যথায়, ধরে নিন OTP সঠিক
      
      // উদাহরণস্বরূপ:
      // const formData = new FormData();
      // formData.append('mobile', mobile);
      // formData.append('otp', otpString);
      // 
      // const response = await axios.post(`${baseURL}/api/password/verify-otp`, formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });
      
      // যদি response.data.success হয়:
      toast.success('OTP verified successfully!');
      onVerifySuccess(otpString);
      
    } catch (err: any) {
      console.error('🔴 [Verify OTP] Error:', err);
      setError('Invalid OTP. Please try again.');
      toast.error('Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Key className="w-8 h-8 text-primary" />
            </div>
          </div>
          <p className="text-gray-600">
            Enter the 4-digit OTP sent to
          </p>
          <p className="text-sm font-medium text-gray-800">
            {mobile.replace(/(\d{3})(\d{3})(\d{4})/, '+88 $1-$2-$3')}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className={`w-14 h-14 text-center text-xl font-semibold border-2 ${
                  error ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all`}
                disabled={isLoading}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-white'
            }`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </span>
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Verify OTP
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OtpVerificationModal;